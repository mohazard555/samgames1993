
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">اتصل بنا</h1>
      <div className="text-gray-700 space-y-4 text-center">
        <p>إذا كان لديك أي أسئلة أو اقتراحات، لا تتردد في التواصل معنا.</p>
        <p>
          <strong>البريد الإلكتروني:</strong>
          <a href={`mailto:${settings.contactEmail}`} className="text-sky-600 hover:underline mr-2">{settings.contactEmail}</a>
        </p>
        <p>
          <strong>المطور:</strong> M.K Studio
        </p>
      </div>
    </div>
  );
};

export default ContactPage;