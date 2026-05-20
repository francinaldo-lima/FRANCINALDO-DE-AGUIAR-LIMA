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
  const officialGreen = '#0B7A3B';
  const officialRed = '#C8102E';
  
  // High contrast text colors for modern institucional look
  const textColor = isDarkTheme ? '#FFFFFF' : '#0F172A'; // Slate-900 or Pure White
  const greenFill = colorOverride || (isDarkTheme ? '#10B981' : officialGreen); // Slight highlight on dark grid

  // Symmetrical 3x4 grid alignment of the "IF" symbol
  // Square side S = 32, Spacing G = 8, Margin/Padding P = 4
  // Row Height/Col Width: 32px
  // Grid coordinates:
  // Col 1: x=4, Col 2: x=44, Col 3: x=84 (Width = 120px)
  // Row 1: y=4, Row 2: y=44, Row 3: y=84, Row 4: y=124 (Height = 160px)
  const renderSymbol = (svgSizeClass: string) => {
    return (
      <svg
        viewBox="0 0 120 160"
        className={`${svgSizeClass} shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-350 hover:scale-[1.05]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ROW 1 */}
        {/* Column 1: Perfect Red circle representing the iconic red dot of the letter "i" */}
        {/* Centered exactly inside the Row 1, Col 1 bounding box (x: 4..36, y: 4..36) */}
        <circle cx="20" cy="20" r="16" fill={officialRed} />
        {/* Column 2: Green square */}
        <rect x="44" y="4" width="32" height="32" fill={greenFill} />
        {/* Column 3: Green square */}
        <rect x="84" y="4" width="32" height="32" fill={greenFill} />

        {/* ROW 2 */}
        {/* Column 1: Green square */}
        <rect x="4" y="44" width="32" height="32" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="44" y="44" width="32" height="32" fill={greenFill} />

        {/* ROW 3 */}
        {/* Column 1: Green square */}
        <rect x="4" y="84" width="32" height="32" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="44" y="84" width="32" height="32" fill={greenFill} />
        {/* Column 3: Green square */}
        <rect x="84" y="84" width="32" height="32" fill={greenFill} />

        {/* ROW 4 */}
        {/* Column 1: Green square */}
        <rect x="4" y="124" width="32" height="32" fill={greenFill} />
        {/* Column 2: Green square */}
        <rect x="44" y="124" width="32" height="32" fill={greenFill} />
      </svg>
    );
  };

  if (variant === 'vertical') {
    // Sizing for 3:4 aspect ratio - scaled up for better prominence
    const symbolSize = 
      size === 'sm' ? 'w-[36px] h-[48px]' : 
      size === 'md' ? 'w-[56px] h-[74px]' : 
      size === 'lg' ? 'w-[84px] h-[112px]' : 
      'w-[48px] h-[64px]';

    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Icon on top */}
        {renderSymbol(symbolSize)}
        
        {/* Text lines vertically stacked, precisely styled like official campus mark */}
        <div className="mt-4 flex flex-col items-center">
          <span
            className="text-[14px] font-[1000] tracking-tight leading-none uppercase"
            style={{ color: textColor, fontFamily: '"Inter", sans-serif' }}
          >
            INSTITUTO FEDERAL
          </span>
          <span
            className="text-[12px] font-bold tracking-[0.2em] leading-normal mt-[4px]"
            style={{ color: isDarkTheme ? '#CBD5E1' : '#334155' }}
          >
            Maranhão
          </span>
          
          {/* Solid Green accent divider line */}
          <div className="w-24 h-[2px] my-2.5" style={{ backgroundColor: greenFill }} />
          
          <span
            className="text-[12px] font-bold tracking-[0.1em] leading-none text-neutral-505 dark:text-neutral-400 opacity-80"
          >
            Campus
          </span>
          <span
            className="text-[15px] font-[1000] tracking-[0.05em] leading-relaxed mt-[2px]"
            style={{ color: textColor }}
          >
            Carolina
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default) - sizing for 3:4 aspect ratio - scaled up
  const symbolSize = 
    size === 'sm' ? 'w-[32px] h-[42px]' : 
    size === 'md' ? 'w-[48px] h-[64px]' : 
    size === 'lg' ? 'w-[64px] h-[85px]' : 
    'w-[40px] h-[53px]';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Icon to the left */}
      {renderSymbol(symbolSize)}
      
      {/* Text group carefully formatted on the right */}
      <div className="flex flex-col text-left justify-center">
        <span
          className="text-[13.5px] md:text-[15px] font-[1000] tracking-tight leading-none uppercase"
          style={{ color: textColor, fontFamily: '"Inter", sans-serif' }}
        >
          INSTITUTO FEDERAL
        </span>
        <span
          className="text-[11px] md:text-[12px] font-bold tracking-[0.16em] leading-normal mt-[1.5px]"
          style={{ color: isDarkTheme ? '#CBD5E1' : '#475569' }}
        >
          Maranhão
        </span>
        <span
          className="text-[12.5px] md:text-[14px] font-[900] tracking-wide leading-none mt-[3px]"
          style={{ color: textColor }}
        >
          Campus Carolina
        </span>
      </div>
    </div>
  );
}

export default IfmaLogo;
