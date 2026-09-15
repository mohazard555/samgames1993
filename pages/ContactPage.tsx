import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playSuccessSound } from '../utils/soundEffects';

const ContactPage: React.FC = () => {
  const { settings, addContactMessage } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) {
      alert('الرجاء كتابة بريدك الإلكتروني والرسالة أولاً.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addContactMessage({
        name: name.trim() || 'صديق الموقع',
        email: email.trim(),
        subject: subject.trim() || 'استفسار عام',
        message: message.trim(),
      });
      playSuccessSound();
      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendViaEmailApp = () => {
    window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(
      subject || 'رسالة من تطبيق ألعاب الأطفال'
    )}&body=${encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\n\nالرسالة:\n${message}`)}`;
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSent(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center">
        <span className="text-6xl mb-2 inline-block animate-bounce">📬</span>
        <h1 className="text-3xl font-black mb-2">تواصل معنا</h1>
        <p className="text-sky-100 font-bold max-w-xl mx-auto text-sm sm:text-base">
          يسعدنا دائماً استقبال رسائلكم واستفساراتكم. أرسل لنا رسالة وسنقوم بالرد عليك في أقرب وقت.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact info sidebar */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-xl border-4 border-sky-200 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-sky-950 border-b pb-2">معلومات التواصل</h3>

            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-bold block">البريد الإلكتروني الرسمي:</span>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-sky-600 hover:text-sky-800 font-black text-sm break-all underline"
              >
                {settings.contactEmail}
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-bold block">فريق العمل:</span>
              <span className="font-bold text-gray-800 text-sm">ToysGame / M.K Studio</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-bold block">قناتنا على يوتيوب:</span>
              <a
                href={settings.subscriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200"
              >
                <span>📺 مشاهدة القناة</span>
              </a>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-xs text-sky-900 font-bold">
            🛡️ جميع الرسائل ترسل وتخزن مباشرة في مركز الرسائل في لوحة التحكم.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-sky-200">
          {isSent ? (
            <div className="text-center p-8 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 animate-fade-in space-y-4">
              <span className="text-6xl block">✉️</span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-800">تم إرسال رسالتك بنجاح!</h2>
              <p className="text-gray-700 font-bold text-sm sm:text-base">
                شكراً لتواصلك معنا. تم حفظ الرسالة وستصل إلى إدارة الموقع للمتابعة.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow transition-transform active:scale-95"
                >
                  إرسال رسالة أخرى ✍️
                </button>
                {settings.contactEmail && (
                  <button
                    onClick={handleSendViaEmailApp}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-xl shadow transition-transform active:scale-95"
                  >
                    فتح في تطبيق البريد 📧
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-black text-gray-700 mb-1">
                    الاسم الكامل
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-bold text-gray-800 text-sm"
                    placeholder="اسمك الكريم"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-black text-gray-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-bold text-gray-800 text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactSubject" className="block text-sm font-black text-gray-700 mb-1">
                  موضوع الرسالة
                </label>
                <input
                  id="contactSubject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-bold text-gray-800 text-sm"
                  placeholder="مثال: استفسار حول لعبة / تعاون"
                />
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-sm font-black text-gray-700 mb-1">
                  نص الرسالة *
                </label>
                <textarea
                  id="contactMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-bold text-gray-800 text-sm"
                  placeholder="اكتب رسالتك واستفسارك هنا بالتفصيل..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-lg py-3.5 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'جاري إرسال الرسالة...' : 'إرسال الرسالة الآن 🚀'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
