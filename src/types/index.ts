export interface SurfPreferences {
  surfingAbility: number; // 1-4 slider (1=beginner, 2=intermediate, 3=advanced, 4=expert)
  currentLocation: string;
  transportModes: ('flight' | 'car' | 'train' | 'bus')[];
  maxTravelTime: number; // in hours
  budget: number;
  currency: 'USD' | 'EUR' | 'GBP';
  temperatureRange: number; // 1-4 (1=cold, 2=mild, 3=warm, 4=hot)
  travelDates: {
    startDate: string; // ISO date string
    endDate: string; // ISO date string
  };
  travelMonth: number; // 1-12 (derived from travelDates for backward compatibility)
  tripDuration: number; // in days (derived from travelDates)
  needsSurfLessons: boolean;
}

export interface SurfForecast {
  waveHeight: number; // in feet
  waveDirection: string;
  wavePeriod: number; // in seconds
  windSpeed: number; // mph
  windDirection: string;
  waterTemp: number; // celsius
  airTemp: number; // celsius
  rating: number; // 1-10
  conditions: string;
  lastUpdated: string;
}

export interface TravelTimeResult {
  distance: number; // in kilometers
  duration: number; // in hours
  mode: string;
}

export interface RedditQuote {
  text: string;
  author: string;
  url: string;
  subreddit: string;
}

export interface SurfDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  waveQuality: number; // 1-10
  waveSize: 'small' | 'medium' | 'large';
  difficultyLevel: number; // 1-4 (1=beginner, 2=intermediate, 3=advanced, 4=expert)
  bestMonths: number[]; // 1-12
  averageTemp: number;
  waterTemp: number;
  crowdLevel: number; // 1-10
  cost: number; // daily budget in USD
  accommodationOptions: string[];
  imageUrl: string;
  description: string;
  highlights: string[];
  weatherConditions: string;
  surflineSpotId?: string; // For API integration
  forecast?: SurfForecast;
  travelTime?: TravelTimeResult; // Best travel option
  numbeoUrl?: string; // Link to Numbeo cost data
  touristFriendliness: number; // 1-10 scale
  lifeguardPresence: boolean; // Whether lifeguards are present
  breakType: string; // 'reef' | 'beach' | 'point' | 'reef+beach' etc.
  redditQuotes?: RedditQuote[]; // Community quotes about the destination
}