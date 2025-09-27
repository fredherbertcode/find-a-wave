import React, { useState } from 'react';
import { Waves, MapPin, Clock, DollarSign, TrendingUp, Users, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <button className="back-btn about-back" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back to App
        </button>

        <div className="about-header">
          <div className="about-logo">
            <Waves className="about-logo-icon" />
            <h1>Find A Wave</h1>
          </div>
          <p className="about-subtitle">Your AI-powered surf trip planner</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>What is Find A Wave?</h2>
            <p>
              Find A Wave is a smart surf trip planner that helps you discover the perfect surf destinations
              based on your preferences. Tell us your surfing ability, travel constraints, budget, and dates -
              we'll show you ranked destinations with live surf forecasts and travel times.
            </p>
          </section>

          <section className="about-section">
            <h2>How to Use</h2>
            <div className="how-to-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Set Your Preferences</h3>
                  <p>Choose your surfing ability, preferred wave size, current location, and travel constraints</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Review Results</h3>
                  <p>Browse ranked destinations as cards - hover to see live forecasts, click for full details</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Plan Your Trip</h3>
                  <p>Use Numbeo cost links and travel time info to plan your perfect surf adventure</p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature">
                <MapPin className="feature-icon" />
                <h3>Smart Location Search</h3>
                <p>Autocomplete with popular destinations plus geolocation detection</p>
              </div>
              <div className="feature">
                <Clock className="feature-icon" />
                <h3>Real Travel Times</h3>
                <p>Accurate calculations for flights, cars, trains, and buses</p>
              </div>
              <div className="feature">
                <Waves className="feature-icon" />
                <h3>Live Surf Forecasts</h3>
                <p>Real-time wave heights, wind conditions, and surf quality ratings</p>
              </div>
              <div className="feature">
                <DollarSign className="feature-icon" />
                <h3>Cost Integration</h3>
                <p>Direct links to Numbeo for detailed local cost-of-living data</p>
              </div>
              <div className="feature">
                <TrendingUp className="feature-icon" />
                <h3>Smart Ranking</h3>
                <p>AI-powered scoring based on your preferences and conditions</p>
              </div>
              <div className="feature">
                <Users className="feature-icon" />
                <h3>100+ Destinations</h3>
                <p>Worldwide surf spots from beginner-friendly to expert-only breaks</p>
              </div>
            </div>
          </section>

          <section className="about-section for-nerds">
            <div className="nerds-header" onClick={() => toggleSection('nerds')}>
              <h2>🤓 For Nerds</h2>
              <p>Deep dive into the algorithms and data sources powering Find A Wave</p>
              {expandedSection === 'nerds' ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expandedSection === 'nerds' && (
              <div className="nerds-content">
                <div className="nerd-section">
                  <h3>🗺️ Travel Time Calculation</h3>
                  <div className="tech-explanation">
                    <h4>Distance Calculation</h4>
                    <p>
                      <strong>Haversine Formula</strong> - calculates great-circle distance between two points on Earth:
                    </p>
                    <ul>
                      <li>Uses latitude/longitude coordinates</li>
                      <li>Earth radius: 6,371 km</li>
                      <li>Returns straight-line distance in kilometers</li>
                    </ul>

                    <h4>Time Calculation by Transport Mode</h4>

                    <div className="transport-mode">
                      <h5>✈️ Flights</h5>
                      <ul>
                        <li><strong>Cruising speed</strong>: 900 km/h</li>
                        <li><strong>Airport procedures</strong> (check-in, security, boarding, etc.):</li>
                        <li className="indent">Short flights (&lt;3,000km): +3 hours</li>
                        <li className="indent">Medium flights (3,000-8,000km): +4 hours</li>
                        <li className="indent">Long-haul (8,000-15,000km): +5 hours</li>
                        <li className="indent">Ultra long-haul (&gt;15,000km): +6 hours</li>
                      </ul>
                    </div>

                    <div className="transport-mode">
                      <h5>🚗 Car</h5>
                      <ul>
                        <li><strong>Average speed</strong>: 80 km/h (includes stops, traffic, rest breaks)</li>
                      </ul>
                    </div>

                    <div className="transport-mode">
                      <h5>🚆 Train</h5>
                      <ul>
                        <li><strong>Average speed</strong>: 120 km/h (intercity trains)</li>
                      </ul>
                    </div>

                    <div className="transport-mode">
                      <h5>🚌 Bus</h5>
                      <ul>
                        <li><strong>Average speed</strong>: 60 km/h (includes stops)</li>
                      </ul>
                    </div>

                    <div className="example">
                      <h5>Example: London to Bali</h5>
                      <ul>
                        <li><strong>Distance</strong>: ~13,000 km (straight line)</li>
                        <li><strong>Flight time</strong>: 13,000 ÷ 900 = 14.4 hours flying + 5 hours airport = <strong>19.4 hours total</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="nerd-section">
                  <h3>💰 Cost Data Integration</h3>
                  <div className="tech-explanation">
                    <h4>Numbeo Integration</h4>
                    <p>
                      We automatically generate <strong>Numbeo</strong> links for each destination to provide detailed cost-of-living data:
                    </p>
                    <ul>
                      <li>Restaurant prices and local food costs</li>
                      <li>Transportation costs (local buses, taxis, fuel)</li>
                      <li>Accommodation ranges from hostels to hotels</li>
                      <li>Activity and entertainment costs</li>
                      <li>Shopping and grocery prices</li>
                    </ul>
                    <p>
                      <strong>URL Format</strong>: <code>numbeo.com/cost-of-living/in/[City]-[Country]</code>
                    </p>
                    <p>
                      Our destination cost estimates are baseline daily budgets, but Numbeo gives you the full breakdown to plan accurately.
                    </p>
                  </div>
                </div>

                <div className="nerd-section">
                  <h3>🌊 Surf Forecast Generation</h3>
                  <div className="tech-explanation">
                    <h4>Current Implementation: Mock Service</h4>
                    <p>
                      We currently use a <strong>realistic simulation service</strong> that generates surf forecasts based on:
                    </p>
                    <ul>
                      <li><strong>Location characteristics</strong>: Each destination has predefined wave patterns</li>
                      <li><strong>Seasonal factors</strong>: Wave heights vary by month based on real-world patterns</li>
                      <li><strong>Realistic ranges</strong>: Wave heights (0.5-12ft), wind speeds (5-25 knots), water temps (12-28°C)</li>
                      <li><strong>Time-based updates</strong>: Forecasts refresh every 15 minutes with variations</li>
                    </ul>

                    <h4>Production APIs (Future Integration)</h4>
                    <ul>
                      <li><strong>Surfline API</strong>: Premium surf data with global coverage (~$50-200/month)</li>
                      <li><strong>Stormglass Marine API</strong>: Weather and ocean data with multiple sources</li>
                      <li><strong>NOAA/NDBC</strong>: Free US buoy data for real-time conditions</li>
                    </ul>

                    <div className="forecast-data">
                      <h5>📊 Forecast Data Points</h5>
                      <ul>
                        <li>Wave height, period, and direction</li>
                        <li>Wind speed and direction</li>
                        <li>Water and air temperature</li>
                        <li>Surf quality rating (1-10 scale)</li>
                        <li>Crowd level estimation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="nerd-section">
                  <h3>🏄‍♂️ Surfing Ability Scoring</h3>
                  <div className="tech-explanation">
                    <h4>Ability Level Definitions</h4>
                    <div className="ability-levels">
                      <div className="ability-level beginner">
                        <h5>🟢 Beginner</h5>
                        <ul>
                          <li>Perfect for first-time surfers</li>
                          <li>Small waves (1-3ft)</li>
                          <li>Gentle, rolling waves</li>
                          <li>Sandy bottom beaches</li>
                        </ul>
                      </div>

                      <div className="ability-level intermediate">
                        <h5>🟡 Intermediate</h5>
                        <ul>
                          <li>Comfortable with basics</li>
                          <li>Medium waves (3-6ft)</li>
                          <li>Can catch waves independently</li>
                          <li>Some experience with different conditions</li>
                        </ul>
                      </div>

                      <div className="ability-level advanced">
                        <h5>🟠 Advanced</h5>
                        <ul>
                          <li>Confident in most conditions</li>
                          <li>Large waves (6-10ft)</li>
                          <li>Can handle reef breaks</li>
                          <li>Experienced with tube riding</li>
                        </ul>
                      </div>

                      <div className="ability-level expert">
                        <h5>🟣 Expert</h5>
                        <ul>
                          <li>Professional level</li>
                          <li>Any size waves</li>
                          <li>Comfortable in heavy, dangerous conditions</li>
                          <li>Big wave surfing</li>
                        </ul>
                      </div>
                    </div>

                    <h4>Matching Algorithm</h4>
                    <p>Our scoring system awards points based on ability match:</p>
                    <ul>
                      <li><strong>Perfect match</strong>: +20 points</li>
                      <li><strong>One level difference</strong>: +15 points</li>
                      <li><strong>Two levels difference</strong>: +5 points</li>
                      <li><strong>Three+ levels difference</strong>: 0 points</li>
                    </ul>
                  </div>
                </div>

                <div className="nerd-section">
                  <h3>📈 Destination Ranking Algorithm</h3>
                  <div className="tech-explanation">
                    <h4>Multi-Factor Scoring System (Max 100 points)</h4>
                    <ul>
                      <li><strong>Surfing Ability Match</strong>: Up to 20 points</li>
                      <li><strong>Wave Size Preference</strong>: Up to 15 points</li>
                      <li><strong>Budget Compatibility</strong>: Up to 15 points</li>
                      <li><strong>Seasonality</strong>: Up to 15 points (best months)</li>
                      <li><strong>Transport Availability</strong>: Up to 10 points</li>
                      <li><strong>Surf School Needs</strong>: Up to 15 points (if requested)</li>
                      <li><strong>Temperature Preference</strong>: Up to 10 points</li>
                      <li><strong>Wave Quality Bonus</strong>: Destination rating × 2</li>
                    </ul>

                    <h4>Budget Scoring Logic</h4>
                    <ul>
                      <li>Within budget: Score decreases as cost approaches budget limit</li>
                      <li>Over budget by &lt;20%: 10 points</li>
                      <li>Over budget by 20-50%: 5 points</li>
                      <li>Over budget by &gt;50%: 0 points</li>
                    </ul>

                    <h4>Pre-Filtering</h4>
                    <p>Before scoring, destinations are filtered by:</p>
                    <ul>
                      <li><strong>Travel Time Constraint</strong>: Only includes destinations reachable within your max travel time</li>
                      <li><strong>Transport Mode Availability</strong>: Matches your selected transport preferences</li>
                    </ul>
                  </div>
                </div>

                <div className="nerd-section">
                  <h3>🗂️ Data Architecture</h3>
                  <div className="tech-explanation">
                    <h4>Destination Database</h4>
                    <p>Our curated database includes <strong>100+ surf destinations</strong> worldwide:</p>
                    <ul>
                      <li><strong>Geographic data</strong>: Precise lat/lng coordinates</li>
                      <li><strong>Surf characteristics</strong>: Wave size, difficulty, quality ratings</li>
                      <li><strong>Seasonal patterns</strong>: Best months for surf conditions</li>
                      <li><strong>Cost estimates</strong>: Daily budget recommendations</li>
                      <li><strong>Local info</strong>: Climate, crowd levels, accommodation types</li>
                    </ul>

                    <h4>Caching Strategy</h4>
                    <ul>
                      <li><strong>Travel Time Cache</strong>: 1-hour cache duration</li>
                      <li><strong>Surf Forecast Cache</strong>: 15-minute refresh cycle</li>
                      <li><strong>Location Geocoding</strong>: Permanent cache for known cities</li>
                    </ul>

                    <h4>Performance Optimizations</h4>
                    <ul>
                      <li><strong>Parallel Processing</strong>: Travel time calculations run concurrently</li>
                      <li><strong>Smart Filtering</strong>: Travel time filtering before expensive ranking calculations</li>
                      <li><strong>Result Limiting</strong>: Returns top ranked destinations only</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};