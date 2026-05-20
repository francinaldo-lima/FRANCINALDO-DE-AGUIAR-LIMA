import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { PostDetails, INSTAGRAM_FORMATS, PostLayout } from '../types';
import { Calendar, User, MapPin, Award, BookOpen, Clock, Heart, Radio, Sparkles } from 'lucide-react';
import { IfmaLogo } from './IfmaLogo';

interface PreviewAreaProps {
  details: PostDetails;
  zoom: number; // e.g. 0.5 for half size
  extractedPalette: string[];
}

export interface PreviewAreaRef {
  exportImage: (format: 'png' | 'jpeg') => Promise<string>;
  getDomNode: () => HTMLDivElement | null;
}

export const PreviewArea = forwardRef<PreviewAreaRef, PreviewAreaProps>(({ details, zoom, extractedPalette }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFormat = INSTAGRAM_FORMATS[details.format];

  // Expose the container DOM node for direct export triggering
  useImperativeHandle(ref, () => ({
    exportImage: async (format) => {
      // Stub that will be called externally
      return '';
    },
    getDomNode: () => containerRef.current
  }));

  // Resolve palette colors based on choice
  const primaryColor = details.useExtractedPalette && extractedPalette[0] ? extractedPalette[0] : details.accentColor;
  const secondaryColor = details.useExtractedPalette && extractedPalette[1] ? extractedPalette[1] : details.secondaryColor;
  const accentText = details.isDarkTheme ? '#ffffff' : primaryColor;
  
  // Custom dark elegant background derived
  const customDarkBg = details.useExtractedPalette && extractedPalette[4] ? extractedPalette[4] : details.darkBgColor;

  // Custom textures and overlay patterns
  const bgStyle: React.CSSProperties = details.isDarkTheme
    ? { backgroundColor: customDarkBg, color: '#f3f4f6' }
    : { backgroundColor: '#ffffff', color: '#1f2937' };

  // Helper mock image wrapper
  const imageElement = details.image ? (
    <img
      src={details.image}
      alt="User upload"
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      style={{ filter: 'brightness(0.95) contrast(1.02)' }}
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-radial-gradient"
         style={{
           backgroundImage: `radial-gradient(circle at 50% 50%, ${primaryColor}22, ${secondaryColor}11)`,
           backgroundSize: '100% 100%'
         }}>
      <Sparkles className="w-12 h-12 mb-3 opacity-40 animate-pulse" style={{ color: primaryColor }} />
      <span className="text-xs font-mono uppercase tracking-widest opacity-60">IFMA Campus Carolina</span>
      <span className="text-2xs opacity-40 mt-1">Carregue uma imagem principal para a arte</span>
    </div>
  );
  
  // Helper to render customized, highlighted, and fully responsive title
  const renderTitle = (defaultClass: string, fallbackText: string, extraStyle: React.CSSProperties = {}) => {
    let titleText = details.title || fallbackText;
    if (details.titleUppercase || defaultClass.includes('uppercase')) {
      titleText = titleText.toUpperCase();
    }

    const finalStyle = { ...extraStyle };
    if (details.titleFontSize) {
      finalStyle.fontSize = `${details.titleFontSize}px`;
    }

    const highlight = details.titleHighlight ?? 'normal';
    switch (highlight) {
      case 'marker':
        return (
          <h1 className={`${defaultClass} leading-[1.3]`} style={finalStyle}>
            <span className="inline px-2.5 py-1.5 rounded bg-stone-900 text-white shadow-sm" 
                  style={{ 
                    backgroundColor: primaryColor,
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    color: '#ffffff',
                    textShadow: 'none',
                    backgroundImage: 'none',
                    WebkitTextFillColor: 'initial',
                    WebkitBackgroundClip: 'initial'
                  }}>
              {titleText}
            </span>
          </h1>
        );
      case 'gradient':
        return (
          <h1 className={`${defaultClass} bg-clip-text text-transparent`} 
              style={{
                ...finalStyle,
                backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${details.isDarkTheme ? '#ffffff' : '#0f172a'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
              }}>
            {titleText}
          </h1>
        );
      case 'border-solid':
        return (
          <h1 className={`${defaultClass} tracking-wide font-black`}
              style={{
                ...finalStyle,
                color: details.isDarkTheme ? '#ffffff' : '#0d2214',
                textShadow: `-1px -1px 0 ${primaryColor}, 1px -1px 0 ${primaryColor}, -1px 1px 0 ${primaryColor}, 1px 1px 0 ${primaryColor}, 4px 4px 0px ${secondaryColor}70`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
              }}>
            {titleText}
          </h1>
        );
      case 'normal':
      default:
        return (
          <h1 className={defaultClass} style={finalStyle}>
            {titleText}
          </h1>
        );
    }
  };

  // RENDER DYNAMIC LAYOUT PARTS
  const renderLayout = () => {
    switch (details.layout) {
      case 'noticia':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[6%] relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
            {/* Top-aligned premium double line accent */}
            <div className="absolute top-0 inset-x-0 h-[4px] flex z-20">
              <div className="flex-1" style={{ backgroundColor: primaryColor }} />
              <div className="w-[30%]" style={{ backgroundColor: secondaryColor }} />
            </div>

            {/* Micro aesthetic drafting coordinates */}
            <div className="absolute top-[11%] right-[6%] font-mono text-[7px] tracking-[0.25em] opacity-40 select-none pointer-events-none">
              // PRESS_RELEASE_03.CAROLINA
            </div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full blur-2xl opacity-10 pointer-events-none"
                 style={{ backgroundColor: primaryColor }} />

            {/* Header branding */}
            <div className="flex items-center justify-between border-b pb-[4%] relative z-10"
                 style={{ borderColor: `${primaryColor}20` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Premium Floating Category Badge with high-contrast text */}
              {details.category && (
                <span className="px-3.5 py-1.5 rounded-lg text-[9px] uppercase font-black tracking-widest text-white shadow-[0_4px_12px_rgba(11,122,59,0.25)] border border-white/10 transition-transform duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: primaryColor,
                        backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                      }}>
                  {details.category}
                </span>
              )}
            </div>

            {/* Core Artwork Image container, styled with fine-art double-outline borders */}
            <div className="my-[4.5%] flex-1 relative rounded-2xl overflow-hidden border border-neutral-205/30 dark:border-white/5 shadow-[0_12px_36px_rgba(0,0,0,0.16)] group transition-all duration-300"
                 style={{ outline: `1px solid ${primaryColor}20`, outlineOffset: '3.5px' }}>
              {imageElement}
              {details.credits && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[8.5px] text-white/90 opacity-90 flex items-center gap-1.5 border border-white/10 font-mono tracking-tight shadow-md">
                  <User className="w-[11px] h-[11px] text-emerald-400" /> {details.credits}
                </div>
              )}
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                {/* Event / Action header if date present */}
                {details.date && (
                  <div className="self-start flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-wide shadow-sm border"
                       style={{
                         backgroundColor: `${secondaryColor}12`,
                         borderColor: `${secondaryColor}30`,
                         color: secondaryColor
                       }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{details.date}</span>
                  </div>
                )}
                <div className="h-[1px] flex-grow opacity-60" style={{ backgroundColor: `${primaryColor}15` }} />
              </div>

              {/* Title & subtitle group */}
              <div className="flex flex-col gap-1.5">
                {renderTitle(
                  "text-2xl md:text-[30px] font-[1000] tracking-tight leading-[112%] filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.12)]",
                  "Título da Notícia Institucional",
                  { color: details.isDarkTheme ? '#ffffff' : '#0d1f14' }
                )}
                {details.subtitle && (
                  <p className="text-xs font-bold leading-relaxed opacity-95 border-l-[3.5px] pl-3"
                     style={{ borderColor: primaryColor, color: details.isDarkTheme ? '#cbd5e1' : '#334155' }}>
                    {details.subtitle}
                  </p>
                )}
              </div>

              {/* Description body with smooth line-clamp */}
              {details.description && (
                <p className="text-[10.5px] leading-relaxed opacity-85 line-clamp-3 my-0.5"
                   style={{ color: details.isDarkTheme ? '#f1f5f9' : '#475569' }}>
                  {details.description}
                </p>
              )}

              {/* Fine horizontal dividing rules */}
              <div className="flex items-center justify-between border-t pt-3.5 mt-1 border-dashed"
                   style={{ borderColor: `${primaryColor}20` }}>
                <span className="text-[8.5px] font-mono tracking-widest uppercase opacity-75 font-bold" style={{ color: details.isDarkTheme ? '#94a3b8' : '#475569' }}>
                  #OrgulhoDeSerIFMA • {details.event || 'Campus Carolina'}
                </span>
                <span className="text-[8.5px] font-black tracking-wider hover:opacity-80 transition underline decoration-dotted" style={{ color: primaryColor }}>
                  carolina.ifma.edu.br
                </span>
              </div>
            </div>
          </div>
        );

      case 'evento':
        return (
          <div className="w-full h-full flex flex-col justify-between relative p-[7%] overflow-hidden bg-gradient-to-tr from-stone-50 via-white to-emerald-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Elegant abstract technical blueprints lines */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(45deg, ${primaryColor} 1px, transparent 1px), linear-gradient(-45deg, ${secondaryColor} 1px, transparent 1px)`,
                   backgroundSize: '32px 32px' 
                 }} />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
                 style={{ backgroundColor: primaryColor }} />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-[0.05] pointer-events-none"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Event Header styling */}
            <div className="flex flex-col items-center text-center relative z-10 gap-2.5">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
                className="mb-1"
              />
              <span className="px-3.5 py-1.5 rounded-lg text-[9px] font-black tracking-widest text-white shadow-[0_4px_12px_rgba(200,16,46,0.25)] uppercase mb-0.5"
                    style={{ 
                      backgroundColor: secondaryColor,
                      backgroundImage: `linear-gradient(135deg, ${secondaryColor}, #9e0c24)`
                    }}>
                {details.category || 'EVENTO IFMA'}
              </span>
              
              {/* Premium Title displaying extreme contrast */}
              {renderTitle(
                "text-2xl md:text-[34px] font-[1000] tracking-tighter leading-[108%] uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]",
                "CONGRESSO ACADÊMICO",
                { color: details.isDarkTheme ? '#ffffff' : '#0f172a' }
              )}
              {details.subtitle && (
                <p className="text-[11px] font-black tracking-[0.16em] text-[#4b5563] dark:text-[#cbd5e1] uppercase mt-0.5">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Centered Picture Frame representing poster graphic */}
            <div className="my-[4.5%] flex-1 relative rounded-2xl overflow-hidden shadow-2xl skew-x-[-1deg] transition-transform duration-500 hover:skew-x-0 border-2"
                 style={{ borderColor: primaryColor }}>
              {imageElement}
              {details.event && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-[5%] text-left">
                  <div className="flex items-center gap-1.5 text-white/95 font-mono text-[9px] uppercase tracking-wider font-bold">
                    <MapPin className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>{details.event}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event parameters block styled as translucent Glassmorphism */}
            <div className="rounded-2xl p-4 border relative z-10 backdrop-blur-md shadow-xl transition"
                 style={{
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(11, 122, 59, 0.03)',
                   borderColor: `${primaryColor}22`
                 }}>
              <div className="grid grid-cols-2 gap-3 divide-x divide-neutral-250 dark:divide-neutral-800">
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1.5 mb-1" style={{ color: secondaryColor }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[9.5px] font-black uppercase tracking-widest font-sans">CRONOGRAMA</span>
                  </div>
                  <span className="text-[11px] font-black opacity-95 leading-tight text-neutral-800 dark:text-neutral-100">
                    {details.date || 'Em Breve'}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1.5 mb-1" style={{ color: primaryColor }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[9.5px] font-black uppercase tracking-widest font-sans">PORTAL INSCRIÇÕES</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono underline break-all leading-tight">
                    carolina.ifma.edu.br
                  </span>
                </div>
              </div>

              {details.description && (
                <div className="border-t mt-3 pt-2.5 border-neutral-200/20">
                  <p className="text-[10.5px] leading-relaxed opacity-85 text-center line-clamp-2"
                     style={{ color: details.isDarkTheme ? '#d1d5db' : '#4b5563' }}>
                    {details.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer and Source credits */}
            <div className="flex items-center justify-between text-[8px] opacity-75 mt-3.5 border-t pt-2.5 font-mono tracking-wider"
                 style={{ borderColor: `${primaryColor}20` }}>
              <span>IFMA CAMPUS CAROLINA • PORTAL OFICIAL</span>
              {details.credits ? <span className="font-extrabold text-red-650 dark:text-red-400">FONTE: {details.credits}</span> : <span>DIVULGAÇÃO ACADÊMICA</span>}
            </div>
          </div>
        );

      case 'esportivo':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden bg-stone-950 text-white select-none">
            {/* High-energy diagonal sports background bands */}
            <div className="absolute top-0 left-0 w-[150%] h-[35%] -skew-y-12 -translate-y-12 z-0 opacity-95 transition-all duration-500"
                 style={{ 
                   backgroundImage: `linear-gradient(135deg, ${primaryColor}, #053b1b)` 
                 }} />
            <div className="absolute bottom-0 left-[-10%] w-[120%] h-[15%] skew-y-6 translate-y-8 z-0 opacity-90"
                 style={{ backgroundColor: secondaryColor }} />
            
            {/* Decorative white/yellow diagonal lines */}
            <div className="absolute top-[8%] right-[8%] w-32 h-[3.5px] skew-x-[35deg] bg-white opacity-40 z-10" />
            <div className="absolute top-[18%] left-[30%] w-24 h-[1.5px] skew-x-[-35deg]" style={{ backgroundColor: secondaryColor }} />
            
            {/* Header branding (Sports format) */}
            <div className="px-[6%] pt-[6%] pb-[2%] flex flex-col items-center text-center relative z-10">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={true}
                colorOverride="#ffffff"
                size="sm"
                className="mb-3.5 opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
              <div className="inline-block px-4 py-1 rounded-sm skew-x-[-12deg] bg-yellow-400 text-black text-[10px] font-black tracking-widest uppercase shadow-[0_4px_12px_rgba(250,204,21,0.35)] mb-2.5">
                ⚡ {details.category || 'Competições / Jogos'} ⚡
              </div>
              
              {/* Ultra highlighted athletic title */}
              {renderTitle(
                "text-3xl md:text-[42px] font-[1000] tracking-tighter italic text-yellow-300 uppercase leading-[100%] drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] filter saturate-150-contrast-120",
                "MOMENTO ESPORTE"
              )}
              {details.subtitle && (
                <p className="text-[10px] font-black tracking-widest text-neutral-100 uppercase mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Dynamic skewed athletic Frame (Thick borders with outer container shadow) */}
            <div className="my-[3.5%] mx-[8%] flex-1 relative rounded-xl overflow-hidden border-4 shadow-2xl z-10"
                 style={{ borderColor: '#ffffff', outline: `3.5px solid ${primaryColor}` }}>
              {imageElement}
              {details.credits && (
                <span className="absolute top-2.5 left-2.5 bg-black/90 px-2.5 py-1 rounded text-[8px] font-mono font-black text-white border border-white/20">
                  📸 FOTO: {details.credits}
                </span>
              )}
            </div>

            {/* Details Box */}
            <div className="px-[8%] pb-[6%] relative z-10 flex flex-col gap-3">
              <div className="flex shadow-[0_8px_24px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden border border-white/10">
                <div className="flex-1 px-3 py-2 text-center text-white font-mono"
                     style={{ backgroundColor: secondaryColor }}>
                  <span className="block text-[8px] opacity-85 leading-none mb-1 font-sans font-black tracking-widest">DATA EXCLUSIVA</span>
                  <span className="text-[13px] font-black tracking-tighter">{details.date || 'CONFIRMAR'}</span>
                </div>
                <div className="flex-1 px-3 py-2 text-center text-white bg-neutral-900 border-l border-white/10">
                  <span className="block text-[8px] opacity-85 leading-none mb-1 font-sans tracking-widest">LOCAL / GINÁSIO</span>
                  <span className="text-[10.5px] font-black uppercase truncate block">{details.event || 'CAMPUS CAROLINA'}</span>
                </div>
              </div>

              {details.description && (
                <p className="text-[10.5px] italic leading-relaxed text-center font-bold line-clamp-2 px-1 text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  "{details.description}"
                </p>
              )}

              {/* Dynamic Slogan Bar */}
              <div className="flex items-center justify-between text-[8px] tracking-widest font-black uppercase pt-1 text-neutral-400">
                <span className="text-emerald-400">IFMA ATLETISMO</span>
                <span className="text-red-400">SAÚDE & SUPERAÇÃO</span>
              </div>
            </div>
          </div>
        );

      case 'comemoracao':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[8%] relative overflow-hidden bg-gradient-to-b from-stone-900 via-neutral-950 to-stone-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-white">
            {/* Elegant luxury gala gold/white shining background elements */}
            <div className="absolute top-12 left-5 w-40 h-40 rounded-full blur-3xl opacity-20"
                 style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-20 right-5 w-48 h-48 rounded-full blur-3xl opacity-20"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Gala star overlays */}
            <div className="absolute top-6 right-[15%] opacity-50"><Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" /></div>
            <div className="absolute top-[30%] left-[10%] opacity-35"><Sparkles className="w-3.5 h-3.5 text-yellow-400" /></div>
            <div className="absolute bottom-24 right-[12%] opacity-60"><Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /></div>

            {/* Decorative Corner ribbon polygons */}
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-25">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ fill: primaryColor }}>
                <polygon points="100,0 0,0 100,100" />
              </svg>
            </div>

            {/* Header Brand Seal */}
            <div className="flex flex-col items-center text-center relative z-10 pt-2.5">
              <IfmaLogo
                variant="vertical"
                isDarkTheme={true}
                colorOverride={primaryColor}
                size="sm"
                className="scale-95 mb-1"
              />
            </div>

            {/* Circular picture encased with elegant dynamic border rings */}
            <div className="my-[4.5%] mx-auto w-[48%] aspect-square relative rounded-full overflow-hidden border-4 shadow-2xl z-10 group"
                 style={{ borderColor: primaryColor, outline: `3px solid ${secondaryColor}20`, outlineOffset: '4.5px' }}>
              {imageElement}
            </div>

            {/* Large festive typography in frosted translucent card */}
            <div className="text-center relative z-10 flex flex-col gap-2 px-3">
              <span className="text-[10px] font-black tracking-[0.25em] z-10 uppercase text-yellow-300 saturate-150-contrast-120 animate-pulse">
                ✦ {details.category || 'DATA COMEMORATIVA'} ✦
              </span>
              
              {/* Boxed Title for Celebration */}
              <div className="inline-block py-2.5 px-[6%] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
                {renderTitle(
                  "text-2xl md:text-[29px] font-black tracking-tight leading-tight uppercase text-yellow-300",
                  "Parabéns e Celebrações"
                )}
              </div>
              
              {details.subtitle && (
                <p className="text-xs italic font-bold tracking-wide leading-normal text-slate-100 max-w-[90%] mx-auto mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Description message */}
            {details.description && (
              <div className="relative z-10 text-center px-[5%] max-w-[95%] mx-auto">
                <p className="text-[10.5px] leading-relaxed font-medium text-stone-200">
                  {details.description}
                </p>
              </div>
            )}

            {/* Premium Date stamp layout */}
            <div className="flex flex-col items-center relative z-10 border-t pt-3.5 mt-1"
                 style={{ borderColor: `${primaryColor}25` }}>
              <span className="text-[11.5px] font-black tracking-wider text-yellow-300 font-mono">
                {details.date || 'EXCLUSIVO'}
              </span>
              <span className="text-[8px] uppercase font-mono tracking-widest opacity-75 mt-0.5">
                {details.event || 'CAMPUS CAROLINA • EDUCAÇÃO DO FUTURO'}
              </span>
            </div>
          </div>
        );

      case 'minimalista':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[9%] relative overflow-hidden bg-white text-stone-900 border-[6px] border-neutral-100 select-none">
            {/* Minimal line accents */}
            <div className="absolute inset-x-0 top-0 h-[5px]" style={{ backgroundColor: primaryColor }} />
            
            {/* Fine Drafting Grid Accent */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                   backgroundImage: `radial-gradient(${primaryColor} 1.5px, transparent 1.5px)`, 
                   backgroundSize: '20px 20px' 
                 }} />

            {/* Swiss Editorial Index markings */}
            <div className="absolute left-[9%] top-[10%] font-mono text-[6.5px] tracking-[0.2em] text-neutral-400">
              [ EDITION_2026 // NO.08 ]
            </div>

            {/* Header branding */}
            <div className="flex items-center justify-between relative z-10 border-b pb-3.5 border-neutral-200 mt-2">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={false}
                colorOverride={primaryColor}
                size="sm"
                className="scale-90 origin-left mt-2"
              />
              <span className="text-[9.5px] font-mono tracking-[0.2em] uppercase font-black" style={{ color: secondaryColor }}>
                {details.category || 'INFORMATIVO'}
              </span>
            </div>

            {/* Main Visual Image matching offset outline design */}
            <div className="my-[5%] flex-1 relative rounded-lg overflow-hidden bg-neutral-100 shadow-[2px_18px_40px_rgba(0,0,0,0.06)] border border-neutral-200 transition-all duration-300"
                 style={{ outline: `1px solid ${primaryColor}20`, outlineOffset: '4px' }}>
              {imageElement}
            </div>

            {/* Swiss/Scandinavian typographic structure */}
            <div className="flex flex-col gap-3.5 relative z-10 text-left">
              <div className="flex gap-3.5 items-stretch text-left">
                <div className="w-1.5 rounded" style={{ backgroundColor: primaryColor }} />
                
                {details.titleHighlight !== 'normal' || details.titleFontSize || details.titleUppercase ? (
                  renderTitle(
                    "text-2xl md:text-[27px] font-light tracking-tight text-neutral-950 leading-[115%]",
                    "Informativo"
                  )
                ) : (
                  <h1 className="text-2xl md:text-[27px] font-light tracking-tight text-neutral-950 leading-[115%]">
                    {details.title ? (
                      <span>
                        {details.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 0 || i === 1 ? 'font-[1000] text-stone-950 pr-1.5 block md:inline uppercase' : 'font-light text-stone-700 pr-1.5'}>
                            {word}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="font-[1000] text-stone-950 block uppercase">Informativo</span>
                    )}
                  </h1>
                )}
              </div>

              {details.subtitle && (
                <p className="text-[10.5px] tracking-widest text-neutral-500 uppercase font-bold pl-4">
                  {details.subtitle}
                </p>
              )}

              {details.description && (
                <p className="text-[10.5px] leading-relaxed text-neutral-600 line-clamp-3 pl-4">
                  {details.description}
                </p>
              )}

              {/* Symmetrical fine print coordinates */}
              <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 pt-3 border-t border-neutral-200/50">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-extrabold">{details.event || 'CAMPUS CAROLINA'}</span>
                </div>
                <span>{details.date || 'IFMA OFFICIAL RELEASE'}</span>
              </div>
            </div>
          </div>
        );

      case 'campanha':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden p-[7%] bg-gradient-to-br from-emerald-50 via-white to-red-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors">
            {/* Youth campaign abstract style (vibrant modern shapes) */}
            <div className="absolute top-0 right-[-10%] w-[65%] h-[65%] rotate-12 opacity-[0.12] pointer-events-none"
                 style={{
                   background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                   borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
                 }} />
            <div className="absolute bottom-[-5%] left-[-10%] w-[55%] h-[55%] -rotate-12 opacity-[0.12] pointer-events-none"
                 style={{
                   background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                   borderRadius: '50% 50% 30% 70% / 50% 60% 40% 60%'
                 }} />

            {/* Campaign tag with active pulsing dot */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-250/30">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse animate-duration-1000" />
                <span className="text-[9px] font-black tracking-wider uppercase text-neutral-800 dark:text-neutral-200">
                  {details.category || 'Campanha Estudantil'}
                </span>
              </div>
              
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
                className="scale-85 origin-right"
              />
            </div>

            {/* Polaroid style rounded visual frame for campaign */}
            <div className="my-[4.5%] flex-1 relative rounded-3xl overflow-hidden border shadow-[0_16px_40px_rgba(0,0,0,0.12)] z-10 transition-transform duration-500 hover:rotate-0"
                 style={{ 
                   borderColor: `${primaryColor}30`,
                   borderRadius: '40px 6px 40px 40px' 
                 }}>
              {imageElement}
            </div>

            {/* Premium speech dialogue capsule with cartoon bubble shadow */}
            <div className="relative z-10 flex flex-col gap-3">
              <div className="text-white rounded-2xl p-4 md:p-5 shadow-2xl relative border"
                   style={{ 
                     backgroundImage: `linear-gradient(135deg, ${primaryColor}, #051a0d)`,
                     borderColor: `${primaryColor}45`
                   }}>
                {/* Speech arrow */}
                <div className="absolute top-[-7px] left-8 w-4 h-4 rotate-45 border-t border-l"
                     style={{ 
                       backgroundColor: primaryColor,
                       borderColor: `${primaryColor}30` 
                     }} />
                
                {renderTitle(
                  "text-xl md:text-[23px] font-[1000] tracking-tight leading-tight uppercase text-yellow-300 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.4)]",
                  "#ConexãoEstudantil IFMA"
                )}
                {details.subtitle && (
                  <p className="text-[11px] text-white/95 font-black uppercase tracking-widest mt-1.5 opacity-90">
                    {details.subtitle}
                  </p>
                )}
              </div>

              {details.description && (
                <p className="text-[10.5px] leading-relaxed opacity-95 px-2.5 font-bold text-neutral-700 dark:text-neutral-300">
                  {details.description}
                </p>
              )}

              {/* Slogan details footer */}
              <div className="flex items-center justify-between text-[8px] font-mono tracking-wider pt-2.5 border-t"
                   style={{ borderColor: `${primaryColor}20` }}>
                <span className="font-black text-neutral-500 dark:text-neutral-300">@IFMACAMPUSCAROLINA</span>
                <span className="text-white px-2.5 py-1 rounded-md font-black uppercase text-[7.5px]"
                      style={{ backgroundColor: secondaryColor }}>
                  {details.date || 'PARTICIPE'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'oportunidade':
        return (
          <div className="flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full bg-gradient-to-tr from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Blueprint architecture technical lines background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ 
                   backgroundImage: `radial-gradient(${primaryColor} 1.5px, transparent 1.5px)`,
                   backgroundSize: '16px 16px' 
                 }} />
            
            <div className="absolute top-0 left-1/4 w-80 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
                 style={{ backgroundColor: primaryColor }} />

            {/* Header section with dashed borders */}
            <div className="flex items-center justify-between relative z-10 border-b pb-4 border-dashed"
                 style={{ borderColor: `${primaryColor}25` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Symmetrical coordination widget badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black tracking-widest uppercase bg-white/40 dark:bg-black/40 backdrop-blur-md"
                   style={{ 
                     borderColor: `${secondaryColor}30`,
                     color: secondaryColor
                   }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: secondaryColor }} />
                <span>{details.category || 'OPORTUNIDADE'}</span>
              </div>
            </div>

            {/* Split Content with blueprint coordinate sights */}
            <div className="my-[4.5%] flex-1 flex flex-col justify-center gap-4 relative z-10">
              {/* Graphic framed precisely like drafting board plots */}
              <div className="w-full h-[40%] min-h-[145px] relative rounded-2xl overflow-hidden shadow-lg border-2 group"
                   style={{ borderColor: `${primaryColor}40` }}>
                {imageElement}
                
                {details.credits && (
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/90 text-[7.5px] text-white font-mono font-bold border border-white/10 opacity-90 shadow-md">
                    📂 DOC: {details.credits}
                  </div>
                )}

                {/* Technical targeting crosshairs */}
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-r border-t opacity-50" style={{ borderColor: primaryColor }} />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-r border-b opacity-50" style={{ borderColor: primaryColor }} />
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-l border-t opacity-50" style={{ borderColor: primaryColor }} />
              </div>

              {/* Blueprint details panel */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-900 border border-neutral-250 dark:border-white/5 font-mono"
                        style={{ color: primaryColor }}>
                    // DESIGN_PLOT_UNIT_CAROLINA
                  </span>
                  <div className="h-[1px] flex-1" style={{ backgroundColor: `${primaryColor}20` }} />
                </div>

                {/* Bold, premium responsive title */}
                {renderTitle(
                  "text-2xl md:text-[28px] font-[1000] tracking-tight leading-[115%]",
                  "Inscrições Abertas / Oportunidade",
                  { color: details.isDarkTheme ? '#ffffff' : '#0f172a' }
                )}

                {details.subtitle && (
                  <p className="text-xs font-black leading-normal border-l-[3.5px] pl-3 text-stone-500 dark:text-stone-300"
                     style={{ borderColor: secondaryColor }}>
                    {details.subtitle}
                  </p>
                )}

                {details.description && (
                  <p className="text-[10.5px] leading-relaxed opacity-85 line-clamp-3 mt-1.5"
                     style={{ color: details.isDarkTheme ? '#e2e8f0' : '#475569' }}>
                    {details.description}
                  </p>
                )}
              </div>
            </div>

            {/* Symmetrical visual bento data boxes */}
            <div className="relative z-10 rounded-2xl p-3.5 border grid grid-cols-2 gap-3 shadow-md"
                 style={{ 
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(11, 122, 59, 0.03)',
                   borderColor: `${primaryColor}25` 
                 }}>
              <div className="flex flex-col justify-center">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-[#475569] dark:text-[#cbd5e1] block mb-0.5">PRAZOS LIMITE</span>
                <span className="text-[11.5px] font-black uppercase tracking-tighter text-red-650 dark:text-red-400">
                  ⏳ {details.date || 'Verificar Edital'}
                </span>
              </div>
              <div className="flex flex-col justify-center border-l pl-3.5 border-dashed"
                   style={{ borderColor: `${primaryColor}25` }}>
                <span className="text-[7.5px] font-black uppercase tracking-widest text-[#475569] dark:text-[#cbd5e1] block mb-0.5">DEPARTAMENTO ORGANIZADOR</span>
                <span className="text-[11.5px] font-black uppercase tracking-tight text-neutral-800 dark:text-neutral-100 truncate">
                  🏛️ {details.event || 'Campus Carolina'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-3 mt-3 relative z-10"
                 style={{ borderColor: `${primaryColor}15` }}>
              <span className="text-[8.5px] font-mono tracking-widest uppercase opacity-75 font-bold" style={{ color: details.isDarkTheme ? '#94a3b8' : '#475569' }}>
                PROGRAMA DE ASSISTÊNCIA ESTUDANTIL • IFMA
              </span>
              <span className="text-[8.5px] font-black tracking-wide underline" style={{ color: primaryColor }}>
                carolina.ifma.edu.br
              </span>
            </div>
          </div>
        );

      case 'pesquisa':
        return (
          <div className={`flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full ${details.isDarkTheme ? 'text-white bg-neutral-950' : 'text-stone-900 bg-stone-50'}`}>
            {/* Linear technical micro circuit in backgrounds */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="circuit" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M0 25 H50 M25 0 V50 M25 25 L35 35" fill="none" stroke={primaryColor} strokeWidth="1" />
                  <circle cx="25" cy="25" r="3.5" fill={secondaryColor} />
                  <circle cx="35" cy="35" r="2.5" fill={primaryColor} />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>

            {/* Left side green accent strip line */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-[4px] rounded-r"
                 style={{ backgroundColor: primaryColor }} />
            
            {/* Techno status panel */}
            <div className="absolute right-5 top-5 font-mono text-[7px] tracking-[0.2em] text-emerald-500 opacity-70 uppercase font-black">
              [ SYSTEM_CORE_OK ]
            </div>

            {/* Header section with refined placement */}
            <div className="flex items-center justify-between relative z-10">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Technological Scientific Badge */}
              <span className="bg-[#15803d]/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm">
                🔬 CIÊNCIA & PESQUISA
              </span>
            </div>

            {/* Picture Frame with glowing double boundaries */}
            <div className="my-[4.5%] flex-1 relative rounded-2xl overflow-hidden border shadow-inner group"
                 style={{ borderColor: `${primaryColor}60`, outline: `1px solid ${primaryColor}25`, outlineOffset: '4px' }}>
              {imageElement}
              
              {/* Symmetrical target reticle on photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-[8.5px] font-mono tracking-widest border border-white/10 uppercase text-white font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{details.event || 'DESENVOLVIMENTO CIENTÍFICO'}</span>
              </div>
            </div>

            {/* Content titles columns */}
            <div className="relative z-10 flex flex-col gap-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[8.5px] font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-black">
                  INFORMAÇÃO CIENTÍFICA / PROPESP CAROLINA
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
              </div>

              {/* Glowing scientific bold title */}
              {renderTitle(
                "text-2xl md:text-[27px] font-[1000] tracking-tight leading-[110%] uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]",
                "Pesquisa Científica e Inovação",
                { color: details.isDarkTheme ? '#ffffff' : '#0a1d12' }
              )}

              {details.subtitle && (
                <p className="text-[11.5px] font-black italic tracking-wide leading-relaxed border-l-[3.5px] pl-3"
                   style={{ borderColor: secondaryColor, color: details.isDarkTheme ? '#cbd5e1' : '#4b5563' }}>
                  {details.subtitle}
                </p>
              )}

              {details.description && (
                <p className="text-[10px] leading-relaxed opacity-85 line-clamp-3 my-0.5"
                   style={{ color: details.isDarkTheme ? '#cbd5e1' : '#475569' }}>
                  {details.description}
                </p>
              )}
            </div>

            {/* Techno widgets blocks parameters */}
            <div className="grid grid-cols-2 gap-3 mt-3.5 relative z-10">
              <div className="bg-stone-100 dark:bg-stone-900/90 rounded-xl p-2.5 border border-neutral-200 dark:border-stone-850">
                <span className="block text-[7.5px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-0.5">DATA PUBLICAÇÃO</span>
                <span className="text-[10.5px] font-black text-neutral-800 dark:text-neutral-100">
                  📅 {details.date || 'Maio de 2026'}
                </span>
              </div>
              <div className="bg-stone-100 dark:bg-stone-900/90 rounded-xl p-2.5 border border-neutral-200 dark:border-stone-850">
                <span className="block text-[7.5px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-extrabold mb-0.5">CRÉDITOS FONTE</span>
                <span className="text-[10.5px] font-black text-neutral-800 dark:text-neutral-100 truncate block">
                  ✍️ {details.credits || 'Secom Campus Carolina'}
                </span>
              </div>
            </div>

            {/* Slogan details footer */}
            <div className="flex items-center justify-between border-t pt-3 mt-3.5 relative z-10 border-neutral-200 dark:border-stone-850 font-mono text-[7.5px] text-[#64748b] tracking-wider uppercase">
              <span>IFMA CAROLINA • CIÊNCIA APLICADA</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition" style={{ color: primaryColor }}>propesp.ifma.edu.br</span>
            </div>
          </div>
        );

      case 'depoimento':
        return (
          <div className="flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Elegant high contract design elements */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ 
                   backgroundImage: `radial-gradient(${secondaryColor} 1.5px, transparent 1.5px)`,
                   backgroundSize: '20px 20px' 
                 }} />
            
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Brand Logo Header */}
            <div className="flex items-center justify-between relative z-10 border-b pb-4"
                 style={{ borderColor: `${primaryColor}20` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              <span className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-900 border text-[8.5px] font-black tracking-widest uppercase rounded-lg shadow-sm"
                    style={{ 
                      color: secondaryColor,
                      borderColor: `${secondaryColor}25`
                    }}>
                👤 HISTÓRIAS DE SUCESSO
              </span>
            </div>

            {/* Circular testifier profile with custom circular glowing halo ring */}
            <div className="my-[4.5%] flex-1 flex flex-col items-center justify-center gap-4.5 relative z-10">
              <div className="w-[32%] aspect-square relative rounded-full overflow-hidden border-4 bg-stone-100 shadow-2xl transition-transform duration-500 hover:scale-105"
                   style={{ borderColor: primaryColor, outline: `3px solid ${primaryColor}20`, outlineOffset: '4.5px' }}>
                {imageElement}
                
                {/* Visual student marker badge overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/85 text-[7px] text-white py-1 text-center font-bold tracking-widest uppercase truncate font-mono">
                  {details.credits || 'EGRESSO / ALUNO'}
                </div>
              </div>

              {/* Symmetrical large quotes styling */}
              <span className="text-5xl font-serif font-black italic leading-none opacity-50 -mb-2 mt-2"
                    style={{ color: secondaryColor }}>
                “
              </span>

              {/* Testifier speech content group */}
              <div className="text-center flex flex-col gap-2.5 max-w-[95%]">
                {/* Highlight customized quotes text */}
                {renderTitle(
                  "text-lg md:text-xl font-extrabold tracking-tight leading-relaxed italic text-stone-900 dark:text-stone-100 px-2.5",
                  '"A educação científica mudou os rumos do meu destino."',
                  { color: details.isDarkTheme ? '#ffffff' : '#0f172a' }
                )}

                {/* Vertical aesthetic separation line */}
                <div className="w-16 h-[2.5px] mx-auto rounded" style={{ backgroundColor: secondaryColor }} />

                {details.subtitle && (
                  <p className="text-[11px] font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-wide leading-snug">
                    {details.subtitle}
                  </p>
                )}

                {details.description && (
                  <p className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400 font-medium px-[6%] line-clamp-3">
                    {details.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom academic seal stamps block */}
            <div className="relative z-10 rounded-xl p-3 border text-center border-neutral-250 shadow-sm"
                 style={{ 
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(200, 16, 46, 0.03)',
                   borderColor: `${secondaryColor}15` 
                 }}>
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                🎓 {details.date || 'Orgulho de fazer parte da história do IFMA Campus Carolina'}
              </span>
            </div>

            {/* Federal network citation seal */}
            <div className="flex items-center justify-between border-t pt-3 mt-3 relative z-10 border-neutral-150 text-[8.5px] font-mono uppercase text-neutral-400">
              <span className="font-bold">REDE FEDERAL DE EDUCAÇÃO PROFISSIONAL</span>
              <span className="font-extrabold text-red-650 dark:text-red-400 select-none" style={{ color: secondaryColor }}>#DEPOIMENTOS</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Dimensions formatted visually safely for preview
  const scaleRatio = zoom;
  const containerWidth = activeFormat.width * scaleRatio;
  const containerHeight = activeFormat.height * scaleRatio;

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      {/* Simulation Info */}
      <div className="mb-2 text-2xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
        <span>Preview Real ({activeFormat.width}x{activeFormat.height}px)</span>
        <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[9px] text-neutral-500">
          Zoom: {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Actual canvas frame mimicking final render container */}
      <div className="shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden rounded-xl transition-all duration-300 transform"
           style={{
             width: `${containerWidth}px`,
             height: `${containerHeight}px`,
           }}>
        
        {/* Render container scaling inner contents based on layout pixels */}
        <div
          id="ifma-post-render-node"
          ref={containerRef}
          className="relative origin-top-left flex flex-col"
          style={{
            width: `${activeFormat.width}px`,
            height: `${activeFormat.height}px`,
            transform: `scale(${scaleRatio})`,
            ...bgStyle,
          }}
        >
          {renderLayout()}
        </div>
      </div>
    </div>
  );
});

PreviewArea.displayName = 'PreviewArea';
