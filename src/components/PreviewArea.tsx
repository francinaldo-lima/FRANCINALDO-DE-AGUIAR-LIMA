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

  // RENDER DYNAMIC LAYOUT PARTS
  const renderLayout = () => {
    switch (details.layout) {
      case 'noticia':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[6%] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] opacity-[0.04] pointer-events-none"
                 style={{
                   backgroundImage: `radial-gradient(ellipse at top right, ${primaryColor}, transparent)`
                 }} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-5"
                 style={{ backgroundColor: secondaryColor }} />
                 
            {/* Header branding */}
            <div className="flex items-center justify-between border-b pb-[4%] relative z-10"
                 style={{ borderColor: `${primaryColor}25` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Category Badge */}
              {details.category && (
                <span className="px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest text-white shadow-md border border-white/10"
                      style={{ backgroundColor: primaryColor }}>
                  {details.category}
                </span>
              )}
            </div>

            {/* Core Artwork Image container */}
            <div className="my-[4.5%] flex-1 relative rounded-xl overflow-hidden border shadow-lg group"
                 style={{ borderColor: `${primaryColor}25` }}>
              {imageElement}
              {details.credits && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[8px] text-white opacity-80 flex items-center gap-1 border border-white/5">
                  <User className="w-[10px] h-[10px]" /> {details.credits}
                </div>
              )}
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 flex flex-col gap-3">
              {/* Event / Action header if date present */}
              {details.date && (
                <div className="self-start flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-wide shadow-xs border"
                     style={{
                       backgroundColor: `${secondaryColor}10`,
                       borderColor: `${secondaryColor}30`,
                       color: secondaryColor
                     }}>
                  <Calendar className="w-3 h-3" />
                  <span>{details.date}</span>
                </div>
              )}

              {/* Title group */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl md:text-[27px] font-[1000] tracking-tight leading-[112%] filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                    style={{ color: details.isDarkTheme ? '#ffffff' : '#0a1d12' }}>
                  {details.title || 'Título da Notícia Institucional'}
                </h1>
                {details.subtitle && (
                  <p className="text-xs font-semibold leading-relaxed opacity-90 border-l-3 pl-2.5"
                     style={{ borderColor: primaryColor, color: details.isDarkTheme ? '#cbd5e1' : '#4b5563' }}>
                    {details.subtitle}
                  </p>
                )}
              </div>

              {/* Description */}
              {details.description && (
                <p className="text-[10.5px] leading-relaxed opacity-80 line-clamp-3 my-0.5"
                   style={{ color: details.isDarkTheme ? '#e2e8f0' : '#475569' }}>
                  {details.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-3 mt-1"
                   style={{ borderColor: `${primaryColor}20` }}>
                <span className="text-[8px] font-mono tracking-wider uppercase opacity-65">
                  #OrgulhoDeSerIFMA • {details.event || 'Campus Carolina'}
                </span>
                <span className="text-[8px] font-black tracking-wide underline" style={{ color: primaryColor }}>
                  carolina.ifma.edu.br
                </span>
              </div>
            </div>
          </div>
        );

      case 'evento':
        return (
          <div className="w-full h-full flex flex-col justify-between relative p-[7%] overflow-hidden">
            {/* Geometric backgrounds */}
            <div className="absolute top-0 right-0 w-[140%] h-[140%] translate-x-[40%] -translate-y-[40%] rounded-full opacity-10 pointer-events-none"
                 style={{
                   backgroundImage: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
                 }} />
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] translate-x-[-20%] translate-y-[20%] opacity-5"
                 style={{
                   background: `linear-gradient(45deg, ${secondaryColor}, transparent)`
                 }} />

            {/* Event Header styling */}
            <div className="flex flex-col items-center text-center relative z-10 gap-2">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
                className="mb-1"
              />
              <span className="px-3.5 py-1 rounded-full text-[9px] font-black tracking-widest text-white shadow-md uppercase mb-0.5"
                    style={{ backgroundColor: secondaryColor }}>
                {details.category || 'EVENTO IFMA'}
              </span>
              
              {/* Premium Gradient Title with extreme contrast shadow */}
              <h1 className="text-2xl md:text-[34px] font-[1000] tracking-tighter leading-[108%] uppercase bg-clip-text text-transparent bg-gradient-to-r filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                  }}>
                {details.title || 'CONGRESSO ACADÊMICO'}
              </h1>
              {details.subtitle && (
                <p className="text-[11px] font-bold tracking-widest text-[#52525b] dark:text-[#a1a1aa] uppercase mt-0.5">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Highlight Centered Frame for Event Poster */}
            <div className="my-[5%] flex-1 relative rounded-xl overflow-hidden border-2 shadow-2xl skew-x-[-1.5deg]"
                 style={{ borderColor: primaryColor }}>
              {imageElement}
              {details.event && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-left">
                  <div className="flex items-center gap-1.5 text-white/90 font-mono text-2xs uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-red-500 animate-pulse" />
                    <span>{details.event}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event details block (Glassmorphism layout) */}
            <div className="rounded-xl p-4 border relative z-10 backdrop-blur-md shadow-lg"
                 style={{
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(11, 122, 59, 0.04)',
                   borderColor: `${primaryColor}25`
                 }}>
              <div className="grid grid-cols-2 gap-3 divide-x divide-neutral-200 dark:divide-neutral-850">
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1 mb-1" style={{ color: secondaryColor }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">QUANDO</span>
                  </div>
                  <span className="text-[11px] font-extrabold opacity-95 leading-tight text-neutral-800 dark:text-neutral-100">
                    {details.date || 'Em Breve'}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="flex items-center gap-1 mb-1" style={{ color: primaryColor }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">SITE PORTAL</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono underline break-all leading-tight">
                    carolina.ifma.edu.br
                  </span>
                </div>
              </div>

              {details.description && (
                <div className="border-t mt-3 pt-2.5 border-neutral-200/20">
                  <p className="text-[10px] leading-relaxed opacity-85 text-center line-clamp-2"
                     style={{ color: details.isDarkTheme ? '#d1d5db' : '#4b5563' }}>
                    {details.description}
                  </p>
                </div>
              )}
            </div>

            {/* Credits & Official Brand */}
            <div className="flex items-center justify-between text-[8px] opacity-70 mt-3 border-t pt-2"
                 style={{ borderColor: `${primaryColor}20` }}>
              <span>IFMA CAMPUS CAROLINA • PORTAL DE EVENTOS</span>
              {details.credits ? <span>FONTE: {details.credits}</span> : <span>DIVULGAÇÃO ACADÊMICA</span>}
            </div>
          </div>
        );

      case 'esportivo':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden bg-radial-gradient">
            {/* Dynamic high contrast diagonal bands */}
            <div className="absolute top-0 left-0 w-full h-[32%] -skew-y-6 -translate-y-[20%] z-0"
                 style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-0 left-0 w-full h-[12%] skew-y-6 translate-y-[20%] z-0"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Corner Decorative dynamic lines */}
            <div className="absolute top-[8%] right-[10%] w-24 h-1 skew-x-[30deg] bg-white opacity-40 z-10" />
            <div className="absolute top-[16%] left-[45%] w-16 h-[2px] skew-x-[-30deg]" style={{ backgroundColor: secondaryColor }} />

            {/* Header Title with heavy drop shadows (Sports Theme) */}
            <div className="px-[6%] pt-[6%] pb-[2%] flex flex-col items-center text-center relative z-10">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={true}
                colorOverride="#ffffff"
                size="sm"
                className="mb-3 opacity-95 drop-shadow-md"
              />
              <div className="inline-block px-4 py-0.5 rounded-sm skew-x-[-10deg] bg-yellow-400 text-black text-[9.5px] font-black tracking-widest uppercase shadow-md mb-2">
                {details.category || 'Competições / Jogos'}
              </div>
              
              {/* Ultra highlighted sporty title */}
              <h1 className="text-3xl md:text-[42px] font-[1000] tracking-tighter italic text-yellow-300 uppercase leading-[100%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] filter saturate-150">
                {details.title || 'MOMENTO ESPORTE'}
              </h1>
              {details.subtitle && (
                <p className="text-[10px] font-black tracking-widest text-[#ffffffea] uppercase mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Sporty frame structure (Thick double borders, tilted) */}
            <div className="my-[4%] mx-[8%] flex-1 relative rounded-lg overflow-hidden border-4 shadow-2xl z-10"
                 style={{ borderColor: '#ffffff', outline: `3px solid ${primaryColor}` }}>
              {imageElement}
              {details.credits && (
                <span className="absolute top-2 left-2 bg-black/85 px-2 py-0.5 rounded text-[8px] text-white font-bold border border-white/10">
                  📸 {details.credits}
                </span>
              )}
            </div>

            {/* Bottom details with block styling */}
            <div className="px-[8%] pb-[6%] relative z-10 flex flex-col gap-2.5">
              <div className="flex shadow-lg rounded-md overflow-hidden border border-white/20">
                <div className="flex-1 px-3 py-2 text-center text-white font-mono"
                     style={{ backgroundColor: secondaryColor }}>
                  <span className="block text-[8px] opacity-80 leading-none mb-0.5 font-sans font-black">DATA EXCLUSIVA</span>
                  <span className="text-[12.5px] font-black">{details.date || 'CONFIRMAR'}</span>
                </div>
                <div className="flex-1 px-3 py-2 text-center text-white bg-neutral-900 border-l border-white/10">
                  <span className="block text-[8px] opacity-85 leading-none mb-0.5">LOCAL / EVENTO</span>
                  <span className="text-[10.5px] font-black uppercase truncate block">{details.event || 'CAMPUS carolina'}</span>
                </div>
              </div>

              {details.description && (
                <p className="text-[10px] italic leading-relaxed text-center font-semibold line-clamp-2"
                   style={{ color: details.isDarkTheme ? '#f1f5f9' : '#1e293b' }}>
                  "{details.description}"
                </p>
              )}

              {/* Dynamic educational slogan */}
              <div className="flex items-center justify-between text-[8px] tracking-wider uppercase opacity-85 pt-1">
                <span className="font-extrabold" style={{ color: primaryColor }}>IFMA ESPORTES</span>
                <span className="font-extrabold" style={{ color: secondaryColor }}>SAÚDE & INTEGRAÇÃO</span>
              </div>
            </div>
          </div>
        );

      case 'comemoracao':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[8%] relative overflow-hidden">
            {/* Celebration abstract circles and stars in dynamic style */}
            <div className="absolute top-10 left-5 w-24 h-24 rounded-full blur-2xl opacity-15"
                 style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-20 right-5 w-32 h-32 rounded-full blur-2xl opacity-15"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Ribbon element decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ fill: primaryColor }}>
                <polygon points="100,0 0,0 100,100" />
              </svg>
            </div>

            {/* Header Brand with elegant IFMA Vertical seal */}
            <div className="flex flex-col items-center text-center relative z-10 pt-2">
              <IfmaLogo
                variant="vertical"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
                className="scale-95 mb-1"
              />
            </div>

            {/* Aesthetic circle frame for celebratory photo */}
            <div className="my-[5%] mx-auto w-[46%] aspect-square relative rounded-full overflow-hidden border-4 shadow-xl z-10"
                 style={{ borderColor: primaryColor }}>
              {imageElement}
            </div>

            {/* Large festive typography - beautifully boxed inside a translucent fine tablet */}
            <div className="text-center relative z-10 flex flex-col gap-2 px-[4%]">
              <span className="text-[11px] font-black tracking-widest uppercase"
                    style={{ color: secondaryColor }}>
                {details.category || 'DATA COMEMORATIVA'}
              </span>
              
              {/* Premium Boxed Title for Celebration */}
              <div className="inline-block py-2 px-4 rounded-2xl bg-white/20 dark:bg-black/35 backdrop-blur-md border border-neutral-200/10 shadow-lg">
                <h1 className="text-2xl md:text-[29px] font-black tracking-tight leading-tight uppercase"
                    style={{ color: primaryColor }}>
                  ✨ {details.title || 'Parabéns e Celebrações'} ✨
                </h1>
              </div>
              
              {details.subtitle && (
                <p className="text-xs italic font-semibold tracking-wide opacity-90 leading-normal max-w-[90%] mx-auto text-neutral-800 dark:text-neutral-200 mt-1">
                  {details.subtitle}
                </p>
              )}
            </div>

            {/* Slogan and message descriptions */}
            {details.description && (
              <div className="relative z-10 text-center px-4 max-w-[95%] mx-auto my-1.5">
                <p className="text-[10px] leading-relaxed opacity-85 font-medium"
                   style={{ color: details.isDarkTheme ? '#e2e8f0' : '#374151' }}>
                  {details.description}
                </p>
              </div>
            )}

            {/* Date Footer and Event marker */}
            <div className="flex flex-col items-center relative z-10 border-t pt-3 mt-1"
                 style={{ borderColor: `${primaryColor}20` }}>
              <span className="text-[11px] font-black tracking-wide" style={{ color: primaryColor }}>
                {details.date || 'CAMPUS CAROLINA'}
              </span>
              <span className="text-[7.5px] uppercase font-mono tracking-widest opacity-60 mt-1">
                {details.event || 'Educação para a Vida'}
              </span>
            </div>
          </div>
        );

      case 'minimalista':
        return (
          <div className="w-full h-full flex flex-col justify-between p-[9%] relative overflow-hidden bg-white text-gray-900 border-4 border-neutral-100">
            {/* Elegant tiny line background */}
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: primaryColor }} />
            
            {/* Minimalist Grid Overlay for tech concept */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ 
                   backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, 
                   backgroundSize: '16px 16px' 
                 }} />

            {/* Header info with sleek minimal logo */}
            <div className="flex items-center justify-between relative z-10 border-b pb-3 border-neutral-150">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={false} // Minimalist is always light background (white bg)
                colorOverride={primaryColor}
                size="sm"
                className="scale-90 origin-left"
              />
              <span className="text-[9px] font-mono tracking-widest uppercase font-black" style={{ color: secondaryColor }}>
                {details.category || 'comunicado'}
              </span>
            </div>

            {/* Main Visual Image aligned on layout */}
            <div className="my-[6%] flex-1 relative rounded-md overflow-hidden bg-neutral-50 shadow-md border border-neutral-200">
              {imageElement}
            </div>

            {/* Sleek details and minimal alignments with stylized vertical bar */}
            <div className="flex flex-col gap-3 relative z-10">
              
              {/* Premium editorial highlight vertical line bar */}
              <div className="flex gap-3 items-stretch my-1 text-left">
                <div className="w-1.5 rounded" style={{ backgroundColor: primaryColor }} />
                
                <h1 className="text-2xl md:text-[27px] font-light tracking-tight text-neutral-900 leading-[115%]">
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
              </div>

              {details.subtitle && (
                <p className="text-[10.5px] tracking-wide text-neutral-500 uppercase font-black mt-0.5 pl-4">
                  {details.subtitle}
                </p>
              )}

              {details.description && (
                <p className="text-[10px] leading-relaxed text-neutral-600 line-clamp-3 pl-4">
                  {details.description}
                </p>
              )}

              {/* Inline data details */}
              <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-neutral-400" />
                  <span>{details.event || 'Campus Carolina'}</span>
                </div>
                <span>{details.date || 'Informativo Oficial'}</span>
              </div>
            </div>
          </div>
        );

      case 'campanha':
        return (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden p-[7%]">
            {/* Youth campaign abstract style (shapes, dynamic banners, speech bubble elements) */}
            <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] rotate-12 opacity-10 pointer-events-none"
                 style={{
                   background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                   borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
                 }} />
            <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] -rotate-12 opacity-10 pointer-events-none"
                 style={{
                   background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                   borderRadius: '50% 50% 30% 70% / 50% 60% 40% 60%'
                 }} />

            {/* Top Bar for campaign tag with modern horizontal seal */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1 bg-white/10 dark:bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-neutral-200/10">
                <Radio className="w-3 h-3 text-green-500 animate-pulse" />
                <span className="text-[8.5px] font-black tracking-wider uppercase opacity-90 text-neutral-800 dark:text-neutral-200">
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

            {/* Large dynamic campaign imagery with rounded bubble corners */}
            <div className="my-[4%] flex-1 relative rounded-2xl overflow-hidden border-3 shadow-xl z-10"
                 style={{ 
                   borderColor: primaryColor,
                   borderRadius: '32px 4px 32px 32px' 
                 }}>
              {imageElement}
            </div>

            {/* Premium, ultra highlighted and modern contrast message bubble panel */}
            <div className="relative z-10 flex flex-col gap-2.5">
              
              {/* Premium gradient style youth campaign billboard with deep shadow */}
              <div className="text-white rounded-2xl p-4 md:p-5 shadow-2xl relative scale-[1.01] -rotate-1 border"
                   style={{ 
                     backgroundImage: `linear-gradient(135deg, ${primaryColor}, #0a130f)`,
                     borderColor: `${primaryColor}50`
                   }}>
                {/* Speech arrow */}
                <div className="absolute top-[-6px] left-8 w-3.5 h-3.5 rotate-45 border-t border-l animate-bounce"
                     style={{ 
                       backgroundColor: primaryColor,
                       borderColor: `${primaryColor}40` 
                     }} />
                
                <h1 className="text-xl md:text-[23px] font-[1000] tracking-tight leading-tight uppercase text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {details.title || '#ConexãoEstudantil IFMA'}
                </h1>
                {details.subtitle && (
                  <p className="text-[10.5px] text-white font-extrabold uppercase tracking-widest mt-1.5 opacity-90">
                    {details.subtitle}
                  </p>
                )}
              </div>

              {details.description && (
                <p className="text-[10px] leading-relaxed opacity-90 px-2 font-medium"
                   style={{ color: details.isDarkTheme ? '#cbd5e1' : '#334155' }}>
                  {details.description}
                </p>
              )}

              {/* Footer labels */}
              <div className="flex items-center justify-between text-[8px] font-mono tracking-wider pt-2 border-t"
                   style={{ borderColor: `${primaryColor}20` }}>
                <span className="font-extrabold" style={{ color: primaryColor }}>@ifmacampuscarolina</span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-sm font-black uppercase text-[7px]"
                      style={{ backgroundColor: secondaryColor }}>
                  {details.date || 'PARTICIPE'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'oportunidade':
        return (
          <div className="flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full">
            {/* Technical Grid background decoration for premium structure */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ 
                   backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`,
                   backgroundSize: '12px 12px' 
                 }} />
            
            {/* Sleek top corner lights */}
            <div className="absolute top-0 left-1/4 w-64 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
                 style={{ backgroundColor: primaryColor }} />

            {/* Header section */}
            <div className="flex items-center justify-between relative z-10 border-b pb-4 border-dashed"
                 style={{ borderColor: `${primaryColor}25` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Visual Pill Badge for Category */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase shadow-xs"
                   style={{ 
                     backgroundColor: `${secondaryColor}15`, 
                     borderColor: `${secondaryColor}30`,
                     color: secondaryColor
                   }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                {details.category || 'OPORTUNIDADE'}
              </div>
            </div>

            {/* Split Content with Bento Grid style */}
            <div className="my-[4%] flex-1 flex flex-col justify-center gap-4 relative z-10">
              {/* Dynamic Image Container formatted like an architect's blueprint draft */}
              <div className="w-full h-[40%] min-h-[140px] relative rounded-xl overflow-hidden shadow-md border group"
                   style={{ borderColor: `${primaryColor}30` }}>
                {imageElement}
                
                {/* Credits Tag */}
                {details.credits && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/90 text-[7.5px] text-white font-bold border border-white/10 opacity-90 font-mono">
                    📂 {details.credits}
                  </div>
                )}

                {/* Corner Target crosshairs for that blueprint designer feel */}
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t opacity-40" style={{ borderColor: primaryColor }} />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b opacity-40" style={{ borderColor: primaryColor }} />
              </div>

              {/* Text Block & Bold Title with strong highlight */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded animate-pulse"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                    ESTÁGIO / AUXÍLIO
                  </span>
                  <div className="h-[1px] flex-1" style={{ backgroundColor: `${primaryColor}15` }} />
                </div>

                {/* Ultra highlighted, premium bold responsive title */}
                <h1 className="text-2xl md:text-[28px] font-[1000] tracking-tight leading-[115%]"
                    style={{ color: details.isDarkTheme ? '#ffffff' : '#0f172a' }}>
                  {details.title || 'Inscrições Abertas / Oportunidade'}
                </h1>

                {details.subtitle && (
                  <p className="text-xs font-bold leading-normal border-l-3 pl-3 text-stone-500 dark:text-stone-300 animate-fade-in"
                     style={{ borderColor: secondaryColor }}>
                    {details.subtitle}
                  </p>
                )}

                {details.description && (
                  <p className="text-[10px] leading-relaxed opacity-85 line-clamp-3 mt-1"
                     style={{ color: details.isDarkTheme ? '#e2e8f0' : '#475569' }}>
                    {details.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bento informational box at bottom */}
            <div className="relative z-10 rounded-xl p-3 border grid grid-cols-2 gap-3 shadow-md border-neutral-250"
                 style={{ 
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(11, 122, 59, 0.03)',
                   borderColor: `${primaryColor}20` 
                 }}>
              <div className="flex flex-col justify-center">
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8] block mb-0.5">PRAZO DE INSCRIÇÃO</span>
                <span className="text-[11px] font-black uppercase tracking-tight text-red-650 dark:text-red-400">
                  ⏳ {details.date || 'Verificar Edital'}
                </span>
              </div>
              <div className="flex flex-col justify-center border-l pl-3 border-dashed"
                   style={{ borderColor: `${primaryColor}25` }}>
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8] block mb-0.5">ORGANIZAÇÃO / CANAL</span>
                <span className="text-[11px] font-black uppercase tracking-tight text-neutral-800 dark:text-neutral-100 truncate">
                  🏛️ {details.event || 'Campus Carolina'}
                </span>
              </div>
            </div>

            {/* Fine footer bar */}
            <div className="flex items-center justify-between border-t pt-2.5 mt-3 relative z-10 border-neutral-250"
                 style={{ borderColor: `${primaryColor}15` }}>
                <span className="text-[8px] font-mono tracking-wider uppercase opacity-60">
                  PROGRAMA DE ASSISTÊNCIA AO EDUCANDO • IFMA
                </span>
                <span className="text-[8px] font-black tracking-wide underline" style={{ color: primaryColor }}>
                  carolina.ifma.edu.br
                </span>
            </div>
          </div>
        );

      case 'pesquisa':
        return (
          <div className={`flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full ${details.isDarkTheme ? 'text-white bg-stone-950' : 'text-stone-900 bg-stone-50'}`}>
            {/* Futuristic linear technical circuit decoration in the background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 H40 M20 0 V40 M20 20 L30 30" fill="none" stroke={primaryColor} strokeWidth="1" />
                  <circle cx="20" cy="20" r="3" fill={secondaryColor} />
                  <circle cx="30" cy="30" r="2" fill={primaryColor} />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>

            {/* Left sidebar neon strip line decoration */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-[3.5px]"
                 style={{ backgroundColor: primaryColor }} />
            
            {/* Techno grid indicator */}
            <div className="absolute right-4 top-4 font-mono text-[7px] tracking-widest text-emerald-500 opacity-60 uppercase">
              [ SYS_STATUS: ACTIVE ]
            </div>

            {/* Header Branding */}
            <div className="flex items-center justify-between relative z-10">
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              {/* Tech Badge */}
              <span className="bg-[#15803d]/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-sm text-[8.5px] font-black tracking-widest uppercase">
                🔬 CIÊNCIA & PESQUISA
              </span>
            </div>

            {/* Artwork Frame framed by high-contrast neon drop shadows */}
            <div className="my-[4.5%] flex-1 relative rounded-xl overflow-hidden border shadow-inner group"
                 style={{ borderColor: `${primaryColor}60` }}>
              {imageElement}
              
              {/* Visual Glow overlay inside frame */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              
              {/* Lab Badge inside picture overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[8px] font-mono tracking-wider border border-white/10 uppercase text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span>{details.event || 'LABORATÓRIO MAKER'}</span>
              </div>
            </div>

            {/* Typography Group text columns */}
            <div className="relative z-10 flex flex-col gap-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[8.5px] font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-extrabold">
                  DESENVOLVIMENTO CIENTÍFICO / TECNOLÓGICO
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
              </div>

              {/* Cyber premium title focused on scientific relevance */}
              <h1 className="text-2xl md:text-[27px] font-[1000] tracking-tight leading-[110%] uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  style={{ color: details.isDarkTheme ? '#ffffff' : '#0a1d12' }}>
                {details.title || 'Pesquisa Científica e Inovação'}
              </h1>

              {details.subtitle && (
                <p className="text-[11px] font-bold italic tracking-wide leading-relaxed border-l-3 pl-2.5"
                   style={{ borderColor: secondaryColor, color: details.isDarkTheme ? '#cbd5e1' : '#4b5563' }}>
                  {details.subtitle}
                </p>
              )}

              {details.description && (
                <p className="text-[9.5px] leading-relaxed opacity-85 line-clamp-3 my-0.5"
                   style={{ color: details.isDarkTheme ? '#e2e8f0' : '#475569' }}>
                  {details.description}
                </p>
              )}
            </div>

            {/* Techno parameters split bars */}
            <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
              <div className="bg-stone-100 dark:bg-stone-900/85 rounded-md p-2 border border-neutral-200/50 dark:border-stone-800">
                <span className="block text-[7px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold mb-0.5">PUBLICADO EM</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-100">
                  📅 {details.date || 'Maio de 2026'}
                </span>
              </div>
              <div className="bg-stone-100 dark:bg-stone-900/85 rounded-md p-2 border border-neutral-200/50 dark:border-stone-800">
                <span className="block text-[7px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold mb-0.5">FONTE / CRÉDITOS</span>
                <span className="text-[10px] font-black text-neutral-800 dark:text-neutral-100 truncate block">
                  ✍️ {details.credits || 'Secom Campus Carolina'}
                </span>
              </div>
            </div>

            {/* Slogan details footer */}
            <div className="flex items-center justify-between border-t pt-2.5 mt-3 relative z-10 border-neutral-200/50 dark:border-stone-800 font-mono text-[7.5px] text-[#64748b] tracking-wider uppercase">
              <span>IFMA CAROLINA • CIÊNCIA APLICADA</span>
              <span className="font-extrabold" style={{ color: primaryColor }}>PROPESP.IFMA.EDU.BR</span>
            </div>
          </div>
        );

      case 'depoimento':
        return (
          <div className="flex-grow flex flex-col justify-between p-[8%] relative overflow-hidden h-full">
            {/* Elegant radial mesh background decoration */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ 
                   backgroundImage: `radial-gradient(${secondaryColor} 1px, transparent 1px)`,
                   backgroundSize: '16px 16px' 
                 }} />
            
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-[0.05] pointer-events-none"
                 style={{ backgroundColor: secondaryColor }} />

            {/* Top Bar Editorial Branded Header */}
            <div className="flex items-center justify-between relative z-10 border-b pb-3.5"
                 style={{ borderColor: `${primaryColor}20` }}>
              <IfmaLogo
                variant="horizontal"
                isDarkTheme={details.isDarkTheme}
                colorOverride={primaryColor}
                size="sm"
              />
              
              <span className="px-3 py-1 bg-stone-100 dark:bg-stone-900 border text-[8.5px] font-black tracking-widest uppercase rounded shadow-2xs"
                    style={{ 
                      color: secondaryColor,
                      borderColor: `${secondaryColor}25`
                    }}>
                👤 HISTÓRIAS DE SUCESSO
              </span>
            </div>

            {/* Main testifier picture circular alignment with elegant badge rings */}
            <div className="my-[4%] flex-1 flex flex-col items-center justify-center gap-4 relative z-10">
              {/* Floating profile badge circular avatar container */}
              <div className="w-[30%] aspect-square relative rounded-full overflow-hidden border-4 bg-stone-100 shadow-xl"
                   style={{ borderColor: primaryColor }}>
                {imageElement}
                
                {/* Floating graduation seal or quote label */}
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[7px] text-white py-0.5 text-center font-bold tracking-widest uppercase truncate max-w-full font-mono">
                  {details.credits || 'DISCENTE'}
                </div>
              </div>

              {/* Big decorative quotes mark */}
              <span className="text-4xl md:text-5xl font-serif font-black italic leading-none opacity-45 -mb-2 mt-1"
                    style={{ color: secondaryColor }}>
                “
              </span>

              {/* Testimonial Quote and Headline */}
              <div className="text-center flex flex-col gap-2 max-w-[95%]">
                {/* Styled prominent quote speech */}
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight leading-relaxed italic text-stone-900 dark:text-stone-100 px-2"
                    style={{ color: details.isDarkTheme ? '#ffffff' : '#0f172a' }}>
                  {details.title || '"A educação científica mudou os rumos do meu destino."'}
                </h1>

                {/* Divider line style */}
                <div className="w-12 h-0.5 mx-auto rounded" style={{ backgroundColor: secondaryColor }} />

                {/* Biography credentials labels */}
                {details.subtitle && (
                  <p className="text-[10.5px] font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-wide leading-snug">
                    {details.subtitle}
                  </p>
                )}

                {details.description && (
                  <p className="text-[9.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 font-medium px-4 line-clamp-3">
                    {details.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom footer stamp label */}
            <div className="relative z-10 rounded-lg p-2.5 border text-center border-neutral-250"
                 style={{ 
                   backgroundColor: details.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(200, 16, 46, 0.03)',
                   borderColor: `${secondaryColor}15` 
                 }}>
              <span className="text-[8.5px] font-black uppercase tracking-wide" style={{ color: primaryColor }}>
                🎓 {details.date || 'Orgulho de fazer parte da história do IFMA Campus Carolina'}
              </span>
            </div>

            {/* Academic seal branding */}
            <div className="flex items-center justify-between border-t pt-2.5 mt-3 relative z-10 border-neutral-150 text-[8px] font-mono uppercase text-neutral-400">
              <span>REDE FEDERAL DE EDUCAÇÃO PROFISSIONAL</span>
              <span className="font-extrabold" style={{ color: secondaryColor }}>#DEPOIMENTOS</span>
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
