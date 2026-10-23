import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast, setToast, theme } = useApp();
  const isLight = theme === 'light';

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className={`w-5 h-5 shrink-0 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />,
    error: <XCircle className={`w-5 h-5 shrink-0 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />,
    warning: <AlertCircle className={`w-5 h-5 shrink-0 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />,
    info: <Info className={`w-5 h-5 shrink-0 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
  };

  const bgStyles = isLight
    ? {
        success: 'bg-white border-emerald-300 text-emerald-950 shadow-emerald-500/10',
        error: 'bg-white border-rose-300 text-rose-950 shadow-rose-500/10',
        warning: 'bg-white border-amber-300 text-amber-950 shadow-amber-500/10',
        info: 'bg-white border-blue-300 text-blue-950 shadow-blue-500/10'
      }
    : {
        success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-2xl',
        error: 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-2xl',
        warning: 'bg-amber-950/90 border-amber-500/40 text-amber-100 shadow-2xl',
        info: 'bg-blue-950/90 border-blue-500/40 text-blue-100 shadow-2xl'
      };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${bgStyles[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <span className="text-sm font-semibold pr-2">{toast.message}</span>
        {setToast && (
          <button
            onClick={() => setToast(null)}
            className={`p-1 rounded-lg transition-colors ${
              isLight
                ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
            title="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

