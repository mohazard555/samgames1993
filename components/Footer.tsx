
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm mt-12 py-6 px-4">
      <div className="container mx-auto text-center text-gray-500">
        <div className="flex justify-center gap-4 mb-4">
            <Link to="/privacy" className="hover:text-sky-600 transition-colors">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-sky-600 transition-colors">الشروط والأحكام</Link>
            <Link to="/contact" className="hover:text-sky-600 transition-colors">اتصل بنا</Link>
        </div>
        <p>Developer: M.K Studio — 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
