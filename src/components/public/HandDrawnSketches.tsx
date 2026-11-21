import React from 'react';

// Common sketch props
interface SketchProps {
  className?: string;
  color?: string;
  size?: number;
}

/** Hand-drawn Open Book Sketch */
export const OpenBookSketch: React.FC<SketchProps> = ({ 
  className = "w-12 h-12 text-[#087ED1]", 
}) => (
  <svg 
    viewBox="0 0 100 70" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Left Page Outline with subtle hand-drawn curvature */}
    <path d="M50 20 C40 16, 25 15, 10 18 C9 18.5, 8 48, 8 50 C23 47, 38 48, 50 54 Z" fill="white" fillOpacity="0.85" />
    {/* Right Page Outline */}
    <path d="M50 20 C60 16, 75 15, 90 18 C91 18.5, 92 48, 92 50 C77 47, 62 48, 50 54 Z" fill="white" fillOpacity="0.85" />
    {/* Center Spine Crease */}
    <path d="M50 20 L50 54" strokeWidth="2.5" />
    {/* Book Pages Thickness Edge */}
    <path d="M10 21 L10 53 C25 50, 40 51, 50 56 C60 51, 75 50, 90 53 L90 21" strokeOpacity="0.6" strokeDasharray="1 1" />
    {/* Page text lines (sketch style) */}
    <path d="M16 26 C24 24, 34 24, 42 27" strokeWidth="1.6" strokeOpacity="0.5" />
    <path d="M16 33 C25 31, 35 32, 42 34" strokeWidth="1.6" strokeOpacity="0.5" />
    <path d="M16 40 C24 38, 33 39, 42 41" strokeWidth="1.6" strokeOpacity="0.5" />
    
    <path d="M58 27 C66 24, 76 24, 84 26" strokeWidth="1.6" strokeOpacity="0.5" />
    <path d="M58 34 C65 32, 75 31, 84 33" strokeWidth="1.6" strokeOpacity="0.5" />
    <path d="M58 41 C67 39, 76 38, 84 40" strokeWidth="1.6" strokeOpacity="0.5" />
    {/* Bookmark Ribbon hanging down */}
    <path d="M50 20 Q54 36 52 64 L48 61 L45 64 Q48 38 50 20" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
  </svg>
);

/** Hand-drawn Pencil Sketch */
export const PencilSketch: React.FC<SketchProps> = ({ 
  className = "w-10 h-10 text-[#087ED1]",
}) => (
  <svg 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Main Pencil Body */}
    <g transform="rotate(-35 40 40)">
      {/* Eraser */}
      <path d="M30 10 C30 7, 36 6, 42 6 C48 6, 54 7, 54 10 L54 16 L30 16 Z" fill="white" fillOpacity="0.9" />
      {/* Ferrule (Metal Ring) */}
      <rect x="30" y="16" width="24" height="6" fill="currentColor" fillOpacity="0.15" />
      <path d="M30 19 L54 19" strokeWidth="1.2" />
      {/* Wooden Hex Shaft */}
      <path d="M30 22 L30 56 L54 56 L54 22 Z" fill="white" fillOpacity="0.95" />
      <path d="M38 22 L38 56" strokeWidth="1.4" strokeOpacity="0.5" />
      <path d="M46 22 L46 56" strokeWidth="1.4" strokeOpacity="0.5" />
      {/* Sharpened Cone Tip */}
      <path d="M30 56 L42 74 L54 56 Z" fill="white" fillOpacity="0.9" />
      {/* Graphite Lead Tip */}
      <path d="M38 68 L42 74 L46 68 Z" fill="currentColor" stroke="none" />
    </g>
    {/* Little sketch line behind pencil */}
    <path d="M58 54 C66 60, 72 63, 76 62" strokeWidth="1.8" strokeDasharray="3 3" strokeOpacity="0.7" />
  </svg>
);

