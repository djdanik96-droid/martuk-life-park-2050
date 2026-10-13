import React, { useState, useMemo } from 'react';
import { COMPARISON_CRITERIA, PROJECT_ALTERNATIVES } from '../data/parkData';
import { ProjectAlternative } from '../types';
import { Award, Sliders, CheckCircle2, AlertCircle, Info, ChevronRight } from 'lucide-react';

export const ComparisonMatrix: React.FC = () => {
  // User adjustable criterion weights
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    COMPARISON_CRITERIA.forEach((c) => {
      initial[c.id] = c.defaultWeight;
    });
    return initial;
  });

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setWeights((prev) => ({ ...prev, [criterionId]: newWeight }));
  };

  const resetWeights = () => {
    const initial: Record<string, number> = {};
    COMPARISON_CRITERIA.forEach((c) => {
      initial[c.id] = c.defaultWeight;
    });
    setWeights(initial);
  };

  // Compute weighted scores for each alternative
  const scoredAlternatives = useMemo(() => {
    const totalMaxPossible =
      COMPARISON_CRITERIA.reduce((sum, c) => sum + 10 * (weights[c.id] || 1), 0);

    return PROJECT_ALTERNATIVES.map((alt) => {
      let rawScore = 0;
      COMPARISON_CRITERIA.forEach((c) => {
        const val = alt.scores[c.id] || 0;
        const weight = weights[c.id] || 1;
        rawScore += val * weight;
      });

      const percentage = Math.round((rawScore / totalMaxPossible) * 100);

      return {
        ...alt,
        rawScore,
        percentage,
      };
    }).sort((a, b) => b.rawScore - a.rawScore);
  }, [weights]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>Жобалық нұсқаларды көпкритерийлік салыстыру</span>
            <span aria-hidden="true">·</span>
            <span>Салыстырмалы зерттеу әдісі</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Үш жобалық шешімді талдау және рейтингі
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Дәстүрлі демалыс кешені, таза агроферма және Martuk Life Park 2050 тұжырымдамаларын негізгі 7 критерий бойынша салыстырыңыз.
          </p>
        </div>

        <button
          onClick={resetWeights}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Салмақтарды бастапқы қалпына келтіру
        </button>
      </div>

      {/* Methodological Notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Ғылыми ескерту:</strong> Есептелген жалпы балл — авторлық салыстыру әдісі (оқушының зерттеу аппараты), мемлекеттік ресми сараптама қорытындысы емес.
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Top: 3 Resulting Cards with Live Weighted Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoredAlternatives.map((alt, index) => {
            const isWinner = index === 0;
            return (
              <div
                key={alt.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isWinner
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isWinner ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {alt.codeLetter} нұсқасы
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {alt.percentage}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{alt.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{alt.tagline}</p>

                  <div className="text-xs text-slate-700 mb-2">
                    <strong className="block text-slate-900 mb-1">Басты артықшылықтары:</strong>
                    <ul className="space-y-1 text-slate-600">
                      {alt.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Жиынтық балл:</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {alt.rawScore} ұпай
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Weights Adjustment & Detailed Table */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Критерийлер және олардың салмағын өзгерту</span>
            </h3>
            <span className="text-xs text-slate-500">
              Салмақ: 1 (төмен маңызды) — 5 (жоғары маңызды)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-white text-slate-900 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Бағалау критерийі</th>
                  <th className="py-2.5 px-3 text-center">Салмақ (1–5)</th>
                  <th className="py-2.5 px-3 text-center">А: Дәстүрлі</th>
                  <th className="py-2.5 px-3 text-center">Ә: Агроферма</th>
                  <th className="py-2.5 px-3 text-center bg-emerald-50 text-emerald-900">Б: Martuk Life Park</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON_CRITERIA.map((criterion) => {
                  const weight = weights[criterion.id] || 1;
                  return (
                    <tr key={criterion.id} className="hover:bg-white/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <strong className="block text-slate-900">{criterion.name}</strong>
                        <span className="text-[11px] text-slate-500">{criterion.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <select
                          value={weight}
                          onChange={(e) =>
                            handleWeightChange(criterion.id, Number(e.target.value))
                          }
                          aria-label={`${criterion.name} салмағы`}
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold cursor-pointer"
                        >
                          <option value="1">1 (төмен)</option>
                          <option value="2">2</option>
                          <option value="3">3 (орташа)</option>
                          <option value="4">4</option>
                          <option value="5">5 (өте маңызды)</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center tabular-nums font-semibold">
                        {PROJECT_ALTERNATIVES[0].scores[criterion.id]} / 10
                      </td>
                      <td className="py-2.5 px-3 text-center tabular-nums font-semibold">
                        {PROJECT_ALTERNATIVES[1].scores[criterion.id]} / 10
                      </td>
                      <td className="py-2.5 px-3 text-center tabular-nums font-bold bg-emerald-50/60 text-emerald-900">
                        {PROJECT_ALTERNATIVES[2].scores[criterion.id]} / 10
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Formula summary */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
            <strong>Есептеу формуласы:</strong>{' '}
            <code className="text-emerald-800">
              Жиынтық балл = Σ (Критерий балы × Таңдалған салмақ)
            </code>
            <p className="font-sans text-[11px] text-slate-500 mt-1">
              Бұл салыстыру «Martuk Life Park 2050» тұжырымдамасының дәстүр мен технологияны ұштастыруда кешенді артықшылыққа ие екенін дәйектейді.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
