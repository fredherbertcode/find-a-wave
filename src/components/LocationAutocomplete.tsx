import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface LocationOption {
  name: string;
  country: string;
  displayName: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const worldwideLocations: LocationOption[] = [
  // Major cities
  { name: 'London', country: 'UK', displayName: 'London, United Kingdom' },
  { name: 'New York', country: 'USA', displayName: 'New York, United States' },
  { name: 'Los Angeles', country: 'USA', displayName: 'Los Angeles, United States' },
  { name: 'Paris', country: 'France', displayName: 'Paris, France' },
  { name: 'Tokyo', country: 'Japan', displayName: 'Tokyo, Japan' },
  { name: 'Sydney', country: 'Australia', displayName: 'Sydney, Australia' },
  { name: 'San Francisco', country: 'USA', displayName: 'San Francisco, United States' },
  { name: 'Amsterdam', country: 'Netherlands', displayName: 'Amsterdam, Netherlands' },
  { name: 'Barcelona', country: 'Spain', displayName: 'Barcelona, Spain' },
  { name: 'Lisbon', country: 'Portugal', displayName: 'Lisbon, Portugal' },
  { name: 'Dublin', country: 'Ireland', displayName: 'Dublin, Ireland' },
  { name: 'Berlin', country: 'Germany', displayName: 'Berlin, Germany' },
  { name: 'Madrid', country: 'Spain', displayName: 'Madrid, Spain' },
  { name: 'Rome', country: 'Italy', displayName: 'Rome, Italy' },
  { name: 'Copenhagen', country: 'Denmark', displayName: 'Copenhagen, Denmark' },
  { name: 'Stockholm', country: 'Sweden', displayName: 'Stockholm, Sweden' },
  { name: 'Toronto', country: 'Canada', displayName: 'Toronto, Canada' },
  { name: 'Vancouver', country: 'Canada', displayName: 'Vancouver, Canada' },
  { name: 'Miami', country: 'USA', displayName: 'Miami, United States' },
  { name: 'Honolulu', country: 'USA', displayName: 'Honolulu, United States' },
  { name: 'Rio de Janeiro', country: 'Brazil', displayName: 'Rio de Janeiro, Brazil' },
  { name: 'Buenos Aires', country: 'Argentina', displayName: 'Buenos Aires, Argentina' },
  { name: 'Cape Town', country: 'South Africa', displayName: 'Cape Town, South Africa' },
  { name: 'Mumbai', country: 'India', displayName: 'Mumbai, India' },
  { name: 'Singapore', country: 'Singapore', displayName: 'Singapore' },
  { name: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand' },
  { name: 'Bali', country: 'Indonesia', displayName: 'Bali, Indonesia' },
  { name: 'Mexico City', country: 'Mexico', displayName: 'Mexico City, Mexico' },
  { name: 'Lima', country: 'Peru', displayName: 'Lima, Peru' },

  // Additional major cities
  { name: 'Chicago', country: 'USA', displayName: 'Chicago, United States' },
  { name: 'Houston', country: 'USA', displayName: 'Houston, United States' },
  { name: 'Boston', country: 'USA', displayName: 'Boston, United States' },
  { name: 'Seattle', country: 'USA', displayName: 'Seattle, United States' },
  { name: 'Las Vegas', country: 'USA', displayName: 'Las Vegas, United States' },
  { name: 'Denver', country: 'USA', displayName: 'Denver, United States' },
  { name: 'Atlanta', country: 'USA', displayName: 'Atlanta, United States' },
  { name: 'Philadelphia', country: 'USA', displayName: 'Philadelphia, United States' },
  { name: 'San Diego', country: 'USA', displayName: 'San Diego, United States' },
  { name: 'Phoenix', country: 'USA', displayName: 'Phoenix, United States' },

  // UK cities
  { name: 'Manchester', country: 'UK', displayName: 'Manchester, United Kingdom' },
  { name: 'Birmingham', country: 'UK', displayName: 'Birmingham, United Kingdom' },
  { name: 'Leeds', country: 'UK', displayName: 'Leeds, United Kingdom' },
  { name: 'Liverpool', country: 'UK', displayName: 'Liverpool, United Kingdom' },
  { name: 'Edinburgh', country: 'UK', displayName: 'Edinburgh, United Kingdom' },
  { name: 'Glasgow', country: 'UK', displayName: 'Glasgow, United Kingdom' },
  { name: 'Bristol', country: 'UK', displayName: 'Bristol, United Kingdom' },
  { name: 'Newcastle', country: 'UK', displayName: 'Newcastle, United Kingdom' },
  { name: 'Cardiff', country: 'UK', displayName: 'Cardiff, United Kingdom' },
  { name: 'Belfast', country: 'UK', displayName: 'Belfast, United Kingdom' },

  // European cities
  { name: 'Frankfurt', country: 'Germany', displayName: 'Frankfurt, Germany' },
  { name: 'Munich', country: 'Germany', displayName: 'Munich, Germany' },
  { name: 'Hamburg', country: 'Germany', displayName: 'Hamburg, Germany' },
  { name: 'Cologne', country: 'Germany', displayName: 'Cologne, Germany' },
  { name: 'Milan', country: 'Italy', displayName: 'Milan, Italy' },
  { name: 'Florence', country: 'Italy', displayName: 'Florence, Italy' },
  { name: 'Venice', country: 'Italy', displayName: 'Venice, Italy' },
  { name: 'Naples', country: 'Italy', displayName: 'Naples, Italy' },
  { name: 'Lyon', country: 'France', displayName: 'Lyon, France' },
  { name: 'Marseille', country: 'France', displayName: 'Marseille, France' },
  { name: 'Nice', country: 'France', displayName: 'Nice, France' },
  { name: 'Toulouse', country: 'France', displayName: 'Toulouse, France' },
  { name: 'Seville', country: 'Spain', displayName: 'Seville, Spain' },
  { name: 'Valencia', country: 'Spain', displayName: 'Valencia, Spain' },
  { name: 'Bilbao', country: 'Spain', displayName: 'Bilbao, Spain' },
  { name: 'Porto', country: 'Portugal', displayName: 'Porto, Portugal' },
  { name: 'Geneva', country: 'Switzerland', displayName: 'Geneva, Switzerland' },
  { name: 'Zurich', country: 'Switzerland', displayName: 'Zurich, Switzerland' },
  { name: 'Vienna', country: 'Austria', displayName: 'Vienna, Austria' },
  { name: 'Brussels', country: 'Belgium', displayName: 'Brussels, Belgium' },
  { name: 'Oslo', country: 'Norway', displayName: 'Oslo, Norway' },
  { name: 'Helsinki', country: 'Finland', displayName: 'Helsinki, Finland' },
  { name: 'Warsaw', country: 'Poland', displayName: 'Warsaw, Poland' },
  { name: 'Prague', country: 'Czech Republic', displayName: 'Prague, Czech Republic' },
  { name: 'Budapest', country: 'Hungary', displayName: 'Budapest, Hungary' },
  { name: 'Athens', country: 'Greece', displayName: 'Athens, Greece' },

  // Canadian cities
  { name: 'Montreal', country: 'Canada', displayName: 'Montreal, Canada' },
  { name: 'Calgary', country: 'Canada', displayName: 'Calgary, Canada' },
  { name: 'Ottawa', country: 'Canada', displayName: 'Ottawa, Canada' },
  { name: 'Edmonton', country: 'Canada', displayName: 'Edmonton, Canada' },
  { name: 'Winnipeg', country: 'Canada', displayName: 'Winnipeg, Canada' },
  { name: 'Quebec City', country: 'Canada', displayName: 'Quebec City, Canada' },

  // Australian cities
  { name: 'Melbourne', country: 'Australia', displayName: 'Melbourne, Australia' },
  { name: 'Brisbane', country: 'Australia', displayName: 'Brisbane, Australia' },
  { name: 'Perth', country: 'Australia', displayName: 'Perth, Australia' },
  { name: 'Adelaide', country: 'Australia', displayName: 'Adelaide, Australia' },
  { name: 'Canberra', country: 'Australia', displayName: 'Canberra, Australia' },
  { name: 'Gold Coast', country: 'Australia', displayName: 'Gold Coast, Australia' },
  { name: 'Newcastle', country: 'Australia', displayName: 'Newcastle, Australia' },
  { name: 'Wollongong', country: 'Australia', displayName: 'Wollongong, Australia' },

  // Asian cities
  { name: 'Seoul', country: 'South Korea', displayName: 'Seoul, South Korea' },
  { name: 'Beijing', country: 'China', displayName: 'Beijing, China' },
  { name: 'Shanghai', country: 'China', displayName: 'Shanghai, China' },
  { name: 'Hong Kong', country: 'Hong Kong', displayName: 'Hong Kong' },
  { name: 'Taipei', country: 'Taiwan', displayName: 'Taipei, Taiwan' },
  { name: 'Manila', country: 'Philippines', displayName: 'Manila, Philippines' },
  { name: 'Jakarta', country: 'Indonesia', displayName: 'Jakarta, Indonesia' },
  { name: 'Kuala Lumpur', country: 'Malaysia', displayName: 'Kuala Lumpur, Malaysia' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', displayName: 'Ho Chi Minh City, Vietnam' },
  { name: 'Hanoi', country: 'Vietnam', displayName: 'Hanoi, Vietnam' },
  { name: 'Delhi', country: 'India', displayName: 'Delhi, India' },
  { name: 'Bangalore', country: 'India', displayName: 'Bangalore, India' },
  { name: 'Chennai', country: 'India', displayName: 'Chennai, India' },
  { name: 'Kolkata', country: 'India', displayName: 'Kolkata, India' },

  // New Zealand
  { name: 'Auckland', country: 'New Zealand', displayName: 'Auckland, New Zealand' },
  { name: 'Wellington', country: 'New Zealand', displayName: 'Wellington, New Zealand' },
  { name: 'Christchurch', country: 'New Zealand', displayName: 'Christchurch, New Zealand' },

  // South African cities
  { name: 'Johannesburg', country: 'South Africa', displayName: 'Johannesburg, South Africa' },
  { name: 'Durban', country: 'South Africa', displayName: 'Durban, South Africa' },
  { name: 'Pretoria', country: 'South Africa', displayName: 'Pretoria, South Africa' },

  // Middle Eastern cities
  { name: 'Dubai', country: 'UAE', displayName: 'Dubai, United Arab Emirates' },
  { name: 'Abu Dhabi', country: 'UAE', displayName: 'Abu Dhabi, United Arab Emirates' },
  { name: 'Tel Aviv', country: 'Israel', displayName: 'Tel Aviv, Israel' },
  { name: 'Istanbul', country: 'Turkey', displayName: 'Istanbul, Turkey' },
  { name: 'Ankara', country: 'Turkey', displayName: 'Ankara, Turkey' },

  // More worldwide locations to simulate global coverage
  { name: 'Any Address Worldwide', country: 'Global', displayName: 'Enter any address, city, or location worldwide' }
];

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "e.g., London, United Kingdom",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<LocationOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = worldwideLocations.filter(location =>
        location.displayName.toLowerCase().includes(value.toLowerCase()) ||
        location.name.toLowerCase().includes(value.toLowerCase()) ||
        location.country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10)); // Show max 10 results
    } else {
      setFilteredLocations(worldwideLocations.slice(0, 10)); // Show top 10 popular locations
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleLocationSelect = (location: LocationOption) => {
    onChange(location.displayName);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // In production, you'd reverse geocode these coordinates
          onChange(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsOpen(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="location-autocomplete">
      <div className="location-input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required}
          className="location-input"
        />
        <button
          type="button"
          onClick={handleGeolocation}
          className="location-detect-btn"
          title="Use my location"
        >
          <MapPin className="location-pin-icon" />
        </button>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="location-dropdown">
          {filteredLocations.length > 0 ? (
            <>
              {!value && (
                <div className="location-dropdown-header">
                  Popular destinations
                </div>
              )}
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  className="location-option"
                  onClick={() => handleLocationSelect(location)}
                >
                  <MapPin className="location-option-icon" />
                  <div className="location-option-content">
                    <span className="location-name">{location.name}</span>
                    <span className="location-country">{location.country}</span>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="location-no-results">
              <span>No locations found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};