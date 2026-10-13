import React, { useState, useMemo } from 'react';
import { SimulationParams, SimulationResults } from '../types';
import { TOUR_ROUTES } from '../data/parkData';
import {
  Sliders,
  DollarSign,
  Droplets,
  Zap,
  Users,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  Cpu,
  BarChart3,
  Percent,
} from 'lucide-react';

interface SmartHubDashboardProps {
  onClose?: () => void;
  selectedRouteId?: string | null;
  onSelectRoute?: (routeId: string) => void;
}

export const SmartHubDashboard: React.FC<SmartHubDashboardProps> = ({
  onClose,
  selectedRouteId = null,
  onSelectRoute,
}) => {
  // State for user adjustable parameters
  const [params, setParams] = useState<SimulationParams>({
    dailyVisitors: 150,
    averageSpendKzt: 4800,
    season: 'summer',
    selectedRouteId: selectedRouteId || 'family',
    activeServicesCount: 4,
    waterIntensityMode: 'normal',
    powerIntensityMode: 'normal',
    solarEnergyActive: true,
    smartLightingActive: true,
    dripIrrigationActive: true,
    qrGuideActive: true,
    smartWasteSortingActive: true,
    visitorSchedulingActive: false,
  });

  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Synchronize when route changes externally
  const handleRouteChange = (rId: string) => {
    setParams((prev) => ({
      ...prev,
      selectedRouteId: rId,
      // route adjusts base spend
      averageSpendKzt:
        rId === 'agro_day'
          ? 7500
          : rId === 'students'
          ? 3500
          : rId === 'cultural'
          ? 4000
          : 5000,
    }));
    if (onSelectRoute) onSelectRoute(rId);
  };

  // Deterministic calculation engine
  const results: SimulationResults = useMemo(() => {
    // 1. Seasonal and route factor
    let seasonMultiplier = 1.0;
    let waterAgroBase = 8000; // liters per day for farm
    let powerBase = 180; // kWh per day

    if (params.season === 'summer') {
      seasonMultiplier = 1.25;
      waterAgroBase = 11500;
      powerBase = 205;
    } else if (params.season === 'spring') {
      seasonMultiplier = 1.05;
      waterAgroBase = 7200;
      powerBase = 175;
    } else if (params.season === 'autumn') {
      seasonMultiplier = 0.95;
      waterAgroBase = 6200;
      powerBase = 190;
    } else if (params.season === 'winter') {
      seasonMultiplier = 0.7;
      waterAgroBase = 3200;
      powerBase = 245;
    }

    // Scheduling peak-smoothing effect
    const schedulingEffect = params.visitorSchedulingActive ? 1.05 : 1.0;
    const dailyVisitors = Math.round(
      params.dailyVisitors * (params.season === 'winter' ? 0.75 : 1.0) * schedulingEffect
    );
    const monthlyVisitors = dailyVisitors * 30;

    // Additional spend from active gastronomy & craft services
    const serviceSpendBonus = Math.max(0, (params.activeServicesCount - 2) * 350);
    const effectiveAverageSpend = params.averageSpendKzt + serviceSpendBonus;

    // 2. Financial Calculations
    // Жалпы түсім = келушілер саны × орташа төлем
    const dailyRevenueKzt = dailyVisitors * effectiveAverageSpend;
    const monthlyRevenueKzt = dailyRevenueKzt * 30;

    // Қызмет көрсету шығыны (consumables, products, tastings per visitor)
    const serviceCostPerVisitor = 650 + params.activeServicesCount * 80;
    const dailyServiceCostKzt = dailyVisitors * serviceCostPerVisitor;
    const monthlyServiceCosts = dailyServiceCostKzt * 30;

    // Fixed base operational expenses: staff (16 staff * 180k) + base maintenance + utilities
    const baseMonthlyFixedCosts = 3600000;

    // Savings from Smart Eco Technologies
    let monthlySavings = 0;
    let powerSavedKwhDaily = 0;
    let waterSavedLitersDaily = 0;

    if (params.solarEnergyActive) {
      monthlySavings += 320000;
      powerSavedKwhDaily += 95;
    }
    if (params.smartLightingActive) {
      monthlySavings += 90000;
      powerSavedKwhDaily += 30;
    }
    if (params.dripIrrigationActive) {
      monthlySavings += 180000;
      waterSavedLitersDaily += 4600;
    }
    if (params.smartWasteSortingActive) {
      monthlySavings += 110000;
    }
    if (params.qrGuideActive) {
      monthlySavings += 140000; // digital guide saves paper print and extra staff burden
    }

    // Жалпы операциялық шығын
    const monthlyOperatingCostKzt = Math.max(
      1800000,
      baseMonthlyFixedCosts + monthlyServiceCosts - monthlySavings
    );
    const dailyOperatingCostKzt = Math.round(monthlyOperatingCostKzt / 30);

    // Есептік операциялық айырма = жалпы түсім − операциялық шығын
    const monthlyOperatingMarginKzt = monthlyRevenueKzt - monthlyOperatingCostKzt;

    // 3. Resource Requirements
    // Су қажеттілігі = келушілер саны × бір келушінің шартты су тұтынуы + шаруашылық қажеттілігі
    let visitorWaterRate = 24; // liters per visitor
    if (params.waterIntensityMode === 'low') visitorWaterRate = 18;
    if (params.waterIntensityMode === 'high') visitorWaterRate = 32;

    const agroWaterAfterDrip = params.dripIrrigationActive
      ? waterAgroBase * 0.6
      : waterAgroBase;
    const dailyWaterNeedLiters = Math.round(dailyVisitors * visitorWaterRate + agroWaterAfterDrip);

    // Электр қажеттілігі = келушілер санына және кешен қызметіне байланысты көрсеткіш
    let powerModeScale = 1.0;
    if (params.powerIntensityMode === 'low') powerModeScale = 0.85;
    if (params.powerIntensityMode === 'high') powerModeScale = 1.25;

    const rawDailyPowerNeed = Math.round(
      (powerBase + dailyVisitors * 0.38 + params.activeServicesCount * 6) * powerModeScale
    );
    const netDailyPowerNeedKwh = Math.max(30, rawDailyPowerNeed - powerSavedKwhDaily);

    const maxVisitorCapacity = 600; // max comfortable 10 ha capacity

    return {
      dailyVisitors,
      monthlyVisitors,
      averageSpendKzt: effectiveAverageSpend,
      dailyRevenueKzt,
      monthlyRevenueKzt,
      dailyServiceCostKzt,
      dailyOperatingCostKzt,
      monthlyOperatingCostKzt,
      monthlyOperatingMarginKzt,
      dailyWaterNeedLiters,
      dailyPowerNeedKwh: netDailyPowerNeedKwh,
      maxVisitorCapacity,
      waterSavedLitersDaily,
      powerSavedKwhDaily,
    };
  }, [params]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Cpu className="w-4 h-4" />
            <span>SMART PARK сандық басқару жүйесі</span>
            <span aria-hidden="true">·</span>
            <span>Мәртөк 2050 модельдік басқару орталығы</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Smart Hub — Экономикалық және ресурстық есептеу панелі
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Кешеннің келушілер ағынын, қызметтер санын, маршрутты және жасыл эко-шешімдерді өзгертіп, қаржы мен ресурстарға әсерін нақты уақытта модельдеңіз.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Жабу
          </button>
        )}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Демонстрациялық жорамал:</strong> Барлық есептер мен көрсеткіштер — 10-сынып оқушысының авторлық модельдік симуляциясы. Бұл ресми бекітілген бизнес-жоспар немесе нақты құрылыс есебі емес.
        </span>
      </div>

      {/* Main Dashboard Layout */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Басқару параметрлері</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">Интерактивті реттеу</span>
          </div>

          {/* 1. Daily Visitors */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">1. Күнделікті келушілер саны:</span>
              <span className="font-bold text-emerald-800 text-sm tabular-nums">
                {params.dailyVisitors} адам/күн
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="550"
              step="10"
              value={params.dailyVisitors}
              onChange={(e) => setParams({ ...params, dailyVisitors: Number(e.target.value) })}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>30 (аз жүктеме)</span>
              <span>250 (орташа)</span>
              <span>550 (максимум)</span>
            </div>
          </div>

          {/* 2. Average spend */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">2. Орташа билет / қызмет құны:</span>
              <span className="font-bold text-emerald-800 text-sm tabular-nums">
                {params.averageSpendKzt.toLocaleString()} ₸
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="10000"
              step="500"
              value={params.averageSpendKzt}
              onChange={(e) => setParams({ ...params, averageSpendKzt: Number(e.target.value) })}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* 3. Route Selection Connection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Таңдалған маршруттың әсері:</span>
            </label>
            <select
              value={params.selectedRouteId || 'family'}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium cursor-pointer"
            >
              {TOUR_ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} (~{r.baseCostKzt.toLocaleString()} ₸)
                </option>
              ))}
            </select>
          </div>

          {/* 4. Number of Active Services */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">4. Қызмет түрлерінің саны («Мәртөк дәмі»):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {params.activeServicesCount} қызмет
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={params.activeServicesCount}
              onChange={(e) => setParams({ ...params, activeServicesCount: Number(e.target.value) })}
              className="w-full accent-slate-800 cursor-pointer"
            />
          </div>

          {/* 5. Resource Consumption Modes */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Су деңгейі:</label>
              <select
                value={params.waterIntensityMode}
                onChange={(e) =>
                  setParams({ ...params, waterIntensityMode: e.target.value as any })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs"
              >
                <option value="low">Үнемді (18 л/адам)</option>
                <option value="normal">Қалыпты (24 л/адам)</option>
                <option value="high">Жоғары (32 л/адам)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Электр деңгейі:</label>
              <select
                value={params.powerIntensityMode}
                onChange={(e) =>
                  setParams({ ...params, powerIntensityMode: e.target.value as any })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs"
              >
                <option value="low">Төмен қуат (-15%)</option>
                <option value="normal">Қалыпты (стандарт)</option>
                <option value="high">Пиктік қуат (+25%)</option>
              </select>
            </div>
          </div>

          {/* 6. Smart Eco Solutions Toggles (directly connected to 2050 techs) */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Эко және цифрлық шешімдерді қосу / өшіру:
            </span>

            <div className="space-y-1.5 text-xs">
              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium">Күн панельдері (жасыл қуат)</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.solarEnergyActive}
                  onChange={(e) => setParams({ ...params, solarEnergyActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span className="font-medium">Тамшылатып суару (суды 40% үнемдеу)</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.dripIrrigationActive}
                  onChange={(e) => setParams({ ...params, dripIrrigationActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="font-medium">Ақылды түнгі жарықтандыру</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.smartLightingActive}
                  onChange={(e) => setParams({ ...params, smartLightingActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">QR</span>
                  <span className="font-medium">QR-аудиогид (цифрлық навигация)</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.qrGuideActive}
                  onChange={(e) => setParams({ ...params, qrGuideActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">♻</span>
                  <span className="font-medium">Қалдықтарды бөлек жинау және компост</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.smartWasteSortingActive}
                  onChange={(e) =>
                    setParams({ ...params, smartWasteSortingActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-medium">Келушілер ағынын цифрлық жоспарлау</span>
                </div>
                <input
                  type="checkbox"
                  checked={params.visitorSchedulingActive}
                  onChange={(e) =>
                    setParams({ ...params, visitorSchedulingActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 10 Evaluative Indicators + Visual Charts (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top 6 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 1. Daily Visitors */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                Бір күндегі келушілер:
              </span>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {results.dailyVisitors.toLocaleString()} <span className="text-xs font-normal text-slate-500">адам</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Сыйымдылық жүктемесі: {((results.dailyVisitors / results.maxVisitorCapacity) * 100).toFixed(0)}%
              </span>
            </div>

            {/* 2. Monthly Visitors */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                Бір айдағы шартты келушілер:
              </span>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {results.monthlyVisitors.toLocaleString()} <span className="text-xs font-normal text-slate-500">адам</span>
              </div>
              <span className="text-[10px] text-slate-400">30 күндік үлгі</span>
            </div>

            {/* 3. Average Spend per visitor */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                Орташа төлем:
              </span>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                ~{results.averageSpendKzt.toLocaleString()} ₸
              </div>
              <span className="text-[10px] text-slate-400">1 келушіге шаққанда</span>
            </div>

            {/* 4. Total Monthly Revenue */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-semibold block mb-0.5">
                Жалпы шартты түсім:
              </span>
              <div className="text-lg font-bold text-emerald-950 tabular-nums">
                ~{results.monthlyRevenueKzt.toLocaleString()} ₸
              </div>
              <span className="text-[10px] text-emerald-700">
                Күніне: ~{results.dailyRevenueKzt.toLocaleString()} ₸
              </span>
            </div>

            {/* 5. Water Need */}
            <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
              <span className="text-[10px] text-sky-800 font-semibold block mb-0.5">
                Су қажеттілігі:
              </span>
              <div className="text-lg font-bold text-sky-950 tabular-nums">
                {results.dailyWaterNeedLiters.toLocaleString()} <span className="text-xs font-normal text-sky-700">л/күн</span>
              </div>
              <span className="text-[10px] text-sky-700">
                {results.waterSavedLitersDaily > 0 ? `-${results.waterSavedLitersDaily.toLocaleString()} л үнемделді` : 'Стандартты суару'}
              </span>
            </div>

            {/* 6. Power Need */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-800 font-semibold block mb-0.5">
                Электр қажеттілігі:
              </span>
              <div className="text-lg font-bold text-amber-950 tabular-nums">
                {results.dailyPowerNeedKwh} <span className="text-xs font-normal text-amber-700">кВт·сағ/күн</span>
              </div>
              <span className="text-[10px] text-amber-700">
                {results.powerSavedKwhDaily > 0 ? `-${results.powerSavedKwhDaily} кВт·сағ жасыл қуат` : 'Желілік қуат'}
              </span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">
                Кешеннің шартты сыйымдылығы (максимум: {results.maxVisitorCapacity} адам/күн):
              </span>
              <span className="font-bold text-emerald-800 tabular-nums">
                {results.dailyVisitors} / {results.maxVisitorCapacity} (
                {((results.dailyVisitors / results.maxVisitorCapacity) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (results.dailyVisitors / results.maxVisitorCapacity) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Full Financial Waterfall: Revenue -> Services -> Operations -> Operating Margin */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Айлық шартты қаржылық баланс (Операциялық айырма)</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">демонстрациялық үлгі</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">1. Жалпы шартты түсім (кіру + турлар + өнімдер):</span>
                <span className="font-bold text-emerald-800 tabular-nums">
                  +{results.monthlyRevenueKzt.toLocaleString()} ₸
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">2. Қызмет көрсету шығыны (өнім, дәм тату, шикізат):</span>
                <span className="font-semibold text-rose-700 tabular-nums">
                  -{(results.dailyServiceCostKzt * 30).toLocaleString()} ₸
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">3. Жалпы операциялық шығын (қызметкерлер, техникалық күтім, коммуналдық):</span>
                <span className="font-semibold text-rose-700 tabular-nums">
                  -{results.monthlyOperatingCostKzt.toLocaleString()} ₸
                </span>
              </div>

              <div className="flex justify-between py-2.5 bg-white px-3 rounded-lg border border-slate-200 font-bold text-sm shadow-2xs">
                <span className="text-slate-900">4. Есептік операциялық айырма (маржа):</span>
                <span
                  className={`tabular-nums ${
                    results.monthlyOperatingMarginKzt >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {results.monthlyOperatingMarginKzt >= 0 ? '+' : ''}
                  {results.monthlyOperatingMarginKzt.toLocaleString()} ₸
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Mathematical Formulas Section */}
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Ашық есептеу формулалары (Математикалық алгоритм)</span>
              </span>
              <span className="text-emerald-700 font-medium lowercase">
                {showFormulaDetails ? 'жасыру' : 'толық көру'}
              </span>
            </button>

            {showFormulaDetails && (
              <div className="mt-3 space-y-2 text-xs text-slate-700 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p>
                  <strong>• Жалпы түсім:</strong>{' '}
                  <code className="text-emerald-800">
                    Келушілер ({results.dailyVisitors}) × Орташа төлем ({results.averageSpendKzt} ₸) = {results.dailyRevenueKzt.toLocaleString()} ₸/күн
                  </code>
                </p>
                <p>
                  <strong>• Операциялық айырма:</strong>{' '}
                  <code className="text-emerald-800">
                    Жалпы түсім ({results.monthlyRevenueKzt.toLocaleString()} ₸) − Операциялық шығын ({results.monthlyOperatingCostKzt.toLocaleString()} ₸) = {results.monthlyOperatingMarginKzt.toLocaleString()} ₸
                  </code>
                </p>
                <p>
                  <strong>• Су қажеттілігі:</strong>{' '}
                  <code className="text-sky-800">
                    Келушілер ({results.dailyVisitors} × {params.waterIntensityMode === 'low' ? 18 : params.waterIntensityMode === 'high' ? 32 : 24} л) + Шаруашылық қажеттілігі = {results.dailyWaterNeedLiters.toLocaleString()} л/күн
                  </code>
                </p>
                <p>
                  <strong>• Электр қажеттілігі:</strong>{' '}
                  <code className="text-amber-800">
                    Базалық жүктеме + Келушілер қуаты − Жасыл күн қуаты ({results.powerSavedKwhDaily} кВт) = {results.dailyPowerNeedKwh} кВт·сағ/күн
                  </code>
                </p>
                <p className="font-sans text-[11px] text-slate-500 mt-2">
                  Көрсеткіштер тұрақты детерминирленген математикалық алгоритмге негізделген: бірдей кіріс деректері әрдайым бірдей дәл нәтиже береді.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
