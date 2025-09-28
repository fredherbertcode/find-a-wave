import React, { useState, useEffect } from 'react';
import { PreferenceWeights } from '../types';
import { Sliders, RotateCcw, TrendingUp, TrendingDown, Waves, DollarSign, Clock, Users, Thermometer, Target, Shield, Info, ChevronDown, ChevronUp } from 'lucide-react';

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

const factorConfig = {
  waveQuality: {
    label: "Wave Quality",
    icon: Waves,
    description: "How important wave quality and consistency is to you",
    color: "blue",
    example: "Prioritize consistent, high-quality waves over other factors"
  },
  budget: {
    label: "Budget Fit",
    icon: DollarSign,
    description: "How much budget constraints matter in your decision",
    color: "green",
    example: "Stay within budget vs. splurge for better spots"
  },
  travelTime: {
    label: "Travel Ease",
    icon: Clock,
    description: "How important travel time and logistics are",
    color: "orange",
    example: "Prefer nearby spots vs. long journeys for perfect waves"
  },
  crowdLevel: {
    label: "Avoid Crowds",
    icon: Users,
    description: "How much you want to avoid crowded surf spots",
    color: "purple",
    example: "Seek uncrowded spots even if waves aren't perfect"
  },
  temperature: {
    label: "Climate",
    icon: Thermometer,
    description: "How important air and water temperature are",
    color: "red",
    example: "Warm weather and water vs. cold but epic surf"
  },
  skillMatch: {
    label: "Skill Match",
    icon: Target,
    description: "How important it is that waves match your skill level",
    color: "indigo",
    example: "Perfect for your level vs. challenging progression"
  },
  safetyFactors: {
    label: "Safety",
    icon: Shield,
    description: "How important safety features like lifeguards are",
    color: "emerald",
    example: "Prioritize safe spots with lifeguards and facilities"
  }
};

export const PreferenceWeightControls: React.FC<PreferenceWeightControlsProps> = ({
  weights,
  onWeightsChange,
  onPreviewImpact,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
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
    setActivePreset(null); // Clear preset when manually adjusting

    if (onPreviewImpact) {
      onPreviewImpact(factor, newValue);
    }
  };

  const resetToDefaults = () => {
    setTempWeights(defaultWeights);
    onWeightsChange(defaultWeights);
    setActivePreset('balanced');
  };

  const presets = {
    'wave-hunter': {
      name: '🏄‍♂️ Wave Hunter',
      description: 'Perfect waves above all else',
      weights: { waveQuality: 40, budget: 10, travelTime: 10, crowdLevel: 15, temperature: 10, skillMatch: 10, safetyFactors: 5 }
    },
    'budget-conscious': {
      name: '💰 Budget Explorer',
      description: 'Great value without breaking the bank',
      weights: { waveQuality: 20, budget: 35, travelTime: 20, crowdLevel: 10, temperature: 5, skillMatch: 5, safetyFactors: 5 }
    },
    'beginner-safe': {
      name: '🛡️ Beginner Safe',
      description: 'Safety and skill-appropriate spots',
      weights: { waveQuality: 15, budget: 15, travelTime: 15, crowdLevel: 5, temperature: 15, skillMatch: 25, safetyFactors: 10 }
    },
    'crowd-avoider': {
      name: '🏝️ Solitude Seeker',
      description: 'Uncrowded spots for peaceful sessions',
      weights: { waveQuality: 25, budget: 15, travelTime: 10, crowdLevel: 35, temperature: 5, skillMatch: 5, safetyFactors: 5 }
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = presets[presetKey as keyof typeof presets];
    setTempWeights(preset.weights);
    onWeightsChange(preset.weights);
    setActivePreset(presetKey);
  };

  const getColorClass = (color: string, intensity: 'bg' | 'text' | 'border') => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' }
    };
    return colorMap[color as keyof typeof colorMap]?.[intensity] || 'bg-gray-500';
  };

  return (
    <div className={`preference-weight-controls bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Sliders className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-lg">Fine-tune Your Preferences</span>
              <p className="text-sm text-gray-500 mt-0.5">Customize what matters most to you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600 font-medium">
              {isExpanded ? 'Hide controls' : 'Customize'}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {/* Quick Presets */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">Quick Presets</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      activePreset === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900 mb-1">{preset.name}</div>
                    <div className="text-xs text-gray-600">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Controls */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-800">Custom Adjustments</span>
                </div>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Default
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {Object.entries(factorConfig).map(([factorKey, config]) => {
                  const factor = factorKey as keyof PreferenceWeights;
                  const value = tempWeights[factor];
                  const IconComponent = config.icon;

                  return (
                    <div key={factor} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${getColorClass(config.color, 'text')} bg-opacity-10`}
                               style={{ backgroundColor: `var(--${config.color}-50, #f0f9ff)` }}>
                            <IconComponent className={`w-4 h-4 ${getColorClass(config.color, 'text')}`} />
                          </div>
                          <span className="font-medium text-gray-800">{config.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getColorClass(config.color, 'text')}`}>
                            {value}%
                          </span>
                          {value > defaultWeights[factor] + 3 && <TrendingUp className="w-3 h-3 text-green-500" />}
                          {value < defaultWeights[factor] - 3 && <TrendingDown className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>

                      <div className="relative mb-2">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={value}
                          onChange={(e) => handleWeightChange(factor, parseInt(e.target.value))}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer preference-slider"
                          style={{
                            background: `linear-gradient(to right, var(--${config.color}-500, #3b82f6) 0%, var(--${config.color}-500, #3b82f6) ${value * 2}%, #e5e7eb ${value * 2}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>

                      <div className="group-hover:opacity-100 opacity-70 transition-opacity">
                        <p className="text-xs text-gray-600 mb-1">{config.description}</p>
                        <p className="text-xs text-gray-500 italic">{config.example}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Your Priority Mix</span>
              </div>

              <div className="flex h-4 bg-white bg-opacity-50 rounded-full overflow-hidden mb-2">
                {Object.entries(tempWeights).map(([factorKey, weight]) => {
                  const config = factorConfig[factorKey as keyof PreferenceWeights];
                  return (
                    <div
                      key={factorKey}
                      className={`transition-all duration-500 ${getColorClass(config.color, 'bg')}`}
                      style={{ width: `${weight}%` }}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {Object.entries(tempWeights).map(([factorKey, weight]) => {
                  const config = factorConfig[factorKey as keyof PreferenceWeights];
                  return (
                    <div key={factorKey} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getColorClass(config.color, 'bg')}`} />
                      <span className="text-gray-700 truncate">{config.label}: {weight}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm text-blue-800 font-medium">✨ Live Updates Active</p>
                <p className="text-xs text-blue-700">
                  Rankings update instantly as you adjust. Your preferences are automatically saved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};