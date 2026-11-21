import React from 'react';

/**
 * Educational & Drafting Stationery Instruments
 * Includes:
 * - Campus (Drafting Compass)
 * - Protector (Protractor 180°)
 * - Divider (Drafting Divider)
 * - Pencil (Sharpened Wooden Drafting Pencil)
 * - Pen (Fountain Pen / Executive Technical Pen)
 * - Set Square (30-60-90 Drafting Triangle)
 * - Eraser / Rubber (Drafting Eraser block)
 * - Scale / Ruler (Measurement Scale)
 * - Paperclips & Binder Clips
 */

// 1. CAMPUS (GEOMETRY DRAFTING COMPASS)
export const GeometryCompass: React.FC<{ className?: string; size?: number; arc?: boolean }> = ({ 
  className = '', 
  size = 140,
  arc = true 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 1.15} 
        viewBox="0 0 160 185" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-md"
      >
        {/* Optional pencil arc drawn onto paper */}
        {arc && (
          <path 
            d="M 125 155 A 65 65 0 0 0 45 130" 
            stroke="#0BA3FF" 
            strokeWidth="2.5" 
            strokeDasharray="4 3" 
            strokeLinecap="round" 
            opacity="0.85" 
          />
        )}

        {/* Top Handle Knurled Spindle */}
        <rect x="76" y="6" width="8" height="22" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
        <line x1="77" y1="12" x2="83" y2="12" stroke="#475569" strokeWidth="1" />
        <line x1="77" y1="18" x2="83" y2="18" stroke="#475569" strokeWidth="1" />
        <line x1="77" y1="24" x2="83" y2="24" stroke="#475569" strokeWidth="1" />

        {/* Center Pivot Joint Hinge */}
        <circle cx="80" cy="36" r="10" fill="#0BA3FF" stroke="#0369A1" strokeWidth="1.8" />
        <circle cx="80" cy="36" r="4.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />

        {/* Micro-Adjustment Spindle & Screw Bar */}
        <rect x="52" y="76" width="56" height="4.5" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
        {/* Thumbwheel in center */}
        <rect x="74" y="72" width="12" height="12.5" rx="2" fill="#0BA3FF" stroke="#0284C7" strokeWidth="1" />
        <line x1="77" y1="73" x2="77" y2="84" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
        <line x1="80" y1="73" x2="80" y2="84" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
        <line x1="83" y1="73" x2="83" y2="84" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />

        {/* LEFT LEG: Needle Leg */}
        <path d="M 74 42 L 48 115 L 42 165" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 74 42 L 48 115 L 42 165" stroke="#E2E8F0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Needle Point */}
        <polygon points="42,165 40,178 44,165" fill="#1E293B" />

        {/* RIGHT LEG: Pencil Holding Leg */}
        <path d="M 86 42 L 108 108" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 86 42 L 108 108" stroke="#E2E8F0" strokeWidth="2.2" strokeLinecap="round" />

        {/* Pencil Clamp Bracket */}
        <rect x="100" y="102" width="16" height="18" rx="3" fill="#0BA3FF" stroke="#0369A1" strokeWidth="1.2" />
        {/* Tightening screw on clamp */}
        <circle cx="118" cy="111" r="3.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

        {/* Clamped Wooden Pencil */}
        <g transform="rotate(-18 108 120)">
          {/* Pencil Body */}
          <rect x="104" y="80" width="8" height="55" fill="#0BA3FF" stroke="#0369A1" strokeWidth="0.8" />
          <line x1="108" y1="80" x2="108" y2="135" stroke="#7DD3FC" strokeWidth="1" />
          {/* Sharpened Wood Cone */}
          <polygon points="104,135 112,135 108,154" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
          {/* Graphite Lead Point touching arc */}
          <polygon points="106,145 110,145 108,154" fill="#0F172A" />
        </g>
      </svg>
    </div>
  );
};

