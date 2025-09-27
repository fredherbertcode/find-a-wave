import React, { useState } from 'react';
import { SurfPreferences } from '../types';
import { MapPin, Calendar, DollarSign, Waves, Car, Plane, Train, Bus, Thermometer, GraduationCap, Clock } from 'lucide-react';
import { MultiSelect } from './MultiSelect';
import { LocationAutocomplete } from './LocationAutocomplete';
import { DualCalendar } from './DualCalendar';

interface SurfPreferencesFormProps {
  onSubmit: (preferences: SurfPreferences) => void;
}

export const SurfPreferencesForm: React.FC<SurfPreferencesFormProps> = ({ onSubmit }) => {
  const getDefaultDates = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const weekLater = new Date(nextMonth);
    weekLater.setDate(nextMonth.getDate() + 6);

    return {
      startDate: nextMonth.toISOString().split('T')[0],
      endDate: weekLater.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();

  const [preferences, setPreferences] = useState<SurfPreferences>({
    surfingAbility: 2, // intermediate
    currentLocation: '',
    transportModes: ['flight'],
    maxTravelTime: 8,
    budget: 100,
    currency: 'GBP', // Default to GBP, will be updated by currency detection
    temperatureRange: 2, // mild
    travelDates: defaultDates,
    travelMonth: new Date(defaultDates.startDate).getMonth() + 1,
    tripDuration: 7,
    needsSurfLessons: false
  });

  // Detect user's currency based on location
  React.useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Try to get user's timezone first
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let detectedCurrency = 'GBP'; // Default to GBP

        // Simple timezone to currency mapping for major regions
        if (timezone.includes('America/') || timezone.includes('US/')) {
          detectedCurrency = 'USD';
        } else if (timezone.includes('Europe/') && !timezone.includes('London')) {
          detectedCurrency = 'EUR';
        }
        // Keep GBP for UK/London and everywhere else as default

        updatePreference('currency', detectedCurrency as 'USD' | 'EUR' | 'GBP');

        // Also update budget to appropriate range for currency
        const budgetMap = { 'USD': 120, 'EUR': 110, 'GBP': 100 };
        updatePreference('budget', budgetMap[detectedCurrency as keyof typeof budgetMap]);

      } catch (error) {
        console.log('Currency detection failed, using GBP default');
      }
    };

    detectCurrency();
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const updatePreference = <K extends keyof SurfPreferences>(
    key: K,
    value: SurfPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateTravelDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = endDate ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 7;
    const month = start.getMonth() + 1;

    setPreferences(prev => ({
      ...prev,
      travelDates: { startDate, endDate },
      travelMonth: month,
      tripDuration: duration
    }));
  };

  const transportOptions = [
    { value: 'flight', label: 'Flight', icon: '✈️' },
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'train', label: 'Train', icon: '🚆' },
    { value: 'bus', label: 'Bus', icon: '🚌' }
  ];

  const getAbilityLabel = (value: number) => {
    switch (value) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      default: return 'Intermediate';
    }
  };

  const getAbilityTooltip = (value: number) => {
    switch (value) {
      case 1: return "Perfect for first-time surfers • Small waves (1-3ft) • Gentle, rolling waves • Sandy bottom beaches";
      case 2: return "Comfortable with basics • Medium waves (3-6ft) • Can catch waves independently • Some experience with different conditions";
      case 3: return "Confident in most conditions • Large waves (6-10ft) • Can handle reef breaks • Experienced with tube riding";
      case 4: return "Professional level • Any size waves • Comfortable in heavy, dangerous conditions • Big wave surfing";
      default: return "";
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getTemperatureRangeLabel = (range: number) => {
    switch (range) {
      case 1: return '❄️ Cold (5-15°C)';
      case 2: return '🌤️ Mild (15-22°C)';
      case 3: return '☀️ Warm (22-28°C)';
      case 4: return '🔥 Hot (28°C+)';
      default: return '🌤️ Mild';
    }
  };

  const getTransportTimeEstimate = (mode: string, maxHours: number) => {
    // Estimate distances and times based on max travel time
    switch (mode) {
      case 'flight':
        if (maxHours <= 2) return 'Local airports (~200km, 1-2h flights)';
        if (maxHours <= 6) return 'Regional flights (~1,500km, 2-6h flights)';
        if (maxHours <= 12) return 'Long-haul flights (~8,000km, 8-12h flights)';
        return 'Global destinations (~15,000km+, 12h+ flights)';
      case 'car':
        const carDistance = maxHours * 80; // Assume 80km/h average
        return `~${carDistance}km by car (${maxHours}h drive)`;
      case 'train':
        const trainDistance = maxHours * 120; // Assume 120km/h average for fast trains
        return `~${trainDistance}km by train (${maxHours}h journey)`;
      case 'bus':
        const busDistance = maxHours * 60; // Assume 60km/h average
        return `~${busDistance}km by bus (${maxHours}h trip)`;
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surf-preferences-form">
      <div className="form-header">
        <h2>Find Your Perfect Wave</h2>
        <p>Tell us about your surf preferences and we'll find the best destinations for you</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>
            🏄‍♂️
            Surfing Ability
          </label>
          <div className="ability-slider">
            <input
              type="range"
              min="1"
              max="4"
              value={preferences.surfingAbility}
              onChange={(e) => updatePreference('surfingAbility', parseInt(e.target.value))}
              className="slider"
            />
            <div className="ability-display">
              {getAbilityLabel(preferences.surfingAbility)}
            </div>
            <div className="ability-description">
              {getAbilityTooltip(preferences.surfingAbility)}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            📍
            Current Location
          </label>
          <LocationAutocomplete
            value={preferences.currentLocation}
            onChange={(value) => updatePreference('currentLocation', value)}
            placeholder="Enter any address, city, or location worldwide"
            required
          />
        </div>

        <div className="form-group">
          <label>
            🚗
            Transport Modes
          </label>
          <div className="transport-options" style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '300px'}}>
            {transportOptions.map((option) => (
              <label key={option.value} className="transport-option" style={{flex: '0 0 calc(50% - 0.25rem)', maxWidth: '140px', minHeight: '80px'}}>
                <input
                  type="checkbox"
                  checked={preferences.transportModes.includes(option.value as any)}
                  onChange={(e) => {
                    const currentModes = preferences.transportModes;
                    if (e.target.checked) {
                      updatePreference('transportModes', [...currentModes, option.value] as any);
                    } else {
                      updatePreference('transportModes', currentModes.filter(mode => mode !== option.value) as any);
                    }
                  }}
                />
                <span className="transport-checkmark"></span>
                <span className="transport-emoji">{option.icon}</span>
                <span className="transport-label">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            ⏰
            Max Travel Time
          </label>
          <div className="travel-time-slider">
            <input
              type="range"
              min="1"
              max="24"
              value={preferences.maxTravelTime}
              onChange={(e) => updatePreference('maxTravelTime', parseInt(e.target.value))}
              className="slider"
            />
            <div className="travel-time-display">
              {preferences.maxTravelTime} hour{preferences.maxTravelTime !== 1 ? 's' : ''}
            </div>
            {preferences.transportModes.length > 0 && (
              <div className="transport-travel-times">
                {preferences.transportModes.map((mode) => {
                  const timeEstimate = getTransportTimeEstimate(mode, preferences.maxTravelTime);
                  const icon = transportOptions.find(opt => opt.value === mode)?.icon;
                  return (
                    <div key={mode} className="transport-time-estimate">
                      <span className="transport-time-icon">{icon}</span>
                      <span className="transport-time-text">{timeEstimate}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>
            💰
            Daily Budget
          </label>
          <div className="budget-slider-group">
            <input
              type="range"
              min="20"
              max="500"
              value={preferences.budget}
              onChange={(e) => updatePreference('budget', parseInt(e.target.value))}
              className="slider budget-slider"
            />
            <div className="budget-input-container">
              <span className="budget-currency">$</span>
              <input
                type="number"
                min="20"
                max="500"
                value={preferences.budget}
                onChange={(e) => updatePreference('budget', parseInt(e.target.value))}
                className="budget-input"
              />
              <span className="budget-period">/day</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            🌡️
            Temperature Range
          </label>
          <div className="temperature-slider">
            <input
              type="range"
              min="1"
              max="4"
              value={preferences.temperatureRange}
              onChange={(e) => updatePreference('temperatureRange', parseInt(e.target.value))}
              className="slider"
            />
            <div className="temperature-display">
              {getTemperatureRangeLabel(preferences.temperatureRange)}
            </div>
          </div>
        </div>

        <div className="form-group dual-calendar-group">
          <label>
            📅
            Travel Dates
          </label>
          <DualCalendar
            startDate={preferences.travelDates.startDate}
            endDate={preferences.travelDates.endDate}
            onChange={updateTravelDates}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.needsSurfLessons}
              onChange={(e) => updatePreference('needsSurfLessons', e.target.checked)}
            />
            <span className="checkmark"></span>
            🎓
            I need surf school/lessons
          </label>
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Find My Perfect Wave
      </button>
    </form>
  );
};