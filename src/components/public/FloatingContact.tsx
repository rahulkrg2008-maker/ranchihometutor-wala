import React from 'react';
import { MessageCircle, Sparkles, Moon, Sun } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';

interface FloatingContactProps {
  settings: WebsiteSettings;
  onOpenTuitionForm?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ 
  settings,
  onOpenTuitionForm,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    'Hello RanchiHomeTutor Wala, I am looking for home tuition coordination support in Ranchi.'
  );

  return (
    <aside aria-label="Quick contact and preferences" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Night Mode Icon: placed cleanly ABOVE WhatsApp icon per user directive */}
      {onToggleDarkMode && (
        <button
          onClick={onToggleDarkMode}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 dark:bg-[#071E3A]/95 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 text-[#063B73] dark:text-amber-300 rounded-full shadow-lg shadow-sky-950/15 border border-[#CDE5F8] dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer md:backdrop-blur-md group"
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-[#063B73] group-hover:-rotate-12 transition-transform" />
          )}
        </button>
      )}

      {/* Action Row: Find a Home Tutor & WhatsApp Floating Button as shown in screenshot */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onOpenTuitionForm && (
          <button
            onClick={onOpenTuitionForm}
            className="px-5 py-3 bg-[#087ED1] hover:bg-[#066bb3] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-sky-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Find a Home Tutor"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Find a Home Tutor</span>
          </button>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-full shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0"
          title={`Chat on WhatsApp (${settings.whatsappNumber})`}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white fill-current" />
        </a>
      </div>
    </aside>
  );
};

