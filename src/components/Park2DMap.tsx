import React from 'react';
import { PARK_ZONES } from '../data/parkData';
import { ZoneId } from '../types';

interface Park2DMapProps {
  selectedZoneId: ZoneId | null;
  onSelectZone: (zoneId: ZoneId) => void;
  highlightedRouteZones?: ZoneId[];
}

export const Park2DMap: React.FC<Park2DMapProps> = ({
  selectedZoneId,
  onSelectZone,
  highlightedRouteZones = [],
}) => {
  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-emerald-950/5 border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Кешеннің 2D Бас Жоспары (Мастер-план)
          </h3>
          <p className="text-xs text-slate-500">
            Шартты жобалық аумақ: 10 гектар · 5 функционалды аймақ
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
          <span>Елек өзені маңындағы орналастыру тек жобалық идея ретінде көрсетілген</span>
        </div>
      </div>

      {/* SVG Interactive Architectural Map */}
      <div className="relative flex-1 w-full flex items-center justify-center py-2">
        <svg
          viewBox="0 0 800 500"
          className="w-full max-h-[460px] rounded-xl bg-gradient-to-b from-[#e8efe2] to-[#dfebd7] shadow-inner border border-slate-300"
        >
          {/* River course (Top / North buffer) */}
          <path
            d="M 20 40 Q 250 80 400 35 T 780 45"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="18"
            strokeLinecap="round"
            className="opacity-70"
          />
          <path
            d="M 20 40 Q 250 80 400 35 T 780 45"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text x="400" y="24" textAnchor="middle" className="text-[11px] fill-sky-800 font-medium">
            Елек өзенінің қорғау алабы (құрылыс салынбайтын буферлік белдеу)
          </text>

          {/* Interconnecting pathways */}
          <line x1="400" y1="260" x2="220" y2="150" stroke="#d5c7b0" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="260" x2="580" y2="150" stroke="#d5c7b0" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="260" x2="580" y2="380" stroke="#d5c7b0" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="260" x2="220" y2="380" stroke="#d5c7b0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="400" cy="260" r="48" fill="#e2d9cb" stroke="#cbd5e1" strokeWidth="3" />

          {/* If route highlighted, draw active path */}
          {highlightedRouteZones.length > 1 && (
            <path
              d={highlightedRouteZones
                .map((zId, i) => {
                  const z = PARK_ZONES.find((item) => item.id === zId);
                  if (!z) return '';
                  let cx = 400;
                  let cy = 260;
                  if (z.id === 'ethno') {
                    cx = 220;
                    cy = 150;
                  } else if (z.id === 'agro') {
                    cx = 580;
                    cy = 150;
                  } else if (z.id === 'martuk_dami') {
                    cx = 580;
                    cy = 380;
                  } else if (z.id === 'eco') {
                    cx = 220;
                    cy = 380;
                  }
                  return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`;
                })
                .join(' ')}
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeDasharray="8 4"
            />
          )}

          {/* Zone 1: Ethno village (Top-Left) */}
          <g
            onClick={() => onSelectZone('ethno')}
            className="cursor-pointer group"
          >
            <circle
              cx="220"
              cy="150"
              r="76"
              fill="#D4A373"
              fillOpacity={selectedZoneId === 'ethno' ? 0.95 : 0.75}
              stroke={selectedZoneId === 'ethno' ? '#78350f' : '#b45309'}
              strokeWidth={selectedZoneId === 'ethno' ? 3 : 1.5}
              className="transition-all hover:fill-opacity-90"
            />
            {/* Small yurts icons */}
            <circle cx="190" cy="140" r="14" fill="#fafaf9" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="240" cy="130" r="12" fill="#fafaf9" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="225" cy="175" r="11" fill="#fafaf9" stroke="#78350f" strokeWidth="1.5" />
            <text x="220" y="112" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">
              Этноауыл
            </text>
            <text x="220" y="196" textAnchor="middle" className="text-[11px] font-medium fill-slate-800">
              2.0 гектар
            </text>
          </g>

          {/* Zone 2: Agro farm (Top-Right) */}
          <g
            onClick={() => onSelectZone('agro')}
            className="cursor-pointer group"
          >
            <rect
              x="500"
              y="74"
              width="160"
              height="150"
              rx="18"
              fill="#588157"
              fillOpacity={selectedZoneId === 'agro' ? 0.95 : 0.75}
              stroke={selectedZoneId === 'agro' ? '#14532d' : '#166534'}
              strokeWidth={selectedZoneId === 'agro' ? 3 : 1.5}
              className="transition-all hover:fill-opacity-90"
            />
            {/* Greenhouse symbol */}
            <rect x="520" y="115" width="46" height="26" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
            {/* Garden rows */}
            <line x1="580" y1="120" x2="640" y2="120" stroke="#fef08a" strokeWidth="3" />
            <line x1="580" y1="130" x2="640" y2="130" stroke="#fef08a" strokeWidth="3" />
            <line x1="580" y1="140" x2="640" y2="140" stroke="#fef08a" strokeWidth="3" />
            <text x="580" y="98" textAnchor="middle" className="text-[13px] font-bold fill-white">
              Агроферма
            </text>
            <text x="580" y="180" textAnchor="middle" className="text-[11px] font-medium fill-emerald-100">
              3.0 гектар
            </text>
          </g>

          {/* Zone 3: Martuk Dami (Bottom-Right) */}
          <g
            onClick={() => onSelectZone('martuk_dami')}
            className="cursor-pointer group"
          >
            <circle
              cx="580"
              cy="380"
              r="68"
              fill="#E07A5F"
              fillOpacity={selectedZoneId === 'martuk_dami' ? 0.95 : 0.75}
              stroke={selectedZoneId === 'martuk_dami' ? '#7c2d12' : '#9a3412'}
              strokeWidth={selectedZoneId === 'martuk_dami' ? 3 : 1.5}
              className="transition-all hover:fill-opacity-90"
            />
            {/* Market stalls symbols */}
            <rect x="545" y="360" width="22" height="14" rx="2" fill="#fed7aa" stroke="#7c2d12" strokeWidth="1" />
            <rect x="590" y="360" width="22" height="14" rx="2" fill="#fed7aa" stroke="#7c2d12" strokeWidth="1" />
            <circle cx="580" cy="395" r="10" fill="#fff" stroke="#7c2d12" strokeWidth="1" />
            <text x="580" y="342" textAnchor="middle" className="text-[13px] font-bold fill-white">
              «Мәртөк дәмі»
            </text>
            <text x="580" y="426" textAnchor="middle" className="text-[11px] font-medium fill-orange-100">
              1.0 гектар
            </text>
          </g>

          {/* Zone 4: Eco recreation (Bottom-Left) */}
          <g
            onClick={() => onSelectZone('eco')}
            className="cursor-pointer group"
          >
            <circle
              cx="220"
              cy="380"
              r="76"
              fill="#81B29A"
              fillOpacity={selectedZoneId === 'eco' ? 0.95 : 0.75}
              stroke={selectedZoneId === 'eco' ? '#134e4a' : '#115e59'}
              strokeWidth={selectedZoneId === 'eco' ? 3 : 1.5}
              className="transition-all hover:fill-opacity-90"
            />
            {/* Gazebo & trees */}
            <circle cx="200" cy="375" r="12" fill="#dcfce7" stroke="#134e4a" strokeWidth="1.5" />
            <circle cx="240" cy="365" r="10" fill="#dcfce7" stroke="#134e4a" strokeWidth="1.5" />
            <path d="M 180 395 Q 220 410 260 395" fill="none" stroke="#fde047" strokeWidth="3" />
            <text x="220" y="340" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">
              Эко-демалыс
            </text>
            <text x="220" y="428" textAnchor="middle" className="text-[11px] font-medium fill-slate-800">
              2.5 гектар
            </text>
          </g>

          {/* Zone 5: Smart Hub (Center) */}
          <g
            onClick={() => onSelectZone('smart_hub')}
            className="cursor-pointer group"
          >
            <circle
              cx="400"
              cy="260"
              r="44"
              fill="#3D5A80"
              fillOpacity={selectedZoneId === 'smart_hub' ? 0.95 : 0.8}
              stroke={selectedZoneId === 'smart_hub' ? '#082f49' : '#0c4a6e'}
              strokeWidth={selectedZoneId === 'smart_hub' ? 3 : 1.5}
              className="transition-all hover:fill-opacity-90"
            />
            {/* Center hub icon */}
            <polygon points="400,234 422,248 422,272 400,286 378,272 378,248" fill="#bae6fd" stroke="#0369a1" strokeWidth="1" />
            <text x="400" y="222" textAnchor="middle" className="text-[13px] font-bold fill-sky-950">
              Smart Hub
            </text>
            <text x="400" y="306" textAnchor="middle" className="text-[11px] font-medium fill-white">
              1.5 гектар
            </text>
          </g>
        </svg>
      </div>

      {/* Legend strip */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-200 text-xs">
        {PARK_ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
              selectedZoneId === zone.id ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
            <span>{zone.shortName}</span>
            <span className="text-[10px] opacity-75">({zone.areaHa} га)</span>
          </button>
        ))}
      </div>
    </div>
  );
};
