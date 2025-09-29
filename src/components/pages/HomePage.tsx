import React from 'react';
import { Map, Zap, Download, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigateToCreate: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToCreate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-12 md:pt-32 md:pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white mb-4">
              Rencanakan Lari atau Perjalanan Sempurna Anda
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Buat rute khusus secara visual, hitung kecepatan Anda, dan ekspor file GPX untuk aplikasi kebugaran favorit Anda seperti Strava.
            </p>
            <button
              onClick={onNavigateToCreate}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Mulai Membuat Rute Anda <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">
              Fitur Canggih, Antarmuka Sederhana
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mx-auto mb-4">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Gambar Peta Interaktif</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Gambar rute Anda langsung di peta, dengan opsi untuk mengikuti jalan demi akurasi.
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mx-auto mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Perhitungan Kecepatan & Waktu</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Atur kecepatan yang Anda inginkan atau target waktu, dan biarkan aplikasi menghitung sisanya untuk Anda.
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mx-auto mb-4">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Ekspor File GPX</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Ekspor rute yang telah Anda buat dengan mudah sebagai file GPX, siap untuk diunggah ke Strava, Garmin, dan lainnya.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
