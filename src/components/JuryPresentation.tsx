import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  Layers,
  Compass,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { ZoneId } from '../types';

interface JuryPresentationProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZone: (zoneId: ZoneId) => void;
  onSwitchMainTab: (tab: '3d' | 'smart_hub' | 'route' | 'tech' | 'compare' | 'history' | 'research') => void;
}

export const JuryPresentation: React.FC<JuryPresentationProps> = ({
  isOpen,
  onClose,
  onSelectZone,
  onSwitchMainTab,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '1. Жобаның мәселесі мен идеясы',
      tagline: 'Тарихи-өлкетану негізі және зерттеудің өзектілігі',
      description:
        'Құрметті қазылар алқасы! Мәртөк өңірі — Ақтөбе облысының құнарлы аграрлық және тарихи мұрасы бар өлкесі. Жобаның негізгі мәселесі: осы бай мәдени, аграрлық және табиғи мүмкіндіктерді біртұтас кешен арқылы жүйелеп, ауыл кәсіпкерлеріне жаңа мүмкіндік қалыптастыру, ауыл мұрасын келушілерге таныстыру және мұның бәрін экологиялық тұрғыдан жауапты жоспарлау.',
      highlightAction: () => onSwitchMainTab('history'),
      actionLabel: 'Тарих бөлімін ашу',
      keyPoints: [
        '10-сынып оқушысының 2050 жылға арналған авторлық идеясы',
        'Мәртөктегі сүт, нан және егіншілік дәстүрлерін жаңғырту',
        'Тексерілген мұрағаттық және өлкетанулық деректер',
      ],
    },
    {
      step: 2,
      title: '2. Кешеннің 5 аймағы',
      tagline: '10 гектар шартты аумақтағы функционалды үйлесім',
      description:
        'Кешен 10 гектар шартты жобалық аумақтағы 5 функционалды аймақтан тұрады: 1) Этноауыл (2 га) — қазақ киіз үйлері, ұлттық ойындар мен қолөнер; 2) Агроферма (3 га) — заманауи жылыжай, бақша мен мал шаруашылығы; 3) «Мәртөк дәмі» (1 га) — жергілікті тағамдар мен ашық жәрмеңке; 4) Эко-демалыс (2.5 га) — серуен соқпақтары мен табиғи демалыс; 5) Smart Hub (1.5 га) — цифрлық басқару түйіні.',
      highlightAction: () => {
        onSwitchMainTab('3d');
        onSelectZone('ethno');
      },
      actionLabel: '5 аймақты қарау',
      keyPoints: [
        'Бес аймақ бір-бірін логикалық түрде толықтырады',
        'Елек өзенінің маңындағы орналастыру жобалық идея ретінде ескерілген',
        'Әр аймақтың өзіндік сәулеті мен танымдық қызметі бар',
      ],
    },
    {
      step: 3,
      title: '3. 3D кешенмен танысу',
      tagline: 'Интерактивті кеңістіктік модель және еркін камера',
      description:
        'Three.js технологиясында жасалған 3D макет кешенді кез келген ракурстан зерттеуге мүмкіндік береді. Қазылар мен келушілер тышқанмен макетті еркін айналдырып, «Жалпы көрініс», «Жер деңгейінен» немесе кез келген аймаққа тікелей жақындата алады. Аймақты басқанда оның мақсаты, қызметтері мен үлесі туралы толық карточка ашылады.',
      highlightAction: () => {
        onSwitchMainTab('3d');
        onSelectZone('smart_hub');
      },
      actionLabel: '3D Кешенді зерттеу',
      keyPoints: [
        'Киіз үйлер, жылыжай, жәрмеңке, саябақ және Smart Hub жеке 3D нысандар',
        'Жолдар мен соқпақтар кешенді біртұтас кеңістік ретінде байланыстырады',
        'Камераның жұмсақ ауысуы мен ыңғайлы басқару батырмалары',
      ],
    },
    {
      step: 4,
      title: '4. Маршрут таңдау',
      tagline: 'Интерактивті турлар және траекторияның 3D визуализациясы',
      description:
        'Пайдаланушыға 4 дайын тур ұсынылады (Отбасылық, Оқушыларға арналған, Мәдени-тарихи және Бір күндік агротур) немесе ол аймақтар мен «Мәртөк дәмі» өнімдерін өзі таңдап, авторлық маршрут құрады. Маршрут таңдалғанда 3D картада көгілдір қозғалыс траекториясы белгіленіп, сапар уақыты мен шартты бағасы есептеледі.',
      highlightAction: () => onSwitchMainTab('route'),
      actionLabel: 'Маршрут құрастырушыға өту',
      keyPoints: [
        '3D сахнадағы маршрут сызығымен тікелей байланыс',
        '«Мәртөк дәмі» жергілікті табиғи өнімдерінің каталогымен интеграция',
        'Ресурстық жүктеме мен келуші тәжірибесі есепке алынған',
      ],
    },
    {
      step: 5,
      title: '5. SMART PARK есептеу және үш нұсқаны салыстыру',
      tagline: 'Сандық симуляция және ғылыми сараптамалық қорытынды',
      description:
        'Жобаның басты инновациясы — SMART PARK басқару орталығы. Келушілер саны, орташа төлем және эко-шешімдер өзгергенде түсім, шығын, маржа, сондай-ақ су мен электр тұтынуы нақты уақытта қайта есептеледі. 8 критерий бойынша дәстүрлі кешен (А), агроферма (Ә) және біздің Martuk Life Park (Б) салыстырылып, дәстүр мен технология синтезінің артықшылығы дәлелденді.',
      highlightAction: () => onSwitchMainTab('smart_hub'),
      actionLabel: 'SMART PARK симуляциясын көру',
      keyPoints: [
        'Ашық математикалық есептеу формулалары көрсетілген',
        'Критерийлер салмағын реттейтін 8 параметрлік салыстыру матрицасы',
        '«Ақылды өлке: болашаққа арналған шешім» номинациясының толық талабы',
      ],
    },
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span>Қазыларға арналған демонстрациялық режим</span>
                <span aria-hidden="true">·</span>
                <span>5 кезеңді автоматтандырылған таныстырылым</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">
                «MARTUK LIFE PARK 2050» жобасын қорғау
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Тоқтату және жабу"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
          {steps.map((st) => (
            <button
              key={st.step}
              onClick={() => {
                setCurrentStep(st.step);
                st.highlightAction();
              }}
              className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                currentStep === st.step
                  ? 'text-emerald-800 bg-emerald-100/80'
                  : currentStep > st.step
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === st.step
                    ? 'bg-emerald-700 text-white'
                    : currentStep > st.step
                    ? 'bg-slate-300 text-slate-800'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {st.step}
              </span>
              <span className="hidden sm:inline">Кезең {st.step}</span>
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              {current.tagline}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{current.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {current.description}
            </p>
          </div>

          {/* Key presentation bullet points */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Негізгі қорғау тезистері:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {current.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                current.highlightAction();
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <span>Экранда {current.actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors"
          >
            Таныстырылымды тоқтату
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 1}
              onClick={() => {
                const prev = Math.max(1, currentStep - 1);
                setCurrentStep(prev);
                steps[prev - 1].highlightAction();
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Артқа</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => {
                  const next = Math.min(5, currentStep + 1);
                  setCurrentStep(next);
                  steps[next - 1].highlightAction();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Келесі кезең ({currentStep + 1}/5)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Таныстырылымды аяқтау ✓</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