/** Hand-drawn Stacked Books Sketch */
export const StackedBooksSketch: React.FC<SketchProps> = ({ 
  className = "w-14 h-14 text-[#087ED1]",
}) => (
  <svg 
    viewBox="0 0 90 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Bottom Book */}
    <path d="M12 62 C26 59, 64 59, 78 62 L78 72 C64 69, 26 69, 12 72 Z" fill="white" fillOpacity="0.9" />
    <path d="M12 62 L12 72" />
    <path d="M78 62 L78 72" />
    <path d="M18 64 L18 70" strokeWidth="1.4" />
    <path d="M22 64 L22 70" strokeWidth="1.4" />

    {/* Middle Book */}
    <path d="M16 46 C30 43, 62 43, 74 46 L74 56 C62 53, 30 53, 16 56 Z" fill="white" fillOpacity="0.9" />
    <path d="M16 46 L16 56" />
    <path d="M74 46 L74 56" />
    <path d="M24 48 L24 54" strokeWidth="1.4" />

    {/* Top Book (slightly tilted) */}
    <g transform="rotate(-3 45 35)">
      <path d="M20 28 C34 25, 60 25, 70 28 L70 38 C60 35, 34 35, 20 38 Z" fill="white" fillOpacity="0.9" />
      <path d="M20 28 L20 38" />
      <path d="M70 28 L70 38" />
      {/* Ribbon bookmark sticking out */}
      <path d="M56 36 Q60 44 58 50 L62 52 L64 47 Q61 41 58 36" fill="currentColor" fillOpacity="0.2" strokeWidth="1.2" />
    </g>
    
    {/* An apple or small graduation element on top */}
    <circle cx="45" cy="18" r="6" fill="white" fillOpacity="0.9" />
    <path d="M45 12 Q48 8 51 9" strokeWidth="1.6" />
    <path d="M47 11 Q51 11 50 14" fill="currentColor" fillOpacity="0.3" strokeWidth="1" />
  </svg>
);

/** Hand-drawn Graduation Cap Sketch */
export const GraduationCapSketch: React.FC<SketchProps> = ({ 
  className = "w-10 h-10 text-[#087ED1]",
}) => (
  <svg 
    viewBox="0 0 80 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Rhombus / Mortarboard Diamond */}
    <path d="M40 10 L72 23 L40 36 L8 23 Z" fill="white" fillOpacity="0.9" />
    {/* Skull cap under diamond */}
    <path d="M22 29 L22 42 C22 47, 58 47, 58 42 L58 29" fill="white" fillOpacity="0.8" />
    {/* Button on top */}
    <circle cx="40" cy="23" r="2.2" fill="currentColor" />
    {/* Tassel cord and fringe */}
    <path d="M40 23 C48 24, 62 27, 65 38 L65 48" strokeWidth="1.8" />
    <path d="M63 48 L67 48 L66 54 L62 54 Z" fill="currentColor" fillOpacity="0.4" strokeWidth="1.2" />
  </svg>
);

/** Hand-drawn Notebook Sheet Sketch */
export const NotebookSheetSketch: React.FC<SketchProps> = ({ 
  className = "w-12 h-14 text-[#087ED1]",
}) => (
  <svg 
    viewBox="0 0 70 85" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Sheet body with bent corner */}
    <path d="M12 10 L50 10 L62 22 L62 76 L12 76 Z" fill="white" fillOpacity="0.95" />
    {/* Folded corner triangle */}
    <path d="M50 10 L50 22 L62 22 Z" fill="currentColor" fillOpacity="0.1" />
    {/* Spiral punch holes on left */}
    <circle cx="17" cy="18" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    <circle cx="17" cy="28" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    <circle cx="17" cy="38" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    <circle cx="17" cy="48" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    <circle cx="17" cy="58" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    <circle cx="17" cy="68" r="1.8" fill="currentColor" fillOpacity="0.3" strokeWidth="1.2" />
    {/* Ruled lines */}
    <path d="M24 30 L54 30" strokeWidth="1.4" strokeOpacity="0.4" />
    <path d="M24 40 L54 40" strokeWidth="1.4" strokeOpacity="0.4" />
    <path d="M24 50 L54 50" strokeWidth="1.4" strokeOpacity="0.4" />
    <path d="M24 60 L44 60" strokeWidth="1.4" strokeOpacity="0.4" />
    {/* Checkmark sketch */}
    <path d="M42 66 L46 70 L55 61" strokeWidth="1.8" stroke="#18A957" />
  </svg>
);

