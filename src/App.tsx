import React, { useState } from 'react';
import { SurfPreferences, SurfDestination } from './types';
import { SurfPreferencesForm } from './components/SurfPreferencesForm';
import { DestinationGrid } from './components/DestinationGrid';
import { AboutPage } from './components/AboutPage';
import { surfDestinations } from './data/surfDestinations';
import { filterAndRankDestinations } from './utils/filterDestinations';
import { Waves, ArrowLeft, Info } from 'lucide-react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'results' | 'about'>('form');
  const [filteredDestinations, setFilteredDestinations] = useState<SurfDestination[]>([]);
  const [currentPreferences, setCurrentPreferences] = useState<SurfPreferences | null>(null);

  const handleFormSubmit = async (preferences: SurfPreferences) => {
    try {
      const ranked = await filterAndRankDestinations(surfDestinations, preferences);
      setFilteredDestinations(ranked);
      setCurrentPreferences(preferences);
      setCurrentView('results');
    } catch (error) {
      console.error('Error filtering destinations:', error);
      // Fallback to show all destinations if filtering fails
      setFilteredDestinations(surfDestinations);
      setCurrentPreferences(preferences);
      setCurrentView('results');
    }
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setFilteredDestinations([]);
  };

  const handleShowAbout = () => {
    setCurrentView('about');
  };

  const handleBackFromAbout = () => {
    setCurrentView('form');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Waves className="logo-icon" />
            <h1>Find A Wave</h1>
          </div>
          <div className="header-actions">
            {currentView === 'results' && (
              <button className="back-btn" onClick={handleBackToForm}>
                <ArrowLeft className="back-icon" />
                New Search
              </button>
            )}
            {currentView === 'form' && (
              <button className="about-btn" onClick={handleShowAbout}>
                <Info className="about-icon" />
                About
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentView === 'form' && (
          <div className="form-container">
            <SurfPreferencesForm onSubmit={handleFormSubmit} />
          </div>
        )}
        {currentView === 'results' && currentPreferences && (
          <div className="results-container">
            <DestinationGrid
              destinations={filteredDestinations}
              travelMonth={currentPreferences.travelMonth}
              tripDuration={currentPreferences.tripDuration}
            />
          </div>
        )}
        {currentView === 'about' && (
          <AboutPage onBack={handleBackFromAbout} />
        )}
      </main>

      <footer className="app-footer">
        <p>Find your perfect wave • Discover amazing surf destinations worldwide</p>
        <p className="footer-credit">
          Website by <a href="https://fredherbert.co.uk" target="_blank" rel="noopener noreferrer">Fred Herbert</a>
        </p>
      </footer>
    </div>
  );
}

export default App;