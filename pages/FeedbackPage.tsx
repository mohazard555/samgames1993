import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playSuccessSound } from '../utils/soundEffects';
import { FeedbackItem } from '../types';
import { buildWhatsAppNotificationUrl, formatFeedbackWhatsAppMessage } from '../utils/whatsappNotification';

const FeedbackPage: React.FC = () => {
  const { settings, addFeedback } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('اقتراح لعبة جديدة');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackItem | null>(null);

  const categories = [
    'اقتراح لعبة جديدة 🎮',
    'رأي عام وتقييم 🌟',
    'تحسين في التصميم والموقع 🎨',
    'مشكلة أو خطأ واجهني ⚠️',
    'رسالة شكر وتشجيع ❤️',
  ];

  const ratingLabels: Record<number, string> = {
    1: 'يحتاج تحسين 🙁',
    2: 'مقبول 😐',
    3: 'جيد 🙂',
    4: 'رائع جداً 😄',
    5: 'ممتاز وممتع للأطفال! 🥳✨',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('الرجاء كتابة رأيك أو ملاحظتك أولاً.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addFeedback({
        name: name.trim() || 'صديق مجهول',
        email: email.trim(),
        rating,
        category,
        message: message.trim(),
      });
      setSubmittedFeedback(created);
      playSuccessSound();
      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmailCopy = () => {
    window.location.href = `mailto:${settings.feedbackEmail}?subject=${encodeURIComponent(
      `رأي جديد من ${name || 'زائر'}: ${category}`
    )}&body=${encodeURIComponent(
      `الاسم: ${name}\nالبريد: ${email}\nالتقييم: ${rating}/5\nالتصنيف: ${category}\n\nالرسالة:\n${message}`
    )}`;
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setRating(5);
    setMessage('');
    setSubmittedFeedback(null);
    setIsSent(false);
  };

  const whatsappUrl = submittedFeedback
    ? buildWhatsAppNotificationUrl(
        settings.whatsappUrl,
        formatFeedbackWhatsAppMessage(submittedFeedback)
      )
    : '';

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-amber-300">
      <div className="text-center mb-6">
        <span className="text-6xl mb-2 inline-block animate-bounce">🌟</span>
        <h1 className="text-2xl sm:text-3xl font-black text-amber-900 mb-2">شاركنا رأيك واقتراحاتك</h1>
        <p className="text-gray-600 text-sm sm:text-base font-bold">
          رأيك يهمنا جداً لتطوير الموقع وإضافة أفضل الألعاب لأطفالنا الصغار!
        </p>
      </div>

      {isSent ? (
        <div className="text-center p-6 sm:p-8 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 animate-fade-in space-y-4">
          <span className="text-6xl block">🎉</span>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-800">شكراً جزيلاً لمشاركتك!</h2>
          <p className="text-gray-700 font-bold">
            تم استلام رأيك وحفظه سحابياً في داتا الموقع، ومزامنته مع Gist لتظهر مباشرة لدى الإدارة.
          </p>

          {/* Cloud & IP Verification Box */}
          <div className="bg-white/80 border border-emerald-200 rounded-xl p-3 text-right text-xs space-y-1.5 shadow-sm max-w-md mx-auto">
            <div className="flex justify-between items-center text-emerald-950 font-bold border-b border-emerald-100 pb-1">
              <span>حالة المزامنة السحابية:</span>
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <span>✓ تم الحفظ والمزامنة السحابية</span>
              </span>
            </div>
            {submittedFeedback?.clientIp && (
              <div className="flex justify-between items-center text-gray-600">
                <span>IP جهاز المُرسل:</span>
                <span className="font-mono text-emerald-800 font-black">{submittedFeedback.clientIp}</span>
              </div>
            )}
            {submittedFeedback?.deviceInfo && (
              <div className="flex justify-between items-center text-gray-600">
                <span>الجهاز:</span>
                <span className="text-gray-800 font-bold truncate max-w-[200px]">{submittedFeedback.deviceInfo}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {/* WhatsApp Notification Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>📲 إرسال إشعار برأيك إلى واتساب الإدارة</span>
            </a>

            {settings.feedbackEmail && (
              <button
                onClick={handleSendEmailCopy}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
              >
                إرسال نسخة عبر الإيميل 📧
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-4 rounded-xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
            >
              إرسال رأي آخر ✍️
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating selector */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-center">
            <label className="block text-base font-black text-amber-950 mb-2">ما تقييمك لتجربتك في موقع الألعاب؟</label>
            <div className="flex justify-center items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl sm:text-4xl transition-transform hover:scale-125 cursor-pointer ${
                    star <= rating ? 'text-amber-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-sm font-black text-amber-800">{ratingLabels[rating]}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="feedbackName" className="block text-sm font-black text-gray-700 mb-1">
                اسمك (اختياري)
              </label>
              <input
                id="feedbackName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-bold text-gray-800"
                placeholder="مثال: البطل أحمد"
              />
            </div>
            <div>
              <label htmlFor="feedbackEmail" className="block text-sm font-black text-gray-700 mb-1">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                id="feedbackEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-bold text-gray-800"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="feedbackCategory" className="block text-sm font-black text-gray-700 mb-1">
              نوع المشاركة
            </label>
            <select
              id="feedbackCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-bold text-gray-800 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="feedbackMessage" className="block text-sm font-black text-gray-700 mb-1">
              رأيك واقتراحاتك بالتفصيل *
            </label>
            <textarea
              id="feedbackMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-bold text-gray-800"
              placeholder="اكتب هنا كل ما ترغب بمشاركته معنا أو ألعاب جديدة تحب أن نضيفها..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-black text-xl py-3.5 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال رأيي الآن ✨'}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackPage;