// 2. PROTECTOR (180° ACRYLIC DRAFTING PROTRACTOR)
export const Protractor: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 170 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 0.58} 
        viewBox="0 0 200 115" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Semi-circular Acrylic Body */}
        <path 
          d="M 10 100 A 90 90 0 0 1 190 100 Z" 
          fill="rgba(11, 163, 255, 0.08)" 
          stroke="#0BA3FF" 
          strokeWidth="2.2" 
        />

        {/* Inner semi-circle cutout */}
        <path 
          d="M 50 100 A 50 50 0 0 1 150 100 Z" 
          fill="rgba(255, 255, 255, 0.15)" 
          stroke="#0BA3FF" 
          strokeWidth="1.2" 
          strokeDasharray="2 2"
        />

        {/* Center origin target point crosshair */}
        <circle cx="100" cy="100" r="4" fill="none" stroke="#0BA3FF" strokeWidth="1.5" />
        <line x1="94" y1="100" x2="106" y2="100" stroke="#0BA3FF" strokeWidth="1.5" />
        <line x1="100" y1="94" x2="100" y2="106" stroke="#0BA3FF" strokeWidth="1.5" />

        {/* Degree Tick Marks every 10° */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 100 - 90 * Math.cos(rad);
          const y1 = 100 - 90 * Math.sin(rad);
          const isMajor = deg % 30 === 0 || deg === 90;
          const tickLen = isMajor ? 12 : 7;
          const x2 = 100 - (90 - tickLen) * Math.cos(rad);
          const y2 = 100 - (90 - tickLen) * Math.sin(rad);
          const textX = 100 - 72 * Math.cos(rad);
          const textY = 100 - 72 * Math.sin(rad) + 3;

          return (
            <g key={deg}>
              <line 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="#0BA3FF" 
                strokeWidth={isMajor ? "1.6" : "1"} 
              />
              {isMajor && (
                <text 
                  x={textX} 
                  y={textY} 
                  fill="#0BA3FF" 
                  fontSize="7.5" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  fontFamily="sans-serif"
                >
                  {deg}°
                </text>
              )}
            </g>
          );
        })}

        {/* Baseline ruler millimeter marks */}
        {Array.from({ length: 19 }).map((_, i) => (
          <line 
            key={i} 
            x1={10 + i * 10} 
            y1={100} 
            x2={10 + i * 10} 
            y2={i % 5 === 0 ? 93 : 96} 
            stroke="#0BA3FF" 
            strokeWidth={i % 5 === 0 ? "1.4" : "0.8"} 
          />
        ))}

        {/* Brand engraving */}
        <text 
          x="100" 
          y="84" 
          fill="#0BA3FF" 
          fontSize="6.5" 
          fontWeight="bold" 
          letterSpacing="0.8" 
          textAnchor="middle" 
          opacity="0.8"
        >
          180° PROTRACTOR
        </text>
      </svg>
    </div>
  );
};

// 3. DIVIDER (PRECISION TWO-NEEDLE DRAFTING DIVIDER)
export const GeometryDivider: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 130 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 1.15} 
        viewBox="0 0 140 165" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Top Loop Handle */}
        <ellipse cx="70" cy="14" rx="6" ry="8" fill="none" stroke="#64748B" strokeWidth="2.2" />
        <rect x="67" y="20" width="6" height="12" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

        {/* Pivot Hinge Joint */}
        <circle cx="70" cy="38" r="9" fill="#0BA3FF" stroke="#0284C7" strokeWidth="1.5" />
        <circle cx="70" cy="38" r="4" fill="#F1F5F9" stroke="#64748B" strokeWidth="1" />

        {/* Spring Bow Adjustment Spindle in middle */}
        <rect x="42" y="78" width="56" height="3.5" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="0.8" />
        <rect x="64" y="73" width="12" height="13" rx="2" fill="#0BA3FF" stroke="#0284C7" strokeWidth="1" />
        <line x1="68" y1="74" x2="68" y2="85" stroke="#FFFFFF" strokeWidth="0.8" />
        <line x1="72" y1="74" x2="72" y2="85" stroke="#FFFFFF" strokeWidth="0.8" />

        {/* Left Needle Leg */}
        <path d="M 64 44 L 44 110 L 32 152" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <path d="M 64 44 L 44 110 L 32 152" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        {/* Sharp Steel Point */}
        <polygon points="32,152 28,162 34,152" fill="#0F172A" />

        {/* Right Needle Leg */}
        <path d="M 76 44 L 96 110 L 108 152" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <path d="M 76 44 L 96 110 L 108 152" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        {/* Sharp Steel Point */}
        <polygon points="108,152 112,162 106,152" fill="#0F172A" />

        {/* Measuring interval arc */}
        <path 
          d="M 36 156 Q 70 162 104 156" 
          stroke="#0BA3FF" 
          strokeWidth="1.2" 
          strokeDasharray="2 3" 
          opacity="0.75" 
        />
      </svg>
    </div>
  );
};

