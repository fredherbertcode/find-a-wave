import { SurfPreferences, SurfDestination, TravelTimeResult } from '../types';
import { TravelTimeService } from '../services/travelTimeService';

interface ScoredDestination {
  destination: SurfDestination;
  score: number;
}

export const filterAndRankDestinations = async (
  destinations: SurfDestination[],
  preferences: SurfPreferences
): Promise<SurfDestination[]> => {
  const travelService = TravelTimeService.getInstance();

  // Calculate travel times and filter by max travel time
  const destinationsWithTravel: SurfDestination[] = [];

  for (const destination of destinations) {
    try {
      // Try to calculate travel time, but don't let it block the results
      const travelTimes = await Promise.race([
        travelService.calculateTravelTime(
          preferences.currentLocation,
          destination.coordinates,
          preferences.transportModes
        ),
        new Promise<any[]>((_, reject) =>
          setTimeout(() => reject(new Error('Travel time calculation timeout')), 2000)
        )
      ]);

      // Find the fastest travel option
      const fastestTravel = travelTimes.reduce((fastest, current) =>
        current.duration < fastest.duration ? current : fastest
      );

      // Only include destinations within travel time preference
      if (fastestTravel.duration <= preferences.maxTravelTime) {
        destinationsWithTravel.push({
          ...destination,
          travelTime: fastestTravel,
          numbeoUrl: generateNumbeoUrl(destination.name, destination.country)
        });
      }
    } catch (error) {
      console.warn(`Could not calculate travel time for ${destination.name}:`, error);
      // Include destination with estimated travel time based on distance
      const estimatedTime = estimateSimpleTravel(destination.coordinates, preferences.currentLocation);

      if (estimatedTime <= preferences.maxTravelTime) {
        destinationsWithTravel.push({
          ...destination,
          travelTime: {
            distance: 0,
            duration: estimatedTime,
            mode: preferences.transportModes[0] || 'flight'
          },
          numbeoUrl: generateNumbeoUrl(destination.name, destination.country)
        });
      }
    }
  }

  const scoredDestinations: ScoredDestination[] = destinationsWithTravel.map(destination => ({
    destination,
    score: calculateScore(destination, preferences)
  }));

  return scoredDestinations
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ destination }) => destination);
};

const generateNumbeoUrl = (city: string, country: string): string => {
  const cityParam = encodeURIComponent(city);
  const countryParam = encodeURIComponent(country);
  return `https://www.numbeo.com/cost-of-living/in/${cityParam}-${countryParam}`;
};

// Fallback simple travel time estimation
const estimateSimpleTravel = (destination: { lat: number; lng: number }, fromLocation: string): number => {
  // Very simple estimation based on common travel patterns
  // This is a fallback when geocoding fails

  // Extract probable location info from string
  const isUK = fromLocation.toLowerCase().includes('london') ||
              fromLocation.toLowerCase().includes('uk') ||
              fromLocation.toLowerCase().includes('england');

  const isEurope = fromLocation.toLowerCase().includes('paris') ||
                   fromLocation.toLowerCase().includes('amsterdam') ||
                   fromLocation.toLowerCase().includes('berlin');

  const isUS = fromLocation.toLowerCase().includes('new york') ||
               fromLocation.toLowerCase().includes('los angeles') ||
               fromLocation.toLowerCase().includes('usa');

  // Rough estimation based on destination latitude
  const lat = Math.abs(destination.lat);

  if (isUK) {
    if (lat > 40 && lat < 65) return 2; // Europe
    if (lat > 20 && lat < 40) return 6; // Mediterranean/Africa
    if (lat < 20) return 12; // Tropical
    return 8; // Default
  } else if (isEurope) {
    if (lat > 40 && lat < 65) return 3; // Within Europe
    if (lat > 20 && lat < 40) return 5; // Mediterranean
    if (lat < 20) return 11; // Tropical
    return 7; // Default
  } else if (isUS) {
    if (lat > 25 && lat < 50) return 5; // North America
    if (lat < 25) return 8; // Central/South America
    return 12; // International
  }

  // Global default
  return 8;
};

const calculateScore = (destination: SurfDestination, preferences: SurfPreferences): number => {
  let score = 0;
  const maxScore = 100;

  score += scoreSurfingAbility(destination.difficultyLevel, preferences.surfingAbility);

  score += scoreBudget(destination.cost, preferences.budget);

  score += scoreSeasonality(destination.bestMonths, preferences.travelMonth);

  score += scoreTransport(preferences.transportModes);

  score += scoreSurfLessons(destination.accommodationOptions, preferences.needsSurfLessons);

  score += scoreTemperature(destination.averageTemp, preferences.temperatureRange);

  score += destination.waveQuality * 2;

  return Math.min(score, maxScore);
};

const scoreSurfingAbility = (destinationLevel: number, preferredLevel: number): number => {
  if (destinationLevel === preferredLevel) return 20;
  if (Math.abs(destinationLevel - preferredLevel) === 1) return 15;
  if (Math.abs(destinationLevel - preferredLevel) === 2) return 5;
  return 0;
};


const scoreBudget = (destinationCost: number, budget: number): number => {
  if (destinationCost <= budget) {
    const ratio = destinationCost / budget;
    return 15 * (1 - ratio + 0.2);
  }

  const overage = (destinationCost - budget) / budget;
  if (overage <= 0.2) return 10;
  if (overage <= 0.5) return 5;
  return 0;
};

const scoreSeasonality = (bestMonths: number[], travelMonth: number): number => {
  if (bestMonths.includes(travelMonth)) return 15;

  const nearbyMonths = [
    travelMonth === 1 ? 12 : travelMonth - 1,
    travelMonth === 12 ? 1 : travelMonth + 1
  ];

  if (bestMonths.some(m => nearbyMonths.includes(m))) return 10;
  return 0;
};

const scoreTransport = (
  transportModes: string[]
): number => {
  if (transportModes.length === 0) return 5;
  return 10;
};

const scoreSurfLessons = (
  destinationOptions: string[],
  needsLessons: boolean
): number => {
  if (!needsLessons) return 10;

  const hasSurfSchool = destinationOptions.some(option =>
    option.toLowerCase().includes('surf school') ||
    option.toLowerCase().includes('surf-school')
  );

  return hasSurfSchool ? 15 : 0;
};

const scoreTemperature = (
  destinationTemp: number,
  temperatureRange: number
): number => {
  // Temperature ranges: 1=cold (5-15°C), 2=mild (15-22°C), 3=warm (22-28°C), 4=hot (28°C+)
  let preferredMin: number, preferredMax: number;

  switch (temperatureRange) {
    case 1: // Cold
      preferredMin = 5; preferredMax = 15;
      break;
    case 2: // Mild
      preferredMin = 15; preferredMax = 22;
      break;
    case 3: // Warm
      preferredMin = 22; preferredMax = 28;
      break;
    case 4: // Hot
      preferredMin = 28; preferredMax = 40;
      break;
    default:
      preferredMin = 15; preferredMax = 22;
  }

  // Perfect match within range
  if (destinationTemp >= preferredMin && destinationTemp <= preferredMax) {
    return 15;
  }

  // Calculate distance from preferred range
  const distanceFromRange = destinationTemp < preferredMin
    ? preferredMin - destinationTemp
    : destinationTemp - preferredMax;

  if (distanceFromRange <= 3) return 10;
  if (distanceFromRange <= 6) return 5;
  if (distanceFromRange <= 10) return 2;
  return 0;
};