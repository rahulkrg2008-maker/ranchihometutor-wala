import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  PlayCircle, 
  Lock, 
  HeartHandshake,
  Check,
  Star,
  Award
} from 'lucide-react';
import { RANCHI_LANDMARK_IMG } from '../../assets/images';
import { 
  OpenBookSketch, 
  RulerSketch, 
  DoodleStar,
  HandwrittenNote,
  CurvedWaveDivider
} from './HandDrawnSketches';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: ShieldCheck,
      title: 'Verified Tutors',
      description: 'Background & qualification verification. Every tutor’s identity and credentials are vetted before assignment.',
      accent: 'text-[#087ED1] bg-[#EAF6FF] border-[#CDE5F8]',
    },
    {
      icon: MapPin,
      title: 'Local Tutor Matching',
      description: 'We find nearby tutors in your area to ensure punctual schedules, zero commute fatigue, and familiarity with your school board.',
      accent: 'text-[#087ED1] bg-[#EAF6FF] border-[#CDE5F8]',
    },
    {
      icon: UserCheck,
      title: 'Personal Coordinator',
      description: 'Dedicated support at every step. Real human coordinators handle schedules, tutor matching, and feedback whenever you need.',
      accent: 'text-[#18A957] bg-emerald-50 border-emerald-100',
    },
    {
      icon: PlayCircle,
      title: 'Demo Class',
      description: 'Try before you confirm. Attend a one-on-one trial demo session in your home to evaluate tutor compatibility firsthand.',
      accent: 'text-[#087ED1] bg-[#EAF6FF] border-[#CDE5F8]',
    },
    {
      icon: Lock,
      title: 'Safe & Secure',
      description: 'Your information is kept strictly private. Student details and home address are only shared after mutual confirmation.',
      accent: 'text-[#18A957] bg-emerald-50 border-emerald-100',
    },
    {
      icon: HeartHandshake,
      title: 'Parent Support',
      description: 'Help whenever you need. Reach out directly via phone or WhatsApp for schedule adjustments, tutor replacements, or progress reviews.',
      accent: 'text-[#6366F1] bg-indigo-50 border-indigo-100',
    },
  ];

  const ranchiLocalities = [
    'Morabadi', 'Bariatu', 'Lalpur', 'Doranda', 'Hinoo', 'Harmu', 
    'Kanke Road', 'Ashok Nagar', 'Ratu Road', 'Kokar', 'Namkum', 'Dhurwa',
    'Chutia', 'Burdwan Compound', 'Kadru', 'Pandra'
  ];

  return (
    <section id="why-choose-us" className="relative py-16 sm:py-24 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 overflow-hidden">
      
      {/* Subtle school paper grid background */}
      <div className="absolute inset-0 bg-notebook-grid opacity-20 pointer-events-none -z-0" />

      {/* Hand-drawn sketches on the edges */}
      <div className="hidden xl:block absolute top-10 right-8 opacity-30 pointer-events-none -rotate-6">
        <OpenBookSketch className="w-14 h-14 text-[#087ED1]" />
      </div>
      <div className="hidden xl:block absolute bottom-16 left-6 opacity-30 pointer-events-none rotate-12">
        <RulerSketch className="w-16 h-8 text-[#087ED1]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4FAFF] dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <DoodleStar className="w-3.5 h-3.5 text-[#087ED1]" />
            <span>Why Ranchi HomeTutor Wala</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B73] dark:text-white tracking-tight">
            Trusted & Convenient
          </h2>

          <p className="text-base sm:text-lg text-[#54708F] dark:text-slate-300 mt-3 font-normal leading-relaxed">
            Reliable home tuition coordination built on trust, transparency, and personal care for your child.
          </p>

          <div className="mt-1">
            <HandwrittenNote className="text-base font-semibold text-[#087ED1]">
              "Safe study environment right at your home"
            </HandwrittenNote>
          </div>
        </div>

        {/* Visual Trust Board: Central Shield Anchor Flanked by Floating Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-center mb-16">
          
          {/* Left Column: 3 Floating Feature Cards */}
          <div className="lg:col-span-4 space-y-5">
            {cards.slice(0, 3).map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-[22px] bg-white/95 dark:bg-slate-800/90 border border-[#CDE5F8] dark:border-slate-700 hover:border-[#087ED1]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Paper Dog-ear Fold at Top-Right */}
                  <div className="absolute top-0 right-0 w-5 h-5 bg-[#EAF6FF] dark:bg-slate-700 border-b border-l border-[#CDE5F8] dark:border-slate-600 rounded-bl-lg pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.accent} shadow-2xs group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4FAFF] dark:bg-slate-700 text-[#087ED1] dark:text-sky-300 border border-[#E2EEF8] dark:border-slate-600">
                        {idx === 0 ? '100% ID Verified' : idx === 1 ? 'Nearby in Ranchi' : 'Dedicated Support'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#063B73] dark:text-white mb-1.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#F0F7FD] dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-[#087ED1] dark:text-sky-300">
                    <Check className="w-3.5 h-3.5 text-[#18A957]" />
                    <span>Guaranteed Coordinator Check</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Anchor: Visual Trust Board with Central Shield & Metrics */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="w-full p-6 sm:p-8 rounded-[30px] bg-gradient-to-b from-white via-[#F4FAFF] to-[#EAF6FF] dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-2 border-[#087ED1]/30 dark:border-sky-500/30 shadow-lg shadow-sky-950/5 relative text-center">
              
              {/* Organic Soft Blue Halo */}
              <div className="w-24 h-24 mx-auto rounded-full bg-[#EAF6FF] dark:bg-sky-950/60 flex items-center justify-center relative mb-4 border border-[#CDE5F8] dark:border-sky-800 shadow-inner">
                {/* Central Shield Icon */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#087ED1] to-[#063B73] text-white flex items-center justify-center shadow-md shadow-[#087ED1]/30">
                  <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
                </div>
                {/* Small floating badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#CDE5F8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Ranchi's Trusted Network</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#063B73] dark:text-white leading-tight">
                Verified Coordinator Trust Board
              </h3>

              <p className="text-xs text-[#54708F] dark:text-slate-300 mt-2 leading-relaxed">
                Every tutor is individually vetted with ID & address proof, ensuring safe study routines in your living room.
              </p>

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-[#D9EFFF] dark:border-slate-700 text-left">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 shadow-2xs">
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-extrabold text-xs text-[#063B73] dark:text-white">4.9 / 5</span>
                  </div>
                  <div className="text-[10px] text-[#54708F] dark:text-slate-400 font-semibold">
                    Parent Satisfaction
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 shadow-2xs">
                  <div className="flex items-center gap-1 text-[#18A957] mb-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span className="font-extrabold text-xs text-[#063B73] dark:text-white">100%</span>
                  </div>
                  <div className="text-[10px] text-[#54708F] dark:text-slate-400 font-semibold">
                    Vetted Educators
                  </div>
                </div>
              </div>

              {/* Handwritten Note Annotation */}
              <div className="mt-4">
                <span className="font-handwriting text-sm sm:text-base font-bold text-[#087ED1] dark:text-sky-300">
                  Learning Made Personal ♡
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: 3 Floating Feature Cards */}
          <div className="lg:col-span-4 space-y-5">
            {cards.slice(3, 6).map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-[22px] bg-white/95 dark:bg-slate-800/90 border border-[#CDE5F8] dark:border-slate-700 hover:border-[#087ED1]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Paper Dog-ear Fold at Top-Right */}
                  <div className="absolute top-0 right-0 w-5 h-5 bg-[#EAF6FF] dark:bg-slate-700 border-b border-l border-[#CDE5F8] dark:border-slate-600 rounded-bl-lg pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.accent} shadow-2xs group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5 stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4FAFF] dark:bg-slate-700 text-[#087ED1] dark:text-sky-300 border border-[#E2EEF8] dark:border-slate-600">
                        {idx === 0 ? 'Trial Class' : idx === 1 ? 'Confidential' : 'Continuous Care'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#063B73] dark:text-white mb-1.5 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#F0F7FD] dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-[#087ED1] dark:text-sky-300">
                    <Check className="w-3.5 h-3.5 text-[#18A957]" />
                    <span>Guaranteed Coordinator Check</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Ranchi Citywide Coverage Card */}
        <div className="rounded-[28px] overflow-hidden border border-[#E2EEF8] dark:border-slate-700 bg-[#F4FAFF] dark:bg-slate-800/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-5 relative h-60 sm:h-72 lg:h-full min-h-[260px] overflow-hidden">
            <img
              src={RANCHI_LANDMARK_IMG}
              alt="Ranchi landmark representing citywide home tutoring"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#063B73]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 p-2.5 px-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 md:backdrop-blur-md text-xs font-bold text-[#063B73] dark:text-sky-200 border border-[#E2EEF8] dark:border-slate-700 shadow-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#087ED1]" />
              <span>Deeply Rooted Across Ranchi</span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FF] dark:bg-sky-950/60 text-[#087ED1] dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
              Local City Coverage
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#063B73] dark:text-white leading-tight">
              Personalized Home Tutors In Every Corner of Ranchi
            </h3>

            <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 leading-relaxed font-normal">
              No matter where you reside in Ranchi, our coordinator network connects your child with an educator living nearby. Punctual routines, no long commutes, and trusted neighborhood presence.
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#063B73] dark:text-slate-300 block mb-2">
                Popular Localities Served:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ranchiLocalities.map((area, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-[#063B73] dark:text-sky-200 border border-[#E2EEF8] dark:border-slate-700 text-xs font-semibold shadow-2xs hover:border-[#087ED1] transition-colors"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Smooth Wave Transition at the bottom */}
      <div className="mt-16">
        <CurvedWaveDivider fillColor="fill-transparent" />
      </div>

    </section>
  );
};
