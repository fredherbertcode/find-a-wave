import { SurfForecast } from '../types';

// Mock surf forecast service - in production, this would connect to Surfline, Magic Seaweed, or similar APIs
export class SurfForecastService {
  private static instance: SurfForecastService;
  private forecastCache: Map<string, { data: SurfForecast; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  static getInstance(): SurfForecastService {
    if (!SurfForecastService.instance) {
      SurfForecastService.instance = new SurfForecastService();
    }
    return SurfForecastService.instance;
  }

  async getForecast(destinationId: string, surflineSpotId?: string): Promise<SurfForecast> {
    // Check cache first
    const cached = this.forecastCache.get(destinationId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    // Generate realistic forecast data
    const forecast = this.generateRealisticForecast(destinationId);

    // Cache the result
    this.forecastCache.set(destinationId, {
      data: forecast,
      timestamp: Date.now()
    });

    return forecast;
  }

  private generateRealisticForecast(destinationId: string): SurfForecast {
    // Use destination ID to seed random generation for consistency
    const seed = this.hashCode(destinationId);
    const random = this.seededRandom(seed);

    // Generate wave height based on destination characteristics
    const baseWaveHeight = this.getBaseWaveHeight(destinationId);
    const waveHeight = Math.max(0.5, baseWaveHeight + (random() - 0.5) * 3);

    // Generate wave period (longer period = better quality waves)
    const wavePeriod = 8 + random() * 12;

    // Wind conditions
    const windSpeed = random() * 25;
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDirection = windDirections[Math.floor(random() * windDirections.length)];

    // Wave direction
    const waveDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const waveDirection = waveDirections[Math.floor(random() * waveDirections.length)];

    // Temperature variations
    const baseTemp = this.getBaseTemperature(destinationId);
    const airTemp = Math.round(baseTemp + (random() - 0.5) * 8);
    const waterTemp = Math.round(baseTemp - 2 + (random() - 0.5) * 6);

    // Calculate surf rating based on conditions
    const rating = this.calculateSurfRating(waveHeight, wavePeriod, windSpeed, destinationId);

    // Generate conditions description
    const conditions = this.generateConditionsDescription(rating, windSpeed, waveHeight);

    return {
      waveHeight: Math.round(waveHeight * 10) / 10,
      waveDirection,
      wavePeriod: Math.round(wavePeriod * 10) / 10,
      windSpeed: Math.round(windSpeed),
      windDirection,
      waterTemp,
      airTemp,
      rating,
      conditions,
      lastUpdated: new Date().toISOString()
    };
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): () => number {
    let x = Math.sin(seed + Date.now() / 86400000) * 10000; // Change daily
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }

  private getBaseWaveHeight(destinationId: string): number {
    // Different surf spots have different typical wave sizes
    const bigWaveSpots = ['us-hi-pipeline', 'us-hi-sunset', 'pt-nazare', 'za-dungeons', 'mx-puerto-escondido'];
    const mediumWaveSpots = ['id-uluwatu', 'au-superbank', 'pt-ericeira', 'fr-hossegor'];
    const smallWaveSpots = ['us-hi-waikiki', 'cr-nosara', 'es-tarifa', 'lk-hikkaduwa'];

    if (bigWaveSpots.includes(destinationId)) {
      return 6 + Math.random() * 8;
    } else if (mediumWaveSpots.includes(destinationId)) {
      return 3 + Math.random() * 4;
    } else if (smallWaveSpots.includes(destinationId)) {
      return 1 + Math.random() * 3;
    } else {
      return 2 + Math.random() * 5;
    }
  }

  private getBaseTemperature(destinationId: string): number {
    // Approximate temperatures based on location
    const tropicalSpots = ['id-uluwatu', 'ph-siargao', 'mv-cokes', 'cr-nosara', 'mx-sayulita'];
    const temperateSpots = ['us-ca-malibu', 'au-byron-bay', 'nz-raglan', 'za-jeffreys-bay'];
    const coldSpots = ['us-ca-ocean-beach', 'cl-pichilemu', 'za-dungeons'];

    if (tropicalSpots.includes(destinationId)) {
      return 28;
    } else if (temperateSpots.includes(destinationId)) {
      return 20;
    } else if (coldSpots.includes(destinationId)) {
      return 15;
    } else {
      return 22;
    }
  }

  private calculateSurfRating(waveHeight: number, wavePeriod: number, windSpeed: number, destinationId: string): number {
    let rating = 5; // Base rating

    // Wave height scoring
    if (waveHeight >= 2 && waveHeight <= 8) {
      rating += 2;
    } else if (waveHeight >= 1 && waveHeight <= 10) {
      rating += 1;
    }

    // Wave period scoring (longer period = better waves)
    if (wavePeriod >= 12) {
      rating += 2;
    } else if (wavePeriod >= 8) {
      rating += 1;
    }

    // Wind scoring (offshore is better)
    if (windSpeed <= 5) {
      rating += 2;
    } else if (windSpeed <= 10) {
      rating += 1;
    } else if (windSpeed >= 20) {
      rating -= 2;
    }

    // Quality spot bonus
    const worldClassSpots = ['us-hi-pipeline', 'id-uluwatu', 'pt-nazare', 'pe-chicama'];
    if (worldClassSpots.includes(destinationId)) {
      rating += 1;
    }

    return Math.max(1, Math.min(10, Math.round(rating)));
  }

  private generateConditionsDescription(rating: number, windSpeed: number, waveHeight: number): string {
    const windCondition = windSpeed <= 5 ? 'Light offshore' :
                         windSpeed <= 10 ? 'Moderate winds' :
                         windSpeed <= 15 ? 'Strong winds' : 'Very windy';

    const waveCondition = waveHeight <= 2 ? 'Small waves' :
                         waveHeight <= 5 ? 'Good size waves' :
                         waveHeight <= 8 ? 'Large waves' : 'Big waves';

    if (rating >= 8) {
      return `Excellent conditions - ${waveCondition.toLowerCase()}, ${windCondition.toLowerCase()}`;
    } else if (rating >= 6) {
      return `Good conditions - ${waveCondition.toLowerCase()}, ${windCondition.toLowerCase()}`;
    } else if (rating >= 4) {
      return `Fair conditions - ${waveCondition.toLowerCase()}, ${windCondition.toLowerCase()}`;
    } else {
      return `Poor conditions - ${waveCondition.toLowerCase()}, ${windCondition.toLowerCase()}`;
    }
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.forecastCache.clear();
  }
}