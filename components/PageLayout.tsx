import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MusicAutoplayBanner from './MusicAutoplayBanner';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50 text-gray-800 antialiased overflow-x-hidden">
      <Header />
      <main className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
        {children}
      </main>
      <MusicAutoplayBanner />
      <Footer />
    </div>
  );
};

export default PageLayout;
