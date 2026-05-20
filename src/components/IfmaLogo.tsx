import React from 'react';

interface IfmaLogoProps {
  variant?: 'vertical' | 'horizontal';
  isDarkTheme?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  colorOverride?: string; // e.g. custom extracted green, or white
}

export function IfmaLogo({
  variant = 'horizontal',
  isDarkTheme = false,
  className = '',
  size = 'auto',
  colorOverride
}: IfmaLogoProps) {
  // Official IFMA institutional colors
  const greenColor = '#0B7A3B';
  const redColor = '#C8102E';
  
  // Decide active colors based on theme
  const textColor = isDarkTheme ? '#FFFFFF' : '#1C1917'; // Elegant charcoal stone-900 or pitch white
  const greenFill = colorOverride || greenColor;

  // Pixel-perfect SVG Symbol containing the iconic Red ball and Green rounded square matrix (IF initials)
  const renderSymbol = (svgSizeClass: string) => {
    return (
      <svg
        viewBox="0 0 140 180"
        className={`${svgSizeClass} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ROW 1 */}
        {/* Column 1: Red circle representing the iconic red dot */}
        <circle cx="30" cy="30" r="22" fill={redColor} />
        {/* Column 2: Green square */}
        <rect x="62" y="8" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 3: Green square */}
        <rect x="104" y="8" width="34" height="34" rx="5" fill={greenFill} />

        {/* ROW 2 */}
        {/* Column 1: Green square */}
        <rect x="12" y="50" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="62" y="50" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 3 is empty in Row 2 */}

        {/* ROW 3 */}
        {/* Column 1: Green square */}
        <rect x="12" y="92" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="62" y="92" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 3: Green square */}
        <rect x="104" y="92" width="34" height="34" rx="5" fill={greenFill} />

        {/* ROW 4 */}
        {/* Column 1: Green square */}
        <rect x="12" y="134" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="62" y="134" width="34" height="34" rx="5" fill={greenFill} />
        {/* Column 3 is empty in Row 4 */}
      </svg>
    );
  };

  if (variant === 'vertical') {
    const symbolSize = size === 'sm' ? 'w-10 h-12' : size === 'md' ? 'w-16 h-20' : size === 'lg' ? 'w-24 h-28' : 'w-14 h-18';
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Icon on top */}
        {renderSymbol(symbolSize)}
        
        {/* Text lines vertically stacked, precisely styled like official campus mark */}
        <div className="mt-3 flex flex-col items-center">
          <span
            className="text-[14px] font-[900] tracking-tight leading-none uppercase"
            style={{ color: textColor, fontFamily: '"Inter", sans-serif' }}
          >
            INSTITUTO FEDERAL
          </span>
          <span
            className="text-[12px] font-medium tracking-[0.16em] leading-normal mt-[1px]"
            style={{ color: isDarkTheme ? '#E5E7EB' : '#4B5563' }}
          >
            Maranhão
          </span>
          
          {/* Solid Green accent divider line */}
          <div className="w-24 h-[1.5px] my-1.5" style={{ backgroundColor: greenFill }} />
          
          <span
            className="text-[12px] font-normal tracking-[0.08em] leading-none"
            style={{ color: textColor }}
          >
            Campus
          </span>
          <span
            className="text-[12px] font-semibold tracking-[0.08em] leading-relaxed mt-[2px]"
            style={{ color: textColor }}
          >
            Carolina
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  const symbolSize = size === 'sm' ? 'w-8 h-10' : size === 'md' ? 'w-12 h-16' : size === 'lg' ? 'w-18 h-22' : 'w-10 h-14';
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon to the left */}
      {renderSymbol(symbolSize)}
      
      {/* Text group carefully formatted on the right */}
      <div className="flex flex-col text-left">
        <span
          className="text-[13px] font-[900] tracking-tight leading-none uppercase"
          style={{ color: textColor, fontFamily: '"Inter", sans-serif' }}
        >
          INSTITUTO FEDERAL
        </span>
        <span
          className="text-[11.5px] font-light tracking-[0.08em] leading-normal"
          style={{ color: isDarkTheme ? '#D1D5DB' : '#475569' }}
        >
          Maranhão
        </span>
        <span
          className="text-[11.5px] font-bold tracking-[0.06em] leading-none mt-[2px]"
          style={{ color: textColor }}
        >
          Campus Carolina
        </span>
      </div>
    </div>
  );
}

export default IfmaLogo;
