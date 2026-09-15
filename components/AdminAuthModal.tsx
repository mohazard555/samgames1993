import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { LockClosedIcon, KeyIcon } from './Icons';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { verifyAdminPassword } = useSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verifyAdminPassword(password)) {
      setError(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/settings');
        }
      }, 600);
    } else {
      setError(true);
      setPassword('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleDigitClick = (num: string) => {
    if (password.length < 8) {
      const nextPin = password + num;
      setPassword(nextPin);
      if (nextPin === '1993') {
        setTimeout(() => {
          verifyAdminPassword(nextPin);
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
            else navigate('/settings');
          }, 600);
        }, 100);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPassword((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center border-4 border-amber-300 transform animate-scale-up">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-white shadow-lg">
          <LockClosedIcon />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">لوحة تحكم المشرف</h2>
        <p className="text-sm text-gray-500 mb-6">هذه المنطقة محمية، يرجى إدخال كلمة السر</p>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full text-center text-3xl tracking-widest font-mono py-3 px-4 rounded-xl border-2 transition-all outline-none ${
                error
                  ? 'border-red-500 bg-red-50 animate-shake text-red-600'
                  : isSuccess
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-sky-300 focus:border-sky-500 bg-gray-50'
              }`}
            />
          </div>

          {error && <p className="text-red-600 text-sm font-bold mb-3 animate-bounce">كلمة المرور غير صحيحة! حاول مجدداً</p>}
          {isSuccess && <p className="text-green-600 text-sm font-bold mb-3">تم التحقق بنجاح! جاري الفتح...</p>}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-4 dir-ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (btn === 'C') setPassword('');
                  else if (btn === '⌫') handleDeleteDigit();
                  else handleDigitClick(btn);
                }}
                className="py-3 bg-gray-100 hover:bg-sky-100 active:bg-sky-200 text-gray-800 font-bold text-lg rounded-xl transition-colors select-none shadow-sm"
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              دخول
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminAuthModal;
