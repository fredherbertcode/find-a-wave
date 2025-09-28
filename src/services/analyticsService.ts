import { UserInteraction, UserFeedback, SurfPreferences } from '../types';

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private interactions: UserInteraction[] = [];
  private startTime: Date;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.userId = this.getUserId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getUserId(): string | undefined {
    // Check for existing user ID in localStorage
    const stored = localStorage.getItem('findAWaveUserId');
    if (stored) return stored;

    // Generate new anonymous user ID
    const newUserId = 'anon_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    localStorage.setItem('findAWaveUserId', newUserId);
    return newUserId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  private initializeSession(): void {
    // Track session start
    this.trackEvent('session_start', {
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date()
    });
  }

  trackDestinationView(destinationId: string, searchContext: SurfPreferences, durationMs?: number): void {
    const interaction: UserInteraction = {
      userId: this.userId,
      sessionId: this.sessionId,
      destinationId,
      action: 'viewed',
      timestamp: new Date(),
      durationViewed: durationMs,
      searchContext,
      deviceType: this.getDeviceType()
    };

    this.interactions.push(interaction);
    this.sendToBackend(interaction);
  }

  trackDestinationSave(destinationId: string, searchContext: SurfPreferences): void {
    const interaction: UserInteraction = {
      userId: this.userId,
      sessionId: this.sessionId,
      destinationId,
      action: 'saved',
      timestamp: new Date(),
      searchContext,
      deviceType: this.getDeviceType()
    };

    this.interactions.push(interaction);
    this.sendToBackend(interaction);
  }

  trackBookingClick(destinationId: string, bookingType: string, provider: string, searchContext: SurfPreferences): void {
    const interaction: UserInteraction = {
      userId: this.userId,
      sessionId: this.sessionId,
      destinationId,
      action: 'clicked-booking',
      timestamp: new Date(),
      searchContext,
      deviceType: this.getDeviceType()
    };

    this.interactions.push(interaction);
    this.sendToBackend({
      ...interaction,
      metadata: { bookingType, provider }
    });
  }

  trackFilterUsage(filterType: string, filterValue: any, searchContext: SurfPreferences): void {
    const interaction: UserInteraction = {
      userId: this.userId,
      sessionId: this.sessionId,
      destinationId: 'filter_usage',
      action: 'applied-filters',
      timestamp: new Date(),
      searchContext,
      deviceType: this.getDeviceType()
    };

    this.interactions.push(interaction);
    this.sendToBackend({
      ...interaction,
      metadata: { filterType, filterValue }
    });
  }

  trackShareAction(destinationId: string, shareMethod: string, searchContext: SurfPreferences): void {
    const interaction: UserInteraction = {
      userId: this.userId,
      sessionId: this.sessionId,
      destinationId,
      action: 'shared',
      timestamp: new Date(),
      searchContext,
      deviceType: this.getDeviceType()
    };

    this.interactions.push(interaction);
    this.sendToBackend({
      ...interaction,
      metadata: { shareMethod }
    });
  }

  private trackEvent(eventName: string, data: any): void {
    // Store in localStorage for now, will send to backend when implemented
    const events = JSON.parse(localStorage.getItem('findAWaveAnalytics') || '[]');
    events.push({
      event: eventName,
      data,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('findAWaveAnalytics', JSON.stringify(events));
  }

  private sendToBackend(data: any): void {
    // For now, store in localStorage
    // In production, this would send to your analytics backend
    const stored = JSON.parse(localStorage.getItem('findAWaveInteractions') || '[]');
    stored.push({
      ...data,
      timestamp: data.timestamp.toISOString()
    });
    localStorage.setItem('findAWaveInteractions', JSON.stringify(stored));

    // Future: Send to actual backend
    // fetch('/api/analytics/interaction', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  }

  submitFeedback(feedback: Omit<UserFeedback, 'userId' | 'sessionId' | 'submittedAt'>): void {
    const fullFeedback: UserFeedback = {
      ...feedback,
      userId: this.userId,
      sessionId: this.sessionId,
      submittedAt: new Date()
    };

    // Store locally for now
    const feedbacks = JSON.parse(localStorage.getItem('findAWaveFeedback') || '[]');
    feedbacks.push({
      ...fullFeedback,
      submittedAt: fullFeedback.submittedAt.toISOString()
    });
    localStorage.setItem('findAWaveFeedback', JSON.stringify(feedbacks));

    // Future: Send to backend
    // fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(fullFeedback)
    // });
  }

  getSessionStats(): any {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      interactionCount: this.interactions.length,
      sessionDuration: Date.now() - this.startTime.getTime(),
      deviceType: this.getDeviceType()
    };
  }

  // Machine Learning Data Preparation
  getMLTrainingData(): any {
    const stored = JSON.parse(localStorage.getItem('findAWaveInteractions') || '[]');
    const feedback = JSON.parse(localStorage.getItem('findAWaveFeedback') || '[]');

    return {
      interactions: stored,
      feedback: feedback,
      sessionStats: this.getSessionStats()
    };
  }
}

export const analyticsService = new AnalyticsService();