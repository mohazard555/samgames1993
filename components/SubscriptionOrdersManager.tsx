import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    generateFreeRandomCode,
    generateSingleRandomCode,
    generateBatchCodes,
    resetApprovedCodesTo100,
    generateFriendCode,
    revokeActivationCode,
    revokeFreeActivationCode,
    exportAllDataAsJSON,
    importAllDataFromJSON,
    loadFromGist,
    saveToGist,
    isSyncing,
    lastSyncTime,
    gistToken,
  } = useSettings();

  const [filter, setFilter] = useState<'all' | 'معلق' | 'موافق عليه' | 'مرفوض'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Single random code state
  const [singleGeneratedCode, setSingleGeneratedCode] = useState<string>('');
  const [singleCodeFeedback, setSingleCodeFeedback] = useState<string | null>(null);

  // Batch code generator state (Specifying count of codes to generate)
  const [batchCountInput, setBatchCountInput] = useState<number>(10);
  const [generatedBatchResult, setGeneratedBatchResult] = useState<string[]>([]);
  const [batchFeedback, setBatchFeedback] = useState<string | null>(null);

  // Approved Codes registry states
  const [codeSearchTerm, setCodeSearchTerm] = useState('');
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  // JSON Import modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [jsonInputText, setJsonInputText] = useState('');
  const [importNotice, setImportNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const orders = settings.purchaseOrders || [];
  const approvedCodes = settings.approvedActivationCodes || [];

  // Filtered orders with search engine for name, phone, code, ID, etc.
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter((ord) => {
      const matchesFilter = filter === 'all' || ord.status === filter;
      if (!matchesFilter) return false;

      if (!term) return true;
      const name = (ord.customerName || '').toLowerCase();
      const phone = (ord.customerPhone || '').toLowerCase();
      const code = (ord.activationCode || '').toLowerCase();
      const id = (ord.id || '').toLowerCase();
      const tx = (ord.transactionId || '').toLowerCase();

      return (
        name.includes(term) ||
        phone.includes(term) ||
        code.includes(term) ||
        id.includes(term) ||
        tx.includes(term)
      );
    });
  }, [orders, filter, searchTerm]);

  // Displayed codes in registry with optional search
  const displayedApprovedCodes = useMemo(() => {
    const term = codeSearchTerm.trim().toUpperCase();
    if (!term) return approvedCodes;
    return approvedCodes.filter((c) => {
      const customer = (settings.codeCustomerBindings?.[c] || '').toUpperCase();
      return c.toUpperCase().includes(term) || customer.includes(term);
    });
  }, [approvedCodes, codeSearchTerm, settings.codeCustomerBindings]);

  const pendingCount = orders.filter((o) => o.status === 'معلق').length;
  const approvedCount = orders.filter((o) => o.status === 'موافق عليه').length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Generate exactly ONE single random code
  const handleGenerateSingleRandom = () => {
    const newCode = generateSingleRandomCode();
    setSingleGeneratedCode(newCode);
    handleCopy(newCode);
    setSingleCodeFeedback(`✓ تم توليد كود VIP عشوائي جديد بنجاح ونسخه إلى الحافظة!`);
    setTimeout(() => setSingleCodeFeedback(null), 4000);
  };

  // Generate specified batch of unique codes
  const handleGenerateBatch = () => {
    const count = Math.max(1, Math.min(Number(batchCountInput) || 1, 500));
    const newCodes = generateBatchCodes(count);
    setGeneratedBatchResult(newCodes);
    setBatchFeedback(`✓ تم بنجاح توليد ${newCodes.length} كود معتمد غير مكرر وحفظها في السجل!`);
    setTimeout(() => setBatchFeedback(null), 4500);
  };

  const handleCopyAllBatch = () => {
    if (generatedBatchResult.length === 0) return;
    navigator.clipboard.writeText(generatedBatchResult.join('\n'));
    setCopiedCode('batch-all');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Reset approved codes registry to clean 100 default codes
  const handleResetCodesTo100 = () => {
    if (
      window.confirm(
        `هل أنت متأكد من رغبتك في إعادة ضبط سجل الأكواد إلى الـ 100 كود الافتراضية النظيفة؟\n(العدد الحالي المسجل: ${approvedCodes.length} كود)`
      )
    ) {
      const fresh = resetApprovedCodesTo100();
      setResetNotice(`✓ تم بنجاح إعادة ضبط السجل إلى ${fresh.length} كود افتراضي نظيف!`);
      setTimeout(() => setResetNotice(null), 4000);
    }
  };

  // Quick Gist synchronization
  const handleManualGistSync = async () => {
    setSyncStatusMsg({ text: '⏳ جاري المزامنة السحابية مع Gist...', type: 'info' });
    const success = await loadFromGist();
    if (success) {
      if (gistToken) {
        await saveToGist();
      }
      setSyncStatusMsg({ text: '✓ تمت المزامنة السحابية بنجاح وتم تحديث كافة البيانات!', type: 'success' });
    } else {
      setSyncStatusMsg({ text: '⚠️ تعذر سحب البيانات من السحابة. تحقق من إعدادات Gist.', type: 'error' });
    }
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  // Handle JSON File Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        const res = await importAllDataFromJSON(text);
        if (res.success) {
          setImportNotice({
            text: `✓ ${res.message} (تم دمج: ${res.summary?.orders ?? 0} طلب، ${res.summary?.codes ?? 0} كود)`,
            type: 'success',
          });
        } else {
          setImportNotice({ text: res.message, type: 'error' });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualJsonTextImport = async () => {
    if (!jsonInputText.trim()) {
      setImportNotice({ text: 'يرجى لصق كود JSON أولاً', type: 'error' });
      return;
    }
    const res = await importAllDataFromJSON(jsonInputText);
    if (res.success) {
      setImportNotice({
        text: `✓ ${res.message} (تم دمج: ${res.summary?.orders ?? 0} طلب، ${res.summary?.codes ?? 0} كود)`,
        type: 'success',
      });
      setJsonInputText('');
    } else {
      setImportNotice({ text: res.message, type: 'error' });
    }
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
      {/* Central Sync & Portability Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🌐</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm sm:text-base text-sky-200">
                  مركز مزامنة ونقل البيانات بين الأجهزة (Gist & JSON)
                </h4>
                {lastSyncTime && (
                  <span className="bg-sky-900/60 text-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-600/30">
                    آخر مزامنة: {lastSyncTime}
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-100/80">
                يمكنك تصدير واستيراد ملف JSON لنقل كافة الطلبات والرسائل لفتحها من أي جهاز ومزامنتها سحابياً.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportAllDataAsJSON}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="تحميل نسخة احتياطية كاملة بصيغة JSON"
            >
              <span>💾 تصدير JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowImportModal(true);
                setImportNotice(null);
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="استيراد بيانات من هاتف أو جهاز آخر"
            >
              <span>📂 استيراد JSON</span>
            </button>

            <button
              type="button"
              onClick={handleManualGistSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="تحديث ومزامنة السحابة الآن"
            >
              <span>{isSyncing ? '⏳ جاري المزامنة...' : '☁️ مزامنة Gist'}</span>
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-xs font-bold ${
              syncStatusMsg.type === 'success'
                ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600'
                : syncStatusMsg.type === 'error'
                ? 'bg-red-900/80 text-red-200 border border-red-600'
                : 'bg-blue-900/80 text-blue-200 border border-blue-600'
            }`}
          >
            {syncStatusMsg.text}
          </div>
        )}
      </div>

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

      {/* Code Generation Controls (Enforced: Single Random Code + Specific Batch Count Generation) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Box 1: Single Unique Random Activation Code */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-950">
                <span className="text-2xl">🎲</span>
                <h4 className="font-black text-sm sm:text-base">
                  كود توليد عشوائي (كود واحد):
                </h4>
              </div>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-400">
                كود واحد غير مكرر
              </span>
            </div>

            <div className="bg-white/90 border border-emerald-200 rounded-2xl p-2.5 text-xs text-emerald-900 space-y-1">
              <div className="flex items-start gap-1.5 font-bold">
                <span className="text-emerald-700">💡</span>
                <span>عند النقر على زر التوليد، يتم توليد كود VIP عشوائي واحد فقط غير مكرر نهائياً، ويُحفظ بالسجل فوراً ويُنسخ تلقائياً للحافظة.</span>
              </div>
            </div>

            {singleGeneratedCode ? (
              <div className="bg-white border-2 border-emerald-400 p-3.5 rounded-2xl shadow-sm space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700">
                    الكود العشوائي المولّد حالياً:
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    جاهز للاستخدام
                  </span>
                </div>
                <div className="font-mono font-black text-base sm:text-lg text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl text-center tracking-wider border border-emerald-200 select-text">
                  {singleGeneratedCode}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(singleGeneratedCode)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedCode === singleGeneratedCode ? '✓ تم النسخ بنجاح' : 'نسخ الكود 📋'}
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateSingleRandom}
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                    title="توليد كود عشوائي آخر جديد"
                  >
                    🔄 توليد كود آخر
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 border border-dashed border-emerald-300 p-4 rounded-2xl text-center space-y-2.5">
                <p className="text-xs text-gray-600">
                  اضغط على الزر أدناه لتوليد كود VIP عشوائي واحد فقط غير مكرر.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateSingleRandom}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎲 توليد كود VIP عشوائي (كود واحد)</span>
                </button>
              </div>
            )}

            {singleCodeFeedback && (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-xl text-center animate-fade-in border border-emerald-300">
                {singleCodeFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Box 2: Batch Generation by Specifying Count */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-950">
                <span className="text-2xl">🔢</span>
                <h4 className="font-black text-sm sm:text-base">
                  تحديد الأكواد المراد توليدها:
                </h4>
              </div>
              <span className="bg-blue-200 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-400">
                توليد كمية مخصصة
              </span>
            </div>

            <p className="text-xs text-blue-900 leading-relaxed">
              حدد عدد الأكواد التي تريد توليدها بدقة ثم اضغط على زر توليد؛ يتم إنشاء الأكواد المحددة فوراً بدون أي تكرار مع السجل.
            </p>

            {/* Input & Quick selection */}
            <div className="bg-white/90 border border-blue-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-gray-700">عدد الأكواد المطلوبة:</label>
                <div className="flex gap-1">
                  {[5, 10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBatchCountInput(num)}
                      className={`px-2 py-0.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                        batchCountInput === num
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={batchCountInput}
                  onChange={(e) => setBatchCountInput(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-black text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateBatch}
                  className="shrink-0 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>⚡ توليد {batchCountInput} كود</span>
                </button>
              </div>
            </div>

            {batchFeedback && (
              <div className="text-xs font-bold text-blue-900 bg-blue-100 p-2 rounded-xl text-center animate-fade-in border border-blue-300">
                {batchFeedback}
              </div>
            )}

            {generatedBatchResult.length > 0 && (
              <div className="bg-white border border-blue-200 rounded-2xl p-3 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800">
                    آخر دفعة تم توليدها ({generatedBatchResult.length} كود):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAllBatch}
                    className="text-[11px] font-black text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer"
                  >
                    {copiedCode === 'batch-all' ? '✓ تم نسخ الكل' : '📋 نسخ كل الأكواد'}
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto font-mono text-[10px] text-gray-700 bg-gray-50 p-2 rounded-xl border border-gray-200 space-y-1 select-text">
                  {generatedBatchResult.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-0.5 px-1 hover:bg-white rounded">
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(c)}
                        className="text-gray-400 hover:text-gray-700 text-[10px]"
                      >
                        {copiedCode === c ? '✓' : 'نسخ'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                <span>📂</span>
                <span>استيراد ودمج بيانات التطبيق (ملف JSON)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-black"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              إذا قمت بتصدير ملف JSON من هاتفك أو جهازك الآخر، يمكنك رفعه هنا لدمج كافة الطلبات والأكواد والرسائل فوراً على هذا الجهاز والمزامنة مع السحابة.
            </p>

            {/* Option 1: File Upload */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                الطريقة 1: اختيار ملف JSON من الجهاز
              </span>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
              />
            </div>

            {/* Option 2: Paste Raw JSON */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                الطريقة 2: أو لصق نص الـ JSON مباشرة (مفيد جداً للهواتف):
              </label>
              <textarea
                rows={4}
                value={jsonInputText}
                onChange={(e) => setJsonInputText(e.target.value)}
                placeholder="الصق محتوى ملف الـ JSON هنا..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleManualJsonTextImport}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                تنفيذ الدمج من النص الملصق 📥
              </button>
            </div>

            {importNotice && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  importNotice.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {importNotice.text}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Orders Search Engine */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-gray-200 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 text-sm pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن اسم الزبون، رقم الهاتف، كود التفعيل، رقم العملية، أو معرّف الطلب..."
              className="w-full pr-10 pl-16 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 left-2.5 flex items-center text-xs font-bold text-gray-400 hover:text-gray-700 px-2 cursor-pointer"
                title="مسح البحث"
              >
                ✕ مسح
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl shrink-0">
              <span>نتائج البحث:</span>
              <span className="font-black text-sm text-amber-950">{filteredOrders.length}</span>
              <span className="text-gray-500">من أصل {orders.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="font-black text-base text-gray-800 flex items-center gap-2">
          <span>📦 قائمة طلبات الشراء:</span>
          <span className="text-xs font-normal text-gray-500">
            ({filteredOrders.length} {searchTerm ? 'مطابق للبحث' : 'طلب'})
          </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
          <div>
            <h4 className="font-black text-sm sm:text-base text-gray-800 flex items-center gap-2">
              <span>🔑 سجل أكواد التفعيل المعتمدة:</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {approvedCodes.length} كود مسجل
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              الأكواد الصالحة لتفعيل نسخة VIP للألعاب والبرامج بشكل دائم.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetCodesTo100}
              className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
              title="إعادة ضبط سجل الأكواد إلى الـ 100 كود الافتراضية النظيفة ومنع الزيادة العشوائية"
            >
              <span>🧹</span>
              <span>إعادة ضبط السجل (100 كود افتراضي)</span>
            </button>
          </div>
        </div>

        {resetNotice && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold text-center animate-fade-in">
            {resetNotice}
          </div>
        )}

        {/* Quick Search within Codes Registry */}
        <div className="relative">
          <input
            type="text"
            value={codeSearchTerm}
            onChange={(e) => setCodeSearchTerm(e.target.value)}
            placeholder="بحث سريع داخل سجل الأكواد بالرمز أو اسم الزبون..."
            className="w-full py-2 pr-9 pl-9 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs pointer-events-none">
            🔍
          </span>
          {codeSearchTerm && (
            <button
              type="button"
              onClick={() => setCodeSearchTerm('')}
              className="absolute inset-y-0 left-2.5 flex items-center text-xs font-bold text-gray-400 hover:text-gray-600 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {displayedApprovedCodes.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-500 bg-white rounded-2xl border border-gray-200">
            لا توجد أكواد مطابقة لبحثك في السجل.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1">
            {displayedApprovedCodes.map((code) => {
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
                      className="p-1 hover:bg-gray-200/60 rounded text-gray-600 cursor-pointer"
                      title="نسخ"
                    >
                      {copiedCode === code ? '✓' : '📋'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        revokeActivationCode(code);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500 cursor-pointer"
                      title="إلغاء وحظر الكود"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionOrdersManager;
