import React from 'react';
import Home from '@/pages/Home';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';

// Note: The full multi-page application is wired in src/App.tsx using react-router.
// This AppLayout serves as a fallback single-page composition showing the home experience.
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        <Home />
      </main>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export default AppLayout;
