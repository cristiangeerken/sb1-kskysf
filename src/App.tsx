import React from 'react';
import { Leaf } from 'lucide-react';
import ChallengeSection from './components/ChallengeSection';
import StatsSection from './components/StatsSection';
import { ChallengeProvider } from './context/ChallengeContext';

function App() {
  const [activeTab, setActiveTab] = React.useState<'activities' | 'stats'>('activities');

  return (
    <ChallengeProvider>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <header className="py-6 px-4 bg-white/50 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800">EcoCompromiso</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'activities'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'bg-white/80 text-green-800 hover:bg-white'
              }`}
            >
              Actividades
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'stats'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'bg-white/80 text-green-800 hover:bg-white'
              }`}
            >
              Estadísticas
            </button>
          </div>

          {activeTab === 'activities' ? <ChallengeSection /> : <StatsSection />}
        </main>
      </div>
    </ChallengeProvider>
  );
}

export default App;