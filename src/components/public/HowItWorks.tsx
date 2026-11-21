import React from 'react';
import { 
  FileText, 
  Search, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  Sliders,
  Headphones
} from 'lucide-react';
import { 
  PencilSketch, 
  NotebookSheetSketch, 
  DoodleStar, 
  HandwrittenNote,
  GradCapBooksIllustration,
  PaperAirplaneSketch,
  CurvedWaveDivider
} from './HandDrawnSketches';

interface HowItWorksProps {
  onOpenTuitionForm: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenTuitionForm }) => {
  const steps = [
    {
      num: '01',
      icon: FileText,
      title: 'Submit Your Requirement',
      description: 'Tell us your child’s class, subjects, location and preferred time in our simple form.',
    },
    {
      num: '02',
      icon: Search,
      title: 'We Find a Suitable Tutor',
      description: 'Our team checks available tutors near your area in Ranchi and matches as per your needs.',
    },
    {
      num: '03',
      icon: Users,
      title: 'Demo Class',
      description: 'Meet the tutor and experience the teaching style through an in-person trial class.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Confirm & Start',
      description: 'If you’re satisfied, we confirm the tutor and begin the regular tuition sessions.',
    },
  ];

  const whyProcessWorks = [
    {
      icon: Clock,
      title: 'Saves Your Time',
      desc: 'No endless searching or calling around'
    },
    {
      icon: CheckCircle,
      title: 'Verified Tutors',
      desc: 'Trusted & background checked teachers'
    },
    {
      icon: Sliders,
      title: 'Flexible Options',
      desc: 'For every class & subject in Ranchi'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      desc: 'Friendly coordination at every step'
    }
  ];

  return (
    <section id="how-it-works-section" className="relative py-16 sm:py-20 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 overflow-hidden">
      
      {/* Background Subtle Educational Notes & Dots */}
      <div className="absolute inset-0 bg-notebook-dots opacity-25 pointer-events-none -z-0" />
      <div className="hidden lg:block absolute top-12 right-12 opacity-30 pointer-events-none rotate-12">
        <PaperAirplaneSketch className="w-12 h-10 text-[#087ED1]" />
      </div>
      <div className="hidden lg:block absolute bottom-12 left-10 opacity-30 pointer-events-none -rotate-12">
        <PencilSketch className="w-10 h-10 text-[#087ED1]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with 3D Illustration on Right as in Panel 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          <div className="lg:col-span-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-[#CDE5F8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
              <span>📘</span>
              <span>How It Works</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B73] dark:text-white tracking-tight leading-tight">
              A Simple Process for Better Learning
            </h2>

            <p className="text-sm sm:text-base text-[#54708F] dark:text-slate-300 mt-3 font-normal max-w-xl leading-relaxed">
              Finding the right tutor is easy. Just follow these 4 simple steps and get your child the best learning support in Ranchi.
            </p>
          </div>

          {/* Right: 3D Graduation Cap on Stacked Books Illustration + Note */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div className="relative">
              <GradCapBooksIllustration className="w-56 h-48 sm:w-64 sm:h-52 drop-shadow-md" />
              
              {/* Handwritten Note pointing to books */}
              <div className="absolute -bottom-2 -left-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md border border-[#CDE5F8] dark:border-slate-700">
                <span className="font-handwriting text-sm sm:text-base font-bold text-[#087ED1] dark:text-sky-300">
                  Small Steps Big Progress ♡
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Elegant Notebook Pages Connected with Hand-drawn Line */}
        <div className="relative mb-14">
          
          {/* Hand-drawn Connecting Dashed Wavy Line across all 4 pages on desktop */}
          <div className="hidden lg:block absolute top-12 left-24 right-24 h-1 pointer-events-none z-0">
            <svg className="w-full h-8 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 0 15 Q 180 -5, 360 15 T 720 15 T 1080 15"
                stroke="#087ED1"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                strokeOpacity="0.45"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div key={idx} className="relative group">
                  
                  {/* Notebook Page Card */}
                  <div className="h-full p-6 sm:p-7 rounded-[22px] bg-white/95 dark:bg-slate-800/95 border border-[#CDE5F8] dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-[#087ED1]/50 hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden bg-notebook-lines">
                    
                    {/* Top Spiral Binder Rings styling */}
                    <div className="absolute top-2.5 left-6 right-6 flex justify-around pointer-events-none">
                      {[0, 1, 2, 3].map((ring) => (
                        <div key={ring} className="w-2.5 h-3.5 rounded-sm bg-[#EAF6FF] dark:bg-slate-700 border border-[#CDE5F8] dark:border-slate-600 shadow-2xs" />
                      ))}
                    </div>

                    {/* Red Margin Line on Left */}
                    <div className="absolute top-0 bottom-0 left-5 w-[1.5px] bg-rose-400/50 pointer-events-none" />

                    {/* Subtle Paper Dog-ear Fold at Bottom-Right */}
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#EAF6FF] dark:bg-slate-700 border-t border-l border-[#CDE5F8] dark:border-slate-600 rounded-tl-lg pointer-events-none" />

                    <div className="pl-3 pt-2">
                      {/* Top Row: Large Blue Number Circle & Line Icon */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-full bg-[#087ED1] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-xs shadow-[#087ED1]/30">
                          {s.num}
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] dark:bg-slate-700/80 text-[#087ED1] dark:text-sky-300 flex items-center justify-center border border-[#D0E7FA] dark:border-slate-600">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[#063B73] dark:text-white mb-2 leading-snug">
                        {s.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 leading-relaxed font-normal">
                        {s.description}
                      </p>
                    </div>

                    {/* Card bottom subtle accent bar */}
                    <div className="pl-3 mt-5 pt-3 border-t border-[#F0F7FD] dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-bold text-[#087ED1] dark:text-sky-400">
                      <span>Step {s.num}</span>
                      <span className="text-[#54708F]/50">•</span>
                      <span className="text-[11px] font-medium text-[#54708F] dark:text-slate-400">Personalized</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* "Why This Process Works?" Block as in Panel 2 */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-slate-800/90 border border-[#CDE5F8] dark:border-slate-700 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            
            {/* Left Title with Shield Icon */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] dark:bg-sky-900/50 text-[#087ED1] flex items-center justify-center border border-[#CDE5F8]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#063B73] dark:text-white leading-tight">
                  Why This Process Works?
                </h3>
                <span className="text-xs text-[#54708F] dark:text-slate-400 font-medium">
                  Designed for parents' peace of mind
                </span>
              </div>
            </div>

            {/* 4 Feature Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1 w-full">
              {whyProcessWorks.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#063B73] dark:text-sky-300">
                    <item.icon className="w-3.5 h-3.5 text-[#087ED1]" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-[#54708F] dark:text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

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
