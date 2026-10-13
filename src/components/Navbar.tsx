import React from 'react';
import { Award, GraduationCap, Menu, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: '3d' | 'smart_hub' | 'route' | 'tech' | 'compare' | 'history';
  onSelectTab: (tab: '3d' | 'smart_hub' | 'route' | 'tech' | 'compare' | 'history') => void;
  onOpenJuryDemo: () => void;
  onOpenResearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenJuryDemo,
  onOpenResearchModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: '3d' | 'smart_hub' | 'route' | 'tech' | 'compare' | 'history'; label: string }[] = [
    { id: '3d', label: '3D Кешен' },
    { id: 'smart_hub', label: 'SMART PARK' },
    { id: 'route', label: 'Маршрут' },
    { id: 'tech', label: '2050 Шешімдері' },
    { id: 'compare', label: 'Салыстыру' },
    { id: 'history', label: 'Өлке тарихы' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark (1 line, single element) */}
        <button
          onClick={() => onSelectTab('3d')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors text-left"
        >
          MARTUK LIFE PARK 2050
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                activeTab === link.id
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onOpenResearchModal}
            className="whitespace-nowrap shrink-0 py-1 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Жоба туралы</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Present to Jury) + PWA Install */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton variant="navbar" />

          <button
            onClick={onOpenJuryDemo}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Қазыларға көрсету</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Навигация мәзірі"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                activeTab === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenResearchModal();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Жоба туралы (Төлқұжат)</span>
          </button>
          <div className="pt-2 px-2">
            <PWAInstallButton variant="banner" />
          </div>
        </div>
      )}
    </header>
  );
};
