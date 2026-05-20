import React, { useState } from 'react';
import { PostDetails } from '../types';
import { Sparkles, Copy, Check, MessageSquareCode, Shuffle, AlertCircle } from 'lucide-react';

interface CaptionHelperProps {
  details: PostDetails;
}

export function CaptionHelper({ details }: CaptionHelperProps) {
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerateCaption = async () => {
    if (!details.title) {
      setErrorMessage("Por favor, preencha ao menos o campo 'Título Principal' no painel lateral antes de gerar sua legenda.");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setCopied(false);
    
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: details.title,
          subtitle: details.subtitle,
          category: details.category,
          description: details.description,
          event: details.event,
          credits: details.credits
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCaption(data.caption);
      } else {
        setErrorMessage(data.error || "Houve um erro no servidor ao gerar a legenda.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Erro de rede. Verifique se o servidor backend está online.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!caption) return;
    try {
      navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback copy for environments where clipboard is blocked in iFrame
      const textarea = document.createElement('textarea');
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm transition flex flex-col gap-4">
      {/* Header of the Generator container */}
      <div className="flex items-center gap-2">
        <MessageSquareCode className="w-5 h-5 text-red-600" />
        <div>
          <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">
            Legenda Inteligente (Instagram)
          </h3>
          <p className="text-3xs text-neutral-400">
            Geração de copy oficial e institucional utilizando Gemini Flash
          </p>
        </div>
      </div>

      {/* Button to shoot generate-caption */}
      <button
        onClick={handleGenerateCaption}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300 shadow bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white ${
          loading ? 'opacity-50 cursor-wait' : ''
        }`}
      >
        <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : 'animate-pulse'}`} />
        {loading ? 'Redigindo legenda oficial...' : 'Gerar Legenda com IA'}
      </button>

      {/* Error Output alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-2xs text-red-700 dark:text-red-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Caption Output Box */}
      {caption ? (
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between pointer-events-none">
            <span className="text-3xs font-extrabold text-green-600 uppercase tracking-widest">
              Sugestão de Cópia Oficial:
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black p-4">
            {/* Copy overlay floating */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-stone-200 dark:bg-stone-900 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition shadow"
              title="Copiar Legenda"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-neutral-700 dark:text-neutral-300 pr-8 select-all">
              {caption}
            </pre>
          </div>

          {copied && (
            <span className="text-3xs text-green-600 font-bold self-end animate-bounce">
              ✓ Legenda copiada para a área de transferência!
            </span>
          )}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-6 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-stone-950/20">
            <Shuffle className="w-8 h-8 text-neutral-300 mx-auto mb-2 opacity-50" />
            <p className="text-2xs text-neutral-500 max-w-[80%] mx-auto">
              Sua legenda institucional contendo chamada oficial e hashtags dinâmicas do Campus Carolina aparecerá aqui.
            </p>
          </div>
        )
      )}
    </div>
  );
}
export default CaptionHelper;
