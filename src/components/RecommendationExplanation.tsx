import React, { useState } from 'react';
import { RecommendationExplanation as IRecommendationExplanation } from '../types';
import { Info, ChevronDown, ChevronUp, TrendingUp, AlertCircle } from 'lucide-react';

interface RecommendationExplanationProps {
  explanation: IRecommendationExplanation;
  destinationName: string;
}

export const RecommendationExplanation: React.FC<RecommendationExplanationProps> = ({
  explanation,
  destinationName
}) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatFactorName = (factorKey: string) => {
    return factorKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="recommendation-explanation">
      {/* Simple View */}
      <div className="simple-explanation">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className={`text-lg font-bold ${getScoreColor(explanation.overallScore)}`}>
              {explanation.overallScore}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {explanation.confidenceLevel}% confidence
              </span>
            </div>
            <button
              onClick={() => setShowDetailed(!showDetailed)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showDetailed ? (
                <>Less detail <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>More detail <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        {/* Top reasons */}
        <div className="simple-reasons">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Why {destinationName}:</strong>
          </p>
          <ul className="space-y-1">
            {explanation.alternativeReasons.slice(0, 2).map((reason, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {reason}
              </li>
            ))}
          </ul>

          {explanation.whyNotHigher && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">{explanation.whyNotHigher}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed View */}
      {showDetailed && (
        <div className="detailed-explanation mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Detailed Breakdown</h4>

          <div className="factor-breakdown space-y-3">
            {Object.entries(explanation.factorBreakdown).map(([factorKey, factor]) => (
              <div key={factorKey} className="factor-item">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {formatFactorName(factorKey)}
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(factor.score)}`}>
                    {factor.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      factor.score >= 80 ? 'bg-green-500' :
                      factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{factor.explanation}</p>
                  <span className="text-xs text-gray-400">
                    {factor.confidence}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Confidence explanation */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Confidence Level</span>
            </div>
            <p className="text-xs text-gray-600">
              Our {explanation.confidenceLevel}% confidence is based on data quality, community feedback,
              and seasonal reliability. Higher confidence means we have more verified information about this destination.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};