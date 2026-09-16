import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

interface QuestionGateModalProps {
  isOpen: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
  gameTitle: string;
  onOpenVipModal: () => void;
}

export const QuestionGateModal: React.FC<QuestionGateModalProps> = ({
  isOpen,
  currentQuestionNumber,
  totalQuestions,
  gameTitle,
  onOpenVipModal,
}) => {
  const navigate = useNavigate();
  const { settings, isVipActive, activateVip } = useSettings();
  const [quickCode, setQuickCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  if (!isOpen || isVipActive) return null;

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    const res = activateVip(quickCode);
    setCodeStatus(res);
    if (res.success) {
      setTimeout(() => {
        setCodeStatus(null);
        setQuickCode('');
      }, 1500);
    }
  };

  const sc = settings.paidSettings?.shamCash;
  const price = typeof sc?.price === 'number' ? sc.price : settings.paidSettings?.price ?? 3;
  const currency = sc?.currency?.trim() || settings.paidSettings?.currency || 'ليرة سورية';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
        {/* Crown Badge */}
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center text-5xl shadow-lg border-2 border-amber-200 animate-bounce">
          👑
        </div>

        {/* Heading */}
        <div className="inline-block bg-amber-100 text-amber-900 text-xs sm:text-sm font-black px-4 py-1 rounded-full border border-amber-300 mb-2">
          🌟 إنجاز مميز: وصلت للسؤال {currentQuestionNumber} بنجاح! 🌟
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          متابعة باقي مراحل اللعبة الـ {totalQuestions}
        </h2>
        <p className="text-sm text-gray-600 font-bold mb-5 leading-relaxed">
          أحسنت يا بطل! لمتابعة باقي التحدي من السؤال {currentQuestionNumber} وحتى السؤال {totalQuestions}، وفتح جميع الألعاب الحصرية، يرجى تفعيل النسخة المدفوعة VIP.
        </p>

        {/* Pricing Pill */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-3.5 mb-6 flex items-center justify-around">
          <div>
            <span className="text-xs text-gray-500 font-bold block">قيمة التفعيل الدائم</span>
            <span className="text-2xl font-black text-amber-700">{price} {currency}</span>
          </div>
          <div className="h-8 w-px bg-amber-200"></div>
          <div>
            <span className="text-xs text-gray-500 font-bold block">طريقة الدفع الفورية</span>
            <span className="text-sm font-black text-gray-800">شام كاش (Sham Cash) ⚡</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onOpenVipModal}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>👑</span>
            <span>ترقية واشتراك VIP الآن ({price} {currency})</span>
          </button>

          {!showCodeInput ? (
            <button
              onClick={() => setShowCodeInput(true)}
              className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold py-2.5 px-4 rounded-xl border border-sky-200 transition-colors text-sm cursor-pointer"
            >
              🔑 لدي كود تفعيل جاهز
            </button>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-200 text-right">
              <label className="block text-xs font-bold text-gray-700">أدخل كود تفعيل الـ VIP الخاص بك:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  placeholder="مثال: VIP-TOYS-2026-PREMIUM"
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-center"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow cursor-pointer active:scale-95"
                >
                  تفعيل
                </button>
              </div>
              {codeStatus && (
                <p className={`text-xs font-bold text-center mt-1 ${codeStatus.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {codeStatus.message}
                </p>
              )}
            </form>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-500 hover:text-gray-700 font-bold py-2 text-xs transition-colors cursor-pointer"
          >
            🏠 العودة إلى القائمة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionGateModal;