// 4. SHARPENED WOODEN DRAFTING PENCIL
export const DraftingPencil: React.FC<{ 
  className?: string; 
  length?: number; 
  angle?: number;
  label?: string;
}> = ({ 
  className = '', 
  length = 180, 
  angle = -12,
  label = 'RHTW • 2B' 
}) => {
  return (
    <div 
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <svg 
        width={length * 0.16} 
        height={length} 
        viewBox="0 0 26 180" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Pink/Sky-Blue Rubber Eraser */}
        <path d="M 4 176 C 4 180, 22 180, 22 176 L 22 162 L 4 162 Z" fill="#0BA3FF" />

        {/* Silver Aluminum Crimped Ferrule */}
        <rect x="4" y="152" width="18" height="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
        <line x1="4" y1="155" x2="22" y2="155" stroke="#64748B" strokeWidth="0.8" />
        <line x1="4" y1="159" x2="22" y2="159" stroke="#64748B" strokeWidth="0.8" />

        {/* Hexagonal Blue Pencil Body */}
        <rect x="4" y="38" width="18" height="114" fill="#0BA3FF" stroke="#0284C7" strokeWidth="1" />
        {/* Hexagonal Facet Highlights */}
        <line x1="9" y1="38" x2="9" y2="152" stroke="#7DD3FC" strokeWidth="1.2" />
        <line x1="17" y1="38" x2="17" y2="152" stroke="#0369A1" strokeWidth="1.2" />

        {/* Stamped Golden Foil Text */}
        <text 
          x="-95" 
          y="15" 
          fill="#FEF08A" 
          fontSize="6" 
          fontWeight="bold" 
          fontFamily="sans-serif"
          letterSpacing="0.8"
          transform="rotate(-90)"
        >
          {label}
        </text>

        {/* Sharpened Cedar Wood Cone */}
        <polygon points="4,38 22,38 13,8" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
        {/* Wood Grain Arc */}
        <path d="M 7 35 Q 13 32 19 35" stroke="#B45309" strokeWidth="0.6" fill="none" />

        {/* Dark Graphite Lead Tip */}
        <polygon points="9,20 17,20 13,8" fill="#0F172A" />
      </svg>
    </div>
  );
};

// 5. EXECUTIVE FOUNTAIN PEN / TECHNICAL PEN
export const FountainPen: React.FC<{ 
  className?: string; 
  length?: number; 
  angle?: number;
}> = ({ 
  className = '', 
  length = 190, 
  angle = 25 
}) => {
  return (
    <div 
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <svg 
        width={length * 0.17} 
        height={length} 
        viewBox="0 0 28 190" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Pen End Finial Cap */}
        <path d="M 7 186 C 7 190, 21 190, 21 186 L 21 176 L 7 176 Z" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
        <rect x="7" y="174" width="14" height="2.5" fill="#E2E8F0" />

        {/* Deep Navy/Black Pen Barrel */}
        <rect x="7" y="82" width="14" height="92" fill="#071A36" stroke="#0BA3FF" strokeWidth="1" />
        <line x1="10" y1="82" x2="10" y2="174" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

        {/* Center Chrome Band Ring */}
        <rect x="6.5" y="78" width="15" height="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />

        {/* Metal Pocket Clip */}
        <rect x="18" y="90" width="3" height="50" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />
        <circle cx="19.5" cy="142" r="2.5" fill="#0BA3FF" />

        {/* Ergonomic Grip Section with Ink Window */}
        <polygon points="8,78 20,78 18,36 10,36" fill="#1E293B" stroke="#0BA3FF" strokeWidth="0.8" />
        {/* Ink level preview window in #0BA3FF */}
        <rect x="12" y="48" width="4" height="18" rx="2" fill="#0BA3FF" />

        {/* Engraved Two-Tone Gold & Steel Nib */}
        <polygon points="10,36 18,36 14,8" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
        {/* Steel Nib Center Inlay */}
        <polygon points="12,36 16,36 14,14" fill="#E2E8F0" />
        {/* Nib Breather Hole & Ink Slit */}
        <circle cx="14" cy="22" r="1.2" fill="#0F172A" />
        <line x1="14" y1="8" x2="14" y2="22" stroke="#0F172A" strokeWidth="0.8" />

        {/* Droplet of #0BA3FF Sky Blue Ink at Tip */}
        <circle cx="14" cy="6" r="2" fill="#0BA3FF" />
      </svg>
    </div>
  );
};

