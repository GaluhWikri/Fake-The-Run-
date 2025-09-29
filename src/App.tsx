import React, { useState, useEffect } from 'react';
import { MapIcon, Settings, Info, Sun, Moon, Home } from 'lucide-react';
import HomePage from './components/pages/HomePage';
import CreateRoutePage from './components/pages/CreateRoutePage';

function App() {
  const [page, setPage] = useState('home'); // 'home' or 'create'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigateToCreate = () => setPage('create');
  const navigateToHome = () => setPage('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">RouteTracker</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rencanakan rute sempurna Anda</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleThemeSwitch} className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {page === 'create' && (
                <button onClick={navigateToHome} className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Home className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {page === 'home' && <HomePage onNavigateToCreate={navigateToCreate} />}
      {page === 'create' && <CreateRoutePage />}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p className="text-sm">
              Buat, rencanakan, dan ekspor rute Anda untuk Strava dan aplikasi kebugaran lainnya
            </p>
            <p className="text-xs mt-2">
              Kompatibel dengan format GPX • Siap diekspor untuk diunggah ke Strava
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


