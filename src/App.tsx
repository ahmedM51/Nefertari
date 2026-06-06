import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ExploreEgypt } from './pages/ExploreEgypt';
import { MonumentDetails } from './pages/MonumentDetails';
import { Tours } from './pages/Tours';
import { TourDetails } from './pages/TourDetails';
import { HeritageStore } from './pages/HeritageStore';
import { CartPage } from './pages/CartPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [view, setView] = useState<string>('home');
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('m1');
  const [selectedTourId, setSelectedTourId] = useState<string>('t1');

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return (
          <Home 
            onSetView={setView} 
            onSelectMonumentId={setSelectedMonumentId} 
          />
        );
      case 'explore':
        return (
          <ExploreEgypt 
            onSelectMonumentId={setSelectedMonumentId} 
            onSetView={setView} 
          />
        );
      case 'monument_details':
        return (
          <MonumentDetails 
            monumentId={selectedMonumentId} 
            onBack={() => setView('explore')} 
            onSetView={setView} 
            onSelectTourId={setSelectedTourId} 
          />
        );
      case 'tours':
        return (
          <Tours 
            onSelectTourId={setSelectedTourId} 
            onSetView={setView} 
          />
        );
      case 'tour_details':
        return (
          <TourDetails 
            tourId={selectedTourId} 
            onBack={() => setView('tours')} 
            onSetView={setView} 
          />
        );
      case 'store':
        return (
          <HeritageStore 
            onSetView={setView} 
          />
        );
      case 'cart':
        return (
          <CartPage 
            onSetView={setView} 
          />
        );
      case 'user_dashboard':
        return (
          <UserDashboard />
        );
      case 'admin_dashboard':
        return (
          <AdminDashboard />
        );
      default:
        return (
          <Home 
            onSetView={setView} 
            onSelectMonumentId={setSelectedMonumentId} 
          />
        );
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#e5e7eb] select-text">
            
            {/* Shared Navigation Header */}
            <Header currentView={view} onSetView={setView} />

            {/* Primary View Area */}
            <main className="flex-grow">
              {renderActiveView()}
            </main>

            {/* Shared Branding Footer */}
            <Footer onSetView={setView} />

          </div>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