// 6. 30°-60°-90° SET SQUARE (DRAFTING TRIANGLE)
export const SetSquareTriangle: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 140 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 1.2} 
        viewBox="0 0 120 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Outer Triangular Boundary */}
        <polygon 
          points="10,140 110,140 10,10" 
          fill="rgba(11, 163, 255, 0.08)" 
          stroke="#0BA3FF" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />

        {/* Inner Triangular Cutout for Drafting Grip */}
        <polygon 
          points="25,125 80,125 25,45" 
          fill="rgba(255, 255, 255, 0.2)" 
          stroke="#0BA3FF" 
          strokeWidth="1.2" 
          strokeLinejoin="round" 
        />

        {/* Scale Millimeter Graduations along vertical leg */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line 
            key={`v-${i}`} 
            x1="10" 
            y1={140 - i * 10} 
            x2={i % 5 === 0 ? "20" : "15"} 
            y2={140 - i * 10} 
            stroke="#0BA3FF" 
            strokeWidth={i % 5 === 0 ? "1.4" : "0.8"} 
          />
        ))}

        {/* Scale Graduations along bottom leg */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line 
            key={`h-${i}`} 
            x1={10 + i * 10} 
            y1="140" 
            x2={10 + i * 10} 
            y2={i % 5 === 0 ? "130" : "135"} 
            stroke="#0BA3FF" 
            strokeWidth={i % 5 === 0 ? "1.4" : "0.8"} 
          />
        ))}

        <text 
          x="35" 
          y="105" 
          fill="#0BA3FF" 
          fontSize="7" 
          fontWeight="bold" 
          fontFamily="sans-serif"
          opacity="0.8"
        >
          30°/60°
        </text>
      </svg>
    </div>
  );
};

// 7. BEVELED DRAFTING ERASER / RUBBER
export const DraftingEraser: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 80 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 0.55} 
        viewBox="0 0 90 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Soft Beveled White Eraser Block */}
        <polygon points="10,38 75,38 85,15 20,15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        <polygon points="75,38 85,15 88,22 78,45" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
        <polygon points="10,38 75,38 78,45 13,45" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />

        {/* Protective Blue Cardstock Sleeve in #0BA3FF */}
        <polygon points="28,38 75,38 85,15 38,15" fill="#0BA3FF" stroke="#0284C7" strokeWidth="1" />
        <polygon points="75,38 85,15 88,22 78,45" fill="#0284C7" />
        <polygon points="28,38 75,38 78,45 31,45" fill="#0369A1" />

        <text 
          x="58" 
          y="30" 
          fill="#FFFFFF" 
          fontSize="6.5" 
          fontWeight="bold" 
          fontFamily="sans-serif"
          textAnchor="middle"
          transform="skewX(-22)"
        >
          RHTW DUST-FREE
        </text>
      </svg>
    </div>
  );
};

// 8. METALLIC PENCIL SHARPENER
export const PencilSharpener: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 60 
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size} 
        height={size * 0.75} 
        viewBox="0 0 65 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Metal Wedge Body with Grips */}
        <rect x="8" y="6" width="48" height="38" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
        <rect x="12" y="10" width="40" height="30" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.8" />

        {/* Side knurl grip grooves */}
        <line x1="8" y1="16" x2="12" y2="16" stroke="#475569" strokeWidth="1" />
        <line x1="8" y1="25" x2="12" y2="25" stroke="#475569" strokeWidth="1" />
        <line x1="8" y1="34" x2="12" y2="34" stroke="#475569" strokeWidth="1" />
        <line x1="52" y1="16" x2="56" y2="16" stroke="#475569" strokeWidth="1" />
        <line x1="52" y1="25" x2="56" y2="25" stroke="#475569" strokeWidth="1" />
        <line x1="52" y1="34" x2="56" y2="34" stroke="#475569" strokeWidth="1" />

        {/* Pencil Insertion Cone Hole */}
        <ellipse cx="14" cy="25" rx="4" ry="7" fill="#1E293B" />

        {/* Hardened Steel Blade at Angle */}
        <polygon points="20,13 46,13 42,37 16,37" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />
        <line x1="18" y1="37" x2="44" y2="13" stroke="#0BA3FF" strokeWidth="1.5" />

        {/* Center Fixing Screw */}
        <circle cx="31" cy="25" r="3.2" fill="#64748B" stroke="#334155" strokeWidth="0.8" />
        <line x1="29" y1="25" x2="33" y2="25" stroke="#F1F5F9" strokeWidth="0.8" />
      </svg>
    </div>
  );
};

// 9. WIRE PAPERCLIP (ACCENTED IN #0BA3FF)
export const PaperclipItem: React.FC<{ className?: string; size?: number; color?: string }> = ({ 
  className = '', 
  size = 40,
  color = '#0BA3FF'
}) => {
  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <svg 
        width={size * 0.52} 
        height={size} 
        viewBox="0 0 22 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <path 
          d="M7 4 L7 32 C7 36.5, 17 36.5, 17 32 L17 12 C17 7.5, 12 7.5, 12 12 L12 28 C12 30.5, 9 30.5, 9 28 L9 10" 
          stroke={color} 
          strokeWidth="2.6" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};
