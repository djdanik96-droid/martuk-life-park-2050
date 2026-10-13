import React, { useState } from 'react';
import { ParkZone, GastronomyProduct } from '../types';
import { GASTRONOMY_PRODUCTS } from '../data/parkData';
import {
  X,
  Compass,
  Sparkles,
  Droplets,
  ShieldAlert,
  ShoppingBag,
  Check,
  ChevronRight,
  BookOpen,
  Wheat,
  Trees,
} from 'lucide-react';

interface ZoneInfoModalProps {
  zone: ParkZone;
  onClose: () => void;
  selectedProducts: string[];
  onToggleProduct: (product: GastronomyProduct) => void;
  onOpenSmartHub?: () => void;
  onOpenRoutePlannerWithZone?: (zoneId: string) => void;
}

export const ZoneInfoModal: React.FC<ZoneInfoModalProps> = ({
  zone,
  onClose,
  selectedProducts,
  onToggleProduct,
  onOpenSmartHub,
  onOpenRoutePlannerWithZone,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'interactive'>('overview');
  const [selectedGreenhouseStage, setSelectedGreenhouseStage] = useState<number>(0);
  const [showAgroComparison, setShowAgroComparison] = useState<boolean>(false);

  const greenhouseStages = [
    {
      stage: '1. Тұқым және көшет кезеңі',
      desc: 'Автоматты жылыту және топырақ температурасы 22°C деңгейінде ұсталатын арнайы кассеталарда органикалық тұқымдар өндіріледі.',
    },
    {
      stage: '2. Тамшылатып нәрлендіру',
      desc: 'Тамыр жүйесіне дәл мөлшерленген су мен табиғи органикалық минералдар тамшылатқыштар арқылы беріледі.',
    },
    {
      stage: '3. Биологиялық қорғау',
      desc: 'Химиялық пестицидтерсіз, пайдалы жәндіктер мен биопрепараттар арқылы өсімдіктердің денсаулығы қамтамасыз етіледі.',
    },
    {
      stage: '4. Өнім жинау және жәрмеңкеге жөнелту',
      desc: 'Піскен көкөністер сол күні кешеннің «Мәртөк дәмі» павильонына жас күйінде жеткізіледі.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header with Zone Badge */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
              <span>Шартты аумақ: {zone.areaHa} гектар</span>
              <span aria-hidden="true">·</span>
              <span>10 гектардың {((zone.areaHa / 10) * 100).toFixed(0)}%-ы</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{zone.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{zone.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Жабу"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Жалпы сипаттама
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'features'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Нысандар мен іс-шаралар
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'interactive'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Интерактивті мүмкіндіктер
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                <p>{zone.description}</p>
              </div>

              {/* The 4 Core Evaluative Fields for Jury & Visitors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    1. Аймақтың мақсаты
                  </span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {zone.purpose}
                  </p>
                </div>

                <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80">
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-1">
                    2. Негізгі қызметтері
                  </span>
                  <ul className="text-xs text-sky-950 space-y-1">
                    {zone.coreServices.map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    3. Туристке беретін тәжірибесі
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {zone.visitorExperience}
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                    4. Кешенге қосатын үлесі
                  </span>
                  <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                    {zone.parkContribution}
                  </p>
                </div>
              </div>

              {/* Educational Lore Box */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs mb-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Танымдық-тәрбиелік мазмұн және тарихи негіз</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">{zone.educationalContent}</p>
              </div>

              {/* Specific Zone Alerts / Rules */}
              {zone.id === 'eco' && (
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-200">
                  <div className="flex items-center gap-2 text-sky-900 font-semibold text-xs mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-sky-700" />
                    <span>Елек өзені маңындағы орналастыру және экологиялық қауіпсіздік</span>
                  </div>
                  <p className="text-xs text-sky-950 font-semibold mb-2">
                    «Елек өзені маңындағы орналастыру тек жобалық идея ретінде көрсетілген. Нақты жер учаскесі мен су қорғау талаптары кейін қосымша тексеріледі.»
                  </p>
                  <ul className="text-xs text-sky-950 space-y-1">
                    <li>• <strong>Су қорғау белдеуі:</strong> Өзеннің тікелей жағалауына ғимарат салуға тыйым салынады; тек табиғи жасыл буферлік белдеу сақталады.</li>
                    <li>• <strong>Су тасқыны қаупі:</strong> Барлық туристік соқпақтар көктемгі қар еру кезеңіндегі су деңгейін ескере отырып жобаланады.</li>
                    <li>• <strong>Нөлдік ластану:</strong> Су ағындарына тұрмыстық қалдықтардың түсуін толық болдырмайтын герметикалық жүйелер қарастырылған.</li>
                  </ul>
                </div>
              )}

              {zone.id === 'agro' && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs mb-1.5">
                    <Wheat className="w-4 h-4 text-emerald-700" />
                    <span>Санитариялық және биоқауіпсіздік талаптары</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    Демонстрациялық мал шаруашылығы алаңы ветеринариялық-санитариялық ережелерге сәйкес арнайы қоршалып,
                    келушілердің қауіпсіздігі үшін дезинфекциялық өткелдермен және жануарлармен жауапты қарым-қатынас ережелерімен қамтамасыз етіледі.
                  </p>
                </div>
              )}

              {/* Call to action within zone */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {zone.id === 'smart_hub' && onOpenSmartHub ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSmartHub();
                    }}
                    className="px-4 py-2 bg-sky-700 text-white rounded-lg text-xs font-semibold hover:bg-sky-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>SMART PARK басқару панелін ашу</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onOpenRoutePlannerWithZone) {
                        onClose();
                        onOpenRoutePlannerWithZone(zone.id);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>Осы аймақты маршрутқа қосу</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Негізгі сәулеттік және табиғи нысандар
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {zone.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Келушілерге арналған іс-шаралар мен шеберлік сабақтары
                </h4>
                <div className="space-y-2">
                  {zone.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interactive' && (
            <div className="space-y-4">
              {/* INTERACTIVE 1: Gastronomy catalog if «Мәртөк дәмі» */}
              {zone.id === 'martuk_dami' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        «Мәртөк дәмі» — Жергілікті өнімдер каталогы
                      </h4>
                      <p className="text-xs text-slate-500">
                        Қалаған өнімдерді таңдаңыз; олар маршруттың шартты құнына автоматты қосылады.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GASTRONOMY_PRODUCTS.map((prod) => {
                      const isSelected = selectedProducts.includes(prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => onToggleProduct(prod)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-orange-700 font-semibold">
                                {prod.category}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                ~{prod.priceKzt.toLocaleString()} ₸
                              </span>
                            </div>
                            <h5 className="font-semibold text-slate-800 mb-1">{prod.name}</h5>
                            <p className="text-[11px] text-slate-600 leading-snug">{prod.description}</p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 italic">
                              {prod.localOriginNote}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* INTERACTIVE 2: Greenhouse Stages if Агроферма */}
              {zone.id === 'agro' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-emerald-600" />
                      <span>Ақылды жылыжайда өсімдік өсіру кезеңдері</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                      {greenhouseStages.map((stg, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGreenhouseStage(i)}
                          className={`p-2 rounded-lg text-left text-xs font-medium transition-colors ${
                            selectedGreenhouseStage === i
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {i + 1}-кезең
                        </button>
                      ))}
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                      <strong className="text-emerald-900 block mb-1">
                        {greenhouseStages[selectedGreenhouseStage].stage}
                      </strong>
                      <p>{greenhouseStages[selectedGreenhouseStage].desc}</p>
                    </div>
                  </div>

                  {/* Traditional vs Smart Farm Comparison Toggle */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setShowAgroComparison(!showAgroComparison)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider"
                    >
                      <span>«Дәстүрлі шаруашылық vs Ақылды ферма» салыстыруы</span>
                      <span className="text-emerald-700 lowercase font-medium">
                        {showAgroComparison ? 'жасыру' : 'көру'}
                      </span>
                    </button>

                    {showAgroComparison && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-slate-800 mb-1">Дәстүрлі тәсіл</h5>
                          <ul className="space-y-1 text-slate-600">
                            <li>• Суару жаппай жүргізіледі (булану көп)</li>
                            <li>• Ауа райының құрғақшылығына тәуелді</li>
                            <li>• Қол еңбегі көбірек, шығын жоғары</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <h5 className="font-bold text-emerald-900 mb-1">Ақылды ферма (2050)</h5>
                          <ul className="space-y-1 text-emerald-800">
                            <li>• Тамшылатып суару арқылы суды мақсатты жұмсау</li>
                            <li>• Ылғалдылық пен температура сенсорлары арқылы бақылау</li>
                            <li>• Экологиялық таза, өнімділігі бақыланатын бақша</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INTERACTIVE 3: Kazakh Yurt Architectural Explainer if Этноауыл */}
              {zone.id === 'ethno' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Киіз үйдің құрылымы мен маңызы
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-900 mb-0.5">Кереге</h5>
                      <p className="text-slate-600">
                        Киіз үйдің дөңгелене құрылатын торкөзді ағаш қабырғасы. Бүктеліп-жазылатын ықшам құрылым.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-slate-900 mb-0.5">Уық</h5>
                      <p className="text-slate-600">
                        Кереге басы мен шаңырақты жалғастыратын иілген ағаш сырықтар. Үйдің күмбезін қалыптастырады.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <h5 className="font-bold text-amber-800 mb-0.5">Шаңырақ</h5>
                      <p className="text-slate-600">
                        Күмбездің төбесіндегі шеңбер. Күн сәулесі түсетін, түтін шығатын және бірлік нышаны болып табылатын қасиетті бөлік.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE 4: Eco zone trails & flora if Эко-демалыс */}
              {zone.id === 'eco' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Trees className="w-4 h-4 text-teal-600" />
                    <span>Эко-бағыттар мен демалыс соқпақтары</span>
                  </h4>
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-2">
                    <p>
                      <strong>Табиғи серуен соқпағы:</strong> Аймақ бойымен табиғи тас пен ағаш қиыршықтарынан салынған жаяу жүргінші жолдары өтеді.
                    </p>
                    <p>
                      <strong>Эко-стендтер:</strong> Мәртөк өңірінің далалық өсімдіктері (жусан, боз, көде) және құстары туралы ақпараттық тақталар қойылған.
                    </p>
                  </div>
                </div>
              )}

              {/* INTERACTIVE 5: Smart Hub digital link */}
              {zone.id === 'smart_hub' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    SMART PARK — Цифрлық модельдеу
                  </h4>
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 leading-relaxed">
                    Кешеннің күнделікті келушілер санын өзгертіп, қаржылық түсімді, операциялық шығынды, су және электр қажеттілігін симуляциялау үшін арнайы басқару панелін қолданыңыз.
                  </div>
                  {onOpenSmartHub && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSmartHub();
                      }}
                      className="w-full py-2.5 bg-sky-700 text-white rounded-lg text-xs font-semibold hover:bg-sky-800 transition-colors"
                    >
                      SMART PARK басқару орталығына өту
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>«MARTUK LIFE PARK 2050» авторлық жобасы</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
