import { SurfDestination, SurfPreferences, RecommendationExplanation, FactorScore, PreferenceWeights } from '../types';

class RecommendationService {
  private defaultWeights: PreferenceWeights = {
    waveQuality: 25,
    budget: 20,
    travelTime: 15,
    crowdLevel: 10,
    temperature: 10,
    skillMatch: 15,
    safetyFactors: 5
  };

  generateExplanation(
    destination: SurfDestination,
    preferences: SurfPreferences,
    customWeights?: PreferenceWeights
  ): RecommendationExplanation {
    const weights = customWeights || preferences.preferenceWeights || this.defaultWeights;

    const skillMatch = this.calculateSkillMatch(destination, preferences);
    const budgetFit = this.calculateBudgetFit(destination, preferences);
    const seasonalTiming = this.calculateSeasonalTiming(destination, preferences);
    const travelLogistics = this.calculateTravelLogistics(destination, preferences);
    const safetyFactors = this.calculateSafetyFactors(destination, preferences);
    const personalPreferences = this.calculatePersonalPreferences(destination, preferences);

    const factorBreakdown = {
      skillMatch,
      budgetFit,
      seasonalTiming,
      travelLogistics,
      safetyFactors,
      personalPreferences
    };

    const overallScore = this.calculateOverallScore(factorBreakdown, weights);
    const confidenceLevel = this.calculateConfidence(destination, factorBreakdown);

    return {
      overallScore,
      confidenceLevel,
      factorBreakdown,
      alternativeReasons: this.generateAlternativeReasons(destination, factorBreakdown),
      whyNotHigher: this.generateImprovementSuggestions(factorBreakdown)
    };
  }

  private calculateSkillMatch(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    const userSkill = preferences.surfingAbility;
    const destDifficulty = destination.difficultyLevel;

    let score: number;
    let explanation: string;
    let confidence = 90;

    if (userSkill === destDifficulty) {
      score = 100;
      explanation = `Perfect match for your ${this.getSkillLevelName(userSkill)} level`;
    } else if (Math.abs(userSkill - destDifficulty) === 1) {
      score = 75;
      explanation = userSkill > destDifficulty
        ? `Slightly easier than your skill level - great for building confidence`
        : `Slightly more challenging - good for progression`;
    } else if (userSkill < destDifficulty) {
      score = 30;
      explanation = `May be too challenging for ${this.getSkillLevelName(userSkill)} level`;
      confidence = 95;
    } else {
      score = 60;
      explanation = `Easier than your skill level but still enjoyable`;
    }

    // Adjust for safety considerations for beginners
    if (userSkill === 1 && destination.safetyInfo && destination.safetyInfo.overallSafetyRating >= 8) {
      score += 10;
      explanation += ` (bonus for excellent safety rating)`;
    }

    return {
      score: Math.min(100, score),
      weight: 15,
      explanation,
      confidence
    };
  }

  private calculateBudgetFit(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    const dailyCost = destination.cost;
    const userBudget = preferences.budget / preferences.tripDuration; // Daily budget

    let score: number;
    let explanation: string;

    if (dailyCost <= userBudget * 0.8) {
      score = 100;
      explanation = `Well within budget ($${dailyCost} vs $${userBudget.toFixed(0)} daily)`;
    } else if (dailyCost <= userBudget) {
      score = 80;
      explanation = `Fits your budget ($${dailyCost} daily)`;
    } else if (dailyCost <= userBudget * 1.2) {
      score = 60;
      explanation = `Slightly over budget ($${dailyCost} vs $${userBudget.toFixed(0)} daily)`;
    } else {
      score = 30;
      explanation = `Above your budget range ($${dailyCost} vs $${userBudget.toFixed(0)} daily)`;
    }

    return {
      score,
      weight: 20,
      explanation,
      confidence: 85
    };
  }

  private calculateSeasonalTiming(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    const travelMonth = preferences.travelMonth;
    const bestMonths = destination.bestMonths;

    let score: number;
    let explanation: string;
    let confidence = 90;

    if (bestMonths.includes(travelMonth)) {
      score = 100;
      explanation = `Excellent timing - ${this.getMonthName(travelMonth)} is peak season`;
    } else {
      // Check adjacent months
      const adjacentMonths = [
        travelMonth === 1 ? 12 : travelMonth - 1,
        travelMonth === 12 ? 1 : travelMonth + 1
      ];

      if (bestMonths.some(month => adjacentMonths.includes(month))) {
        score = 70;
        explanation = `Good timing - close to peak season`;
        confidence = 75;
      } else {
        score = 40;
        explanation = `Off-season timing - waves may be smaller/less consistent`;
        confidence = 60;
      }
    }

    return {
      score,
      weight: 25,
      explanation,
      confidence
    };
  }

