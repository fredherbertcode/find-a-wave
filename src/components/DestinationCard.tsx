import React from 'react';
import { SurfDestination } from '../types';
import { MapPin, Thermometer, Users, DollarSign, Star, Waves, Calendar, Wind, Activity, RefreshCw } from 'lucide-react';
import { useSurfForecast } from '../hooks/useSurfForecast';

interface DestinationCardProps {
  destination: SurfDestination;
  rank: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, rank }) => {
  const { forecast, loading: forecastLoading, error: forecastError, refetch } = useSurfForecast(
    destination.id,
    destination.surflineSpotId
  );
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      case 'expert': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getWaveSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return '〰️';
      case 'medium': return '🌊';
      case 'large': return '🌊🌊';
      default: return '🌊';
    }
  };

  const formatBestMonths = (months: number[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => monthNames[m - 1]).join(', ');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#10b981'; // Green
    if (rating >= 6) return '#f59e0b'; // Yellow
    if (rating >= 4) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="destination-card">
      <div className="card-rank">#{rank}</div>

      <div className="card-image">
        <img src={destination.imageUrl} alt={destination.name} />
        <div className="card-overlay">
          <div className="location-info">
            <h3>{destination.name}</h3>
            <p>{destination.region}, {destination.country}</p>
          </div>
        </div>
      </div>

      {/* Live Surf Forecast */}
      <div className="card-forecast">
        <div className="forecast-header">
          <h4>🌊 Live Surf Forecast</h4>
          {forecastLoading ? (
            <RefreshCw className="forecast-refresh spinning" />
          ) : forecastError ? (
            <button onClick={refetch} className="forecast-refresh-btn" title="Retry">
              <RefreshCw className="forecast-refresh" />
            </button>
          ) : (
            <button onClick={refetch} className="forecast-refresh-btn" title="Refresh">
              <RefreshCw className="forecast-refresh" />
            </button>
          )}
        </div>

        {forecastLoading ? (
          <div className="forecast-loading">
            <div className="loading-spinner"></div>
            <span>Loading forecast...</span>
          </div>
        ) : forecastError ? (
          <div className="forecast-error">
            <span>Unable to load forecast</span>
          </div>
        ) : forecast ? (
          <div className="forecast-content">
            <div className="forecast-rating">
              <div
                className="rating-badge"
                style={{ backgroundColor: getRatingColor(forecast.rating) }}
              >
                {forecast.rating}/10
              </div>
              <span className="rating-text">{forecast.conditions}</span>
            </div>

            <div className="forecast-stats">
              <div className="forecast-stat">
                <Waves className="forecast-icon" />
                <span className="forecast-label">Waves</span>
                <span className="forecast-value">{forecast.waveHeight}ft</span>
              </div>
              <div className="forecast-stat">
                <Activity className="forecast-icon" />
                <span className="forecast-label">Period</span>
                <span className="forecast-value">{forecast.wavePeriod}s</span>
              </div>
              <div className="forecast-stat">
                <Wind className="forecast-icon" />
                <span className="forecast-label">Wind</span>
                <span className="forecast-value">{forecast.windSpeed}mph {forecast.windDirection}</span>
              </div>
              <div className="forecast-stat">
                <Thermometer className="forecast-icon" />
                <span className="forecast-label">Water</span>
                <span className="forecast-value">{forecast.waterTemp}°C</span>
              </div>
            </div>

            <div className="forecast-updated">
              Updated {formatLastUpdated(forecast.lastUpdated)}
            </div>
          </div>
        ) : null}
      </div>

      <div className="card-stats">
        <div className="stat-row">
          <div className="stat">
            <Star className="stat-icon" />
            <span className="stat-label">Wave Quality</span>
            <span className="stat-value">{destination.waveQuality}/10</span>
          </div>
          <div className="stat">
            <Waves className="stat-icon" />
            <span className="stat-label">Wave Size</span>
            <span className="stat-value">{getWaveSizeIcon(destination.waveSize)}</span>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat">
            <div
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(destination.difficultyLevel) }}
            >
              {destination.difficultyLevel}
            </div>
          </div>
          <div className="stat">
            <DollarSign className="stat-icon" />
            <span className="stat-label">Daily Cost</span>
            <span className="stat-value">${destination.cost}</span>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat">
            <Thermometer className="stat-icon" />
            <span className="stat-label">Air / Water</span>
            <span className="stat-value">{destination.averageTemp}° / {destination.waterTemp}°C</span>
          </div>
          <div className="stat">
            <Users className="stat-icon" />
            <span className="stat-label">Crowd Level</span>
            <span className="stat-value">{destination.crowdLevel}/10</span>
          </div>
        </div>

        <div className="stat-full">
          <Calendar className="stat-icon" />
          <span className="stat-label">Best Months</span>
          <span className="stat-value">{formatBestMonths(destination.bestMonths)}</span>
        </div>

        <div className="stat-full">
          <MapPin className="stat-icon" />
          <span className="stat-label">Weather</span>
          <span className="stat-value">{destination.weatherConditions}</span>
        </div>
      </div>

      <div className="card-highlights">
        <h4>Highlights</h4>
        <ul>
          {destination.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div className="card-description">
        <p>{destination.description}</p>
      </div>

      <div className="card-accommodation">
        <span className="accommodation-label">Available:</span>
        <div className="accommodation-tags">
          {destination.accommodationOptions.map((option, index) => (
            <span key={index} className="accommodation-tag">{option}</span>
          ))}
        </div>
      </div>
    </div>
  );
};