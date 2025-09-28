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
  preferenceWeights?: PreferenceWeights; // User-customizable importance weights
}

export interface PreferenceWeights {
  waveQuality: number;      // 0-100%
  budget: number;
  travelTime: number;
  crowdLevel: number;
  temperature: number;
  skillMatch: number;
  safetyFactors: number;
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
  touristFriendliness?: number; // 1-10 scale
  lifeguardPresence?: boolean; // Whether lifeguards are present
  breakType?: string; // 'reef' | 'beach' | 'point' | 'reef+beach' etc.
  redditQuotes?: RedditQuote[]; // Community quotes about the destination
  safetyInfo?: SafetyInfo;
  skillRequirements?: SkillRequirement[];
  bookingOptions?: BookingOption[];
  recommendationScore?: RecommendationExplanation;
}

// Enhanced Safety Information
export interface SafetyInfo {
  overallSafetyRating: number; // 1-10
  medicalFacilitiesNearby: boolean;
  lifeguardPresence: boolean;
  emergencyContacts: string[];
  commonHazards: string[];
  beginnerFriendlyTimes: string[];
  waterQualityRating: number; // 1-10
}

// Skill Requirements
export interface SkillRequirement {
  skill: string;
  level: 'required' | 'recommended' | 'helpful';
  description: string;
}

// Booking Integration
export interface BookingOption {
  type: 'accommodation' | 'flights' | 'surf-lessons' | 'equipment-rental';
  provider: string;
  url: string;
  estimatedPrice?: number;
  currency?: string;
}

// Recommendation Explanations
export interface RecommendationExplanation {
  overallScore: number;
  confidenceLevel: number; // 0-100%
  factorBreakdown: {
    skillMatch: FactorScore;
    budgetFit: FactorScore;
    seasonalTiming: FactorScore;
    travelLogistics: FactorScore;
    safetyFactors: FactorScore;
    personalPreferences: FactorScore;
  };
  alternativeReasons: string[];
  whyNotHigher?: string;
}

export interface FactorScore {
  score: number; // 0-100
  weight: number; // 0-100
  explanation: string;
  confidence: number; // 0-100
}

// User Feedback and Learning
export interface UserInteraction {
  userId?: string;
  sessionId: string;
  destinationId: string;
  action: 'viewed' | 'saved' | 'shared' | 'clicked-booking' | 'applied-filters';
  timestamp: Date;
  durationViewed?: number;
  searchContext: SurfPreferences;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export interface UserFeedback {
  userId?: string;
  sessionId: string;
  destinationId: string;
  tripCompleted: boolean;
  ratings: {
    overallExperience: number; // 1-10
    waveQualityVsExpected: number; // 1-10
    crowdLevelVsExpected: number; // 1-10
    costVsExpected: number; // 1-10
    safetyRating: number; // 1-10
  };
  wouldReturn: boolean;
  wouldRecommend: boolean;
  comments?: string;
  submittedAt: Date;
}

// Trip Planning
export interface TripPlan {
  id: string;
  userId?: string;
  sessionId: string;
  destinations: string[];
  preferences: SurfPreferences;
  estimatedCost: number;
  status: 'planning' | 'booked' | 'completed';
  createdAt: Date;
}

// Analytics and A/B Testing
export interface ExperimentVariant {
  experimentId: string;
  variantId: string;
  userId?: string;
  sessionId: string;
  assignedAt: Date;
}