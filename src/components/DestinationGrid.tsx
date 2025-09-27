import React, { useState } from 'react';
import { SurfDestination } from '../types';
import { SquareDestinationCard } from './SquareDestinationCard';
import { DestinationModal } from './DestinationModal';

interface DestinationGridProps {
  destinations: SurfDestination[];
  travelMonth: number;
  tripDuration: number;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({ destinations, travelMonth, tripDuration }) => {
  const [selectedDestination, setSelectedDestination] = useState<SurfDestination | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(0);

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
      <div className="grid-header">
        <h2>Your Perfect Surf Destinations</h2>
        <p>Hover to see forecast • Click for full details</p>
      </div>

      <div className="square-cards-container">
        {destinations.map((destination, index) => (
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