/** Hand-drawn House + Book + Pencil CTA Sketch */
export const HouseBookPencilSketch: React.FC<SketchProps> = ({ 
  className = "w-20 h-20 text-sky-200",
}) => (
  <svg 
    viewBox="0 0 110 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* House Roof & Body */}
    <path d="M20 50 L55 22 L90 50" strokeWidth="2.6" />
    <path d="M26 48 L26 84 L84 84 L84 48" strokeWidth="2.2" />
    <path d="M72 26 L72 36" strokeWidth="2" /> {/* Chimney */}
    {/* Open Book inside Home */}
    <g transform="translate(30, 48) scale(0.5)">
      <path d="M50 20 C40 16, 25 15, 10 18 L10 50 C25 47, 38 48, 50 54 Z" fill="white" fillOpacity="0.2" />
      <path d="M50 20 C60 16, 75 15, 90 18 L90 50 C77 47, 62 48, 50 54 Z" fill="white" fillOpacity="0.2" />
      <path d="M50 20 L50 54" strokeWidth="2" />
    </g>
    {/* Pencil leaning against the house */}
    <g transform="translate(68, 42) rotate(24) scale(0.65)">
      <path d="M30 20 L30 64 L42 64 L42 20 Z" fill="white" fillOpacity="0.3" strokeWidth="2" />
      <path d="M30 64 L36 78 L42 64 Z" strokeWidth="2" />
      <path d="M34 73 L36 78 L38 73 Z" fill="currentColor" />
    </g>
    {/* Small stars */}
    <path d="M18 28 L20 33 L25 35 L20 37 L18 42 L16 37 L11 35 L16 33 Z" fill="currentColor" fillOpacity="0.6" stroke="none" />
    <path d="M92 30 L93.5 34 L97 35 L93.5 36 L92 40 L90.5 36 L87 35 L90.5 34 Z" fill="currentColor" fillOpacity="0.6" stroke="none" />
  </svg>
);

/** Hand-drawn Small Blue Doodle Star */
export const DoodleStar: React.FC<SketchProps> = ({ 
  className = "w-4 h-4 text-[#087ED1]",
}) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M12 0 C12 6, 14 10, 24 12 C14 14, 12 18, 12 24 C12 18, 10 14, 0 12 C10 10, 12 6, 12 0 Z" />
  </svg>
);

/** Hand-drawn Ruler Sketch */
export const RulerSketch: React.FC<SketchProps> = ({
  className = "w-12 h-6 text-[#087ED1]",
}) => (
  <svg
    viewBox="0 0 80 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="6" width="72" height="18" rx="2" fill="white" fillOpacity="0.9" />
    <path d="M12 6 L12 14" strokeWidth="1.4" />
    <path d="M18 6 L18 10" strokeWidth="1.2" />
    <path d="M24 6 L24 14" strokeWidth="1.4" />
    <path d="M30 6 L30 10" strokeWidth="1.2" />
    <path d="M36 6 L36 14" strokeWidth="1.4" />
    <path d="M42 6 L42 10" strokeWidth="1.2" />
    <path d="M48 6 L48 14" strokeWidth="1.4" />
    <path d="M54 6 L54 10" strokeWidth="1.2" />
    <path d="M60 6 L60 14" strokeWidth="1.4" />
    <path d="M66 6 L66 10" strokeWidth="1.2" />
  </svg>
);

