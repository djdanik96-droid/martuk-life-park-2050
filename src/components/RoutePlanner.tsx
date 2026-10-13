import React, { useState } from 'react';
import { TourRoute, ZoneId, GastronomyProduct } from '../types';
import { TOUR_ROUTES, PARK_ZONES, GASTRONOMY_PRODUCTS } from '../data/parkData';
import {
  Compass,
  Clock,
  DollarSign,
  MapPin,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';

interface RoutePlannerProps {
  activeRouteId: string | null;
  onSelectPredefinedRoute: (route: TourRoute) => void;
  customZoneIds: ZoneId[];
  onToggleCustomZone: (zoneId: ZoneId) => void;
  selectedProducts: string[];
  onToggleProduct: (product: GastronomyProduct) => void;
  onResetCustomRoute: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  activeRouteId,
  onSelectPredefinedRoute,
  customZoneIds,
  onToggleCustomZone,
  selectedProducts,
  onToggleProduct,
  onResetCustomRoute,
}) => {
  const [plannerMode, setPlannerMode] = useState<'ready' | 'custom'>(
    activeRouteId ? 'ready' : 'custom'
  );

  // Calculate custom route estimates
  const customDurationHours = Math.max(1, customZoneIds.length * 1.2);
  const customBaseCostKzt = customZoneIds.length * 1200;
  const foodCostKzt = selectedProducts.reduce((sum, pId) => {
    const prod = GASTRONOMY_PRODUCTS.find((p) => p.id === pId);
    return sum + (prod ? prod.priceKzt : 0);
  }, 0);
  const totalCustomCostKzt = customBaseCostKzt + foodCostKzt;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Compass className="w-4 h-4" />
            <span>Интерактивті маршрут құрастырушы</span>
            <span aria-hidden="true">·</span>
            <span>3D Картамен синхрондалған</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Өз маршрутыңды жаса және жоспарла
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Дайын тақырыптық турларды таңдаңыз немесе 5 аймақ пен «Мәртөк дәмі» өнімдерін өзіңіз біріктіріп, жеке бағдарлама құрыңыз.
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => setPlannerMode('ready')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              plannerMode === 'ready'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Дайын турлар
          </button>
          <button
            onClick={() => setPlannerMode('custom')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              plannerMode === 'custom'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Жеке маршрут құру
          </button>
        </div>
      </div>

      {/* Disclaimers Strip */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 text-xs text-slate-500 flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Маршрут уақыты мен бағалары кешеннің шартты модельдік жорамалы ретінде есептелген. 3D картадағы көгілдір сызық жүру траекториясын көрсетеді.
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        {plannerMode === 'ready' ? (
          /* Ready-Made Tours Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOUR_ROUTES.map((route) => {
              const isSelected = activeRouteId === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => onSelectPredefinedRoute(route)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {route.targetAudience}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 tabular-nums">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          ~{route.durationHours} сағат
                        </span>
                        <span>·</span>
                        <span className="text-emerald-700">~{route.baseCostKzt.toLocaleString()} ₸</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{route.title}</h3>
                    <p className="text-xs text-slate-600 mb-3">{route.goal}</p>

                    {/* Visited Zones Tags */}
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Баратын аймақтар:
                      </span>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {route.zoneIds.map((zId) => {
                          const z = PARK_ZONES.find((item) => item.id === zId);
                          return (
                            <span
                              key={zId}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] border border-slate-200"
                            >
                              {z?.shortName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1 text-xs text-slate-600 mb-2">
                      {route.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visitor Experience & Resource Load indicators (Section 11) */}
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400">Келуші тәжірибесі:</span>
                        <span className="font-semibold text-emerald-800">{route.visitorExperienceLevel}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400">Ресурс және су жүктемесі:</span>
                        <span className="font-medium text-sky-800">{route.resourceLoadDesc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Инфрақұрылым: {route.infrastructure.join(', ')}
                    </span>
                    <button
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Таңдалды ✓' : 'Таңдау'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Route Builder */
          <div className="space-y-6">
            {/* Step 1: Pick Zones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  1. Кешеннің аймақтарын таңдаңыз ({customZoneIds.length}/5 таңдалды)
                </h3>
                {customZoneIds.length > 0 && (
                  <button
                    onClick={onResetCustomRoute}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Тазарту</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {PARK_ZONES.map((zone) => {
                  const isChecked = customZoneIds.includes(zone.id);
                  return (
                    <div
                      key={zone.id}
                      onClick={() => onToggleCustomZone(zone.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              isChecked ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-300'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-0.5">{zone.shortName}</h4>
                        <span className="text-[10px] text-slate-400 block mb-1">
                          {zone.areaHa} гектар
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{zone.tagline}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pick Gastronomy Items */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                2. «Мәртөк дәмі» аймағынан дәм тату және өнімдерді қосу
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Таңдалған өнімдер келушінің жеке сапар құнына қосылады:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {GASTRONOMY_PRODUCTS.map((prod) => {
                  const isProdSelected = selectedProducts.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => onToggleProduct(prod)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isProdSelected
                          ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-orange-700 font-semibold block">
                          {prod.category}
                        </span>
                        <span className="font-semibold text-slate-900">{prod.name}</span>
                        <span className="text-slate-500 block text-[11px] tabular-nums">
                          +{prod.priceKzt.toLocaleString()} ₸
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          isProdSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Estimated Summary Card */}
            <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-semibold block mb-0.5">
                  Сіздің авторлық маршрутыңыз:
                </span>
                <div className="text-lg font-bold">
                  {customZoneIds.length === 0 ? (
                    <span className="text-slate-400">Аймақтар әлі таңдалмаған</span>
                  ) : (
                    <span>
                      {customZoneIds
                        .map((zId) => PARK_ZONES.find((z) => z.id === zId)?.shortName)
                        .join(' → ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Болжамды уақыт:</span>
                  <span className="font-bold tabular-nums">~{customDurationHours.toFixed(1)} сағат</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Шартты құны:</span>
                  <span className="font-bold text-emerald-400 text-lg tabular-nums">
                    ~{totalCustomCostKzt.toLocaleString()} ₸
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
