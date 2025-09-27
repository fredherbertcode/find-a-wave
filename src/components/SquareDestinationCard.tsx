import React, { useState } from 'react';
import { SurfDestination } from '../types';
import { MapPin, Thermometer, Users, DollarSign, Star, Waves, Calendar, Wind, Activity, RefreshCw, Clock, Plane, Car, Train, Bus, ExternalLink, TrendingUp, Droplets } from 'lucide-react';
import { useSurfForecast } from '../hooks/useSurfForecast';
import { SeasonalSurfService } from '../services/seasonalSurfService';

interface SquareDestinationCardProps {
  destination: SurfDestination;
  rank: number;
  travelMonth: number;
  tripDuration: number;
  onClick: () => void;
}

export const SquareDestinationCard: React.FC<SquareDestinationCardProps> = ({
  destination,
  rank,
  travelMonth,
  tripDuration,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { forecast, loading: forecastLoading } = useSurfForecast(
    destination.id,
    destination.surflineSpotId
  );

  const seasonalService = SeasonalSurfService.getInstance();
  const seasonalConditions = seasonalService.getSeasonalConditions(destination, travelMonth);

  const getMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month - 1];
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return '#10b981'; // beginner
      case 2: return '#f59e0b'; // intermediate
      case 3: return '#ef4444'; // advanced
      case 4: return '#8b5cf6'; // expert
      default: return '#6b7280';
    }
  };

  const getDifficultySymbol = (level: number) => {
    switch (level) {
      case 1: return '🌊'; // beginner - single wave
      case 2: return '🌊🌊'; // intermediate - double waves
      case 3: return '🌊🌊🌊'; // advanced - triple waves
      case 4: return '⚡🌊'; // expert - lightning + wave
      default: return '🌊🌊';
    }
  };

  const getAbilityLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      default: return 'Intermediate';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#10b981';
    if (rating >= 6) return '#f59e0b';
    if (rating >= 4) return '#ef4444';
    return '#6b7280';
  };

  const formatBestMonths = (months: number[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.slice(0, 3).map(m => monthNames[m - 1]).join(', ') +
           (months.length > 3 ? '...' : '');
  };

  return (
    <div
      className={`square-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Rank Badge */}
      <div className="square-rank">#{rank}</div>

      {/* Main Card Content */}
      <div
        className="square-image"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="square-overlay">
          <div className="square-title">
            <h3>{destination.name}</h3>
            <p>{destination.country}</p>
          </div>

          {/* Quick Stats - Always Visible */}
          <div className="quick-stats">
            <div className="quick-stat">
              <Star className="quick-icon" />
              <span>{destination.waveQuality}/10</span>
            </div>
            <div
              className="quick-stat cost-stat"
              title={`Total: $${destination.cost * tripDuration} (${tripDuration} days)`}
            >
              <DollarSign className="quick-icon" />
              <span>${destination.cost}/day</span>
            </div>
            {destination.travelTime && (
              <div className="quick-stat travel-stat">
                {destination.travelTime.mode === 'flight' && <Plane className="quick-icon" />}
                {destination.travelTime.mode === 'car' && <Car className="quick-icon" />}
                {destination.travelTime.mode === 'train' && <Train className="quick-icon" />}
                {destination.travelTime.mode === 'bus' && <Bus className="quick-icon" />}
                <span>{Math.round(destination.travelTime.duration)}h</span>
              </div>
            )}
            <div
              className="difficulty-badge-square"
              style={{ backgroundColor: getDifficultyColor(destination.difficultyLevel) }}
              title={`Difficulty: ${getAbilityLabel(destination.difficultyLevel)}`}
            >
              {getDifficultySymbol(destination.difficultyLevel)}
            </div>
          </div>
        </div>

        {/* Hover Details Overlay */}
        <div className="hover-details">
          <div className="hover-content">
            <div className="hover-header">
              <h4>{destination.name}</h4>
              <span className="hover-region">{destination.region}</span>
            </div>

          {/* Seasonal Conditions - Primary */}
          <div className="seasonal-forecast">
            <div className="seasonal-header">
              <TrendingUp className="seasonal-icon" />
              <span className="seasonal-title">{getMonthName(travelMonth)} Conditions</span>
            </div>
            <div className="seasonal-stats">
              <div className="seasonal-stat">
                <span className="seasonal-waves">{seasonalConditions.waveHeight}</span>
                <span className="seasonal-label">Wave Size</span>
              </div>
              <div className="seasonal-stat">
                <span className="seasonal-consistency">{seasonalConditions.consistency}</span>
                <span className="seasonal-label">Consistency</span>
              </div>
              <div className="seasonal-stat">
                <span className="seasonal-crowd">{seasonalConditions.crowd}</span>
                <span className="seasonal-label">Crowds</span>
              </div>
            </div>
          </div>

          {/* Current Live Conditions - Secondary */}
          {forecast && (
            <div className="current-conditions-small">
              <span className="current-label">Live Now:</span>
              <span className="current-waves">{forecast.waveHeight}ft</span>
              <span className="current-rating" style={{ color: getRatingColor(forecast.rating) }}>
                {forecast.rating}/10
              </span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.alert('Surf forecast data simulated for demo. In production, this would link to Surfline, Stormglass, or NOAA data sources.');
                }}
                className="forecast-info-link"
                title="About surf forecast data"
              >
                <Activity className="forecast-info-icon" />
              </a>
            </div>
          )}

          {/* Seasonal Conditions for Selected Dates */}
          <div className="seasonal-conditions-small">
            <span className="seasonal-label">Your Dates ({getMonthName(travelMonth)}):</span>
            <span className="seasonal-waves">{seasonalConditions.waveHeight}</span>
            <span className="seasonal-consistency">{seasonalConditions.consistency} consistent</span>
            <span className="seasonal-crowd">{seasonalConditions.crowd} crowds</span>
          </div>

          {/* Key Stats */}
          <div className="back-stats">
            <div className="back-stat">
              <Star className="back-icon" />
              <span>Wave Quality: {destination.waveQuality}/10</span>
            </div>
            <div className="back-stat">
              <Waves className="back-icon" />
              <span>Wave Size: {destination.waveSize}</span>
            </div>
            <div className="back-stat">
              <Users className="back-icon" />
              <span>Crowd Level: {destination.crowdLevel}/10</span>
            </div>
            <div className="back-stat">
              <Thermometer className="back-icon" />
              <span>Air/Water Temp: {destination.averageTemp}°/{destination.waterTemp}°C</span>
            </div>
            <div className="back-stat">
              <Calendar className="back-icon" />
              <span>Best Months: {formatBestMonths(destination.bestMonths)}</span>
            </div>
            {destination.travelTime && (
              <div className="back-stat">
                {destination.travelTime.mode === 'flight' && <Plane className="back-icon" />}
                {destination.travelTime.mode === 'car' && <Car className="back-icon" />}
                {destination.travelTime.mode === 'train' && <Train className="back-icon" />}
                {destination.travelTime.mode === 'bus' && <Bus className="back-icon" />}
                <span>{Math.round(destination.travelTime.duration)}h • {destination.travelTime.mode}</span>
              </div>
            )}
            <div className="back-stat back-cost-stat">
              <DollarSign className="back-icon" />
              <span
                className="cost-daily"
                title={`Total trip cost: $${destination.cost * tripDuration} (${tripDuration} days)`}
              >
                ${destination.cost}/day
              </span>
              <a
                href={`https://www.numbeo.com/cost-of-living/country_result.jsp?country=${encodeURIComponent(destination.country)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="numbeo-link-back"
                onClick={(e) => e.stopPropagation()}
                title="View cost of living for this country on Numbeo"
              >
                <ExternalLink className="numbeo-icon" />
              </a>
            </div>
          </div>

          {/* Highlights */}
          <div className="back-highlights">
            {destination.highlights.slice(0, 2).map((highlight, index) => (
              <span key={index} className="highlight-tag">
                {highlight}
              </span>
            ))}
          </div>

          <div className="click-hint">
            <span>Click for details</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};