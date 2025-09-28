import React, { useState, useEffect } from 'react';
import { PreferenceWeights } from '../types';
import { Sliders, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

interface PreferenceWeightControlsProps {
  weights: PreferenceWeights;
  onWeightsChange: (weights: PreferenceWeights) => void;
  onPreviewImpact?: (factor: keyof PreferenceWeights, newWeight: number) => void;
  className?: string;
}

const defaultWeights: PreferenceWeights = {
  waveQuality: 25,
  budget: 20,
  travelTime: 15,
  crowdLevel: 10,
  temperature: 10,
  skillMatch: 15,
  safetyFactors: 5
};

const factorDescriptions = {
  waveQuality: "How important wave quality and consistency is to you",
  budget: "How much budget constraints matter in your decision",
  travelTime: "How important travel time and logistics are",
  crowdLevel: "How much you want to avoid crowded surf spots",
  temperature: "How important air and water temperature are",
  skillMatch: "How important it is that waves match your skill level",
  safetyFactors: "How important safety features like lifeguards are"
};

const factorLabels = {
  waveQuality: "Wave Quality",
  budget: "Budget Fit",
  travelTime: "Travel Time",
  crowdLevel: "Crowd Avoidance",
  temperature: "Temperature",
  skillMatch: "Skill Match",
  safetyFactors: "Safety"
};

export const PreferenceWeightControls: React.FC<PreferenceWeightControlsProps> = ({
  weights,
  onWeightsChange,
  onPreviewImpact,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveringFactor, setHoveringFactor] = useState<keyof PreferenceWeights | null>(null);
  const [tempWeights, setTempWeights] = useState(weights);

  useEffect(() => {
    setTempWeights(weights);
  }, [weights]);

  const normalizeWeights = (newWeights: PreferenceWeights): PreferenceWeights => {
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    const factor = 100 / total;

    const normalized: PreferenceWeights = {
      waveQuality: Math.round(newWeights.waveQuality * factor),
      budget: Math.round(newWeights.budget * factor),
      travelTime: Math.round(newWeights.travelTime * factor),
      crowdLevel: Math.round(newWeights.crowdLevel * factor),
      temperature: Math.round(newWeights.temperature * factor),
      skillMatch: Math.round(newWeights.skillMatch * factor),
      safetyFactors: Math.round(newWeights.safetyFactors * factor)
    };

    return normalized;
  };

  const handleWeightChange = (factor: keyof PreferenceWeights, newValue: number) => {
    const updatedWeights = { ...tempWeights, [factor]: newValue };
    const normalized = normalizeWeights(updatedWeights);

    setTempWeights(normalized);
    onWeightsChange(normalized);

    if (onPreviewImpact) {
      onPreviewImpact(factor, newValue);
    }
  };

  const resetToDefaults = () => {
    setTempWeights(defaultWeights);
    onWeightsChange(defaultWeights);
  };

  const getWeightChangeIndicator = (factor: keyof PreferenceWeights) => {
    const current = tempWeights[factor];
    const original = defaultWeights[factor];

    if (current > original + 2) {
      return <TrendingUp className="w-3 h-3 text-green-600" />;
    } else if (current < original - 2) {
      return <TrendingDown className="w-3 h-3 text-red-600" />;
    }
    return null;
  };

  return (
    <div className={`preference-weight-controls bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">Fine-tune Your Preferences</span>
          </div>
          <span className="text-sm text-gray-500">
            {isExpanded ? 'Hide' : 'Customize what matters most'}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Adjust how much each factor influences your recommendations
              </p>
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(factorLabels).map(([factorKey, label]) => {
                const factor = factorKey as keyof PreferenceWeights;
                const value = tempWeights[factor];

                return (
                  <div
                    key={factor}
                    className="factor-control"
                    onMouseEnter={() => setHoveringFactor(factor)}
                    onMouseLeave={() => setHoveringFactor(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        {getWeightChangeIndicator(factor)}
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {value}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={value}
                      onChange={(e) => handleWeightChange(factor, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />

                    {hoveringFactor === factor && (
                      <p className="text-xs text-gray-500 mt-1">
                        {factorDescriptions[factor]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Live Updates</p>
                  <p className="text-xs text-blue-700">
                    Rankings update automatically as you adjust these settings.
                    Your preferences are saved for future searches.
                  </p>
                </div>
              </div>
            </div>

            {/* Weight distribution visualization */}
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Weight Distribution</p>
              <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                {Object.entries(tempWeights).map(([factorKey, weight], index) => {
                  const colors = [
                    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
                    'bg-red-500', 'bg-indigo-500', 'bg-pink-500'
                  ];

                  return (
                    <div
                      key={factorKey}
                      className={`${colors[index]} transition-all duration-300`}
                      style={{ width: `${weight}%` }}
                      title={`${factorLabels[factorKey as keyof PreferenceWeights]}: ${weight}%`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};