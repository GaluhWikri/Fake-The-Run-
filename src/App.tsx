import React, { useState, useEffect } from 'react';
// Pastikan semua ikon yang diperlukan sudah diimpor
import { Sun, Moon, Home } from 'lucide-react'; 
import HomePage from './components/pages/HomePage';
import CreateRoutePage from './components/pages/CreateRoutePage';

function App() {
  const [page, setPage] = useState('home'); // 'home' or 'create'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigateToCreate = () => setPage('create');
  const navigateToHome = () => setPage('home');

  const scrollToHowItWorks = () => {
    if (page !== 'home') {
      navigateToHome();
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <header className="bg-brand-light/80 dark:bg-brand-dark/80 backdrop-blur-sm border-b border-black/10 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={navigateToHome}
            >
              {/* PERUBAHAN DI SINI: Logo berubah berdasarkan tema */}
              <img 
                src={theme === 'dark' ? '/lgooo.png' : '/lgoood.png'} 
                alt="Fake The Run Logo" 
                className="h-10 w-10" 
              />
              <div>
                <h1 className="text-xl font-bold text-brand-dark dark:text-brand-light">Fake The Run</h1>
                <p className="text-sm text-brand-secondary dark:text-gray-300">Plan your route</p>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="flex items-center gap-4">
              {page === 'home' && (
                <button
                  onClick={scrollToHowItWorks}
                  className="hidden sm:block text-sm font-medium text-brand-dark dark:text-brand-light hover:text-brand-secondary dark:hover:text-brand-secondary transition-colors"
                >
                  How It Works
                </button>
              )}
               {page === 'create' && (
                <button onClick={navigateToHome} className="p-2 rounded-md text-brand-secondary dark:text-brand-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <Home className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleThemeSwitch}
                className="p-2 rounded-full text-brand-secondary dark:text-brand-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={navigateToCreate}
                className="px-5 py-2.5 bg-brand-secondary text-white text-sm font-semibold rounded-full shadow-lg hover:opacity-90 transition-opacity"
              >
                Create Route
              </button>
            </div>
          </div>
        </div>
      </header>

      {page === 'home' && <HomePage onNavigateToCreate={navigateToCreate} />}
      {page === 'create' && <CreateRoutePage />}
    </div>
  );
}

export default App;