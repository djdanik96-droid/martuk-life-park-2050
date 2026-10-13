import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGeneralInfoModal, setShowGeneralInfoModal] = useState(false);

  // If already running inside installed standalone PWA, hide button
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Орнатылған PWA</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGeneralInfoModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 font-semibold transition-all whitespace-nowrap shrink-0 shadow-xs ${
          variant === 'hero'
            ? 'px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm'
            : variant === 'banner'
            ? 'px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg text-xs'
            : 'px-3 py-1.5 text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl'
        }`}
        title="Қосымшаны құрылғыға офлайн пайдалану үшін орнату"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" />
        <span>Орнату (PWA)</span>
      </button>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">iPhone / iPad-қа орнату</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apple құрылғыларында веб-қосымшаны интернетсіз қолдану үшін басты экранға қосыңыз:
            </p>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <div>
                  Safari браузерінің төменгі мәзіріндегі <strong>«Бөлісу» (Share)</strong> белгішесін <Share2 className="w-3.5 h-3.5 inline mx-0.5" /> басыңыз.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <div>
                  Төмен сырғытып, <strong>«Басты экранға қосу» (Add to Home Screen)</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" /> жолын таңдаңыз.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <div>
                  Жоғарғы оң жақтағы <strong>«Қосу» (Add)</strong> батырмасын басыңыз. Қосымша жеке қолданба ретінде ашылады.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Түсінікті
            </button>
          </div>
        </div>
      )}

      {/* General Desktop / Android Browser Guide Modal */}
      {showGeneralInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">Қосымшаны орнату</h3>
              </div>
              <button
                onClick={() => setShowGeneralInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              «MARTUK LIFE PARK 2050» — толыққанды Progressive Web App (PWA). Оны компьютерге немесе Android телефонына орнату үшін:
            </p>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>• <strong>Google Chrome / Edge:</strong> Мекенжай жолындағы (URL) <strong>«Орнату» (Install)</strong> белгішесін немесе браузердің «...» мәзірінен «Қосымшаны орнату» пәрменін басыңыз.</p>
              <p>• <strong>Android:</strong> Браузердің үш нүкте мәзірінен <strong>«Қосымшаны орнату»</strong> тармағын таңдаңыз.</p>
              <p>• Орнатқаннан кейін сайт интернетсіз (офлайн режимде) тікелей жұмыс істейді.</p>
            </div>

            <button
              onClick={() => setShowGeneralInfoModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Жабу
            </button>
          </div>
        </div>
      )}
    </>
  );
};
