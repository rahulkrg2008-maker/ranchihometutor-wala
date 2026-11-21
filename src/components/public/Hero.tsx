import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  Search, 
  Star,
  Shield,
  MapPin,
  MonitorPlay,
  UserCheck
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { TUTOR_TEACHING_IMG, LOGO_IMG } from '../../assets/images';
import { 
  GeometryCompass, 
  Protractor, 
  GeometryDivider, 
  DraftingPencil, 
  FountainPen, 
  SetSquareTriangle, 
  DraftingEraser, 
  PencilSharpener, 
  PaperclipItem 
} from './StationeryItems';

interface HeroProps {
  settings: WebsiteSettings;
  onOpenTuitionForm: () => void;
  onOpenTutorRegister: () => void;
}

// Helper components for realistic torn-paper deckle edges
const TornTop: React.FC = () => (
  <svg viewBox="0 0 160 5" preserveAspectRatio="none" className="absolute -top-[4px] left-0 w-full h-[5px] text-white dark:text-slate-800 fill-current pointer-events-none">
    <path d="M0 5 L5 0 L10 5 L15 0 L20 5 L25 0 L30 5 L35 0 L40 5 L45 0 L50 5 L55 0 L60 5 L65 0 L70 5 L75 0 L80 5 L85 0 L90 5 L95 0 L100 5 L105 0 L110 5 L115 0 L120 5 L125 0 L130 5 L135 0 L140 5 L145 0 L150 5 L155 0 L160 5 Z" />
  </svg>
);

const TornBottom: React.FC = () => (
  <svg viewBox="0 0 160 5" preserveAspectRatio="none" className="absolute -bottom-[4px] left-0 w-full h-[5px] text-white dark:text-slate-800 fill-current pointer-events-none">
    <path d="M0 0 L5 5 L10 0 L15 5 L20 0 L25 5 L30 0 L35 5 L40 0 L45 5 L50 0 L55 5 L60 0 L65 5 L70 0 L75 5 L80 0 L85 5 L90 0 L95 5 L100 0 L105 5 L110 0 L115 5 L120 0 L125 5 L130 0 L135 5 L140 0 L145 5 L150 0 L155 5 L160 0 Z" />
  </svg>
);

