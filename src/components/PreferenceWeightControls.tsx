import React, { useState, useEffect } from 'react';
import { PreferenceWeights } from '../types';
import { Sliders, RotateCcw, TrendingUp, TrendingDown, Waves, DollarSign, Clock, Users, Thermometer, Target, Shield, Info, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
      blue: { bg: 'bg-blue-400', text: 'text-blue-300', border: 'border-blue-300' },
      green: { bg: 'bg-green-400', text: 'text-green-300', border: 'border-green-300' },
      orange: { bg: 'bg-orange-400', text: 'text-orange-300', border: 'border-orange-300' },
      purple: { bg: 'bg-purple-400', text: 'text-purple-300', border: 'border-purple-300' },
      red: { bg: 'bg-red-400', text: 'text-red-300', border: 'border-red-300' },
      indigo: { bg: 'bg-indigo-400', text: 'text-indigo-300', border: 'border-indigo-300' },
      emerald: { bg: 'bg-emerald-400', text: 'text-emerald-300', border: 'border-emerald-300' }
    };
    return colorMap[color as keyof typeof colorMap]?.[intensity] || 'bg-gray-400';
  };

  return (
    <>
      {/* Toggle Button - Fixed positioned on left side */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-gradient-to-b from-purple-600 to-purple-700 text-white p-3 rounded-r-lg shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      )}

      {/* Sidebar Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />

          {/* Sidebar */}
          <div className={`relative w-96 max-w-[90vw] h-full bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-800 text-white shadow-2xl transform transition-transform duration-300 preference-sidebar-mobile ${
            isExpanded ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Header */}
            <div className="p-6 border-b border-purple-500 border-opacity-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                    <Sliders className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white">Fine-tune Preferences</h2>
                    <p className="text-purple-200 text-sm">Customize your perfect match</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-120px)] space-y-6">
              {/* Quick Presets */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-purple-200" />
                  <span className="font-semibold text-white text-lg">Quick Presets</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(presets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`p-4 rounded-xl border-2 transition-all text-left backdrop-blur-sm ${
                        activePreset === key
                          ? 'border-white bg-white bg-opacity-20 shadow-lg'
                          : 'border-purple-400 border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20 hover:border-opacity-50'
                      }`}
                    >
                      <div className="font-semibold text-white mb-1">{preset.name}</div>
                      <div className="text-sm text-purple-200">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Controls */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-200" />
                    <span className="font-semibold text-white text-lg">Custom Adjustments</span>
                  </div>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center gap-1 text-sm text-purple-200 hover:text-white transition-colors bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1 rounded-lg backdrop-blur-sm"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  {Object.entries(factorConfig).map(([factorKey, config]) => {
                    const factor = factorKey as keyof PreferenceWeights;
                    const value = tempWeights[factor];
                    const IconComponent = config.icon;

                    return (
                      <div key={factor} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white">{config.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">
                              {value}%
                            </span>
                            {value > defaultWeights[factor] + 3 && <TrendingUp className="w-4 h-4 text-green-300" />}
                            {value < defaultWeights[factor] - 3 && <TrendingDown className="w-4 h-4 text-red-300" />}
                          </div>
                        </div>

                        <div className="relative mb-3">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={value}
                            onChange={(e) => handleWeightChange(factor, parseInt(e.target.value))}
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer preference-slider-sidebar"
                            style={{
                              background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${value * 2}%, rgba(255,255,255,0.2) ${value * 2}%, rgba(255,255,255,0.2) 100%)`
                            }}
                          />
                        </div>

                        <div>
                          <p className="text-sm text-purple-100 mb-1">{config.description}</p>
                          <p className="text-xs text-purple-200 italic">{config.example}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Visualization */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white text-lg">Your Priority Mix</span>
                </div>

                <div className="flex h-4 bg-white bg-opacity-20 rounded-full overflow-hidden mb-3">
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

                <div className="grid grid-cols-1 gap-2 text-sm">
                  {Object.entries(tempWeights).map(([factorKey, weight]) => {
                    const config = factorConfig[factorKey as keyof PreferenceWeights];
                    return (
                      <div key={factorKey} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getColorClass(config.color, 'bg')}`} />
                          <span className="text-white">{config.label}</span>
                        </div>
                        <span className="text-purple-200 font-semibold">{weight}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                  <p className="text-white font-semibold mb-1">✨ Live Updates Active</p>
                  <p className="text-sm text-purple-200">
                    Rankings update instantly as you adjust. Your preferences are automatically saved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};