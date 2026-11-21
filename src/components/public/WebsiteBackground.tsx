import React from 'react';

/** A fluffy cloud built from overlapping circles (pure SVG, no assets). */
const Cloud: React.FC<{ className?: string; width?: number; opacity?: number }> = ({
  className = '',
  width = 360,
  opacity = 0.9,
}) => (
  <svg
    viewBox="0 0 360 140"
    width={width}
    className={`cloud ${className}`}
    style={{ opacity }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#dff1ff" />
      </linearGradient>
    </defs>
    <g fill="url(#cloudFill)">
      <circle cx="70" cy="92" r="42" />
      <circle cx="132" cy="62" r="52" />
      <circle cx="205" cy="70" r="48" />
      <circle cx="268" cy="88" r="40" />
      <rect x="40" y="88" width="260" height="44" rx="22" />
    </g>
  </svg>
);

/** Soft sky + drifting clouds across the whole page. */
export const WebsiteBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Soft light (plain gradients: no blur filter, cheap to paint) */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(900px 500px at 50% 0%, rgba(255,255,255,.55), transparent 70%)' }} />
      {/* Clouds (hidden in dark mode for a calm night sky) */}
      <div className="dark:opacity-15">
        <Cloud className="top-[2%] left-[-60px] cloud-drift" width={380} opacity={0.85} />
        <Cloud className="top-[7%] right-[-40px] cloud-drift" width={300} opacity={0.8} />
        <Cloud className="top-[22%] left-[55%] hidden md:block cloud-drift" width={240} opacity={0.6} />
        <Cloud className="top-[34%] left-[-90px] cloud-drift" width={420} opacity={0.8} />
        <Cloud className="top-[47%] right-[-80px] cloud-drift" width={400} opacity={0.85} />
        <Cloud className="top-[60%] left-[-50px] hidden sm:block cloud-drift" width={340} opacity={0.75} />
        <Cloud className="top-[72%] right-[-60px] cloud-drift" width={360} opacity={0.8} />
        <Cloud className="top-[84%] left-[20%] hidden md:block cloud-drift" width={300} opacity={0.65} />
        <Cloud className="bottom-[2%] right-[8%] cloud-drift" width={420} opacity={0.9} />
      </div>
    </div>
  );
};
