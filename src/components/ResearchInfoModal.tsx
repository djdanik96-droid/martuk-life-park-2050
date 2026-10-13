import React from 'react';
import { RESEARCH_PROJECT_METADATA } from '../data/parkData';
import {
  GraduationCap,
  X,
  Target,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface ResearchInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchInfoModal: React.FC<ResearchInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
                <span>{RESEARCH_PROJECT_METADATA.contest}</span>
                <span aria-hidden="true">·</span>
                <span>{RESEARCH_PROJECT_METADATA.grade}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-800 font-bold">{RESEARCH_PROJECT_METADATA.nomination}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Ғылыми-жобалық төлқұжат (Паспорт)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Title */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Жобаның толық тақырыбы:
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
              «{RESEARCH_PROJECT_METADATA.title}»
            </h3>
          </div>

          {/* Problem & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>Зерттеу мәселесі</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {RESEARCH_PROJECT_METADATA.problem}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1.5">
                <Target className="w-4 h-4 text-emerald-700" />
                <span>Зерттеу мақсаты</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {RESEARCH_PROJECT_METADATA.goal}
              </p>
            </div>
          </div>

          {/* Methods */}
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Зерттеу әдістері:
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              {RESEARCH_PROJECT_METADATA.methods.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Novelty & Practical Significance */}
          <div className="space-y-3">
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
              <div className="flex items-center gap-2 text-sky-900 font-bold mb-1">
                <Lightbulb className="w-4 h-4 text-sky-700" />
                <span>Жобаның ғылыми-тәжірибелік жаңалығы</span>
              </div>
              <p className="text-xs text-sky-950 leading-relaxed">
                {RESEARCH_PROJECT_METADATA.novelty}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Практикалық маңызы</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {RESEARCH_PROJECT_METADATA.practicalSignificance}
              </p>
            </div>
          </div>

          {/* Scientific Disclaimer */}
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{RESEARCH_PROJECT_METADATA.disclaimer}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>«Менің шағын Отаным» 10-сынып оқушысының авторлық жұмысы</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Түсінікті, жабу
          </button>
        </div>
      </div>
    </div>
  );
};
