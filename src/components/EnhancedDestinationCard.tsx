import React, { useState, useEffect } from 'react';
import { SurfDestination, SurfPreferences } from '../types';
import { RecommendationExplanation } from './RecommendationExplanation';
import { BookingOptions } from './BookingOptions';
import { FeedbackModal } from './FeedbackModal';
import { recommendationService } from '../services/recommendationService';
import { analyticsService } from '../services/analyticsService';
import {
  MapPin, Star, Users, DollarSign, Thermometer, Shield,
  Heart, Share2, MessageSquare, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, Info
} from 'lucide-react';

interface EnhancedDestinationCardProps {
  destination: SurfDestination;
  preferences: SurfPreferences;
  rank?: number;
  className?: string;
}

const getSkillLevelColor = (level: number) => {
  switch (level) {
    case 1: return 'bg-green-100 text-green-800';
    case 2: return 'bg-yellow-100 text-yellow-800';
    case 3: return 'bg-orange-100 text-orange-800';
    case 4: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSkillLevelName = (level: number) => {
  const levels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return levels[level] || 'Unknown';
};

const getSafetyIcon = (rating: number) => {
  if (rating >= 8) return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (rating >= 6) return <Info className="w-4 h-4 text-yellow-600" />;
  return <AlertTriangle className="w-4 h-4 text-red-600" />;
};

export const EnhancedDestinationCard: React.FC<EnhancedDestinationCardProps> = ({
  destination,
  preferences,
  rank,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [viewStartTime] = useState(Date.now());
  const [explanation, setExplanation] = useState(destination.recommendationScore);

  useEffect(() => {
    // Generate recommendation explanation if not already present
    if (!explanation) {
      const newExplanation = recommendationService.generateExplanation(destination, preferences);
      setExplanation(newExplanation);
    }

    // Track destination view
    analyticsService.trackDestinationView(destination.id, preferences);

    // Track view duration when component unmounts
    return () => {
      const viewDuration = Date.now() - viewStartTime;
      if (viewDuration > 5000) { // Only track if viewed for more than 5 seconds
        analyticsService.trackDestinationView(destination.id, preferences, viewDuration);
      }
    };
  }, [destination.id, preferences, explanation, viewStartTime]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    analyticsService.trackDestinationSave(destination.id, preferences);

    // Store in localStorage
    const saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
    if (!isSaved) {
      saved.push(destination.id);
    } else {
      const index = saved.indexOf(destination.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem('savedDestinations', JSON.stringify(saved));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${destination.name} - Surf Destination`,
        text: `Check out ${destination.name} for your next surf trip!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    analyticsService.trackShareAction(destination.id, 'native-share', preferences);
  };

  const userSkillMatch = preferences.surfingAbility === destination.difficultyLevel;
  const isUserBeginner = preferences.surfingAbility <= 2;
  const hasSkillMismatch = Math.abs(preferences.surfingAbility - destination.difficultyLevel) > 1;

  return (
    <div className={`enhanced-destination-card bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header Image and Ranking */}
      <div className="relative">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />

        {rank && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold">
            #{rank}
          </div>
        )}

        {explanation && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
            <span className="text-sm font-bold text-blue-600">
              {explanation.overallScore}% match
            </span>
          </div>
        )}

        {/* Safety warning for skill mismatches */}
        {hasSkillMismatch && preferences.surfingAbility < destination.difficultyLevel && (
          <div className="absolute bottom-3 left-3 right-3 bg-red-500 text-white p-2 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>May be challenging for your skill level</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{destination.region}, {destination.country}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{destination.waveQuality}/10</span>
            </div>
            <p className="text-xs text-gray-600">Wave Quality</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{11 - destination.crowdLevel}/10</span>
            </div>
            <p className="text-xs text-gray-600">Uncrowded</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">${destination.cost}</span>
            </div>
            <p className="text-xs text-gray-600">Per Day</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{destination.averageTemp}°C</span>
            </div>
            <p className="text-xs text-gray-600">Air Temp</p>
          </div>
        </div>

        {/* Skill Level and Safety */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(destination.difficultyLevel)}`}>
            {getSkillLevelName(destination.difficultyLevel)}
          </div>

          {destination.safetyInfo && (
            <div className="flex items-center gap-1">
              {getSafetyIcon(destination.safetyInfo.overallSafetyRating)}
              <span className="text-sm text-gray-600">
                Safety: {destination.safetyInfo.overallSafetyRating}/10
              </span>
            </div>
          )}

          {destination.safetyInfo?.lifeguardPresence && (
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Lifeguards</span>
            </div>
          )}
        </div>

        {/* Quick Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {destination.description}
        </p>

        {/* Recommendation Explanation */}
        {explanation && (
          <RecommendationExplanation
            explanation={explanation}
            destinationName={destination.name}
          />
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 mt-4 text-blue-600 hover:text-blue-700 transition-colors border-t border-gray-100"
        >
          <span className="text-sm font-medium">
            {isExpanded ? 'Show Less' : 'Show More Details'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
            {/* Skill Requirements */}
            {destination.skillRequirements && destination.skillRequirements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Recommended Skills</h4>
                <div className="space-y-2">
                  {destination.skillRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        req.level === 'required' ? 'bg-red-100 text-red-800' :
                        req.level === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {req.level}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{req.skill}</p>
                        <p className="text-xs text-gray-600">{req.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Information */}
            {destination.safetyInfo && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Safety Information</h4>
                <div className="space-y-2">
                  {destination.safetyInfo.commonHazards && destination.safetyInfo.commonHazards.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Common Hazards:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {destination.safetyInfo.commonHazards.map((hazard, index) => (
                          <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {hazard}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.safetyInfo.beginnerFriendlyTimes && destination.safetyInfo.beginnerFriendlyTimes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Best Times for Beginners:</p>
                      <p className="text-sm text-gray-600">
                        {destination.safetyInfo.beginnerFriendlyTimes.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Community Quotes */}
            {destination.redditQuotes && destination.redditQuotes.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">What Surfers Say</h4>
                <div className="space-y-3">
                  {destination.redditQuotes.slice(0, 2).map((quote, index) => (
                    <blockquote key={index} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 mb-2">"{quote.text}"</p>
                      <cite className="text-xs text-gray-500">
                        — {quote.author} on {quote.subreddit}
                      </cite>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Options */}
            {destination.bookingOptions && destination.bookingOptions.length > 0 && (
              <BookingOptions
                options={destination.bookingOptions}
                destinationId={destination.id}
                destinationName={destination.name}
                travelDates={preferences.travelDates}
                searchContext={preferences}
              />
            )}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        destinationId={destination.id}
        destinationName={destination.name}
        trigger="immediate"
      />
    </div>
  );
};