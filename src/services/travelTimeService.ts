interface TravelTimeResult {
  distance: number; // in kilometers
  duration: number; // in hours
  mode: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export class TravelTimeService {
  private static instance: TravelTimeService;
  private travelCache: Map<string, { data: TravelTimeResult; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  static getInstance(): TravelTimeService {
    if (!TravelTimeService.instance) {
      TravelTimeService.instance = new TravelTimeService();
    }
    return TravelTimeService.instance;
  }

  async calculateTravelTime(
    fromLocation: string,
    toCoordinates: Coordinates,
    transportModes: string[]
  ): Promise<TravelTimeResult[]> {
    // For now, return mock calculations
    // In production, this would use Google Maps API, Mapbox API, etc.

    const fromCoords = await this.geocodeLocation(fromLocation);
    if (!fromCoords) {
      throw new Error('Could not find coordinates for location');
    }

    const results: TravelTimeResult[] = [];

    for (const mode of transportModes) {
      const cacheKey = `${fromLocation}-${toCoordinates.lat},${toCoordinates.lng}-${mode}`;

      // Check cache
      const cached = this.travelCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        results.push(cached.data);
        continue;
      }

      // Calculate distance and time
      const distance = this.calculateDistance(fromCoords, toCoordinates);
      const duration = this.estimateTravelTime(distance, mode);

      const result: TravelTimeResult = {
        distance: Math.round(distance),
        duration: Math.round(duration * 10) / 10,
        mode
      };

      // Cache result
      this.travelCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      results.push(result);
    }

    return results;
  }

  private async geocodeLocation(location: string): Promise<Coordinates | null> {
    // Mock geocoding - in production, use Google Maps Geocoding API
    const cityCoordinates: { [key: string]: Coordinates } = {
      'london': { lat: 51.5074, lng: -0.1278 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'amsterdam': { lat: 52.3676, lng: 4.9041 },
      'barcelona': { lat: 41.3851, lng: 2.1734 },
      'lisbon': { lat: 38.7223, lng: -9.1393 },
      'dublin': { lat: 53.3498, lng: -6.2603 },
      'berlin': { lat: 52.5200, lng: 13.4050 },
      'madrid': { lat: 40.4168, lng: -3.7038 },
      'rome': { lat: 41.9028, lng: 12.4964 },
      'copenhagen': { lat: 55.6761, lng: 12.5683 },
      'stockholm': { lat: 59.3293, lng: 18.0686 },
      'toronto': { lat: 43.6532, lng: -79.3832 },
      'vancouver': { lat: 49.2827, lng: -123.1207 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'honolulu': { lat: 21.3099, lng: -157.8581 },
      'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
      'buenos aires': { lat: -34.6037, lng: -58.3816 },
      'cape town': { lat: -33.9249, lng: 18.4241 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'bangkok': { lat: 13.7563, lng: 100.5018 },
      'bali': { lat: -8.3405, lng: 115.0920 },
      'mexico city': { lat: 19.4326, lng: -99.1332 },
      'lima': { lat: -12.0464, lng: -77.0428 }
    };

    const normalized = location.toLowerCase().trim();

    // Try exact match first
    if (cityCoordinates[normalized]) {
      return cityCoordinates[normalized];
    }

    // Try partial matches
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (city.includes(normalized) || normalized.includes(city)) {
        return coords;
      }
    }

    return null;
  }

  private calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(to.lat - from.lat);
    const dLng = this.toRadians(to.lng - from.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(from.lat)) * Math.cos(this.toRadians(to.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private estimateTravelTime(distance: number, mode: string): number {
    if (mode === 'flight') {
      // More realistic flight calculation
      const cruisingSpeed = 900; // km/h actual flight speed
      const flightTime = distance / cruisingSpeed;

      // Airport procedures vary by distance
      let airportTime = 3; // Base 3 hours for short flights
      if (distance > 3000) airportTime = 4; // 4 hours for medium flights
      if (distance > 8000) airportTime = 5; // 5 hours for long-haul flights
      if (distance > 15000) airportTime = 6; // 6 hours for ultra long-haul

      return flightTime + airportTime;
    }

    // Ground transport speeds
    const speeds = {
      'car': 80,     // km/h average including stops
      'train': 120,  // km/h average for intercity
      'bus': 60      // km/h average including stops
    };

    const speed = speeds[mode as keyof typeof speeds] || 80;
    return distance / speed;
  }

  clearCache(): void {
    this.travelCache.clear();
  }
}