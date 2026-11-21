import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Compass, 
  Calculator, 
  Award,
  Layers
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { 
  StackedBooksSketch, 
  PencilSketch, 
  RulerSketch, 
  DoodleStar,
  HandwrittenNote,
  CurvedWaveDivider
} from './HandDrawnSketches';

interface ServicesSectionProps {
  services?: ServiceItem[];
  onOpenTuitionForm: () => void;
  onOpenTutorRegister: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenTuitionForm,
  onOpenTutorRegister,
}) => {
  const classStages = [
    {
      stage: 'Classes 1–5',
      tagline: 'All Subjects',
      badge: 'Primary Foundation',
      description: 'Patient, encouraging guidance covering English, Hindi, Mathematics, EVS, and daily homework assistance.',
      highlights: ['Strong Reading & Math Basics', 'Good Study Habits & Homework', 'All School Boards (CBSE/ICSE/JAC)'],
      color: {
        badgeBg: 'bg-[#EAF6FF] dark:bg-sky-950/60',
        badgeText: 'text-[#087ED1] dark:text-sky-300',
        iconBg: 'bg-[#F4FAFF] text-[#087ED1] border-[#CDE5F8]',
        cardBorder: 'hover:border-[#087ED1]/50',
      },
      icon: BookOpen,
    },
    {
      stage: 'Classes 6–8',
      tagline: 'Core Subjects',
      badge: 'Middle School',
      description: 'Strengthening fundamental concepts in Science, Mathematics, English Grammar, and Social Studies to build solid analytical confidence.',
      highlights: ['Conceptual Math & Science', 'Doubt Solving & School Exams', 'Bilingual English/Hindi Support'],
      color: {
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
        badgeText: 'text-[#18A957] dark:text-emerald-300',
        iconBg: 'bg-emerald-50 text-[#18A957] border-emerald-200',
        cardBorder: 'hover:border-emerald-500/40',
      },
      icon: Calculator,
    },
    {
      stage: 'Classes 9–10',
      tagline: 'Core Subjects',
      badge: 'Board Preparation',
      description: 'Targeted coaching for Class 9 & 10 Board examinations with structured chapter tests, NCERT mastery, and previous year paper practice.',
      highlights: ['CBSE, ICSE & JAC Board Focus', 'Physics, Chem, Bio & Advanced Math', 'Time Management & Test Strategy'],
      color: {
        badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
        badgeText: 'text-[#063B73] dark:text-sky-200',
        iconBg: 'bg-blue-50 text-[#063B73] border-blue-200',
        cardBorder: 'hover:border-blue-600/40',
      },
      icon: Compass,
    },
    {
      stage: 'Classes 11–12',
      tagline: 'Subject Specific',
      badge: 'Senior Secondary',
      description: 'Deep subject-matter expertise for Science (PCM/PCB), Commerce, and Arts with competitive test fundamentals (JEE / NEET / CUET).',
      highlights: ['Dedicated Physics, Chem, Maths, Bio', 'Commerce, Accounts & Economics', 'Senior Specialized Educators'],
      color: {
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
        badgeText: 'text-indigo-600 dark:text-indigo-300',
        iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        cardBorder: 'hover:border-indigo-500/40',
      },
      icon: Award,
    },
  ];

  return (
    <section id="services-section" className="relative py-16 sm:py-24 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 overflow-hidden">
      
      {/* Subtle school paper lines background */}
      <div className="absolute inset-0 bg-notebook-lines opacity-25 pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Side Illustration & Handwritten Phrase */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-14">
          
          <div className="text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#CDE5F8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <DoodleStar className="w-3.5 h-3.5 text-[#087ED1]" />
              <span>Classes & Subjects</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B73] dark:text-white tracking-tight">
              Learn for Every Stage
            </h2>

            <p className="text-base sm:text-lg text-[#54708F] dark:text-slate-300 mt-3 font-normal">
              Whether your child is learning their first multiplication tables or preparing for crucial Board examinations, we coordinate the right qualified home tutor in Ranchi.
            </p>
          </div>

          {/* Decorative Right Area with Stacked Books & Handwritten Phrase */}
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-[#E2EEF8] dark:border-slate-700 shadow-sm relative">
            <div className="shrink-0">
              <StackedBooksSketch className="w-16 h-16 sm:w-20 sm:h-20 text-[#087ED1] dark:text-sky-400" />
            </div>

            <div className="border-l border-[#EAF6FF] dark:border-slate-700 pl-4 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#54708F] block">
                Educational Mission
              </span>
              <div className="font-handwriting text-xl sm:text-2xl font-extrabold text-[#063B73] dark:text-sky-300 leading-tight">
                "Right Tutor, <br />
                Right Subject, <br />
                Better Results"
              </div>
            </div>
          </div>

        </div>

        {/* 4 Beautiful Educational Stationery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classStages.map((stage, idx) => {
            const IconComp = stage.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-[22px] bg-white/95 dark:bg-slate-800/95 border border-[#E2EEF8] dark:border-slate-700 shadow-xs hover:shadow-md ${stage.color.cardBorder} hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden pl-8`}
              >
                {/* Textbook Spine Styling on Left Border */}
                <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-b from-[#087ED1] to-[#063B73] opacity-85 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/40 dark:bg-slate-900/40 pointer-events-none" />

                {/* Bookmark ribbon accent in top right */}
                <div className="absolute top-0 right-6 w-3.5 h-5 bg-[#087ED1] opacity-75 rounded-b-sm pointer-events-none" />

                <div>
                  {/* Top Row: Stage Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wide ${stage.color.badgeBg} ${stage.color.badgeText} border border-current/10`}>
                      {stage.badge}
                    </span>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stage.color.iconBg} shadow-2xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stage Title */}
                  <h3 className="text-xl font-extrabold text-[#063B73] dark:text-white leading-tight">
                    {stage.stage}
                  </h3>
                  <div className="text-sm font-bold text-[#087ED1] dark:text-sky-300 mb-3">
                    {stage.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 leading-relaxed font-normal mb-5">
                    {stage.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-[#F0F7FD] dark:border-slate-700/60">
                    {stage.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-semibold text-[#12345B] dark:text-slate-200">
                        <Check className="w-3.5 h-3.5 text-[#18A957] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquire Action Button */}
                <button
                  onClick={onOpenTuitionForm}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F4FAFF] dark:bg-slate-700/80 hover:bg-[#087ED1] text-[#087ED1] hover:text-white dark:text-sky-300 dark:hover:text-white font-bold text-xs sm:text-sm border border-[#CDE5F8] dark:border-slate-600 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                >
                  <span>Inquire for {stage.stage}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-[24px] bg-white dark:bg-slate-800 border-2 border-[#CDE5F8] dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#063B73] dark:text-white">
              Need Tuition for ICSE, CBSE, or JAC Board in Ranchi?
            </h4>
            <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 mt-1">
              We arrange demo classes with experienced subject specialists across all localities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenTuitionForm}
              className="px-6 py-3 bg-[#087ED1] hover:bg-[#066bb3] text-white text-sm font-bold rounded-xl shadow-md shadow-[#087ED1]/25 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              Find a Home Tutor →
            </button>
            <button
              onClick={onOpenTutorRegister}
              className="px-5 py-3 bg-white dark:bg-slate-800 text-[#087ED1] dark:text-sky-300 text-sm font-bold rounded-xl border border-[#CDE5F8] dark:border-slate-700 hover:bg-[#EAF6FF] transition-all cursor-pointer"
            >
              Join as Teacher
            </button>
          </div>
        </div>

      </div>

      {/* Wave Transition at the bottom */}
      <div className="mt-16">
        <CurvedWaveDivider fillColor="fill-transparent" />
      </div>

    </section>
  );
};