/** Hand-drawn Compass Sketch */
export const CompassSketch: React.FC<SketchProps> = ({
  className = "w-10 h-10 text-[#087ED1]",
}) => (
  <svg
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="30" cy="12" r="4" fill="white" />
    <path d="M30 16 L18 52" strokeWidth="2.2" />
    <path d="M30 16 L42 52" strokeWidth="2.2" />
    <path d="M22 36 L38 36" strokeWidth="1.6" strokeDasharray="2 2" />
    <circle cx="18" cy="52" r="1.5" fill="currentColor" />
    {/* Pencil lead at end of compass */}
    <path d="M40 48 L44 54" strokeWidth="2" />
  </svg>
);

/** Decorative Handwritten Note Tag */
export const HandwrittenNote: React.FC<{
  children: React.ReactNode;
  className?: string;
  rotation?: string;
}> = ({ children, className = "", rotation = "-rotate-2" }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1 font-handwriting text-lg sm:text-xl font-bold tracking-wide text-[#087ED1] dark:text-sky-300 select-none ${rotation} ${className}`}>
    <span>{children}</span>
  </div>
);

/** Hand-drawn Paper Airplane Sketch */
export const PaperAirplaneSketch: React.FC<SketchProps> = ({
  className = "w-10 h-10 text-[#087ED1]",
}) => (
  <svg
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Trajectory flight dashed path */}
    <path
      d="M8 50 C20 54, 30 46, 38 34"
      strokeWidth="1.6"
      strokeDasharray="3 3"
      strokeOpacity="0.6"
    />
    {/* Paper Airplane Body */}
    <path d="M72 10 L32 32 L46 36 L52 46 L72 10 Z" fill="white" fillOpacity="0.9" />
    <path d="M72 10 L46 36" strokeWidth="1.8" />
    <path d="M46 36 L44 44 L48 40" strokeWidth="1.4" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

/** 3D Graduation Cap on Stacked Books Illustration (Panel 2) */
export const GradCapBooksIllustration: React.FC<{ className?: string }> = ({
  className = "w-72 h-64",
}) => (
  <svg
    viewBox="0 0 320 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft ambient background glow */}
    <circle cx="160" cy="150" r="110" fill="#EAF6FF" fillOpacity="0.8" />
    
    {/* Bottom Book (Teal/Emerald Green) */}
    <g>
      <path d="M40 215 C100 205, 220 205, 275 215 L285 240 C220 230, 100 230, 40 240 Z" fill="#0D9488" stroke="#0F766E" strokeWidth="2.5" />
      <path d="M40 240 L285 240 L280 252 L35 252 Z" fill="#14B8A6" stroke="#0F766E" strokeWidth="2" />
      {/* Pages edge */}
      <path d="M45 220 C105 210, 215 210, 270 220 L275 238 C215 228, 105 228, 45 238 Z" fill="#FEF3C7" />
    </g>

    {/* Middle Book (Yellow/Orange) */}
    <g transform="rotate(-3 160 190)">
      <path d="M50 180 C105 170, 215 170, 265 180 L272 205 C215 195, 105 195, 50 205 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
      <path d="M50 205 L272 205 L268 217 L46 217 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      {/* Pages edge */}
      <path d="M55 185 C110 175, 210 175, 260 185 L264 203 C210 193, 110 193, 55 203 Z" fill="#FFFBEB" />
    </g>

    {/* Top Book (Coral Red / Crimson) */}
    <g transform="rotate(2 160 150)">
      <path d="M60 145 C115 135, 210 135, 255 145 L262 170 C210 160, 115 160, 60 170 Z" fill="#E11D48" stroke="#BE123C" strokeWidth="2.5" />
      <path d="M60 170 L262 170 L258 182 L56 182 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
      {/* Pages edge */}
      <path d="M65 150 C118 140, 205 140, 252 150 L256 168 C205 158, 118 158, 65 168 Z" fill="#FFF1F2" />
    </g>

    {/* Graduation Mortarboard Cap (Deep Navy / Blue) on Top */}
    <g>
      {/* Diamond Cap Top */}
      <path d="M160 65 L265 105 L160 145 L55 105 Z" fill="#063B73" stroke="#087ED1" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M160 70 L250 105 L160 138 L70 105 Z" fill="#0A4B8F" />
      {/* Skull Cap base under diamond */}
      <path d="M105 125 C105 155, 215 155, 215 125 L215 138 C215 168, 105 168, 105 138 Z" fill="#063B73" stroke="#04274F" strokeWidth="2.5" />
      {/* Top Button */}
      <ellipse cx="160" cy="105" rx="7" ry="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      {/* Golden Yellow Tassel cord & hanging fringe */}
      <path d="M160 105 C190 108, 220 120, 225 155" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <rect x="221" y="155" width="8" height="20" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <path d="M225 175 L225 182" stroke="#D97706" strokeWidth="2" />
    </g>

    {/* Colorful Pencils in Holder on the Right */}
    <g transform="translate(245, 110)">
      {/* Cup holder */}
      <rect x="10" y="55" width="40" height="55" rx="8" fill="#087ED1" stroke="#063B73" strokeWidth="2.5" />
      {/* Pencils sticking out */}
      {/* Yellow pencil */}
      <rect x="14" y="20" width="8" height="40" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" transform="rotate(-8 18 20)" />
      {/* Green pencil */}
      <rect x="25" y="12" width="8" height="48" rx="2" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
      {/* Pink pencil */}
      <rect x="36" y="22" width="8" height="38" rx="2" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" transform="rotate(10 40 22)" />
    </g>

    {/* Decorative hand-drawn doodle stars & sparkle around cap */}
    <path d="M45 70 L48 78 L56 80 L48 82 L45 90 L42 82 L34 80 L42 78 Z" fill="#087ED1" fillOpacity="0.8" />
    <path d="M280 80 L282 85 L288 86 L282 88 L280 94 L278 88 L272 86 L278 85 Z" fill="#087ED1" fillOpacity="0.8" />
    <circle cx="95" cy="55" r="3" fill="#087ED1" fillOpacity="0.6" />
    <circle cx="230" cy="65" r="2.5" fill="#087ED1" fillOpacity="0.6" />
  </svg>
);

/** 3D Security Shield Illustration with Checkmark & Pencils (Panel 3) */
export const SecurityShield3DIllustration: React.FC<{ className?: string }> = ({
  className = "w-64 h-64",
}) => (
  <svg
    viewBox="0 0 260 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft background blue circular aura */}
    <circle cx="130" cy="130" r="100" fill="#EAF6FF" fillOpacity="0.9" />
    
    {/* Pencils / stationery placed neatly beside the shield */}
    <g transform="translate(195, 120)">
      <rect x="0" y="20" width="8" height="45" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" transform="rotate(-6 4 20)" />
      <rect x="12" y="10" width="8" height="55" rx="2" fill="#18A957" stroke="#15803D" strokeWidth="1.5" />
      <rect x="24" y="24" width="8" height="42" rx="2" fill="#087ED1" stroke="#063B73" strokeWidth="1.5" transform="rotate(8 28 24)" />
    </g>

    {/* Outer Shield Border (Deep Blue) */}
    <path
      d="M130 25 C175 25, 215 45, 215 85 C215 155, 160 195, 130 215 C100 195, 45 155, 45 85 C45 45, 85 25, 130 25 Z"
      fill="#087ED1"
      stroke="#063B73"
      strokeWidth="6"
      strokeLinejoin="round"
    />

    {/* Inner Shield Body with Clean Gradient / Highlight */}
    <path
      d="M130 38 C168 38, 202 55, 202 90 C202 150, 155 185, 130 202 C105 185, 58 150, 58 90 C58 55, 92 38, 130 38 Z"
      fill="#063B73"
    />
    <path
      d="M130 45 C162 45, 192 60, 192 92 C192 145, 150 178, 130 192 C110 178, 68 145, 68 92 C68 60, 98 45, 130 45 Z"
      fill="#087ED1"
    />

    {/* White Checkmark in Center */}
    <path
      d="M102 118 L122 138 L164 94"
      stroke="white"
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Subtle Star highlights */}
    <path d="M45 45 L47 50 L52 51 L47 53 L45 58 L43 53 L38 51 L43 50 Z" fill="#087ED1" />
    <path d="M210 40 L212 45 L217 46 L212 48 L210 53 L208 48 L203 46 L208 45 Z" fill="#087ED1" />
  </svg>
);

