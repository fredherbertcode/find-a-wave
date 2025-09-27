import { SurfDestination } from '../types';

interface SeasonalConditions {
  waveHeight: string;
  consistency: string;
  crowd: string;
  waterTemp: number;
  conditions: string;
}

export class SeasonalSurfService {
  private static instance: SeasonalSurfService;

  static getInstance(): SeasonalSurfService {
    if (!SeasonalSurfService.instance) {
      SeasonalSurfService.instance = new SeasonalSurfService();
    }
    return SeasonalSurfService.instance;
  }

  getSeasonalConditions(destination: SurfDestination, month: number): SeasonalConditions {
    const isBestMonth = destination.bestMonths.includes(month);
    const isGoodMonth = this.isAdjacentMonth(destination.bestMonths, month);

    // Adjust conditions based on seasonality
    let waveHeight: string;
    let consistency: string;
    let crowd: string;
    let waterTemp: number;
    let conditions: string;

    if (isBestMonth) {
      // Peak season - best conditions
      waveHeight = this.getSeasonalWaveHeight(destination, month, 'peak');
      consistency = 'Excellent';
      crowd = Math.min(destination.crowdLevel + 2, 10) + '/10';
      waterTemp = this.getSeasonalWaterTemp(destination, month, 'peak');
      conditions = 'Prime conditions';
    } else if (isGoodMonth) {
      // Shoulder season - good conditions
      waveHeight = this.getSeasonalWaveHeight(destination, month, 'good');
      consistency = 'Good';
      crowd = Math.max(destination.crowdLevel - 1, 1) + '/10';
      waterTemp = this.getSeasonalWaterTemp(destination, month, 'good');
      conditions = 'Solid conditions';
    } else {
      // Off season - poor conditions
      waveHeight = this.getSeasonalWaveHeight(destination, month, 'poor');
      consistency = 'Inconsistent';
      crowd = Math.max(destination.crowdLevel - 3, 1) + '/10';
      waterTemp = this.getSeasonalWaterTemp(destination, month, 'poor');
      conditions = 'Variable conditions';
    }

    return {
      waveHeight,
      consistency,
      crowd,
      waterTemp,
      conditions
    };
  }

  private getSeasonalWaveHeight(destination: SurfDestination, month: number, season: 'peak' | 'good' | 'poor'): string {
    const baseHeight = this.getBaseWaveHeight(destination.waveSize);

    switch (season) {
      case 'peak':
        return `${baseHeight.min + 1}-${baseHeight.max + 2}ft`;
      case 'good':
        return `${baseHeight.min}-${baseHeight.max + 1}ft`;
      case 'poor':
        return `${Math.max(baseHeight.min - 1, 1)}-${baseHeight.max}ft`;
    }
  }

  private getSeasonalWaterTemp(destination: SurfDestination, month: number, season: 'peak' | 'good' | 'poor'): number {
    const baseTemp = destination.waterTemp;

    // Adjust for hemisphere and seasonality
    const isNorthernHemisphere = destination.coordinates.lat > 0;
    const summerMonths = isNorthernHemisphere ? [6, 7, 8] : [12, 1, 2];
    const winterMonths = isNorthernHemisphere ? [12, 1, 2] : [6, 7, 8];

    let tempAdjustment = 0;

    if (summerMonths.includes(month)) {
      tempAdjustment = 3; // Warmer in summer
    } else if (winterMonths.includes(month)) {
      tempAdjustment = -3; // Cooler in winter
    }

    // Further adjust based on season quality
    switch (season) {
      case 'peak':
        return baseTemp + tempAdjustment;
      case 'good':
        return baseTemp + Math.round(tempAdjustment * 0.7);
      case 'poor':
        return baseTemp + Math.round(tempAdjustment * 0.5);
    }
  }

  private getBaseWaveHeight(waveSize: string): { min: number; max: number } {
    switch (waveSize) {
      case 'small':
        return { min: 2, max: 4 };
      case 'medium':
        return { min: 4, max: 8 };
      case 'large':
        return { min: 8, max: 15 };
      default:
        return { min: 3, max: 6 };
    }
  }

  private isAdjacentMonth(bestMonths: number[], month: number): boolean {
    for (const bestMonth of bestMonths) {
      const prevMonth = bestMonth === 1 ? 12 : bestMonth - 1;
      const nextMonth = bestMonth === 12 ? 1 : bestMonth + 1;

      if (month === prevMonth || month === nextMonth) {
        return true;
      }
    }
    return false;
  }
}