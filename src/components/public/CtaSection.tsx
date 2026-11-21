import React from 'react';
import { Sparkles, ArrowRight, Phone } from 'lucide-react';
import { 
  HouseBookPencilSketch, 
  DoodleStar, 
  HandwrittenNote 
} from './HandDrawnSketches';

interface CtaSectionProps {
  onOpenTuitionForm: () => void;
  whatsappNumber: string;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ 
  onOpenTuitionForm, 
  whatsappNumber 
}) => {
  return (
    <section className="relative overflow-hidden bg-[#063B73] text-white pt-16 pb-20 sm:pt-20 sm:pb-24">
      
      {/* Curved Top Section Transition */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg 
          viewBox="0 0 1200 40" 
          preserveAspectRatio="none" 
          className="relative block w-full h-8 sm:h-10 text-[#d8ebfa] dark:text-[#071A36] fill-current"
        >
          <path d="M0,0 C300,35 900,35 1200,0 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Ambient background glow & decorative sketch accents */}
      <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14,165,233,.18), transparent 70%)" }} />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-400/15 rounded-full pointer-events-none" />

      {/* Decorative stars */}
      <div className="absolute top-12 left-1/4 opacity-40 text-sky-300 pointer-events-none animate-pulse">
        <DoodleStar className="w-5 h-5 text-sky-300" />
      </div>
      <div className="absolute bottom-12 right-1/4 opacity-40 text-sky-300 pointer-events-none">
        <DoodleStar className="w-4 h-4 text-sky-300" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#042850] via-[#063B73] to-[#0a4d94] border-2 border-sky-400/20 shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Text & CTA Button */}
          <div className="max-w-2xl text-center lg:text-left space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-900/60 border border-sky-400/30 text-sky-200 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Direct Home Tuition Coordination</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Looking for a Home Tutor in Ranchi?
            </h2>

            <p className="text-base sm:text-lg text-sky-100 font-normal leading-relaxed max-w-xl">
              Tell us what you need. We'll take care of the matching.
            </p>

            {/* Handwritten Note Tag */}
            <div className="pt-1">
              <span className="font-handwriting text-xl sm:text-2xl font-bold text-sky-200 tracking-wide">
                ~ Demo class arranged at your home before you confirm ~
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3 justify-center lg:justify-start">
              <button
                onClick={onOpenTuitionForm}
                className="px-8 py-4 rounded-xl bg-[#0BA3FF] hover:bg-[#0892e6] text-slate-950 font-black text-base shadow-lg shadow-sky-950/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Find a Home Tutor →</span>
              </button>

              <a
                href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello Ranchi HomeTutor Wala, I want to find a home tutor for my child in Ranchi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call or WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Hand-Drawn House + Book + Pencil Sketch Illustration */}
          <div className="shrink-0 relative flex items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white/5 border border-sky-400/20 md:backdrop-blur-sm shadow-xl flex flex-col items-center text-center group hover:scale-102 transition-transform">
              <HouseBookPencilSketch className="w-32 h-32 sm:w-40 sm:h-40 text-sky-200" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wider text-sky-200">
                1-to-1 Home Tuition
              </span>
              <span className="text-[11px] text-sky-300 font-medium">
                At Your Doorstep in Ranchi
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
