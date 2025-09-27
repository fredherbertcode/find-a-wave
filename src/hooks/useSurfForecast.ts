import { useState, useEffect } from 'react';
import { SurfForecast } from '../types';
import { SurfForecastService } from '../services/surfForecastService';

interface UseSurfForecastReturn {
  forecast: SurfForecast | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSurfForecast = (destinationId: string, surflineSpotId?: string): UseSurfForecastReturn => {
  const [forecast, setForecast] = useState<SurfForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError(null);

      const forecastService = SurfForecastService.getInstance();
      const data = await forecastService.getForecast(destinationId, surflineSpotId);

      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      console.error('Error fetching surf forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destinationId) {
      fetchForecast();
    }
  }, [destinationId, surflineSpotId]);

  const refetch = () => {
    fetchForecast();
  };

  return {
    forecast,
    loading,
    error,
    refetch
  };
};