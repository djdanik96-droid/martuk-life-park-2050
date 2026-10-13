import React, { useState } from 'react';
import { SMART_TECH_ITEMS } from '../data/parkData';
import { SmartTechItem } from '../types';
import {
  Cpu,
  Zap,
  Droplets,
  QrCode,
  Recycle,
  Lightbulb,
  Radio,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const SmartTech2050: React.FC = () => {
  const [activeTechId, setActiveTechId] = useState<string>(SMART_TECH_ITEMS[0].id);

  const getTechIcon = (id: string) => {
    switch (id) {
      case 'solar':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'smart_lighting':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'drip_irrigation':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'digital_kiosks':
        return <Radio className="w-5 h-5 text-indigo-500" />;
      case 'qr_guide':
        return <QrCode className="w-5 h-5 text-emerald-500" />;
      case 'waste_sorting':
        return <Recycle className="w-5 h-5 text-teal-500" />;
      case 'visitor_scheduling':
        return <CalendarCheck className="w-5 h-5 text-rose-500" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-500" />;
    }
  };

  const selectedTech = SMART_TECH_ITEMS.find((t) => t.id === activeTechId) || SMART_TECH_ITEMS[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <Cpu className="w-4 h-4" />
            <span>2050 жылға арналған инновациялық технологиялар</span>
            <span aria-hidden="true">·</span>
            <span>Ақылды өлке шешімдері</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Интеллектуалды инфрақұрылым және жасыл шешімдер
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Кешенде қолданылуы ұсынылатын заманауи және перспективалы технологиялардың практикалық сипаттамасы мен негіздемесі.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Technology Selector List (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            Технологиялар тізімі ({SMART_TECH_ITEMS.length} шешім):
          </span>
          {SMART_TECH_ITEMS.map((item) => {
            const isSelected = item.id === activeTechId;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTechId(item.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-400 ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                    {getTechIcon(item.id)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isSelected ? 'Ашық' : 'Көру →'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed 4-Question Analytical Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                {getTechIcon(selectedTech.id)}
              </div>
              <div>
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                  {selectedTech.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedTech.name}</h3>
                <span className="text-xs text-slate-500">
                  Қолданылатын аймағы: <strong>{selectedTech.zone}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* The 4 Mandatory Evaluation Questions */}
          <div className="space-y-4 text-xs">
            {/* Q1: Не үшін қажет? */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                  1
                </span>
                <span>Не үшін қажет?</span>
              </h4>
              <p className="text-slate-700 leading-relaxed pl-7">{selectedTech.whyNeeded}</p>
            </div>

            {/* Q2: Қандай мәселені шешуі мүмкін? */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[11px]">
                  2
                </span>
                <span>Қандай мәселені шешуі мүмкін?</span>
              </h4>
              <p className="text-slate-700 leading-relaxed pl-7">{selectedTech.problemSolved}</p>
            </div>

            {/* Q3: Кешеннің қай аймағында қолданылады? */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">
                  3
                </span>
                <span>Кешеннің қай аймағында қолданылады?</span>
              </h4>
              <p className="text-slate-700 leading-relaxed pl-7">{selectedTech.whereApplied}</p>
            </div>

            {/* Q4: Іске асыру үшін не қажет? */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[11px]">
                  4
                </span>
                <span>Іске асыру үшін нақты не қажет?</span>
              </h4>
              <p className="text-slate-700 leading-relaxed pl-7">
                {selectedTech.implementationNeeds}
              </p>
            </div>

            {/* Model Impact on SMART PARK (Section 9) */}
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>SMART PARK көрсеткіштеріне ықтимал әсері</span>
                </h5>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  модельдік жорамал
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-700">
                <div className="p-2 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Су тұтыну:</span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    {selectedTech.modelImpact.waterDeltaDesc}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Электр тұтыну:</span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    {selectedTech.modelImpact.powerDeltaDesc}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Туристік тәжірибе:</span>
                  <span className="font-bold text-emerald-800 text-[11px]">
                    {selectedTech.modelImpact.experienceDeltaDesc}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Қызмет күрделілігі:</span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    {selectedTech.modelImpact.complexityLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
