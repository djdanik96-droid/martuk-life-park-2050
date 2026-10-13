import React, { useState } from 'react';
import { usePWAStatus } from '../hooks/usePWAStatus';
import {
  WifiOff,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export const PWAOfflineNotice: React.FC = () => {
  const {
    isOnline,
    isOfflineReady,
    needRefresh,
    storageWarning,
    storageEstimate,
    updateApp,
  } = usePWAStatus();

  const [dismissedReady, setDismissedReady] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm w-[92vw] sm:w-auto pointer-events-none select-none">
      {/* 1. Offline Mode Indicator (When disconnected from internet) */}
      {!isOnline && (
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-lg border border-amber-500 animate-bounce">
          <WifiOff className="w-4 h-4 shrink-0" />
          <div className="flex-1">
            <span className="block font-bold">Офлайн режим (Интернет жоқ)</span>
            <span className="text-[11px] text-amber-100 font-normal">
              Кешен сақталған кэштен толық жұмыс істеп тұр
            </span>
          </div>
        </div>
      )}

      {/* 2. New Version Available Update Prompt (Requirement 8) */}
      {needRefresh && (
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            <div>
              <span className="block font-bold">Жаңа нұсқа қолжетімді</span>
              <span className="text-[10px] text-slate-400">Кэшті жаңарту ұсынылады</span>
            </div>
          </div>
          <button
            onClick={updateApp}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors shrink-0"
          >
            Жаңарту
          </button>
        </div>
      )}

      {/* 3. Storage Warning If Low Disk Space (Requirement 10) */}
      {storageWarning && (
        <div className="pointer-events-auto flex items-center gap-2 p-3 bg-rose-600 text-white text-xs rounded-xl shadow-lg border border-rose-500">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-[11px] leading-tight">{storageWarning}</span>
        </div>
      )}

      {/* 4. «Офлайн пайдалануға дайын» Badge (Requirement 11 - ONLY shown when precached) */}
      {isOfflineReady && !dismissedReady && isOnline && (
        <div className="pointer-events-auto flex items-center justify-between gap-2.5 px-3 py-2 bg-emerald-50 text-emerald-950 text-xs font-medium rounded-xl shadow-md border border-emerald-300 transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-900">Офлайн пайдалануға дайын</span>
              {storageEstimate && (
                <span className="block text-[10px] text-emerald-700">
                  Ресурстар кэштелді ({storageEstimate.usageMb} MB)
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setDismissedReady(true)}
            className="p-1 rounded-md text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100"
            title="Жасыру"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
