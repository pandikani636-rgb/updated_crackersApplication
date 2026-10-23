import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmModal = () => {
  const { confirmModal, closeConfirm, theme } = useApp();
  const isLight = theme === 'light';

  if (!confirmModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl relative border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-slate-900 border-slate-700/80 text-slate-100'
      }`}>
        <button
          onClick={closeConfirm}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {confirmModal.title || 'Confirm Action'}
            </h3>
            <p className={`text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {confirmModal.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
              isLight
                ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
              closeConfirm();
            }}
            className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/30 transition-all"
          >
            {confirmModal.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
