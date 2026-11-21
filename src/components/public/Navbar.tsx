import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  MessageCircle, 
  Menu, 
  X, 
  Sparkles, 
  GraduationCap,
  Sun,
  Moon,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Home,
  ShieldCheck,
  Phone,
  Info,
  Layers
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';
import { LOGO_IMG } from '../../assets/images';

interface NavbarProps {
  settings: WebsiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTuitionForm: () => void;
  onOpenTutorRegister: () => void;
  onOpenAdminLogin?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenTuitionForm,
  onOpenTutorRegister,
  onOpenAdminLogin,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on clicking outside or pressing Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menuEl = document.getElementById('main-nav-dropdown');
      const btnEl = document.getElementById('nav-hamburger-btn');
      if (menuEl && !menuEl.contains(target) && btnEl && !btnEl.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', targetId: 'hero-section' },
    { id: 'how-it-works', label: 'How It Works', targetId: 'how-it-works-section' },
    { id: 'classes', label: 'Classes & Subjects', targetId: 'services-section' },
    { id: 'safety', label: 'Safety', targetId: 'safety-section' },
    { id: 'about', label: 'About', targetId: 'why-choose-us' },
    { id: 'contact', label: 'Contact', targetId: 'contact-section' },
  ];

  const handleNavClick = (id: string, targetId: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const directWhatsAppUrl = getWhatsAppLink(
    settings.whatsappNumber,
    'Hello Ranchi HomeTutor Wala, I want to inquire about home tuition support in Ranchi.'
  );

  return (
    <header className="sticky top-0 z-40 pb-2 transition-colors duration-200">
      
      {/* 1. Top Mini Information Bar (Deep Navy with crisp white/light text as in mockup) */}
      <div className="bg-[#063B73] dark:bg-[#04142B] text-[11px] sm:text-xs text-sky-100 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Location Tag */}
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span className="font-semibold text-white tracking-wide truncate">
              Ranchi, Jharkhand
            </span>
          </div>

          {/* Right: Phone, WhatsApp & Apps Dots */}
          <div className="flex items-center gap-4 shrink-0 text-xs">
            <a
              href={`tel:+91${settings.whatsappNumber}`}
              className="hidden sm:inline-flex items-center gap-1 text-sky-100 hover:text-white transition-colors"
              title="Call Helpline"
            >
              <Phone className="w-3 h-3 text-sky-300" />
              <span>+91 {settings.whatsappNumber}</span>
            </a>

            <span className="hidden sm:inline text-sky-400/60">|</span>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-sky-200 font-semibold transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="max-w-[1216px] mx-3 sm:mx-6 xl:mx-auto mt-3 px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] rounded-[30px] bg-white/90 dark:bg-[#0A203F]/90 md:backdrop-blur-xl border border-white/80 dark:border-sky-800/50 shadow-[0_14px_34px_-12px_rgba(8,126,209,0.45)] flex items-center justify-between gap-4">
        
        {/* Logo: Ranchi HomeTutor Wala + Tagline */}
        <button
          onClick={() => handleNavClick('home', 'hero-section')}
          className="flex items-center gap-3 text-left group cursor-pointer shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-[#EAF6FF] dark:border-slate-700 shadow-2xs bg-white dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 p-1">
            <img
              src={LOGO_IMG}
              alt="Ranchi HomeTutor Wala Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-[#063B73] dark:text-white leading-none">
              Ranchi HomeTutor <span className="text-[#0BA3FF]">Wala</span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#54708F] dark:text-sky-300 tracking-wide mt-1">
              Learn Today, Lead Tomorrow
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links with active underline */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.targetId)}
                className={`relative px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#0BA3FF] font-bold'
                    : 'text-[#12345B] dark:text-slate-200 hover:text-[#0BA3FF] dark:hover:text-sky-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <svg 
                    className="absolute -bottom-1 left-2 right-2 w-[calc(100%-16px)] h-2 text-[#0BA3FF] overflow-visible" 
                    viewBox="0 0 50 8" 
                    fill="none" 
                  >
                    <path 
                      d="M2 5 C15 1.8, 35 1.8, 48 4.5" 
                      stroke="currentColor" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Header Actions: Mobile Hamburger Button (Header CTA & Dark mode relocated per request) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile Hamburger Button */}
          <button
            id="nav-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-[#F4FAFF] dark:bg-slate-800 hover:bg-[#EAF6FF] dark:hover:bg-slate-700 text-[#12345B] dark:text-slate-200 hover:text-[#087ED1] border border-[#E2EEF8] dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#063B73] dark:text-slate-100" />
            ) : (
              <Menu className="w-5 h-5 text-[#063B73] dark:text-slate-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Dropdown Menu with Clean Educational Stationery Style */}
      <nav 
        id="main-nav-dropdown"
        className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } fixed top-[102px] left-0 right-0 w-full bg-white/98 dark:bg-slate-900/98 md:backdrop-blur-md border-b border-[#EAF6FF] dark:border-slate-800 shadow-2xl p-5 flex-col gap-3 z-50 transition-all max-h-[calc(100vh-110px)] overflow-y-auto lg:hidden`}
      >
        {/* Primary Action Buttons Inside Mobile Menu */}
        <div className="flex flex-col gap-2.5 pb-3 border-b border-[#EAF6FF] dark:border-slate-800">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTuitionForm();
            }}
            className="w-full py-3 bg-[#0BA3FF] hover:bg-[#0892e6] text-white font-bold rounded-xl text-sm text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find a Home Tutor</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTutorRegister();
            }}
            className="w-full py-2.5 bg-[#F4FAFF] dark:bg-slate-800 hover:bg-[#EAF6FF] dark:hover:bg-slate-700 text-[#0BA3FF] font-bold rounded-xl text-sm text-center border-2 border-[#0BA3FF]/40 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#0BA3FF]" />
            <span>Become a Tutor</span>
          </button>
        </div>

        {/* Navigation items in mobile menu */}
        <div className="space-y-1 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.targetId)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#12345B] dark:text-slate-200 hover:bg-[#F4FAFF] dark:hover:bg-slate-800 hover:text-[#0BA3FF] transition-all flex items-center justify-between cursor-pointer"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#54708F] dark:text-slate-400" />
            </button>
          ))}
        </div>

        {/* WhatsApp & Coordinator Helpline */}
        <div className="pt-3 border-t border-[#EAF6FF] dark:border-slate-800 flex flex-col gap-2">
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs text-center border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#18A957]" />
            <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
          </a>

          {onOpenAdminLogin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="w-full py-2 text-xs font-semibold text-[#54708F] dark:text-slate-400 hover:text-[#087ED1] text-center"
            >
              Coordinator / Admin Portal
            </button>
          )}
        </div>
      </nav>

      {/* Backdrop for closing dropdown */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-30 lg:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

    </header>
  );
};
