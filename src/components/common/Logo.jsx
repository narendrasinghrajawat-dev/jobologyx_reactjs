import { Link } from "react-router-dom";

export default function Logo({ size = "md", showText = true, to = "/", className = "" }) {
  const sizeMap = {
    sm: { icon: "h-7 w-7", text: "text-lg", gap: "gap-2" },
    md: { icon: "h-9 w-9", text: "text-xl", gap: "gap-2.5" },
    lg: { icon: "h-12 w-12", text: "text-2xl", gap: "gap-3" },
    xl: { icon: "h-16 w-16", text: "text-3xl", gap: "gap-3.5" },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${selectedSize.gap} font-bold transition-transform hover:opacity-95 ${className}`}>
      {/* Dynamic Monogram Emblem */}
      <div className={`relative flex ${selectedSize.icon} shrink-0 items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="h-full w-full">
          <defs>
            <linearGradient id="logo-c-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="logo-c-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* J Stem */}
          <path d="M 18 10 L 18 28 C 18 34 13 37 8 35 C 5.5 34 4 31.5 4 28.5" 
                stroke="url(#logo-c-blue)" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" />
          <circle cx="18" cy="7.5" r="2.5" fill="url(#logo-c-blue)" />

          {/* X Diagonals */}
          <path d="M 14 14 L 34 38" 
                stroke="url(#logo-c-blue)" 
                strokeWidth="4.5" 
                strokeLinecap="round" />
          <path d="M 16 38 L 38 12" 
                stroke="url(#logo-c-purple)" 
                strokeWidth="4.5" 
                strokeLinecap="round" />

          {/* Arrowheads */}
          <path d="M 31 12 L 39 11 L 38 19" 
                stroke="url(#logo-c-purple)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" />

          <circle cx="27" cy="24.5" r="2.8" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1.2" />
        </svg>
      </div>

      {showText && (
        <span className={`${selectedSize.text} tracking-tight text-slate-900 dark:text-white`}>
          Jobology<span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">X</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} aria-label="JobologyX Home">{content}</Link>;
  }

  return content;
}
