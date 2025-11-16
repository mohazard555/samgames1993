import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const FeedbackPage: React.FC = () => {
  const { settings } = useSettings();
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
        alert('الرجاء كتابة رسالتك أولاً.');
        return;
    }
    window.location.href = `mailto:${settings.feedbackEmail}?subject=Feedback for ${settings.siteName}&body=${encodeURIComponent(message)}`;
    setIsSent(true);
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">شاركنا رأيك</h1>
      <p className="text-center text-gray-600 mb-6">نحن نقدر رأيك! استخدم النموذج أدناه لإرسال اقتراحاتك أو ملاحظاتك مباشرة إلى فريقنا.</p>
      
      {isSent ? (
        <div className="text-center p-8 bg-green-100 text-green-800 rounded-lg">
            <h2 className="text-2xl font-bold">شكراً لك!</h2>
            <p>تم فتح برنامج البريد الإلكتروني الخاص بك. يرجى إرسال الرسالة من هناك.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="feedbackMessage" className="block text-lg font-medium text-gray-700 mb-2">رسالتك</label>
                <textarea
                    id="feedbackMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    placeholder="اكتب رأيك هنا..."
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors"
            >
                إرسال الرأي عبر البريد الإلكتروني
            </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackPage;