  private calculateTravelLogistics(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    // This is simplified - in reality would use actual travel time API
    let score = 70; // Default assumption
    let explanation = `Travel logistics look manageable`;
    let confidence = 50;

    // Bonus for destinations with good tourist infrastructure
    if (destination.touristFriendliness && destination.touristFriendliness >= 8) {
      score += 15;
      explanation = `Excellent tourist infrastructure makes travel easy`;
      confidence = 80;
    }

    return {
      score: Math.min(100, score),
      weight: 15,
      explanation,
      confidence
    };
  }

  private calculateSafetyFactors(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    const safetyInfo = destination.safetyInfo;
    const userSkill = preferences.surfingAbility;

    if (!safetyInfo) {
      return {
        score: 50, // Default neutral score when no safety data
        weight: userSkill <= 2 ? 10 : 5,
        explanation: 'Limited safety information available',
        confidence: 30
      };
    }

    const safetyRating = safetyInfo.overallSafetyRating;
    let score = safetyRating * 10;
    let explanation = `Safety rating: ${safetyRating}/10`;

    // Extra importance for beginners
    if (userSkill <= 2 && safetyRating >= 8) {
      score += 10;
      explanation += ` (excellent for beginners)`;
    }

    if (safetyInfo.lifeguardPresence) {
      explanation += `, lifeguards present`;
    }

    return {
      score: Math.min(100, score),
      weight: userSkill <= 2 ? 10 : 5, // More important for beginners
      explanation,
      confidence: 95
    };
  }

  private calculatePersonalPreferences(destination: SurfDestination, preferences: SurfPreferences): FactorScore {
    let score = 70; // Base score
    let explanation = `Matches your general preferences`;

    // Temperature preference matching
    const tempPref = preferences.temperatureRange;
    const destTemp = destination.averageTemp;

    if ((tempPref === 1 && destTemp < 15) ||
        (tempPref === 2 && destTemp >= 15 && destTemp < 20) ||
        (tempPref === 3 && destTemp >= 20 && destTemp < 25) ||
        (tempPref === 4 && destTemp >= 25)) {
      score += 15;
      explanation = `Perfect temperature match for your preferences`;
    }

    // Crowd level consideration
    if (destination.crowdLevel <= 5) {
      score += 10;
      explanation += `, uncrowded spot`;
    }

    return {
      score: Math.min(100, score),
      weight: 10,
      explanation,
      confidence: 70
    };
  }

  private calculateOverallScore(factorBreakdown: any, weights: PreferenceWeights): number {
    const weightedSum =
      (factorBreakdown.skillMatch.score * weights.skillMatch) +
      (factorBreakdown.budgetFit.score * weights.budget) +
      (factorBreakdown.seasonalTiming.score * weights.waveQuality) +
      (factorBreakdown.travelLogistics.score * weights.travelTime) +
      (factorBreakdown.safetyFactors.score * weights.safetyFactors) +
      (factorBreakdown.personalPreferences.score * (weights.temperature + weights.crowdLevel));

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    return Math.round(weightedSum / totalWeight);
  }

  private calculateConfidence(destination: SurfDestination, factorBreakdown: any): number {
    const confidences = Object.values(factorBreakdown).map((factor: any) => factor.confidence);
    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;

    // Reduce confidence if we're missing key data
    let adjustedConfidence = avgConfidence;
    if (!destination.redditQuotes || destination.redditQuotes.length === 0) {
      adjustedConfidence -= 10;
    }
    if (!destination.forecast) {
      adjustedConfidence -= 5;
    }

    return Math.round(Math.max(0, adjustedConfidence));
  }

  private generateAlternativeReasons(destination: SurfDestination, factorBreakdown: any): string[] {
    const reasons: string[] = [];

    const factors = Object.entries(factorBreakdown).sort(([,a], [,b]) => (b as any).score - (a as any).score);

    // Add the top 2 performing factors
    reasons.push(`Strong ${factors[0][0].replace(/([A-Z])/g, ' $1').toLowerCase()}: ${(factors[0][1] as any).explanation}`);
    if (factors.length > 1) {
      reasons.push(`Good ${factors[1][0].replace(/([A-Z])/g, ' $1').toLowerCase()}: ${(factors[1][1] as any).explanation}`);
    }

    return reasons;
  }

  private generateImprovementSuggestions(factorBreakdown: any): string | undefined {
    const weakestFactor = Object.entries(factorBreakdown)
      .sort(([,a], [,b]) => (a as any).score - (b as any).score)[0];

    if ((weakestFactor[1] as any).score < 70) {
      return `Score limited by ${weakestFactor[0].replace(/([A-Z])/g, ' $1').toLowerCase()}: ${(weakestFactor[1] as any).explanation}`;
    }

    return undefined;
  }

  private getSkillLevelName(level: number): string {
    const levels = ['', 'beginner', 'intermediate', 'advanced', 'expert'];
    return levels[level] || 'unknown';
  }

  private getMonthName(month: number): string {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month] || 'unknown';
  }
}

export const recommendationService = new RecommendationService();