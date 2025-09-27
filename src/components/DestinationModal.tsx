import React from 'react';
import { SurfDestination } from '../types';
import { MapPin, Thermometer, Users, DollarSign, Star, Waves, Calendar, Wind, Activity, X, Plane, TrendingUp, ExternalLink, Car, Train, Bus } from 'lucide-react';
import { useSurfForecast } from '../hooks/useSurfForecast';
import { SeasonalSurfService } from '../services/seasonalSurfService';

interface DestinationModalProps {
  destination: SurfDestination;
  rank: number;
  travelMonth: number;
  tripDuration: number;
  isOpen: boolean;
  onClose: () => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  rank,
  travelMonth,
  tripDuration,
  isOpen,
  onClose
}) => {
  const { forecast, loading: forecastLoading } = useSurfForecast(
    destination.id,
    destination.surflineSpotId
  );

  const seasonalService = SeasonalSurfService.getInstance();
  const seasonalConditions = seasonalService.getSeasonalConditions(destination, travelMonth);

  if (!isOpen) return null;

  const getMonthName = (month: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
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

  const getDifficultyLabel = (level: number) => {
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
    return months.map(m => monthNames[m - 1]).join(', ');
  };

  const getBreakTypeLabel = (breakType: string) => {
    switch (breakType.toLowerCase()) {
      case 'reef':
        return 'Reef Break';
      case 'beach':
        return 'Beach Break';
      case 'point':
        return 'Point Break';
      case 'reef+beach':
        return 'Reef & Beach Break';
      case 'rivermouth':
        return 'River Mouth';
      case 'jetty':
        return 'Jetty Break';
      default:
        return 'Beach Break';
    }
  };

  const getBreakTypeExplanation = (breakType: string) => {
    switch (breakType.toLowerCase()) {
      case 'reef':
        return 'Waves break over coral reef or rock formations. Usually more consistent and powerful, but can be dangerous for beginners due to shallow depths and sharp surfaces.';
      case 'beach':
        return 'Waves break over sandy bottom. Generally safer for all skill levels, more forgiving if you wipe out, but conditions can be less consistent.';
      case 'point':
        return 'Waves break around a rocky point or headland. Often provides longer rides and more predictable waves, great for longboarding and progressive surfing.';
      case 'reef+beach':
        return 'Multiple break types in the same area. Offers variety for different skill levels and conditions - reef sections for power, beach sections for safety.';
      case 'rivermouth':
        return 'Waves break where a river meets the ocean. Can produce excellent waves but conditions vary with tides, river flow, and sediment deposits.';
      case 'jetty':
        return 'Waves break next to man-made structures like piers or jetties. These structures can create consistent waves but also present hazards like rocks or concrete.';
      default:
        return 'Waves break over sandy bottom. Generally safer for all skill levels and more forgiving for beginners.';
    }
  };

  const getLifeguardInfoUrl = (country: string, region: string) => {
    const countryLower = country.toLowerCase();
    const regionLower = region.toLowerCase();

    switch (countryLower) {
      case 'australia':
        return 'https://sls.com.au/beach-safety/';
      case 'usa':
      case 'united states':
        if (regionLower.includes('california')) {
          return 'https://www.parks.ca.gov/pages/795/files/CaliforniaBeachSafetyGuide.pdf';
        } else if (regionLower.includes('florida')) {
          return 'https://www.floridastateparks.org/learn/beach-safety';
        } else if (regionLower.includes('hawaii')) {
          return 'https://www.hawaiioceanproject.com/ocean-safety/';
        }
        return 'https://www.usla.org/beach-safety';
      case 'uk':
      case 'united kingdom':
      case 'england':
      case 'wales':
      case 'scotland':
        return 'https://rnli.org/safety/beach-safety';
      case 'ireland':
        return 'https://watersafety.ie/water-safety-advice/beach-safety/';
      case 'france':
        return 'https://www.ffss.fr/surveillance-des-plages/';
      case 'spain':
        return 'https://www.socorrismo.net/playas-vigiladas/';
      case 'portugal':
        return 'https://www.fepons.pt/nadador-salvador/';
      case 'south africa':
        return 'https://www.lifesaving.co.za/beach-safety/';
      case 'new zealand':
        return 'https://www.surflifesaving.org.nz/safety/beach-safety/';
      case 'brazil':
        return 'https://www.bombeiros.mg.gov.br/prevencao/afogamento/';
      case 'mexico':
        return 'https://www.gob.mx/semarnat/articulos/salvavidas-proteccion-y-rescate-en-playas';
      case 'costa rica':
        return 'https://www.visitcostarica.com/en/costa-rica/planning-your-trip/beach-safety';
      case 'indonesia':
        return 'https://www.indonesia.travel/gb/en/trip-ideas/beach-safety-tips-for-your-indonesia-holiday';
      case 'philippines':
        return 'https://www.tourism.gov.ph/travel_tips/beach_safety.aspx';
      case 'thailand':
        return 'https://www.tourismthailand.org/Articles/beach-safety-in-thailand';
      case 'sri lanka':
        return 'https://www.sltda.gov.lk/safety-guidelines';
      case 'maldives':
        return 'https://www.visitmaldives.com/en/blog/beach-safety-tips';
      case 'japan':
        return 'https://www.jla.or.jp/eng/';
      case 'morocco':
        return 'https://www.visitmorocco.com/en/travel/beach-safety';
      case 'peru':
        return 'https://www.promperu.gob.pe/TurismoIN/sitio/VisorDocumentos?titulo=Manual%20de%20Seguridad%20en%20Playas&url=~/Uploads/publicaciones/1152/Manual_seguridad_playas.pdf';
      case 'chile':
        return 'https://www.onemi.gov.cl/recomendaciones-seguridad-en-playas/';
      case 'ecuador':
        return 'https://www.turismo.gob.ec/seguridad-en-playas/';
      default:
        return 'https://www.who.int/news-room/fact-sheets/detail/drowning';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X className="close-icon" />
        </button>

        <div className="modal-rank">#{rank}</div>

        <div className="modal-header">
          <div
            className="modal-image"
            style={{ backgroundImage: `url(${destination.imageUrl})` }}
          >
            <div className="modal-image-overlay">
              <h2>{destination.name}</h2>
              <p>{destination.region}, {destination.country}</p>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Live Forecast Section */}
          {forecast && (
            <div className="modal-forecast">
              <h3>🌊 Current Surf Conditions</h3>
              <div className="modal-forecast-grid">
                <div className="forecast-main">
                  <div
                    className="modal-rating-badge"
                    style={{ backgroundColor: getRatingColor(forecast.rating) }}
                  >
                    {forecast.rating}/10
                  </div>
                  <div className="forecast-primary">
                    <span className="modal-wave-height">{forecast.waveHeight}ft</span>
                    <span className="modal-wave-period">{forecast.wavePeriod}s period</span>
                  </div>
                </div>
                <div className="forecast-secondary">
                  <div className="modal-weather-stat">
                    <Wind className="modal-weather-icon" />
                    <span>{forecast.windSpeed}mph {forecast.windDirection}</span>
                  </div>
                  <div className="modal-weather-stat">
                    <Thermometer className="modal-weather-icon" />
                    <span>{forecast.waterTemp}°C water</span>
                  </div>
                </div>
              </div>
              <p className="modal-conditions">{forecast.conditions}</p>
            </div>
          )}

          {/* Expected Conditions for Travel Dates */}
          <div className="modal-seasonal-forecast">
            <h3>📅 Expected Conditions in {getMonthName(travelMonth)}</h3>
            <div className="modal-seasonal-grid">
              <div className="seasonal-main">
                <div className="seasonal-metric">
                  <span className="seasonal-emoji">📈</span>
                  <span className="seasonal-label">Wave Height</span>
                  <span className="seasonal-value">{seasonalConditions.waveHeight}</span>
                </div>
                <div className="seasonal-metric">
                  <span className="seasonal-emoji">🎯</span>
                  <span className="seasonal-label">Consistency</span>
                  <span className="seasonal-value">{seasonalConditions.consistency}</span>
                </div>
                <div className="seasonal-metric">
                  <span className="seasonal-emoji">👥</span>
                  <span className="seasonal-label">Crowd Level</span>
                  <span className="seasonal-value">{seasonalConditions.crowd}</span>
                </div>
              </div>
            </div>
            <p className="modal-seasonal-note">
              Typical conditions for {getMonthName(travelMonth)} based on historical data
            </p>
          </div>

          {/* Destination Stats */}
          <div className="modal-stats-grid">
            <div className="modal-stat">
              <span className="modal-stat-emoji">⭐</span>
              <span className="modal-stat-label">Wave Quality</span>
              <span className="modal-stat-value">{destination.waveQuality}/10</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">🌊</span>
              <span className="modal-stat-label">Wave Size</span>
              <span className="modal-stat-value">{destination.waveSize}</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">👥</span>
              <span className="modal-stat-label">Crowd Level</span>
              <span className="modal-stat-value">{destination.crowdLevel}/10</span>
            </div>
            <div className="modal-stat modal-stat-cost">
              <span className="modal-stat-emoji">💰</span>
              <span className="modal-stat-label">Daily Cost</span>
              <div className="modal-cost-container">
                <span className="modal-stat-value">${destination.cost}/day</span>
                <a
                  href={`https://www.numbeo.com/cost-of-living/country_result.jsp?country=${encodeURIComponent(destination.country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-numbeo-link"
                  onClick={(e) => e.stopPropagation()}
                  title="View cost of living for this country on Numbeo"
                >
                  <ExternalLink className="modal-numbeo-icon" />
                </a>
              </div>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">💳</span>
              <span className="modal-stat-label">Total Cost</span>
              <span className="modal-stat-value">${destination.cost * tripDuration} ({tripDuration} days)</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">🌡️</span>
              <span className="modal-stat-label">Air / Water Temp</span>
              <span className="modal-stat-value">{destination.averageTemp}° / {destination.waterTemp}°C</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">
                {destination.travelTime ? (
                  <>
                    {destination.travelTime.mode === 'flight' && '✈️'}
                    {destination.travelTime.mode === 'car' && '🚗'}
                    {destination.travelTime.mode === 'train' && '🚆'}
                    {destination.travelTime.mode === 'bus' && '🚌'}
                  </>
                ) : (
                  '✈️'
                )}
              </span>
              <span className="modal-stat-label">Travel Time</span>
              <span className="modal-stat-value">
                {destination.travelTime
                  ? `${Math.round(destination.travelTime.duration)}h by ${destination.travelTime.mode}`
                  : 'Not calculated'
                }
              </span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">🗺️</span>
              <span className="modal-stat-label">Tourist Friendly</span>
              <span className="modal-stat-value">{destination.touristFriendliness ?? 7}/10</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-emoji">🏊‍♂️</span>
              <span className="modal-stat-label">Lifeguards</span>
              <div className="modal-lifeguard-container">
                <span className="modal-stat-value">{destination.lifeguardPresence ?? true ? 'Yes' : 'No'}</span>
                <a
                  href={getLifeguardInfoUrl(destination.country, destination.region)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-lifeguard-link"
                  onClick={(e) => e.stopPropagation()}
                  title={`Learn more about beach safety and lifeguarding in ${destination.country}`}
                >
                  <ExternalLink className="modal-lifeguard-icon" />
                </a>
              </div>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="modal-difficulty">
            <span className="modal-difficulty-label">Difficulty Level:</span>
            <div
              className="modal-difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(destination.difficultyLevel) }}
            >
              {getDifficultyLabel(destination.difficultyLevel)}
            </div>
          </div>

          {/* Break Type */}
          <div className="modal-break-type">
            <h4>🌊 Break Type: {getBreakTypeLabel(destination.breakType ?? 'beach')}</h4>
            <p className="modal-break-explanation">{getBreakTypeExplanation(destination.breakType ?? 'beach')}</p>
          </div>

          {/* Best Months */}
          <div className="modal-section">
            <h4>📅 Best Months to Visit</h4>
            <p>{formatBestMonths(destination.bestMonths)}</p>
          </div>

          {/* Description */}
          <div className="modal-section">
            <h4>📍 About {destination.name}</h4>
            <p>{destination.description}</p>
          </div>

          {/* Highlights */}
          <div className="modal-section">
            <h4>✨ Highlights</h4>
            <div className="modal-highlights">
              {destination.highlights.map((highlight, index) => (
                <span key={index} className="modal-highlight-tag">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div className="modal-section">
            <h4>🏨 Accommodation Options</h4>
            <div className="modal-accommodation">
              {destination.accommodationOptions.map((option, index) => (
                <span key={index} className="modal-accommodation-tag">
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div className="modal-section">
            <h4>🌤️ Weather Conditions</h4>
            <p>{destination.weatherConditions}</p>
          </div>

          {/* Reddit Quotes */}
          {destination.redditQuotes && destination.redditQuotes.length > 0 && (
            <div className="modal-section">
              <h4>💬 What people are saying</h4>
              <div className="reddit-quotes">
                {destination.redditQuotes.map((quote, index) => (
                  <div key={index} className="reddit-quote">
                    <p className="quote-text">"{quote.text}"</p>
                    <div className="quote-attribution">
                      <a
                        href={quote.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quote-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="quote-author">{quote.author}</span>
                        <span className="quote-subreddit">in {quote.subreddit}</span>
                        <ExternalLink className="quote-external-icon" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};