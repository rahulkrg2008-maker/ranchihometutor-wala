import React from 'react';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Mail, 
  Instagram, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap,
  ArrowUp
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';
import { LOGO_IMG } from '../../assets/images';
import { 
  OpenBookSketch, 
  PencilSketch, 
  StackedBooksSketch,
  DoodleStar 
} from './HandDrawnSketches';

interface FooterProps {
  settings: WebsiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTuitionForm: () => void;
  onOpenTutorRegister: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenTuitionForm,
  onOpenTutorRegister,
  onOpenAdminLogin,
}) => {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    'Hello Ranchi HomeTutor Wala, I want to inquire about home tuition support in Ranchi.'
  );

  const instagramUrl = settings.instagramProfile.startsWith('http')
    ? settings.instagramProfile
    : `https://www.instagram.com/${settings.instagramProfile}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tabId: string, sectionId?: string) => {
    if (sectionId) {
      if (activeTab !== 'home') {
        setActiveTab('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#042448] text-white border-t border-sky-900/60 overflow-hidden">
      
      {/* Subtle education line-art background sketch decorations */}
      <div className="absolute top-8 right-12 opacity-15 pointer-events-none -rotate-12 hidden lg:block">
        <StackedBooksSketch className="w-24 h-24 text-sky-200" />
      </div>
      <div className="absolute bottom-16 left-8 opacity-10 pointer-events-none rotate-45 hidden lg:block">
        <PencilSketch className="w-16 h-16 text-sky-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-sky-800/60">
          
          {/* Col 1: Brand & Tagline & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-sky-400/40 bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={LOGO_IMG}
                  alt="Ranchi HomeTutor Wala Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-tight block">
                  Ranchi HomeTutor <span className="text-[#1496E8] font-black">Wala</span>
                </span>
                <span className="text-xs text-sky-200 font-semibold tracking-wide">
                  Learn Today, Lead Tomorrow
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-100/80 max-w-md leading-relaxed font-normal">
              Trusted, verified, and personalized home tuition coordination across all neighborhoods of Ranchi, Jharkhand. Dedicated 1-to-1 offline teaching from Class 1 to 12.
            </p>

            {/* Social / Helpline Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all flex items-center justify-center shadow-xs"
                title="WhatsApp Coordinator"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:+91${settings.whatsappNumber}`}
                className="w-9 h-9 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-400/30 transition-all flex items-center justify-center shadow-xs"
                title="Call Coordinator"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-400/30 transition-all flex items-center justify-center shadow-xs"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-9 h-9 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-400/30 transition-all flex items-center justify-center shadow-xs"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <DoodleStar className="w-3 h-3 text-sky-300" />
              <span>Quick Links</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-sky-100/90 font-medium">
              <button
                onClick={() => handleNavClick('home', 'hero-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('home', 'how-it-works-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('home', 'services-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Classes & Subjects
              </button>
              <button
                onClick={() => handleNavClick('home', 'safety-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Safety
              </button>
              <button
                onClick={() => handleNavClick('home', 'why-choose-us')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('home', 'contact-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavClick('home', 'contact-section')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                FAQs
              </button>
              <button
                onClick={() => handleNavClick('terms')}
                className="text-left hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenTuitionForm}
                className="text-xs font-bold text-[#1496E8] hover:text-sky-200 text-left cursor-pointer"
              >
                → Find a Home Tutor in Ranchi
              </button>
              <button
                onClick={onOpenTutorRegister}
                className="text-xs font-bold text-[#1496E8] hover:text-sky-200 text-left cursor-pointer"
              >
                → Register as a Teacher
              </button>
            </div>
          </div>

          {/* Col 3: Connect With Us */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-300" />
              <span>Connect With Us</span>
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-sky-100/90 font-medium">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-sky-300">Phone Helpline:</div>
                  <a href={`tel:+91${settings.whatsappNumber}`} className="font-bold hover:underline">
                    +91 {settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-sky-300">WhatsApp Support:</div>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-300 hover:underline">
                    +91 {settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-sky-300">Location:</div>
                  <span className="font-semibold">{settings.officeAddress || `${settings.city}, ${settings.state}, India`}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links, Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200/80 font-normal">
          <div>
            © 2025 Ranchi HomeTutor Wala. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};