/** Architectural Line Art Sketch of Ranchi Landmark (Panel 4) */
export const RanchiLandmarkSketch: React.FC<{ className?: string }> = ({
  className = "w-60 h-44",
}) => (
  <svg
    viewBox="0 0 280 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="#B45309"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Base platform */}
    <path d="M15 155 L265 155" strokeWidth="2.5" />
    <path d="M25 162 L255 162" strokeWidth="1.8" />
    
    {/* Central Shikhara / Dome Tower */}
    <path d="M125 155 L125 70 C125 50, 135 30, 140 20 C145 30, 155 50, 155 70 L155 155" fill="#FEF3C7" fillOpacity="0.4" />
    {/* Kalash on top */}
    <circle cx="140" cy="16" r="3" fill="#D97706" />
    <path d="M140 13 L140 8" strokeWidth="2" stroke="#D97706" />
    <path d="M140 8 L148 11 L140 14 Z" fill="#D97706" stroke="none" /> {/* Flag */}

    {/* Side spires / Pillars */}
    <path d="M95 155 L95 85 C95 72, 105 60, 110 50 C115 60, 125 72, 125 85" fill="#FEF3C7" fillOpacity="0.3" />
    <circle cx="110" cy="47" r="2" fill="#D97706" />
    
    <path d="M155 85 C155 72, 165 60, 170 50 C175 60, 185 72, 185 85 L185 155" fill="#FEF3C7" fillOpacity="0.3" />
    <circle cx="170" cy="47" r="2" fill="#D97706" />

    {/* Far left and far right wings */}
    <path d="M65 155 L65 105 C65 95, 75 88, 80 80 C85 88, 95 95, 95 105" fill="#FEF3C7" fillOpacity="0.2" />
    <path d="M40 155 L40 120 L65 120" />
    
    <path d="M185 105 C185 95, 195 88, 200 80 C205 88, 215 95, 215 105 L215 155" fill="#FEF3C7" fillOpacity="0.2" />
    <path d="M215 120 L240 120 L240 155" />

    {/* Arched windows and doors */}
    <path d="M133 155 L133 135 C133 128, 147 128, 147 135 L147 155" fill="#D97706" fillOpacity="0.3" />
    <path d="M134 110 L134 98 C134 94, 146 94, 146 98 L146 110" />
    <path d="M104 135 L104 125 C104 120, 116 120, 116 125 L116 135" />
    <path d="M164 135 L164 125 C164 120, 176 120, 176 125 L176 135" />

    {/* Horizontal bands & carved detailing */}
    <path d="M65 130 L215 130" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M95 100 L185 100" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M125 65 L155 65" strokeWidth="1.2" />
  </svg>
);

