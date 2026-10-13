import React, { useState } from 'react';
import { HISTORY_ERAS } from '../data/parkData';
import { HistoryEra } from '../types';
import { BookOpen, CheckCircle, Clock, ChevronRight, Landmark, Sparkles } from 'lucide-react';

export const HistorySection: React.FC = () => {
  const [activeEraId, setActiveEraId] = useState<'past' | 'present' | 'future'>('past');

  const activeEra = HISTORY_ERAS.find((e) => e.id === activeEraId) || HISTORY_ERAS[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Тарихи-өлкетану зерттеуі</span>
            <span aria-hidden="true">·</span>
            <span>«Менің шағын Отаным» ғылыми жобасы</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Мәртөк: өткені, бүгіні, болашағы
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Өлкенің тарихи ауыл шаруашылығы мен диірмен дәстүрінен бастап, қазіргі әлеуеті мен 2050 жылғы авторлық цифрлық жобасына дейінгі үш кезеңі.
          </p>
        </div>

        {/* 3 Era Switcher Buttons */}
        <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/10 text-xs font-semibold">
          {HISTORY_ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => setActiveEraId(era.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeEraId === era.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {era.id === 'past' && 'Өткен шақ'}
              {era.id === 'present' && 'Бүгінгі күн'}
              {era.id === 'future' && '2050 Болашақ'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Era Overview Banner */}
        <div className="p-5 rounded-xl border bg-slate-50 border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <span>{activeEra.period}</span>
              <span aria-hidden="true">·</span>
              <span>Тексерілген өлкетану материалдары</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{activeEra.title}</h3>
            <p className="text-xs text-slate-500 font-medium mb-3">{activeEra.tagline}</p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {activeEra.summary}
            </p>
          </div>
        </div>

        {/* Facts & Sources Cards */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Деректі материалдар мен зерттеу айғақтары ({activeEra.facts.length} дерек):
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeEra.facts.map((fact, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      0{index + 1}-дерек
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      Тексерілген дерек
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm mb-2">{fact.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {fact.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                    Дереккөз:
                  </span>
                  <span className="text-[11px] text-slate-700 italic">{fact.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Structured Data Extensibility Note */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-500" />
            <span>
              Жаңа мұрағаттық құжаттар мен фотосуреттерді жоба кодындағы бірыңғай деректер файлынан (<code>parkData.ts</code>) еркін толықтыруға болады.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
