import React from 'react';
import { ArrowRight, PencilLine, FileCog, Download } from 'lucide-react';

// 1. Terima 'theme' di dalam interface props
interface HomePageProps {
  onNavigateToCreate: () => void;
  theme: 'dark' | 'light';
}

// 2. Terima 'theme' sebagai parameter
const HomePage: React.FC<HomePageProps> = ({ onNavigateToCreate, theme }) => {
  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-dark dark:text-white mb-6">
              Create Fake Running Routes
            </h1>
            <p className="text-lg text-brand-secondary dark:text-gray-300 mb-10 max-w-lg mx-auto md:mx-0">
              Fake The Run lets you draw custom, realistic running routes. Run anywhere, anytime, in any shape. Generate GPX files in one click.
            </p>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-white font-semibold rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
            >
              Create Your Route <ArrowRight className="w-5 h-5 ml-3" />
            </button>
          </div>

          {/* Right Graphic */}
          <div className="hidden md:flex justify-center items-center">
            <div className="w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center p-8">
              {/* 3. Perbaiki cara logo ditampilkan di sini */}
              <img 
                src={theme === 'dark' ? '/lgooo.png' : '/lgoood.png'} 
                alt="Fake The Run Graphic" 
                className="w-64 h-64" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-brand-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-brand-secondary dark:text-gray-300 max-w-3xl mx-auto">
              Create custom running routes in just three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group p-8 bg-brand-light dark:bg-brand-dark rounded-xl shadow-lg text-center transition-transform transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-secondary text-white mx-auto mb-6">
                <PencilLine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark dark:text-white mb-2">1. Design Your Route</h3>
              <p className="text-brand-secondary dark:text-gray-300">
                Choose a location and draw your route in any shape you want - letters, animals, or custom designs.
              </p>
            </div>
            {/* Step 2 */}
            <div className="group p-8 bg-brand-light dark:bg-brand-dark rounded-xl shadow-lg text-center transition-transform transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-secondary text-white mx-auto mb-6">
                <FileCog className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark dark:text-white mb-2">2. Generate GPX File</h3>
              <p className="text-brand-secondary dark:text-gray-300">
                Our system creates a realistic GPX file with proper elevation data and route details.
              </p>
            </div>
            {/* Step 3 */}
            <div className="group p-8 bg-brand-light dark:bg-brand-dark rounded-xl shadow-lg text-center transition-transform transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-secondary text-white mx-auto mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark dark:text-white mb-2">3. Download File</h3>
              <p className="text-brand-secondary dark:text-gray-300">
                In just one click, download your GPX file using your tokens.
              </p>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Mulai dari Rp 10.000 per unduhan file.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-light dark:bg-brand-dark border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-brand-secondary dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Fake The Run. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;