import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ThreeParkScene } from './components/ThreeParkScene';
import { Park2DMap } from './components/Park2DMap';
import { ZoneInfoModal } from './components/ZoneInfoModal';
import { SmartHubDashboard } from './components/SmartHubDashboard';
import { RoutePlanner } from './components/RoutePlanner';
import { SmartTech2050 } from './components/SmartTech2050';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { HistorySection } from './components/HistorySection';
import { JuryPresentation } from './components/JuryPresentation';
import { ResearchInfoModal } from './components/ResearchInfoModal';
import { PWAOfflineNotice } from './components/PWAOfflineNotice';
import { PARK_ZONES } from './data/parkData';
import { ZoneId, TourRoute, GastronomyProduct } from './types';
import {
  Compass,
  Sliders,
  Sparkles,
  MapPin,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  Calendar,
  Award,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    '3d' | 'smart_hub' | 'route' | 'tech' | 'compare' | 'history'
  >('3d');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId | null>(null);
  const [isJuryDemoOpen, setIsJuryDemoOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);

  // Route builder states
  const [activeRouteId, setActiveRouteId] = useState<string | null>('family');
  const [customZoneIds, setCustomZoneIds] = useState<ZoneId[]>([
    'ethno',
    'eco',
    'martuk_dami',
  ]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['p1', 'p3']);

  // Handle selecting ready-made route
  const handleSelectPredefinedRoute = (route: TourRoute) => {
    setActiveRouteId(route.id);
    setCustomZoneIds(route.zoneIds);
  };

  // Handle custom zone toggle
  const handleToggleCustomZone = (zoneId: ZoneId) => {
    setActiveRouteId(null);
    setCustomZoneIds((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  };

  // Handle product toggle in «Мәртөк дәмі»
  const handleToggleProduct = (product: GastronomyProduct) => {
    setSelectedProducts((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Currently selected zone object for modal
  const currentZone = selectedZoneId
    ? PARK_ZONES.find((z) => z.id === selectedZoneId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-slate-800 antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenJuryDemo={() => setIsJuryDemoOpen(true)}
        onOpenResearchModal={() => setIsResearchModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-b from-white to-[#f4f7f2] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl">
            {/* Context Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800 mb-3">
              <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>«Менің шағын Отаным» 10-сынып байқауы</span>
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-600">«Ақылды өлке: болашаққа арналған шешім»</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-emerald-300/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>PWA 2050 · 100% Офлайн жұмыс істейді</span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-2 text-balance">
              MARTUK LIFE PARK 2050
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-emerald-900 mb-3">
              Мәртөк: дәстүр, дала және болашақ
            </p>

            {/* Tagline Prose */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              Тарихи мұра, агротуризм, жергілікті өнім және ақылды технология тоғысқан болашақ туристік кеңістік.
              Мәртөк ауылының мәдени-аграрлық әлеуетін ашатын 10 гектар шартты аумақтағы авторлық цифрлық модель.
            </p>

            {/* 3 Primary Action Buttons (as requested) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('3d');
                  const el = document.getElementById('complex-viewport');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 sm:px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-emerald-200" />
                <span>Кешенді 3D форматында зерттеу</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('route');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>Өз маршрутыңды жаса</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('smart_hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>SMART PARK — ақылды басқару</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5 MAIN ZONES MINI SELECTOR STRIP */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Кешеннің 5 функционалды аймағы
              </h2>
              <p className="text-xs text-slate-500">
                Жалпы аумақ: 10 гектар (шартты жобалық аумақ моделі)
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Аймақты таңдап, 3D көріністі жақындатыңыз
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PARK_ZONES.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    if (activeTab !== '3d') setActiveTab('3d');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                        {zone.areaHa} га
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5 line-clamp-1">
                      {zone.shortName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                      {zone.tagline}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-semibold mt-2 block">
                    {isSelected ? 'Ашық' : 'Толығырақ →'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* DYNAMIC VIEWPORT & TAB CONTENT */}
        {activeTab === '3d' && (
          <section id="complex-viewport" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Интерактивті 3D Аумақтық Макет
                </h2>
                <p className="text-xs text-slate-500">
                  Тышқан немесе сенсор арқылы айналдырыңыз, жақындатыңыз және аймақтарды зерттеңіз
                </p>
              </div>

              {/* 3D vs 2D Masterplan Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    viewMode === '3d'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D Макет</span>
                </button>
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    viewMode === '2d'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D Бас жоспар</span>
                </button>
              </div>
            </div>

            {/* Viewport Box */}
            <div className="w-full h-[520px] lg:h-[620px]">
              {viewMode === '3d' ? (
                <ThreeParkScene
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(zId) => setSelectedZoneId(zId)}
                  highlightedRouteZones={customZoneIds}
                />
              ) : (
                <Park2DMap
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(zId) => setSelectedZoneId(zId)}
                  highlightedRouteZones={customZoneIds}
                />
              )}
            </div>
          </section>
        )}

        {activeTab === 'smart_hub' && (
          <section className="space-y-4 animate-fade-in">
            <SmartHubDashboard
              onClose={() => setActiveTab('3d')}
              selectedRouteId={activeRouteId}
              onSelectRoute={(rId) => setActiveRouteId(rId)}
            />
          </section>
        )}

        {activeTab === 'route' && (
          <section className="space-y-4 animate-fade-in">
            <RoutePlanner
              activeRouteId={activeRouteId}
              onSelectPredefinedRoute={handleSelectPredefinedRoute}
              customZoneIds={customZoneIds}
              onToggleCustomZone={handleToggleCustomZone}
              selectedProducts={selectedProducts}
              onToggleProduct={handleToggleProduct}
              onResetCustomRoute={() => {
                setActiveRouteId(null);
                setCustomZoneIds([]);
                setSelectedProducts([]);
              }}
            />
          </section>
        )}

        {activeTab === 'tech' && (
          <section className="space-y-4 animate-fade-in">
            <SmartTech2050 />
          </section>
        )}

        {activeTab === 'compare' && (
          <section className="space-y-4 animate-fade-in">
            <ComparisonMatrix />
          </section>
        )}

        {activeTab === 'history' && (
          <section className="space-y-4 animate-fade-in">
            <HistorySection />
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-lg">
            <div className="text-sm font-bold text-slate-900">
              MARTUK LIFE PARK 2050
            </div>
            <p className="text-xs text-slate-600">
              Мәртөк: дәстүр, дала және болашақ — «Менің шағын Отаным» 10-сынып байқауына арналған авторлық цифрлық жоба.
            </p>
            <p className="text-[11px] text-slate-400">
              Ескерту: Бұл нақты салынып жатқан нысан емес, 2050 жылға арналған оқушының модельдік ұсынысы. Елек өзені маңындағы орналастыру тек жобалық идея ретінде көрсетілген. Нақты жер учаскесі мен су қорғау талаптары кейін қосымша тексеріледі.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsResearchModalOpen(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Ғылыми төлқұжат</span>
            </button>
            <button
              onClick={() => setIsJuryDemoOpen(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Қазыларға таныстыру</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS & OVERLAYS */}
      {/* 1. Zone Detail Modal */}
      {currentZone && (
        <ZoneInfoModal
          zone={currentZone}
          onClose={() => setSelectedZoneId(null)}
          selectedProducts={selectedProducts}
          onToggleProduct={handleToggleProduct}
          onOpenSmartHub={() => setActiveTab('smart_hub')}
          onOpenRoutePlannerWithZone={(zId) => {
            if (!customZoneIds.includes(zId as ZoneId)) {
              setCustomZoneIds([...customZoneIds, zId as ZoneId]);
            }
            setActiveTab('route');
          }}
        />
      )}

      {/* 2. Jury Presentation Modal */}
      <JuryPresentation
        isOpen={isJuryDemoOpen}
        onClose={() => setIsJuryDemoOpen(false)}
        onSelectZone={(zId) => setSelectedZoneId(zId)}
        onSwitchMainTab={(tab) => {
          if (
            tab === '3d' ||
            tab === 'smart_hub' ||
            tab === 'route' ||
            tab === 'tech' ||
            tab === 'compare' ||
            tab === 'history'
          ) {
            setActiveTab(tab);
          } else if (tab === 'research') {
            setIsResearchModalOpen(true);
          }
        }}
      />

      {/* 3. Research Info Modal */}
      <ResearchInfoModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />

      {/* 4. PWA Offline & Status Indicators */}
      <PWAOfflineNotice />
    </div>
  );
}