/** Large Safety Shield + Notebook + Pencil Composition */
export const SafetyShieldNotebookPencilComposition: React.FC<{ className?: string }> = ({
  className = "w-72 h-72 sm:w-80 sm:h-80",
}) => (
  <svg
    viewBox="0 0 320 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft organic blue blob in background */}
    <path
      d="M60 140 C40 80, 110 30, 180 40 C260 50, 290 120, 270 190 C250 260, 180 270, 120 260 C60 250, 80 200, 60 140 Z"
      fill="#EAF6FF"
      className="dark:fill-sky-950/40"
    />
    <path
      d="M100 80 C120 40, 200 45, 230 90 C260 140, 240 220, 190 240 C140 260, 80 210, 85 150 C90 100, 80 120, 100 80 Z"
      fill="#D9EFFF"
      className="dark:fill-sky-900/20"
      opacity="0.6"
    />

    {/* Behind: Open Student Spiral Notebook */}
    <g transform="translate(45, 75) rotate(-8)">
      {/* Notebook base & pages */}
      <rect x="0" y="0" width="130" height="155" rx="8" fill="white" className="dark:fill-slate-800" stroke="#087ED1" strokeWidth="2.2" />
      {/* Notebook Ruled lines */}
      <line x1="24" y1="30" x2="115" y2="30" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="46" x2="115" y2="46" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="62" x2="115" y2="62" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="78" x2="115" y2="78" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="94" x2="115" y2="94" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="110" x2="115" y2="110" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="126" x2="115" y2="126" stroke="#087ED1" strokeOpacity="0.35" strokeWidth="1.2" />
      {/* Red margin line */}
      <line x1="22" y1="0" x2="22" y2="155" stroke="#F87171" strokeWidth="1.5" strokeOpacity="0.7" />
      {/* Spiral binder rings */}
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i} transform={`translate(-4, ${15 + i * 15})`}>
          <ellipse cx="4" cy="4" rx="5" ry="3" fill="#063B73" className="dark:fill-sky-400" />
          <circle cx="7" cy="4" r="2" fill="#EAF6FF" className="dark:fill-slate-900" />
        </g>
      ))}
    </g>

    {/* Centerpiece: Large Trust Shield */}
    <g transform="translate(110, 35)">
      {/* Shield shadow */}
      <path
        d="M60 12 C105 12, 142 32, 142 72 C142 142, 88 182, 60 202 C32 182, -22 142, -22 72 C-22 32, 15 12, 60 12 Z"
        fill="#063B73"
        opacity="0.12"
        transform="translate(4, 6)"
      />
      {/* Shield outer border in Deep Navy/Blue */}
      <path
        d="M60 12 C105 12, 142 32, 142 72 C142 142, 88 182, 60 202 C32 182, -22 142, -22 72 C-22 32, 15 12, 60 12 Z"
        fill="#087ED1"
        stroke="#063B73"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Shield Inner Inset */}
      <path
        d="M60 24 C96 24, 128 40, 128 75 C128 135, 84 170, 60 188 C36 170, -8 135, -8 75 C-8 40, 24 24, 60 24 Z"
        fill="#063B73"
      />
      <path
        d="M60 30 C90 30, 118 44, 118 76 C118 128, 80 162, 60 178 C40 162, 2 128, 2 76 C2 44, 30 30, 60 30 Z"
        fill="#087ED1"
      />

      {/* Prominent White Safety Checkmark */}
      <path
        d="M34 100 L54 120 L94 76"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small stars on shield corners */}
      <path d="M-8 45 L-6 50 L-1 51 L-6 53 L-8 58 L-10 53 L-15 51 L-10 50 Z" fill="white" opacity="0.8" />
      <path d="M128 40 L130 45 L135 46 L130 48 L128 53 L126 48 L121 46 L126 45 Z" fill="white" opacity="0.8" />
    </g>

    {/* Hand-Drawn Sharpened Wooden Pencil Laying Across */}
    <g transform="translate(145, 175) rotate(32)">
      {/* Eraser */}
      <path d="M0 0 L18 0 C18 -6, 0 -6, 0 0 Z" fill="#F87171" stroke="#EF4444" strokeWidth="1.5" />
      {/* Ferrule */}
      <rect x="0" y="0" width="18" height="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.2" />
      {/* Yellow wooden pencil body */}
      <rect x="0" y="8" width="18" height="90" fill="#FBBF24" stroke="#D97706" strokeWidth="1.6" />
      <line x1="6" y1="8" x2="6" y2="98" stroke="#D97706" strokeWidth="1.2" />
      <line x1="12" y1="8" x2="12" y2="98" stroke="#D97706" strokeWidth="1.2" />
      {/* Sharpened wood cone */}
      <polygon points="0,98 18,98 9,122" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      {/* Black lead tip */}
      <polygon points="6,114 12,114 9,122" fill="#1E293B" />
    </g>

    {/* Educational accents & handwritten note */}
    <g transform="translate(18, 230)">
      <path d="M12 8 C25 22, 50 18, 65 14" stroke="#087ED1" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" />
      <polygon points="66,10 74,13 67,18" fill="#087ED1" />
    </g>
  </svg>
);

