/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PostDetails, SavedArt, PostLayout, PostFormat, INSTAGRAM_FORMATS } from './types';
import { Sidebar } from './components/Sidebar';
import { PreviewArea } from './components/PreviewArea';
import { CaptionHelper } from './components/CaptionHelper';
import { HistoryManager } from './components/HistoryManager';
import { IfmaLogo } from './components/IfmaLogo';
import { 
  Sparkles, Download, FileImage, FileCode, Sliders, 
  HelpCircle, Monitor, RefreshCw, Layers, ShieldCheck,
  CheckCircle, PlayCircle, Library, AppWindow, ArrowRightLeft
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function App() {
  // Initial default layout details for the post
  const [details, setDetails] = useState<PostDetails>({
    title: 'Seja bem-vindo ao IFMA Campus Carolina!',
    subtitle: 'Educação Pública, Gratuita e de Alta Qualidade Tecnológica',
    category: 'INSTITUCIONAL',
    date: 'Ano Letivo 100% Presencial',
    description: 'Buscamos formar cidadãos tecnicamente preparados e comprometidos com o desenvolvimento sustentável de Carolina e de toda a região do sul maranhense.',
    event: 'Campus Carolina',
    credits: 'Secom Campus Carolina',
    image: '', // Will start with dynamic gradient illustration until user uploads
    layout: 'noticia',
    format: 'retrato_4_5', // Most common Instagram portrait layout
    accentColor: '#0B7A3B', // IFMA Green default
    secondaryColor: '#C8102E', // IFMA Red default
    darkBgColor: '#0a1d12', // Warm dark Charcoal/Green default
    isDarkTheme: false,
    useExtractedPalette: false,
    titleFontSize: 28,
    titleHighlight: 'normal',
    titleUppercase: false
  });

  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [exporting, setExporting] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0.38); // Visual scaling for preview frame
  const [activeTab, setActiveTab] = useState<'editor' | 'library'>('editor');
  const [backendStatus, setBackendStatus] = useState<{
    online: boolean;
    hasKey: boolean;
  }>({ online: false, hasKey: false });

  // Probe server configuration on load to guide user about Gemini API status
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus({
          online: data.status === 'ok',
          hasKey: !!data.hasApiKey
        });
      })
      .catch(() => {
        setBackendStatus({ online: false, hasKey: false });
      });
  }, []);

  const handleDetailsChange = (updated: Partial<PostDetails>) => {
    setDetails(prev => {
      const merged = { ...prev, ...updated };
      // Auto-save temporary backup in localStorage
      localStorage.setItem('ifma_current_layout_draft', JSON.stringify(merged));
      return merged;
    });
  };

  // Restores local draft if exists
  useEffect(() => {
    const draft = localStorage.getItem('ifma_current_layout_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setDetails(parsed);
      } catch (e) {
        console.warn("Sem rascunho anterior recuperável.");
      }
    }
  }, []);

  // Capture current preview DOM and download as image
  const handleExport = async (format: 'png' | 'jpeg' | 'pdf') => {
    const node = document.getElementById('ifma-post-render-node');
    if (!node) {
      alert("Nó de renderização de imagem de postagem não encontrado.");
      return;
    }

    setExporting(true);
    try {
      // Use clean settings to generate 1:1 crisp asset
      const options = {
        pixelRatio: 1.5, // Crisp retina-friendly output scale
        cacheBust: true,
        skipFonts: false,
        style: {
          transform: 'none', // Capture without scaling
          borderRadius: '0px'
        }
      };

      if (format === 'png') {
        const dataUrl = await toPng(node, options);
        triggerDownload(dataUrl, `IFMA_Carolina_Art_${Date.now()}.png`);
      } else if (format === 'jpeg') {
        const dataUrl = await toJpeg(node, { ...options, quality: 0.98 });
        triggerDownload(dataUrl, `IFMA_Carolina_Art_${Date.now()}.jpg`);
      } else if (format === 'pdf') {
        // High quality scale PNG then insert in A4 or custom size PDF
        const dataUrl = await toPng(node, options);
        const formatConfig = INSTAGRAM_FORMATS[details.format];
        const orientation = formatConfig.height > formatConfig.width ? 'p' : 'l';
        
        const doc = new jsPDF({
          orientation: orientation,
          unit: 'px',
          format: [formatConfig.width, formatConfig.height]
        });

        doc.addImage(dataUrl, 'PNG', 0, 0, formatConfig.width, formatConfig.height);
        doc.save(`IFMA_Carolina_Art_${Date.now()}.pdf`);
      }
    } catch (err) {
      console.error("Erro na exportação de arquivo:", err);
      alert("Houve um problema ao renderizar sua arte. Algumas imagens pesadas podem requerer permissão CORS.");
    } finally {
      setExporting(false);
    }
  };

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-green-600 selection:text-white">
      {/* 1. Header Banner */}
      <header className="border-b border-stone-800 bg-black/45 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Official robust IFMA Vector Logo horizontal brand badge */}
          <div className="bg-white p-2 rounded-lg py-1 px-2.5 shadow-md flex items-center shrink-0">
            <IfmaLogo variant="horizontal" isDarkTheme={false} size="sm" />
          </div>
          <div className="h-6 w-[1px] bg-stone-800 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-green-500/10 text-green-400 font-black px-2 py-0.5 rounded border border-green-500/20 tracking-wider">
                CAMPUS CAROLINA
              </span>
              <span className="text-3xs text-stone-500 font-mono hidden sm:inline">v2.1 Premium Studio</span>
            </div>
            <h1 className="text-sm font-black tracking-tight leading-tight uppercase text-neutral-200">
              Gerador de Artes do IFMA Carolina
            </h1>
          </div>
        </div>

        {/* Server API Keys and Credentials configuration status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-2xs px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700">
            <ShieldCheck className={`w-3.5 h-3.5 ${backendStatus.hasKey ? 'text-green-400' : 'text-amber-400'}`} />
            <span className="text-stone-300 font-medium">
              {backendStatus.hasKey ? 'Gemini IA Pronta' : 'Preencha GEMINI_API_KEY no painel Secrets'}
            </span>
          </div>

          <a
            href="https://carolina.ifma.edu.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xs text-stone-400 hover:text-white underline font-mono font-bold"
          >
            Portal Campus
          </a>
        </div>
      </header>

      {/* 2. Main applet work grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[1720px] w-full mx-auto">
        
        {/* Left Side: Form variables and styles inputs (Lg: col-span-5) */}
        <div className="lg:col-span-5 border-b lg:border-r lg:border-b-0 border-stone-800 max-h-[calc(100vh-77px)] lg:overflow-y-auto bg-stone-950/40">
          <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#0B7A3B] flex items-center gap-1">
              <Sliders className="w-4 h-4 text-green-500" />
              Painel de Customização
            </span>
            <span className="text-3xs text-stone-500">Auto-salvamento ativo</span>
          </div>
          
          <Sidebar 
            details={details} 
            onChange={handleDetailsChange}
            extractedPalette={extractedPalette}
            onPaletteExtracted={(p) => {
              setExtractedPalette(p);
              // Auto turn on the dynamic color palette extractor
              handleDetailsChange({ useExtractedPalette: true });
            }}
          />
        </div>

        {/* Right Side: Canva Live Preview area and Action panels (Lg: col-span-7) */}
        <div className="lg:col-span-7 p-4 md:p-6 flex flex-col gap-6 max-h-[calc(100vh-77px)] lg:overflow-y-auto">
          
          {/* Action Row containing Download options, Export actions and Zoom settings */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between shadow-lg">
            
            {/* Download Buttons group */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleExport('png')}
                disabled={exporting}
                className="py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {exporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Baixar PNG
              </button>
              
              <button
                onClick={() => handleExport('jpeg')}
                disabled={exporting}
                className="py-2.5 px-4 rounded-lg bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition disabled:opacity-50"
              >
                JPEG Otimizado
              </button>

              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="py-2.5 px-3 rounded-lg bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-300 font-semibold text-xs uppercase tracking-wide flex items-center gap-1 transition disabled:opacity-50"
              >
                PDF
              </button>
            </div>

            {/* Slider to configure viewer scale sizes */}
            <div className="flex items-center gap-3 border-l-0 sm:border-l sm:border-stone-800 sm:pl-4">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-neutral-400">Zoom:</span>
              <input
                type="range"
                min="0.22"
                max="0.85"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24 accent-[#0B7A3B] cursor-pointer"
              />
              <span className="text-3xs font-mono text-neutral-500 w-8">{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          {/* Central Live Preview Area */}
          <div className="flex-1 bg-gradient-to-br from-stone-900 to-black rounded-2xl border border-stone-800 p-4 md:p-8 flex items-center justify-center min-h-[460px] relative shadow-2xl overflow-hidden">
            {/* Grid details in base canvas */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 w-full flex justify-center">
              <PreviewArea 
                details={details} 
                zoom={zoom} 
                extractedPalette={extractedPalette}
              />
            </div>
          </div>

          {/* Secondary Helpers / Double boxes row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI caption creator box */}
            <CaptionHelper details={details} />

            {/* Local persistence database list */}
            <HistoryManager 
              currentDetails={details} 
              onSelectArt={(loaded) => setDetails(loaded)} 
            />
          </div>

        </div>
      </main>

      {/* 3. Footer with credit instructions */}
      <footer className="border-t border-stone-800 bg-stone-950 py-4 px-6 text-center text-3xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© 2026 IFMA Campus Carolina • Departamento de Comunicação Social.</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">Direitos Reservados</span>
          <span className="text-stone-300">Produção ágil de conteúdo acadêmico.</span>
        </div>
      </footer>
    </div>
  );
}
