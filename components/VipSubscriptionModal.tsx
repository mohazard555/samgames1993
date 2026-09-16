import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSettings } from '../contexts/SettingsContext';
import ShamCashQrCard, { ShamCashLogoSvg } from './ShamCashQrCard';

interface VipSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'buy' | 'activate';
}

const VipSubscriptionModal: React.FC<VipSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'buy',
}) => {
  const {
    settings,
    isVipActive,
    vipActivationCode,
    activateVip,
    deactivateVip,
    addPurchaseOrder,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'buy' | 'activate'>(initialTab);

  // Buy Flow States
  const [selectedMethod, setSelectedMethod] = useState<'sham_cash' | string>('sham_cash');

  // Compute method-specific pricing and currency
  const methodConfig = useMemo(() => {
    if (selectedMethod === 'sham_cash') {
      const sc = settings.paidSettings?.shamCash;
      const price = typeof sc?.price === 'number' ? sc.price : settings.paidSettings?.price || 3;
      const currency = sc?.currency?.trim() || settings.paidSettings?.currency || 'ليرة سورية';
      const symbol = sc?.currencySymbol?.trim() || settings.paidSettings?.currencySymbol || 'ل.س';
      return {
        id: 'sham_cash',
        name: 'شام كاش (Sham Cash)',
        price,
        currency,
        symbol,
        instructions: sc?.instructions,
        accountName: sc?.accountName,
        accountCode: sc?.accountCode,
      };
    }

    const custom = (settings.paidSettings?.otherMethods || []).find((m) => m.id === selectedMethod);
    if (custom) {
      const price = typeof custom.price === 'number' ? custom.price : settings.paidSettings?.price || 3;
      const currency = custom.currency?.trim() || settings.paidSettings?.currency || 'دولار';
      const symbol = custom.currencySymbol?.trim() || settings.paidSettings?.currencySymbol || '$';
      return {
        id: custom.id,
        name: custom.name,
        price,
        currency,
        symbol,
        instructions: custom.instructions,
        accountName: custom.accountInfo,
        accountCode: custom.accountInfo,
      };
    }

    // Default fallback
    const price = settings.paidSettings?.price || 3;
    const currency = settings.paidSettings?.currency || 'دولار';
    const symbol = settings.paidSettings?.currencySymbol || '$';
    return {
      id: 'default',
      name: 'طريقة الدفع',
      price,
      currency,
      symbol,
      instructions: '',
      accountName: '',
      accountCode: '',
    };
  }, [selectedMethod, settings.paidSettings]);

  const targetPrice = methodConfig.price;
  const targetCurrency = methodConfig.currency;
  const targetSymbol = methodConfig.symbol;

  const [enteredAmount, setEnteredAmount] = useState<string>(String(methodConfig.price));
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isAmountConfirmed, setIsAmountConfirmed] = useState<boolean>(false);

  // Update enteredAmount whenever selectedMethod / methodConfig changes
  useEffect(() => {
    setEnteredAmount(String(methodConfig.price));
    setAmountError(null);
    setIsAmountConfirmed(false);
  }, [selectedMethod, methodConfig.price]);

  // Order Submission Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Activation Code States
  const [inputCode, setInputCode] = useState('');
  const [activationFeedback, setActivationFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  // Handle amount verification strictly per user rule
  const handleVerifyAmount = (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError(null);
    const num = parseFloat(enteredAmount);

    if (isNaN(num)) {
      setAmountError(`يرجى إدخال مبلغ صحيح.`);
      return;
    }

    if (num < targetPrice) {
      setAmountError(
        `المبلغ المدخل (${num} ${targetCurrency}) أقل من السعر المطلوب (${targetPrice} ${targetCurrency}). لا يمكن المتابعة بمبلغ أقل.`
      );
      return;
    }

    if (num > targetPrice) {
      setAmountError(
        `المبلغ المدخل (${num} ${targetCurrency}) أكبر من السعر المطلوب (${targetPrice} ${targetCurrency}). يرجى إدخال ${targetPrice} ${targetCurrency} بالضبط لا أكثر ولا أقل.`
      );
      return;
    }

    // Exact match
    setIsAmountConfirmed(true);
  };

  // Submit purchase order
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !transactionId.trim()) {
      alert('يرجى تعبئة جميع الحقول الإلزامية (الاسم، الهاتف، رقم عملية التحويل)');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await addPurchaseOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod: selectedMethod,
        amount: targetPrice,
        currency: targetCurrency,
        transactionId: transactionId.trim(),
        senderAccount: senderAccount.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setSubmittedOrder(order);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle VIP Activation Code
  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setActivationFeedback(null);
    const result = activateVip(inputCode);

    if (result.success) {
      setActivationFeedback({ type: 'success', text: result.message });
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      setActivationFeedback({ type: 'error', text: result.message });
    }
  };

  const whatsappMessage = submittedOrder
    ? encodeURIComponent(
        `مرحباً، قمت بتحويل مبلغ ${targetPrice} ${targetCurrency} عبر شام كاش لشراء النسخة الكاملة لتطبيق الألعاب.\nرقم الطلب: ${submittedOrder.id}\nالاسم: ${submittedOrder.customerName}\nرقم العملية: ${submittedOrder.transactionId}\nيرجى تزويدي بكود التفعيل.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden my-auto">
        {/* Glowing Top Banner */}
        <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-4 sm:p-5 text-center text-gray-950 font-black flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl animate-bounce">👑</span>
            <div className="text-right">
              <h2 className="text-lg sm:text-xl font-black tracking-wide leading-tight">
                النسخة الكاملة الممتازة (VIP)
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-amber-950/80">
                فتح دائم لجميع الألعاب المدفوعة والمميزات الحصرية!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 text-gray-950 font-black text-lg transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 p-1.5 sm:p-2 gap-2">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'buy'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-950 shadow-md font-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span>💳 طرق الدفع والاشتراك</span>
          </button>
          <button
            onClick={() => setActiveTab('activate')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'activate'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-950 shadow-md font-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span>🔑 لدي كود تفعيل</span>
            {isVipActive && (
              <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                مفعّل ✓
              </span>
            )}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: BUY FLOW */}
          {activeTab === 'buy' && (
            <div>
              {submittedOrder ? (
                /* Success Screen */
                <div className="text-center py-4 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/40 animate-pulse">
                    ✓
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-400">
                    تم استلام طلب الشراء بنجاح!
                  </h3>
                  <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700 text-right space-y-2 text-xs sm:text-sm max-w-md mx-auto">
                    <div className="flex justify-between border-b border-gray-700/60 pb-1.5">
                      <span className="text-gray-400">رقم الطلب:</span>
                      <span className="font-mono font-bold text-amber-400">{submittedOrder.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700/60 pb-1.5">
                      <span className="text-gray-400">الاسم:</span>
                      <span className="font-bold text-white">{submittedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700/60 pb-1.5">
                      <span className="text-gray-400">رقم العملية:</span>
                      <span className="font-mono font-bold text-cyan-300">{submittedOrder.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">المبلغ:</span>
                      <span className="font-bold text-emerald-400">{submittedOrder.amount} {submittedOrder.currency}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                    تم تسجيل طلبك وسيتم التحقق من الإشعار وتزويدك بكود التفعيل الخاص بجهازك لتشغيل النسخة الكاملة فوراً.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                    <a
                      href={`https://wa.me/?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>💬 مراسلة الإدارة عبر واتساب للتفعيل السريع</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmittedOrder(null);
                        setIsAmountConfirmed(false);
                        setActiveTab('activate');
                      }}
                      className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold rounded-xl text-xs sm:text-sm transition-all"
                    >
                      إدخال كود التفعيل 🔑
                    </button>
                  </div>
                </div>
              ) : !isAmountConfirmed ? (
                /* Step 1: Select Method & Strict Amount Input */
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-300 font-bold block">سعر النسخة الكاملة:</span>
                      <span className="text-xl sm:text-2xl font-black text-amber-400">
                        {targetPrice} {targetCurrency}
                      </span>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30">
                      {settings.paidSettings?.periodName || 'تفعيل دائم مدى الحياة'}
                    </span>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 block">
                      اختر طريقة الدفع:
                    </label>
                    <div
                      onClick={() => setSelectedMethod('sham_cash')}
                      className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        selectedMethod === 'sham_cash'
                          ? 'border-cyan-400 bg-cyan-950/30 shadow-lg ring-1 ring-cyan-400/50'
                          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <ShamCashLogoSvg className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                            <span>شام كاش (Sham Cash)</span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                              متاح وموصى به ⭐
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400">
                            تحويل مباشر عبر مسح الباركود أو رمز الحساب
                          </p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Strict Amount Input Form */}
                  <form onSubmit={handleVerifyAmount} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        المبلغ المراد تحويله ({targetCurrency}):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          value={enteredAmount}
                          onChange={(e) => {
                            setEnteredAmount(e.target.value);
                            setAmountError(null);
                          }}
                          placeholder={`أدخل ${targetPrice}`}
                          className={`w-full bg-gray-950 border-2 rounded-xl px-4 py-3 text-lg font-black text-center text-white focus:outline-none transition-all ${
                            amountError
                              ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                              : 'border-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEnteredAmount(String(targetPrice));
                            setAmountError(null);
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 transition-colors"
                        >
                          تعيين {targetPrice} {targetCurrency} تلقائياً
                        </button>
                      </div>
                      {amountError && (
                        <p className="text-xs text-red-400 font-bold mt-2 bg-red-950/40 p-2.5 rounded-xl border border-red-800/50">
                          ⚠️ {amountError}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                        * يجب أن يتطابق المبلغ تماماً مع قيمة الاشتراك المحددة ({targetPrice} {targetCurrency}) للمتابعة.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>متابعة للدفع وعرض الباركود (QR) ➡️</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Step 2: Show Sham Cash QR & Submit Form */
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between bg-gray-800/60 p-2.5 rounded-2xl border border-gray-700">
                    <span className="text-xs text-gray-300">
                      المبلغ المؤكد:{' '}
                      <strong className="text-amber-400 text-sm">
                        {targetPrice} {targetCurrency}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAmountConfirmed(false)}
                      className="text-xs text-cyan-400 hover:underline font-bold"
                    >
                      تعديل ↩️
                    </button>
                  </div>

                  {/* Sham Cash QR Card */}
                  <ShamCashQrCard
                    accountName={settings.paidSettings?.shamCash.accountName || 'mohannad anis ahmad'}
                    accountCode={
                      settings.paidSettings?.shamCash.accountCode ||
                      'c08a30e9e1f27a4b0d98b215562a0dbc'
                    }
                    amount={targetPrice}
                    currency={targetCurrency}
                  />

                  {/* Instructions */}
                  <div className="bg-cyan-950/30 border border-cyan-500/30 p-3.5 rounded-2xl text-xs text-cyan-200 leading-relaxed space-y-1">
                    <div className="font-bold text-cyan-300">📌 خطوات الدفع السهلة:</div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] sm:text-xs">
                      <li>افتح تطبيق شام كاش على هاتفك.</li>
                      <li>امسح الباركود أعلاه أو انسخ رمز الحساب.</li>
                      <li>
                        حوّل مبلغ <strong className="text-white">{targetPrice} {targetCurrency}</strong>.
                      </li>
                      <li>أدخل بياناتك ورقم عملية التحويل في النموذج أدناه واضغط إرسال.</li>
                    </ol>
                  </div>

                  {/* Order Submission Form */}
                  <form onSubmit={handleOrderSubmit} className="space-y-3 bg-gray-950/80 p-4 rounded-2xl border border-gray-800">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                      📝 تأكيد التحويل وإرسال طلب التفعيل:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          اسم المشتري / ولي الأمر <span className="text-red-400">*</span>:
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="مثال: أحمد محمد"
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          رقم الهاتف / الواتساب <span className="text-red-400">*</span>:
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="مثال: 0991234567"
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          رقم عملية التحويل (في شام كاش) <span className="text-red-400">*</span>:
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="مثال: TRX-984210"
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 mb-1">
                          حسابك الذي حولت منه (اختياري):
                        </label>
                        <input
                          type="text"
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          placeholder="رقم أو اسم الحساب المحول"
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">
                        ملاحظات إضافية (اختياري):
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أي ملاحظة أو استفسار"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>جاري إرسال الطلب... ⏳</span>
                      ) : (
                        <span>إرسال طلب الشراء والتفعيل 🚀</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVATE CODE */}
          {activeTab === 'activate' && (
            <div className="space-y-5 animate-fade-in">
              {isVipActive ? (
                /* Already VIP Active */
                <div className="bg-gradient-to-br from-emerald-950/60 to-gray-900 border-2 border-emerald-500/50 p-5 rounded-3xl text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 text-3xl rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    👑
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-400">
                    عضوية النسخة الكاملة (VIP) مفعّلة على هذا الجهاز!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    استمتع باللعب المباشر في كافة الألعاب الحصرية والمميزة بدون أي قيود أو انتظار.
                  </p>
                  {vipActivationCode && (
                    <div className="inline-block bg-gray-950 px-4 py-1.5 rounded-xl border border-emerald-500/30 font-mono text-xs text-amber-300">
                      كود التفعيل: {vipActivationCode}
                    </div>
                  )}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من إلغاء تفعيل VIP على هذا المتصفح؟')) {
                          deactivateVip();
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 underline font-bold"
                    >
                      إلغاء التفعيل على هذا الجهاز
                    </button>
                  </div>
                </div>
              ) : (
                /* Enter Activation Code */
                <form onSubmit={handleActivateCode} className="space-y-4">
                  <div className="bg-gray-950/80 p-4 sm:p-5 rounded-3xl border border-gray-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <span className="text-xl">🔑</span>
                      <h4 className="font-black text-sm sm:text-base">
                        أدخل كود تفعيل النسخة المدفوعة (VIP):
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400">
                      أدخل الكود الذي استلمته من إدارة الموقع بعد شراء النسخة (مثال:{' '}
                      <span className="font-mono text-amber-300">VIP-SHAM-XXXX-XXXX</span>).
                    </p>

                    <input
                      type="text"
                      required
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value);
                        setActivationFeedback(null);
                      }}
                      placeholder="VIP-XXXX-XXXX"
                      className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl px-4 py-3 text-base sm:text-lg font-mono font-bold text-center text-amber-300 uppercase tracking-widest focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                    />

                    {activationFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs font-bold ${
                          activationFeedback.type === 'success'
                            ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                            : 'bg-red-950/60 border border-red-500 text-red-300'
                        }`}
                      >
                        {activationFeedback.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>تفعيل النسخة المدفوعة الآن 🚀</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipSubscriptionModal;
