import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Check, 
  PhoneCall, 
  MessageCircle, 
  Sparkles,
  Users
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';
import { 
  SafetyShieldNotebookPencilComposition,
  PaperAirplaneSketch,
  DoodleStar,
  CurvedWaveDivider
} from './HandDrawnSketches';

interface SafetySectionProps {
  settings: WebsiteSettings;
  onOpenTuitionForm: () => void;
  onOpenTutorRegister: () => void;
  onViewFullPolicy?: () => void;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  settings,
  onOpenTuitionForm,
  onOpenTutorRegister,
  onViewFullPolicy,
}) => {
  const whatsappSafetyUrl = getWhatsAppLink(
    settings.whatsappNumber,
    'Hello Ranchi HomeTutor Wala Coordinator, I have an inquiry or feedback regarding tuition safety.'
  );

  const tutorGuidelines = [
    {
      title: 'Identity Verification',
      desc: 'Government ID (Aadhaar/Voter ID) and address proof verification.'
    },
    {
      title: 'Academic & Qualification Checks',
      desc: 'Degrees, marksheets, and teaching backgrounds thoroughly vetted.'
    },
    {
      title: 'Professional Code of Conduct',
      desc: 'Adherence to strict punctuality, respect, and professionalism.'
    },
    {
      title: 'Safe Teaching Environment',
      desc: 'Classes conducted in open, family-accessible study areas.'
    },
    {
      title: 'Direct Coordinator Support',
      desc: 'Dedicated helpline for prompt assistance with any questions.'
    }
  ];

  const parentGuidelines = [
    {
      title: 'Parent Presence Encouraged',
      desc: 'We recommend guardian presence during tuition sessions.'
    },
    {
      title: 'Free In-Person Demo Class',
      desc: 'Meet the teacher and evaluate teaching comfort before commitment.'
    },
    {
      title: 'Strict Privacy Protection',
      desc: 'Contact and address details kept confidential and secure.'
    },
    {
      title: 'Prompt Replacement Guarantee',
      desc: 'Hassle-free tutor adjustment if learning chemistry doesn’t fit.'
    },
    {
      title: 'Continuous Quality Checks',
      desc: 'Regular follow-ups by our Ranchi coordinator on progress.'
    }
  ];

  return (
    <section id="safety-section" className="relative py-16 sm:py-20 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 scroll-mt-20 overflow-hidden">
      
      {/* Background paper grid */}
      <div className="absolute inset-0 bg-notebook-grid opacity-20 pointer-events-none -z-0" />
      <div className="hidden lg:block absolute top-12 right-12 opacity-30 pointer-events-none rotate-12">
        <PaperAirplaneSketch className="w-12 h-10 text-[#087ED1]" />
      </div>

      <div id="safety-policy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with 3D Shield Illustration as in Panel 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          <div className="lg:col-span-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-sky-950/60 border border-[#CDE5F8] dark:border-sky-800 text-[#087ED1] dark:text-sky-300 text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
              <span>🛡️</span>
              <span>Safety & Trust</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B73] dark:text-white tracking-tight leading-tight">
              Safety Policy
            </h2>

            <p className="text-sm sm:text-base text-[#54708F] dark:text-slate-300 mt-3 font-normal max-w-xl leading-relaxed">
              Your child’s safety and privacy are our top priority. We follow strict safety guidelines to ensure a secure and trustworthy home tuition experience in Ranchi.
            </p>
          </div>

          {/* Right: Large Shield + Notebook + Pencil Composition per prompt specification */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div className="relative">
              <SafetyShieldNotebookPencilComposition className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-sm" />
              
              {/* Handwritten Note pointing to shield */}
              <div className="absolute -bottom-1 -left-2 bg-white/95 dark:bg-slate-800/95 px-3.5 py-1.5 rounded-full shadow-md border border-[#CDE5F8] dark:border-slate-700 whitespace-nowrap backdrop-blur-xs">
                <span className="font-handwriting text-sm sm:text-base font-bold text-[#087ED1] dark:text-sky-300">
                  Learning Made Personal ♡
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Two Large Side-by-Side Cards: FOR TUTORS & FOR PARENTS & STUDENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          
          {/* Card 1: FOR TUTORS (Green theme) */}
          <div className="p-7 sm:p-8 rounded-[24px] bg-[#F4FAFF] dark:bg-slate-800/90 border border-[#CDE5F8] dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative">
            
            <div>
              {/* Card Header with Green User Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2EEF8] dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#18A957] flex items-center justify-center shadow-2xs">
                    <UserCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#18A957] block">
                      Vetted Educators
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#063B73] dark:text-white">
                      For Tutors
                    </h3>
                  </div>
                </div>

                <span className="font-handwriting text-sm font-bold text-[#18A957]">
                  Verified & Trusted ♡
                </span>
              </div>

              {/* 5 Guidelines */}
              <div className="space-y-4 mb-6">
                {tutorGuidelines.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#063B73] dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#54708F] dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2EEF8] dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={onOpenTutorRegister}
                className="py-2.5 px-5 rounded-full bg-white hover:bg-emerald-50 text-[#18A957] font-bold text-xs sm:text-sm border border-[#18A957]/40 transition-all cursor-pointer shadow-2xs"
              >
                Join as a Tutor →
              </button>
              <span className="text-[11px] text-[#54708F] dark:text-slate-400 font-medium">
                KYC & ID Verification Required
              </span>
            </div>

          </div>

          {/* Card 2: FOR PARENTS & STUDENTS (Blue theme) */}
          <div className="p-7 sm:p-8 rounded-[24px] bg-[#F4FAFF] dark:bg-slate-800/90 border border-[#CDE5F8] dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative">
            
            <div>
              {/* Card Header with Blue User Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2EEF8] dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF6FF] text-[#087ED1] flex items-center justify-center shadow-2xs">
                    <Users className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#087ED1] block">
                      Student Protection
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#063B73] dark:text-white">
                      For Parents & Students
                    </h3>
                  </div>
                </div>

                <span className="font-handwriting text-sm font-bold text-[#087ED1]">
                  Your Child's Safety Matters ♡
                </span>
              </div>

              {/* 5 Guidelines */}
              <div className="space-y-4 mb-6">
                {parentGuidelines.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#063B73] dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#54708F] dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2EEF8] dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={onOpenTuitionForm}
                className="py-2.5 px-5 rounded-full bg-[#087ED1] hover:bg-[#066bb3] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                Find a Safe Tutor →
              </button>
              <a
                href={whatsappSafetyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#087ED1] font-bold hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Contact Coordinator</span>
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Safety Charter Bar */}
        <div className="p-5 sm:p-6 rounded-[22px] bg-[#F4FAFF] dark:bg-slate-800/60 border border-[#E2EEF8] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 text-[#087ED1] dark:text-sky-300 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#063B73] dark:text-white">
                Read our Complete Transparency & Verification Charter
              </h4>
              <p className="text-xs text-[#54708F] dark:text-slate-400">
                Detailed protocols on KYC verification, parent guidelines, and reporting channels in Ranchi.
              </p>
            </div>
          </div>

          {onViewFullPolicy && (
            <button
              onClick={onViewFullPolicy}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#EAF6FF] text-[#087ED1] dark:text-sky-300 text-xs font-bold border border-[#CDE5F8] dark:border-slate-600 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              Read Full Safety Policy →
            </button>
          )}
        </div>

      </div>

    </section>
  );
};
