import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useSettings } from '../contexts/SettingsContext';
import { SubscriptionOrder } from '../types';

const OrderQrThumbnail: React.FC<{ code: string }> = ({ code }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && code) {
      QRCode.toCanvas(
        canvasRef.current,
        code,
        {
          width: 90,
          margin: 1,
          color: {
            dark: '#1e295d',
            light: '#ffffff',
          },
        },
        () => {}
      );
    }
  }, [code]);

  return (
    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex flex-col items-center">
      <canvas ref={canvasRef} className="w-20 h-20 rounded-lg" />
      <span className="text-[9px] font-mono text-gray-500 font-bold mt-0.5">باركود التفعيل</span>
    </div>
  );
};

const SubscriptionOrdersManager: React.FC = () => {
  const {
    settings,
    updateOrderStatus,
    deletePurchaseOrder,
    generateManualActivationCode,
    revokeActivationCode,
  } = useSettings();

  const [filter, setFilter] = useState<'all' | 'معلق' | 'موافق عليه' | 'مرفوض'>('all');
  const [manualNote, setManualNote] = useState('');
  const [generatedCodeResult, setGeneratedCodeResult] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Friend / customer code generator modal states
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');

  const orders = settings.purchaseOrders || [];
  const approvedCodes = settings.approvedActivationCodes || [];

  const filteredOrders = orders.filter((ord) => {
    if (filter === 'all') return true;
    return ord.status === filter;
  });

  const pendingCount = orders.filter((o) => o.status === 'معلق').length;
  const approvedCount = orders.filter((o) => o.status === 'موافق عليه').length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateManualActivationCode(manualNote);
    setGeneratedCodeResult(code);
    setManualNote('');
  };

  const handleGenerateForFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendNameInput.trim()) return;
    const code = generateManualActivationCode(friendNameInput);
    handleCopy(code);
    // Automatically close modal upon completion
    setShowFriendModal(false);
    setFriendNameInput('');
  };

  const getWhatsAppShareUrl = (order: SubscriptionOrder) => {
    const rawPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `مرحباً بك يا ${order.customerName}!\nتم التحقق من تحويلك لشراء النسخة الكاملة لتطبيق ألعاب الأطفال (شام كاش) بنجاح.\n\nكود تفعيل نسختك هو:\n${order.activationCode}\n\nطريقة التفعيل: افتح الموقع واضغط على (تفعيل النسخة المدفوعة VIP) وأدخل الكود أعلاه ليتم فتح كافة الألعاب فوراً مدى الحياة على جهازك!\nنتمنى لكم وقتاً ممتعاً 🎈`
    );
    return `https://wa.me/${rawPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6 select-none">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center">
          <span className="text-xs text-amber-800 font-bold block">إجمالي الطلبات</span>
          <span className="text-xl font-black text-amber-900">{orders.length}</span>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-3.5 rounded-2xl text-center">
          <span className="text-xs text-yellow-800 font-bold block">طلبات معلقة ⏳</span>
          <span className="text-xl font-black text-yellow-900">{pendingCount}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center">
          <span className="text-xs text-emerald-800 font-bold block">موافق عليها ✅</span>
          <span className="text-xl font-black text-emerald-900">{approvedCount}</span>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-center">
          <span className="text-xs text-indigo-800 font-bold block">الأكواد المعتمدة</span>
          <span className="text-xl font-black text-indigo-900">{approvedCodes.length}</span>
        </div>
      </div>

      {/* Manual Code Generator Tool */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-300 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-900">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-black text-sm sm:text-base">
                توليد أكواد تفعيل VIP (100 كود متاح):
              </h4>
              <p className="text-xs text-amber-800">
                توليد كود تفعيل جديد مخصص لصديق أو زبون وربطه باسمه فوراً.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFriendModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>🎁 توليد كود لصديق / زبون جديد</span>
          </button>
        </div>

        <form onSubmit={handleCreateManual} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-amber-200/60">
          <input
            type="text"
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            placeholder="ملاحظة أو اسم الزبون اليدوي (اختياري)"
            className="flex-1 bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm shrink-0 active:scale-95 cursor-pointer"
          >
            توليد كود VIP عشوائي 🔑
          </button>
        </form>

        {generatedCodeResult && (
          <div className="bg-white p-3 rounded-2xl border border-amber-300 flex items-center justify-between flex-wrap gap-2 animate-fade-in">
            <div>
              <span className="text-[11px] text-gray-500 font-bold block">تم توليد الكود واعتماده:</span>
              <span className="font-mono font-black text-amber-700 text-sm sm:text-base">
                {generatedCodeResult}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(generatedCodeResult)}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition-colors"
              >
                {copiedCode === generatedCodeResult ? '✓ تم النسخ' : 'نسخ الكود 📋'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Friend Code Generator Modal with Auto-Close */}
      {showFriendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-blue-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-blue-900 flex items-center gap-2">
                <span>🎁</span>
                <span>توليد كود تفعيل عشوائي لصديق / زبون</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFriendModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-black"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleGenerateForFriend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم الصديق أو الزبون المستفيد:
                </label>
                <input
                  type="text"
                  required
                  value={friendNameInput}
                  onChange={(e) => setFriendNameInput(e.target.value)}
                  placeholder="مثلاً: أحمد محمد / صديق الغالي"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  سيتم توليد كود عشوائي فوري، ربطه باسم الصديق، ونسخه تلقائياً مع إغلاق النافذة.
                </p>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowFriendModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  توليد ونسخ وإغلاق 🔑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="font-black text-base text-gray-800 flex items-center gap-2">
          <span>📦 قائمة طلبات الشراء:</span>
          <span className="text-xs font-normal text-gray-500">({filteredOrders.length} طلب)</span>
        </h3>

        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          {(['all', 'معلق', 'موافق عليه', 'مرفوض'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === st
                  ? 'bg-white text-gray-900 shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {st === 'all' ? 'الكل' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 p-8 rounded-3xl text-center text-gray-500 text-sm">
          لا توجد طلبات شراء مطابقة في هذا التصنيف حالياً.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all space-y-3 bg-white ${
                order.status === 'معلق'
                  ? 'border-yellow-300 shadow-sm'
                  : order.status === 'موافق عليه'
                  ? 'border-emerald-200'
                  : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">
                    {order.id}
                  </span>
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                      order.status === 'معلق'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse'
                        : order.status === 'موافق عليه'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}
                  >
                    {order.status === 'معلق' && '⏳ قيد المراجعة'}
                    {order.status === 'موافق عليه' && '✅ معتمد ومفعّل'}
                    {order.status === 'مرفوض' && '❌ مرفوض'}
                  </span>
                  <span className="text-[11px] text-gray-400">{order.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">المبلغ:</span>
                  <span className="font-black text-emerald-600 text-sm">
                    {order.amount} {order.currency} ({order.paymentMethod === 'sham_cash' ? 'شام كاش' : order.paymentMethod})
                  </span>
                </div>
              </div>

              {/* Order Body Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Customer Details */}
                <div className="space-y-1 text-xs md:col-span-2">
                  <div>
                    <span className="text-gray-500 font-bold">اسم المشتري: </span>
                    <strong className="text-gray-900">{order.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold">رقم الهاتف / الواتساب: </span>
                    <span className="font-mono text-gray-800">{order.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold">رقم عملية التحويل: </span>
                    <span className="font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {order.transactionId}
                    </span>
                  </div>
                  {order.senderAccount && (
                    <div>
                      <span className="text-gray-500 font-bold">حساب المحول: </span>
                      <span className="text-gray-700">{order.senderAccount}</span>
                    </div>
                  )}
                  {order.notes && (
                    <div>
                      <span className="text-gray-500 font-bold">ملاحظات: </span>
                      <span className="text-gray-700 italic">{order.notes}</span>
                    </div>
                  )}
                </div>

                {/* Activation Code & QR preview */}
                <div className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                  <OrderQrThumbnail code={order.activationCode} />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] text-amber-800 font-bold block">كود التفعيل الخاص بالزبون:</span>
                    <div className="font-mono font-black text-amber-900 text-xs sm:text-sm break-all">
                      {order.activationCode}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.activationCode)}
                      className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-2 py-0.5 rounded transition-colors"
                    >
                      {copiedCode === order.activationCode ? '✓ تم النسخ' : 'نسخ الكود 📋'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-gray-100">
                <a
                  href={getWhatsAppShareUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                  title="مراسلة الزبون بالواتساب وتزويده بكود التفعيل"
                >
                  <span>💬 إرسال الكود للزبون عبر واتساب</span>
                </a>

                {order.status === 'معلق' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'موافق عليه')}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-colors border border-emerald-300"
                  >
                    تأكيد واعتماد الطلب ✅
                  </button>
                )}

                {order.status !== 'مرفوض' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'مرفوض')}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-bold text-xs rounded-xl transition-colors"
                  >
                    رفض الطلب ⏳
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                      deletePurchaseOrder(order.id);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors border border-red-200"
                >
                  حذف 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approved Codes Registry */}
      <div className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-3xl space-y-3">
        <h4 className="font-black text-sm text-gray-800 flex items-center gap-2">
          <span>🔑 سجل أكواد التفعيل المعتمدة (100 كود):</span>
          <span className="text-xs text-gray-500 font-normal">({approvedCodes.length} كود)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1">
          {approvedCodes.map((code) => {
            const customerName = settings.codeCustomerBindings?.[code];
            const isBoundToCustomer = Boolean(customerName);
            return (
              <div
                key={code}
                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border shadow-sm text-xs font-mono font-bold ${
                  isBoundToCustomer
                    ? 'bg-blue-50 text-blue-900 border-blue-200 ring-1 ring-blue-300'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate">{code}</div>
                  {isBoundToCustomer && (
                    <div className="text-[10px] text-blue-700 font-sans font-semibold mt-0.5 truncate">
                      👤 {customerName}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(code)}
                    className="p-1 hover:bg-gray-200/60 rounded text-gray-600"
                    title="نسخ"
                  >
                    📋
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من إلغاء وحظر الكود: ${code}؟`)) {
                        revokeActivationCode(code);
                      }
                    }}
                    className="p-1 hover:bg-red-100 rounded text-red-500"
                    title="حذف/إلغاء"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOrdersManager;
