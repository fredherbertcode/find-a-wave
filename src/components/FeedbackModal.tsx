import React, { useState } from 'react';
import { X, Star, MessageSquare, Send } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationName: string;
  trigger: 'post-trip' | 'immediate' | 'email-followup';
}

interface FeedbackState {
  tripCompleted: boolean;
  ratings: {
    overallExperience: number;
    waveQualityVsExpected: number;
    crowdLevelVsExpected: number;
    costVsExpected: number;
    safetyRating: number;
  };
  wouldReturn: boolean | null;
  wouldRecommend: boolean | null;
  comments: string;
}

const ratingLabels = {
  overallExperience: "Overall Experience",
  waveQualityVsExpected: "Wave Quality vs Expected",
  crowdLevelVsExpected: "Crowd Level vs Expected",
  costVsExpected: "Cost vs Expected",
  safetyRating: "Safety Rating"
};

const ratingDescriptions = {
  overallExperience: "How would you rate your overall experience?",
  waveQualityVsExpected: "Were the waves better or worse than expected?",
  crowdLevelVsExpected: "Were crowds lighter or heavier than expected?",
  costVsExpected: "Was it cheaper or more expensive than expected?",
  safetyRating: "How safe did you feel surfing here?"
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  destinationId,
  destinationName,
  trigger
}) => {
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackState>({
    tripCompleted: false,
    ratings: {
      overallExperience: 0,
      waveQualityVsExpected: 5,
      crowdLevelVsExpected: 5,
      costVsExpected: 5,
      safetyRating: 0
    },
    wouldReturn: null,
    wouldRecommend: null,
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTripStatusSelect = (completed: boolean) => {
    setFeedback(prev => ({ ...prev, tripCompleted: completed }));
    if (completed) {
      setStep(2);
    } else {
      // For non-completed trips, just collect basic feedback
      setStep(4);
    }
  };

  const handleRatingChange = (category: keyof FeedbackState['ratings'], value: number) => {
    setFeedback(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await analyticsService.submitFeedback({
        destinationId,
        tripCompleted: feedback.tripCompleted,
        ratings: feedback.ratings,
        wouldReturn: feedback.wouldReturn || false,
        wouldRecommend: feedback.wouldRecommend || false,
        comments: feedback.comments
      });

      // Show success and close
      alert('Thank you for your feedback! This helps us improve recommendations for everyone.');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Sorry, there was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    value: number;
    onChange: (value: number) => void;
    max?: number;
    label: string;
  }> = ({ value, onChange, max = 10, label }) => (
    <div className="star-rating">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-6 h-6 ${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/{max}</span>
      </div>
    </div>
  );

  const ExpectedRating: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
    description: string;
  }> = ({ value, onChange, label, description }) => (
    <div className="expected-rating">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-xs text-gray-500 mb-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-red-600">Much worse</span>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="mx-4 flex-1"
        />
        <span className="text-xs text-green-600">Much better</span>
      </div>
      <div className="text-center mt-1">
        <span className="text-sm font-medium">
          {value === 5 ? 'As expected' : value < 5 ? 'Worse than expected' : 'Better than expected'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Share Your Experience
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Help us improve recommendations for <strong>{destinationName}</strong>
            </p>
          </div>

          {/* Step 1: Trip Status */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Did you visit {destinationName}?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTripStatusSelect(true)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-800">Yes, I went!</div>
                  <div className="text-sm text-gray-600">Share your experience</div>
                </button>
                <button
                  onClick={() => handleTripStatusSelect(false)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-800">Not yet</div>
                  <div className="text-sm text-gray-600">Quick feedback</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Experience Ratings */}
          {step === 2 && feedback.tripCompleted && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800">Rate Your Experience</h3>

              <StarRating
                value={feedback.ratings.overallExperience}
                onChange={(value) => handleRatingChange('overallExperience', value)}
                label={ratingDescriptions.overallExperience}
              />

              <StarRating
                value={feedback.ratings.safetyRating}
                onChange={(value) => handleRatingChange('safetyRating', value)}
                label={ratingDescriptions.safetyRating}
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Expectation vs Reality */}
          {step === 3 && feedback.tripCompleted && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800">Expectations vs Reality</h3>

              <ExpectedRating
                value={feedback.ratings.waveQualityVsExpected}
                onChange={(value) => handleRatingChange('waveQualityVsExpected', value)}
                label={ratingLabels.waveQualityVsExpected}
                description={ratingDescriptions.waveQualityVsExpected}
              />

              <ExpectedRating
                value={feedback.ratings.crowdLevelVsExpected}
                onChange={(value) => handleRatingChange('crowdLevelVsExpected', value)}
                label={ratingLabels.crowdLevelVsExpected}
                description={ratingDescriptions.crowdLevelVsExpected}
              />

              <ExpectedRating
                value={feedback.ratings.costVsExpected}
                onChange={(value) => handleRatingChange('costVsExpected', value)}
                label={ratingLabels.costVsExpected}
                description={ratingDescriptions.costVsExpected}
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Questions & Comments */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-medium text-gray-800">Final Questions</h3>

              {feedback.tripCompleted && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Would you return to {destinationName}?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFeedback(prev => ({ ...prev, wouldReturn: true }))}
                        className={`p-2 border rounded-md ${feedback.wouldReturn === true ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setFeedback(prev => ({ ...prev, wouldReturn: false }))}
                        className={`p-2 border rounded-md ${feedback.wouldReturn === false ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Would you recommend {destinationName} to other surfers?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                        className={`p-2 border rounded-md ${feedback.wouldRecommend === true ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                        className={`p-2 border rounded-md ${feedback.wouldRecommend === false ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Any additional comments?
                </label>
                <textarea
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Share any tips, warnings, or insights for future visitors..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                {feedback.tripCompleted ? (
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};