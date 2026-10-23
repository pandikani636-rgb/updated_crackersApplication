import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast, setToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />
  };

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-100',
    warning: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
    info: 'bg-blue-950/90 border-blue-500/40 text-blue-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${bgStyles[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
        {setToast && (
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