export const Hero: React.FC<HeroProps> = ({
  onOpenTuitionForm,
  onOpenTutorRegister,
}) => {
  return (
    <section id="hero-section" className="relative overflow-visible pt-4 pb-12 sm:pt-8 sm:pb-16 text-[#063B73] dark:text-slate-100">
      
      {/* 1. Top-Right Handwritten Floating Doodle: "Learn Grow Succeed" with stars & Open Book */}
      <div className="hidden lg:flex absolute top-1 right-10 xl:right-24 items-center gap-3 pointer-events-none select-none z-20 text-[#0BA3FF]">
        {/* Open Book Sketch */}
        <div className="opacity-85 -rotate-12">
          <svg width="42" height="34" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 12 C18 6, 8 6, 4 9 L4 34 C8 31, 18 31, 25 36 C32 31, 42 31, 46 34 L46 9 C42 6, 32 6, 25 12 Z" fill="white" fillOpacity="0.6" />
            <path d="M25 12 L25 36" />
            <path d="M9 16 C15 14, 20 15, 22 17" strokeWidth="1.2" />
            <path d="M9 22 C15 20, 20 21, 22 23" strokeWidth="1.2" />
            <path d="M28 17 C30 15, 35 14, 41 16" strokeWidth="1.2" />
            <path d="M28 23 C30 21, 35 20, 41 22" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-handwriting text-xl xl:text-2xl font-bold tracking-wide -rotate-6">
            Learn Grow Succeed
          </span>
          {/* Subtle curved underline under the doodle */}
          <svg width="110" height="12" viewBox="0 0 110 12" fill="none" className="-mt-1 -rotate-6">
            <path d="M5 8 C35 2, 75 3, 105 8" stroke="#0BA3FF" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Floating Outline Stars */}
        <div className="flex flex-col gap-1 -mt-3">
          <svg className="w-5 h-5 text-[#0BA3FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" strokeLinejoin="round" />
          </svg>
          <svg className="w-3.5 h-3.5 ml-2 text-[#0BA3FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Hero Grid: Left Content + Right Photo Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Eyebrow, Title, Description, Buttons, 4 Badges */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6 text-left relative">
            
            {/* 1. Eyebrow: "Better Learning Brighter Future ⟶" + Grad Cap Sketch & Stars */}
            <div className="flex items-center gap-3">
              <span className="font-handwriting text-xl sm:text-2xl font-bold text-[#0BA3FF] tracking-wide">
                Better Learning &nbsp;Brighter Future &nbsp;⟶
              </span>

              {/* Hand-drawn Graduation Cap Doodle */}
              <div className="flex items-center gap-1 text-[#0BA3FF]">
                <svg className="w-9 h-9 -rotate-6" viewBox="0 0 60 45" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {/* Cap diamond */}
                  <polygon points="30,4 56,16 30,28 4,16" fill="white" fillOpacity="0.7" />
                  {/* Skull cap base */}
                  <path d="M14 21 L14 32 C14 38, 46 38, 46 32 L46 21" fill="white" fillOpacity="0.5" />
                  {/* Tassel */}
                  <path d="M50 19 L54 34" strokeWidth="2" />
                  <circle cx="54" cy="35" r="2.5" fill="currentColor" />
                </svg>
                {/* Outline Star beside cap */}
                <svg className="w-4 h-4 text-[#0BA3FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </div>
            </div>

            {/* 2. Main Heading: "Find the Right Home Tutor in Ranchi" */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#063B73] dark:text-white leading-[1.12]">
                Find the Right <br />
                <span className="text-[#0BA3FF] relative inline-block mt-1">
                  Home Tutor in Ranchi
                  {/* Authentic hand-drawn brushstroke/highlighter underline in #0BA3FF */}
                  <svg 
                    className="absolute -bottom-3 sm:-bottom-3.5 left-0 w-full h-4 sm:h-5 text-[#0BA3FF] overflow-visible pointer-events-none select-none" 
                    viewBox="0 0 280 18" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Soft glowing highlighter stroke layer behind */}
                    <path 
                      d="M 4 12 C 55 5, 145 4, 276 9" 
                      stroke="#0BA3FF" 
                      strokeWidth="9" 
                      strokeLinecap="round" 
                      opacity="0.22"
                    />
                    {/* Hand-drawn tapered brushstroke body */}
                    <path 
                      d="M 2 13.5 C 45 6.5, 120 5.2, 205 7.2 C 235 8, 260 8.7, 276 10.2 C 278 10.4, 274 7.2, 265 6.7 C 190 3.2, 110 3.7, 25 9.7 C 12 10.7, 2 13, 2 13.5 Z" 
                      fill="#0BA3FF" 
                    />
                    {/* Secondary crisp pen stroke line */}
                    <path 
                      d="M 12 14.5 C 75 9, 175 8, 268 11.5" 
                      stroke="#0BA3FF" 
                      strokeWidth="2.8" 
                      strokeLinecap="round" 
                    />
                    {/* Hand-drawn end ink accent dot */}
                    <circle cx="276" cy="11.2" r="1.6" fill="#0BA3FF" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* 3. Subtitle with selective bolding */}
            <p className="text-sm sm:text-base text-[#4a6b8f] dark:text-sky-100 max-w-xl font-normal leading-relaxed">
              Tell us your child's class, subjects, location and preferred time.{' '}
              <strong className="font-bold text-[#063B73] dark:text-white">We'll find a suitable</strong> nearby tutor and arrange a demo class for you.
            </p>

            {/* 4. Action Buttons: [ 🔍 Find a Home Tutor ➔ ] with Burst Rays & [ 🎓 Become a Tutor ] */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              
              {/* Primary Button with Left Hand-drawn Burst Rays in #0BA3FF */}
              <div className="relative flex items-center">
                {/* Energetic radial rays popping from the left */}
                <div className="absolute -left-6 sm:-left-7 top-1/2 -translate-y-1/2 pointer-events-none text-[#0BA3FF]">
                  <svg className="w-5 h-9" viewBox="0 0 20 36" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <line x1="18" y1="4" x2="3" y2="2" />
                    <line x1="18" y1="13" x2="1" y2="13" />
                    <line x1="18" y1="23" x2="2" y2="25" />
                    <line x1="18" y1="32" x2="5" y2="34" />
                  </svg>
                </div>

                <button
                  onClick={onOpenTuitionForm}
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-[#0BA3FF] hover:bg-[#0892e6] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0BA3FF]/35 hover:scale-102 active:scale-98 transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Find a Home Tutor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Secondary Button: Become a Tutor with #0BA3FF styling */}
              <button
                onClick={onOpenTutorRegister}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-white dark:bg-sky-950/70 hover:bg-[#EAF6FF] dark:hover:bg-sky-900/80 text-[#0BA3FF] font-bold text-sm sm:text-base border-2 border-[#0BA3FF] shadow-xs hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-[#0BA3FF]" />
                <span>Become a Tutor</span>
              </button>

            </div>

            {/* 5. Four Torn-Paper Note Feature Badges in a Row */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                
                {/* Badge 1: Verified Tutors */}
                <div className="relative bg-white/90 dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-sky-700/15 flex flex-col items-start gap-1.5 transition-transform hover:-translate-y-0.5 overflow-hidden">
                  
                  
                  <div className="absolute inset-0 bg-notebook-lines opacity-15 pointer-events-none" />

                  <div className="flex items-center gap-1.5 w-full relative z-10">
                    <span className="w-4 h-4 rounded-full bg-[#18a957] text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                      ✓
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs text-[#063B73] dark:text-slate-100 truncate">
                      Verified Tutors
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-5 text-[#0BA3FF] relative z-10">
                    <Shield className="w-4 h-4 stroke-[2]" />
                    <div className="space-y-1">
                      <div className="w-7 h-0.5 bg-[#0BA3FF]/70 rounded-full" />
                      <div className="w-4 h-0.5 bg-[#0BA3FF]/40 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Badge 2: Nearby Matching */}
                <div className="relative bg-white/90 dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-sky-700/15 flex flex-col items-start gap-1.5 transition-transform hover:-translate-y-0.5 overflow-hidden">
                  
                  
                  <div className="absolute inset-0 bg-notebook-lines opacity-15 pointer-events-none" />

                  <div className="flex items-center gap-1.5 w-full relative z-10">
                    <span className="w-4 h-4 rounded-full bg-[#18a957] text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                      ✓
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs text-[#063B73] dark:text-slate-100 truncate">
                      Nearby Matching
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-5 text-[#0BA3FF] relative z-10">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                    <div className="space-y-1">
                      <div className="w-7 h-0.5 bg-[#0BA3FF]/70 rounded-full" />
                      <div className="w-4 h-0.5 bg-[#0BA3FF]/40 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Badge 3: Demo Class */}
                <div className="relative bg-white/90 dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-sky-700/15 flex flex-col items-start gap-1.5 transition-transform hover:-translate-y-0.5 overflow-hidden">
                  
                  
                  <div className="absolute inset-0 bg-notebook-lines opacity-15 pointer-events-none" />

                  <div className="flex items-center gap-1.5 w-full relative z-10">
                    <span className="w-4 h-4 rounded-full bg-[#18a957] text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                      ✓
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs text-[#063B73] dark:text-slate-100 truncate">
                      Demo Class
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-5 text-[#0BA3FF] relative z-10">
                    <MonitorPlay className="w-4 h-4 stroke-[2]" />
                    <div className="space-y-1">
                      <div className="w-7 h-0.5 bg-[#0BA3FF]/70 rounded-full" />
                      <div className="w-4 h-0.5 bg-[#0BA3FF]/40 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Badge 4: Personal Coordinator */}
                <div className="relative bg-white/90 dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-sky-700/15 flex flex-col items-start gap-1.5 transition-transform hover:-translate-y-0.5 overflow-hidden">
                  
                  
                  <div className="absolute inset-0 bg-notebook-lines opacity-15 pointer-events-none" />

                  <div className="flex items-center gap-1.5 w-full relative z-10">
                    <span className="w-4 h-4 rounded-full bg-[#18a957] text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                      ✓
                    </span>
                    <span className="font-bold text-[11px] sm:text-xs text-[#063B73] dark:text-slate-100 truncate">
                      Personal Coordinator
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-5 text-[#0BA3FF] relative z-10">
                    <UserCheck className="w-4 h-4 stroke-[2]" />
                    <div className="space-y-1">
                      <div className="w-7 h-0.5 bg-[#0BA3FF]/70 rounded-full" />
                      <div className="w-4 h-0.5 bg-[#0BA3FF]/40 rounded-full" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle stationery items in left hero workspace: Protractor & Eraser */}
            <div className="hidden xl:flex items-center gap-6 pt-1 opacity-80 pointer-events-none">
              <Protractor size={150} className="-rotate-6 drop-shadow-sm" />
              <DraftingEraser size={72} className="rotate-12" />
              <PencilSharpener size={48} className="-rotate-12" />
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Layered Notebook Folder, Photo Card, Campus (Compass), Divider, Pencil & Pen */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            
            <div className="relative w-full max-w-[480px]">
              
              {/* 1. CAMPUS (GEOMETRY DRAFTING COMPASS) top right drawing a circular arc onto blueprint paper */}
              <div className="hidden sm:block absolute -top-16 -right-10 z-30 pointer-events-none rotate-12 drop-shadow-lg">
                <GeometryCompass size={150} arc={true} />
              </div>

              {/* Layer 0: Faint Tilted Lined Notebook Paper Sheet Behind Folder */}
              <div 
                className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 rounded-[36px] -rotate-[3deg] -translate-x-2 translate-y-1 shadow-lg shadow-sky-900/10 border border-sky-100 dark:border-slate-700 pointer-events-none overflow-hidden"
                aria-hidden="true"
              >
                {/* Ruled faint blue lines */}
                <div className="absolute inset-0 opacity-20 bg-notebook-lines" />
              </div>

              {/* Layer 1: Tilted Vibrant Royal Blue Folder Backdrop Sheet */}
              <div 
                className="absolute inset-0 bg-[#0BA3FF]/80 dark:bg-[#087ed1]/80 rounded-[36px] rotate-[3.5deg] translate-x-2 translate-y-2 shadow-xl shadow-sky-950/20"
                aria-hidden="true"
              />

              {/* 2. PENCIL: Sharpened Blue Wooden Drafting Pencil with Gold Stamping along the left edge */}
              <div className="absolute -left-6 sm:-left-8 top-16 z-30 pointer-events-none hidden sm:block">
                <DraftingPencil length={200} angle={-8} label="RHTW • 2B" />
              </div>

              {/* 3. DIVIDER: Precision Geometry Divider pinned along the right edge */}
              <div className="hidden lg:block absolute -right-8 top-28 z-30 pointer-events-none rotate-12 drop-shadow-md">
                <GeometryDivider size={120} />
              </div>

              {/* 4. Pinned Sticky Note with Realistic Paperclip at Top-Left of Photo */}
              <div className="absolute -top-7 -left-4 sm:-left-7 z-30 drop-shadow-lg -rotate-[9deg] pointer-events-none select-none">
                {/* Wire Paperclip in #0BA3FF clamping note */}
                <div className="absolute -top-4 right-4 z-40">
                  <PaperclipItem size={42} color="#0BA3FF" />
                </div>

                {/* Sticky Note Body: "Small Steps Big Dreams ♡" */}
                <div className="bg-white/98 text-[#063B73] px-3.5 py-3 rounded-lg shadow-md border border-slate-200 text-center font-handwriting leading-tight">
                  <div className="text-base sm:text-lg font-bold tracking-wide">
                    Small<br />
                    Steps<br />
                    Big<br />
                    Dreams<br />
                    <span className="text-sm text-[#0BA3FF]">♡</span>
                  </div>
                </div>
              </div>

              {/* 5. The Photo Card Frame with Smooth Rounded Corners and Thick White Border */}
              <div className="relative rounded-[30px] sm:rounded-[34px] overflow-hidden border-[5px] sm:border-[6px] border-white shadow-2xl bg-white z-20">
                <img
                  src={TUTOR_TEACHING_IMG}
                  alt="Tutor teaching student at home in Ranchi"
                  referrerPolicy="no-referrer"
                  className="w-full h-[330px] sm:h-[380px] object-cover"
                />

                {/* Soft gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#063B73]/50 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Pill Card Inside the Photo */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 md:backdrop-blur-md border border-white/80 dark:border-slate-700 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0 p-0.5 bg-white">
                      <img src={LOGO_IMG} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-[#063B73] dark:text-white leading-tight">
                        Ranchi HomeTutor Wala
                      </div>
                      <div className="text-[11px] text-[#0BA3FF] font-semibold mt-0.5">
                        1-to-1 Learning in Ranchi
                      </div>
                    </div>
                  </div>

                  {/* 4.9/5 Rating Badge */}
                  <div className="flex items-center gap-1 bg-[#F4FAFF] dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-sky-100 dark:border-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-[#063B73] dark:text-slate-200">4.9/5</span>
                  </div>
                </div>
              </div>

              {/* 6. FOUNTAIN PEN resting at bottom-right corner of photo */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 z-30 pointer-events-none drop-shadow-xl">
                <FountainPen length={180} angle={35} />
              </div>

              {/* 7. Handwritten Note Below the Photo: "Good Education Builds Great Futures" with arrow in #0BA3FF */}
              <div className="hidden sm:flex absolute -bottom-10 left-10 items-center gap-2 pointer-events-none select-none z-20 text-[#0BA3FF]">
                <div className="font-handwriting text-lg sm:text-xl font-bold leading-tight -rotate-3">
                  Good Education<br />Builds Great Futures
                </div>
                {/* Hand-drawn upward curvy arrow with stars */}
                <svg width="45" height="30" viewBox="0 0 45 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="-rotate-12">
                  <path d="M5 22 C18 20, 25 10, 38 6" />
                  <path d="M30 4 L40 6 L36 15" />
                </svg>
                {/* Cute outline star */}
                <svg className="w-3.5 h-3.5 text-[#0BA3FF] -mt-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* DESK STATIONERY ACCENTS (Scoped to Hero Section - Never Fixed) */}
      {/* ======================================================== */}

      {/* 1. Bottom-Left: Open Ruled Workbook with pen sketch */}
      <div className="hidden lg:block absolute -bottom-8 -left-6 z-0 opacity-90 rotate-[-5deg] pointer-events-none drop-shadow-md">
        <svg width="220" height="175" viewBox="0 0 220 175" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left page */}
          <path d="M10 20 C40 18, 80 16, 110 24 L110 160 C80 152, 40 154, 10 160 Z" fill="#ffffff" stroke="#94c5eb" strokeWidth="1.5" />
          {/* Right page */}
          <path d="M110 24 C140 16, 180 18, 210 20 L210 160 C180 154, 140 152, 110 160 Z" fill="#ffffff" stroke="#94c5eb" strokeWidth="1.5" />
          {/* Center binding crease */}
          <path d="M110 24 L110 160" stroke="#0BA3FF" strokeWidth="2" strokeOpacity="0.4" />
          {/* Ruled lines */}
          {[40, 56, 72, 88, 104, 120, 136].map((y) => (
            <React.Fragment key={y}>
              <line x1="25" y1={y} x2="100" y2={y} stroke="#0BA3FF" strokeWidth="1" strokeOpacity="0.25" />
              <line x1="120" y1={y} x2="195" y2={y} stroke="#0BA3FF" strokeWidth="1" strokeOpacity="0.25" />
            </React.Fragment>
          ))}
          {/* Margin line on left */}
          <line x1="28" y1="20" x2="28" y2="160" stroke="#f87171" strokeWidth="1.2" strokeOpacity="0.6" />
          {/* Pen ink sketch */}
          <path d="M35 50 C45 42, 60 52, 70 48" stroke="#0BA3FF" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8" />
          <path d="M35 66 C50 63, 65 67, 85 64" stroke="#0BA3FF" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8" />
          <path d="M130 52 L145 68 L160 52" stroke="#0BA3FF" strokeWidth="1.6" strokeOpacity="0.7" />
        </svg>
      </div>

      {/* 2. Bottom-Right: Open Spiral Wire Notebook with a² + b² = c² in #0BA3FF */}
      <div className="hidden md:block absolute -bottom-5 right-20 lg:right-32 z-0 opacity-95 rotate-[-4deg] pointer-events-none drop-shadow-md">
        <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Page background */}
          <rect x="25" y="10" width="200" height="135" rx="6" fill="#ffffff" stroke="#94c5eb" strokeWidth="1.5" />
          {/* Ruled lines */}
          {[32, 52, 72, 92, 112, 130].map((y) => (
            <line key={y} x1="45" y1={y} x2="215" y2={y} stroke="#0BA3FF" strokeWidth="1" strokeOpacity="0.2" />
          ))}
          {/* Spiral binding rings */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`translate(20, ${20 + i * 15})`}>
              <ellipse cx="6" cy="4" rx="7" ry="3.5" fill="#475569" />
              <ellipse cx="5" cy="3" rx="5" ry="2" fill="#94a3b8" />
            </g>
          ))}
          {/* Handwritten Formula: a² + b² = c² in #0BA3FF */}
          <text 
            x="70" 
            y="65" 
            fill="#0BA3FF" 
            fontFamily="'Caveat', cursive, sans-serif" 
            fontSize="26" 
            fontWeight="bold" 
            transform="rotate(2 70 65)"
          >
            a² + b² = c²
          </text>
          {/* Hand-drawn Star Doodle on notebook */}
          <path 
            d="M175 42 L178 50 L186 51 L180 57 L182 65 L175 61 L168 65 L170 57 L164 51 L172 50 Z" 
            stroke="#0BA3FF" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
        </svg>
      </div>

      {/* 3. 30°-60°-90° SET SQUARE TRIANGLE RULER nestled near bottom desk */}
      <div className="hidden xl:block absolute bottom-2 right-4 z-0 opacity-75 rotate-[14deg] pointer-events-none">
        <SetSquareTriangle size={135} />
      </div>

      {/* 3. Right Edge: Translucent Plastic Measurement Ruler */}
      <div className="hidden xl:block absolute top-1/4 -right-4 z-0 opacity-80 rotate-[18deg] pointer-events-none drop-shadow-sm">
        <svg width="60" height="250" viewBox="0 0 60 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="48" height="230" rx="4" fill="#ffffff" fillOpacity="0.82" stroke="#94c5eb" strokeWidth="1.5" />
          {Array.from({ length: 18 }).map((_, idx) => (
            <g key={idx} transform={`translate(5, ${20 + idx * 12.5})`}>
              <line x1="0" y1="0" x2={idx % 2 === 0 ? "18" : "10"} y2="0" stroke="#0BA3FF" strokeWidth={idx % 2 === 0 ? "1.5" : "1"} />
              {idx % 2 === 0 && (
                <text x="22" y="3" fill="#0BA3FF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  {idx / 2 + 1}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* 4. Bottom-Right Corner: Fresh Green Plant Foliage framing edge */}
      <div className="absolute -bottom-4 -right-4 z-10 pointer-events-none drop-shadow-md">
        <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M180 160 C150 130, 120 100, 100 75" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <path d="M130 115 C110 95, 85 90, 65 80" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 75 C85 55, 90 35, 110 30 C125 45, 120 65, 100 75 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M130 115 C105 110, 100 90, 115 75 C135 85, 140 105, 130 115 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
          <path d="M65 80 C45 70, 50 50, 70 45 C85 60, 80 75, 65 80 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M155 140 C135 130, 138 110, 158 105 C175 120, 170 135, 155 140 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
        </svg>
      </div>

    </section>
  );
};
