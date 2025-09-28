import React, { useState } from 'react';
import { SurfDestination, SurfPreferences } from '../types';
import { SquareDestinationCard } from './SquareDestinationCard';
import { DestinationModal } from './DestinationModal';
import { EnhancedDestinationCard } from './EnhancedDestinationCard';
import { PreferenceWeightControls } from './PreferenceWeightControls';
import { Layout, Grid, Filter, TrendingUp } from 'lucide-react';
import { recommendationService } from '../services/recommendationService';
import { filterAndRankDestinations } from '../utils/filterDestinations';

interface DestinationGridProps {
  destinations: SurfDestination[];
  travelMonth: number;
  tripDuration: number;
  preferences: SurfPreferences;
  onPreferencesChange: (preferences: SurfPreferences) => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  travelMonth,
  tripDuration,
  preferences,
  onPreferencesChange
}) => {
  const [selectedDestination, setSelectedDestination] = useState<SurfDestination | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');
  const [rankedDestinations, setRankedDestinations] = useState(destinations);

  // Generate recommendation explanations for all destinations
  React.useEffect(() => {
    const destinationsWithExplanations = destinations.map(destination => ({
      ...destination,
      recommendationScore: recommendationService.generateExplanation(destination, preferences)
    }));
    setRankedDestinations(destinationsWithExplanations);
  }, [destinations, preferences]);

  const handlePreferenceWeightChange = async (newWeights: any) => {
    const updatedPreferences = {
      ...preferences,
      preferenceWeights: newWeights
    };

    // Re-rank destinations with new weights
    try {
      const reranked = await filterAndRankDestinations(destinations, updatedPreferences);
      setRankedDestinations(reranked);
      onPreferencesChange(updatedPreferences);
    } catch (error) {
      console.error('Error re-ranking destinations:', error);
    }
  };

  if (destinations.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-content">
          <h3>No destinations found</h3>
          <p>Try adjusting your preferences to see more results</p>
        </div>
      </div>
    );
  }

  const handleCardClick = (destination: SurfDestination, rank: number) => {
    setSelectedDestination(destination);
    setSelectedRank(rank);
  };

  const handleCloseModal = () => {
    setSelectedDestination(null);
    setSelectedRank(0);
  };

  return (
    <div className="destination-grid">
      {/* Header with controls */}
      <div className="grid-header mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Perfect Surf Destinations</h2>
            <p className="text-gray-600">
              {rankedDestinations.length} destinations ranked by your preferences
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layout className="w-4 h-4" />
              Detailed
            </button>
          </div>
        </div>

        {/* Preference weight controls */}
        <PreferenceWeightControls
          weights={preferences.preferenceWeights || {
            waveQuality: 25,
            budget: 20,
            travelTime: 15,
            crowdLevel: 10,
            temperature: 10,
            skillMatch: 15,
            safetyFactors: 5
          }}
          onWeightsChange={handlePreferenceWeightChange}
          className="mb-4"
        />

        {/* Results summary */}
        <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>
              Top match: <strong>{rankedDestinations[0]?.name}</strong>
              {rankedDestinations[0]?.recommendationScore &&
                ` (${rankedDestinations[0].recommendationScore.overallScore}% match)`
              }
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filtered from {destinations.length} total destinations</span>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="square-cards-container">
          {rankedDestinations.map((destination, index) => (
            <SquareDestinationCard
              key={destination.id}
              destination={destination}
              rank={index + 1}
              travelMonth={travelMonth}
              tripDuration={tripDuration}
              onClick={() => handleCardClick(destination, index + 1)}
            />
          ))}
        </div>
      )}

      {/* Detailed view */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {rankedDestinations.map((destination, index) => (
            <EnhancedDestinationCard
              key={destination.id}
              destination={destination}
              preferences={preferences}
              rank={index + 1}
              className="detailed-card"
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          rank={selectedRank}
          travelMonth={travelMonth}
          tripDuration={tripDuration}
          isOpen={!!selectedDestination}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};