/** Desk Notebook & Envelope Composition (for Contact section) */
export const DeskNotebookEnvelopeComposition: React.FC<{ className?: string }> = ({
  className = "w-48 h-48 sm:w-56 sm:h-56",
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft organic blob background */}
    <circle cx="100" cy="100" r="75" fill="#EAF6FF" className="dark:fill-sky-950/40" />

    {/* Notebook / Writing Pad */}
    <g transform="translate(35, 45) rotate(-6)">
      <rect x="0" y="0" width="95" height="115" rx="6" fill="white" className="dark:fill-slate-800" stroke="#087ED1" strokeWidth="2" />
      {/* Ruled lines */}
      <line x1="15" y1="25" x2="80" y2="25" stroke="#087ED1" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="15" y1="40" x2="80" y2="40" stroke="#087ED1" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="15" y1="55" x2="80" y2="55" stroke="#087ED1" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="15" y1="70" x2="80" y2="70" stroke="#087ED1" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="15" y1="85" x2="80" y2="85" stroke="#087ED1" strokeOpacity="0.3" strokeWidth="1.2" />
      {/* Header tape / clip */}
      <rect x="30" y="-4" width="35" height="10" rx="2" fill="#087ED1" fillOpacity="0.2" />
    </g>

    {/* Letter Envelope */}
    <g transform="translate(85, 80) rotate(12)">
      <rect x="0" y="0" width="80" height="52" rx="4" fill="#F4FAFF" className="dark:fill-slate-700" stroke="#063B73" strokeWidth="1.8" />
      <path d="M0 0 L40 28 L80 0" stroke="#063B73" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Post stamp */}
      <rect x="58" y="8" width="14" height="16" fill="#087ED1" fillOpacity="0.3" stroke="#087ED1" strokeWidth="1" strokeDasharray="1 1" />
    </g>

    {/* Fountain Ink Pen */}
    <g transform="translate(130, 20) rotate(35)">
      <path d="M4 0 L10 0 L10 70 L4 70 Z" fill="#063B73" stroke="#063B73" strokeWidth="1.4" />
      <polygon points="4,70 10,70 7,85" fill="#087ED1" stroke="#063B73" strokeWidth="1.2" />
      <line x1="7" y1="74" x2="7" y2="82" stroke="white" strokeWidth="1" />
      {/* Pen clip */}
      <rect x="2" y="8" width="2" height="30" rx="1" fill="#CBD5E1" />
    </g>

    {/* Hand-drawn paperclip */}
    <g transform="translate(42, 38) rotate(20)">
      <path d="M4 2 L4 18 C4 22, 10 22, 10 18 L10 6 C10 3, 14 3, 14 6 L14 19 C14 25, 2 25, 2 18 L2 2" stroke="#64748B" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

/** Wave Divider for smooth transitions between sections */
export const CurvedWaveDivider: React.FC<{
  className?: string;
  fillColor?: string;
  inverted?: boolean;
}> = ({
  className = "w-full overflow-hidden leading-none",
  fillColor = "fill-white dark:fill-[#07172C]",
  inverted = false,
}) => (
  <div className={`${className} ${inverted ? 'rotate-180' : ''} pointer-events-none select-none`} aria-hidden="true">
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className="w-full h-8 sm:h-12"
    >
      <path
        d="M0,0 C150,45 350,-20 500,25 C650,70 900,10 1200,35 L1200,60 L0,60 Z"
        className={fillColor}
      />
    </svg>
  </div>
);

