import React, { useState, useRef } from 'react';
import { PostDetails, PostLayout, PostFormat, INSTAGRAM_FORMATS } from '../types';
import { extractPaletteFromImage } from '../utils/palette';
import { 
  Upload, Image as ImageIcon, Calendar, Type, Tag, 
  MapPin, User, Sliders, Palette, Sun, Moon, Sparkles, 
  FileText, HelpCircle, Layers, RefreshCw
} from 'lucide-react';

interface SidebarProps {
  details: PostDetails;
  onChange: (updated: Partial<PostDetails>) => void;
  extractedPalette: string[];
  onPaletteExtracted: (palette: string[]) => void;
}

// Visual preset structures to allow super fast testing with realistic IFMA information
const IFMA_SAMPLES = [
  {
    name: 'Processo Seletivo IFMA',
    title: 'Inscrições Abertas: Processo Seletivo 2026',
    subtitle: 'Cursos Técnicos Integrados e Subseqüentes',
    category: 'PROCESSO SELETIVO',
    date: 'Até 15 de Outubro',
    description: 'O Instituto Federal do Maranhão abre vagas para novos estudantes do ensino médio técnico. Venha estudar na melhor estrutura da região com ensino público, gratuito e de excelência.',
    event: 'Campus Carolina',
    credits: 'Secom IFMA',
    layout: 'noticia' as PostLayout,
    isDarkTheme: false
  },
  {
    name: 'Semana de Tecnologia (Evento)',
    title: 'SECITEC 2026: Inovação e Sustentabilidade',
    subtitle: 'Palestras, Minicursos e Competições de Robótica',
    category: 'TECNOLOGIA',
    date: '22 a 25 de Novembro',
    description: 'Participe do maior evento científico do sul do Maranhão. Submissão de trabalhos aberta com certificação oficial para palestrantes e ouvintes.',
    event: 'Auditório Principal IFMA',
    credits: 'Organização SECITEC',
    layout: 'evento' as PostLayout,
    isDarkTheme: true
  },
  {
    name: 'Jogos Intercampi (Esporte)',
    title: 'IFMA Carolina conquista Ouro no Futsal!',
    subtitle: 'Jogos Intercampi Estaduais de 2026',
    category: 'ESPORTES',
    date: '18 de Maio de 2026',
    description: 'Nossos atletas deram um espetáculo de cooperação e talento na grande final estadual, elevando o nome do Campus Carolina ao topo do pódio!',
    event: 'Quadra Poliesportiva Recreio',
    credits: 'Dae IFMA',
    layout: 'esportivo' as PostLayout,
    isDarkTheme: true
  },
  {
    name: 'Dia do Estudante (Comemoração)',
    title: 'Feliz Dia do Estudante IFMA!',
    subtitle: 'Nossa maior motivação de construir o futuro é você',
    category: 'HOMENAGEM',
    date: '11 de Agosto',
    description: 'Parabenizamos todos os discentes do Campus Carolina pelo esforço diário, curiosidade intelectual e dedicação na jornada da educação científica federal.',
    event: 'Campus Carolina',
    credits: 'Direção Geral',
    layout: 'comemoracao' as PostLayout,
    isDarkTheme: false
  },
  {
    name: 'Bolsas de Estudos (Edital & Vagas)',
    title: 'Edital de Monitoria e Auxílio Estudantil 2026',
    subtitle: 'Vagas para monitoria remunerada em disciplinas científicas',
    category: 'OPORTUNIDADE',
    date: 'Inscrições até 28/05',
    description: 'Inscrições abertas para o Programa de Assistência Estudantil e Monitoria Científica. Garanta sua permanência e potencialize sua formação acadêmica no IFMA.',
    event: 'Diretoria de Ensino',
    credits: 'Secom Campus Carolina',
    layout: 'oportunidade' as PostLayout,
    isDarkTheme: false
  },
  {
    name: 'Inovação Científica (Pesquisa & Ciência)',
    title: 'Grupo de Robótica do IFMA desenvolve protótipo inovador',
    subtitle: 'Tecnologia voltada para agricultura familiar sustentável do sul maranhense',
    category: 'PESQUISA & CIÊNCIA',
    date: 'Publicado em Maio de 2026',
    description: 'Estudantes e pesquisadores do Campus Carolina criam mecanismo autônomo de baixo custo para otimização de pequenas lavouras da nossa bacia hidrográfica.',
    event: 'Laboratório de IoT e Maker',
    credits: 'Propesp IFMA',
    layout: 'pesquisa' as PostLayout,
    isDarkTheme: true
  },
  {
    name: 'Orgulho Discente (Voz & Orgulho)',
    title: '"O IFMA me deu base para vencer e transformar minha realidade"',
    subtitle: 'Depoimento da ex-aluna Júlia Silva, aprovada em Engenharia de Software',
    category: 'HISTÓRIAS DE SUCESSO',
    date: 'Depoimento de Aluno',
    description: 'Júlia, filha de agricultores locais, concluiu o Técnico em Informática em Carolina e obteve nota máxima no processo de ingresso em universidade internacional de tecnologia.',
    event: 'Destaque Acadêmico',
    credits: 'Voz do Estudante',
    layout: 'depoimento' as PostLayout,
    isDarkTheme: false
  }
];

export function Sidebar({ details, onChange, extractedPalette, onPaletteExtracted }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [compositionTip, setCompositionTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  // Handle local draft selection
  const applyPreset = (preset: typeof IFMA_SAMPLES[0]) => {
    onChange({
      ...preset,
      // Keep existing image if loaded
    });
  };

  // Image Upload handler & palette extraction
  const processFile = async (file: File) => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Str = e.target?.result as string;
        onChange({ image: base64Str });
        
        // Extract dominant colors
        const palette = await extractPaletteFromImage(base64Str);
        onPaletteExtracted(palette);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Erro ao processar imagem:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag and Drop files implementation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Gemini Composition Suggestions analysis based on text
  const fetchCompositionSuggestion = async () => {
    if (!details.title) {
      setCompositionTip("Por favor, digite ao menos um Título para analisar.");
      return;
    }
    setLoadingTip(true);
    setCompositionTip('');
    try {
      const res = await fetch("/api/suggest-composition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: details.title,
          subtitle: details.subtitle,
          category: details.category,
          description: details.description
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCompositionTip(data.suggestions);
      } else {
        setCompositionTip("Configuração: Chave Gemini indisponível no momento.");
      }
    } catch (e) {
      setCompositionTip("Não foi possível conectar ao servidor de IA.");
    } finally {
      setLoadingTip(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Dynamic Academic Presets Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3">
        <label className="text-2xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
          Modelos de Demonstração Rápidos
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {IFMA_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(sample)}
              className="text-left text-3xs font-medium px-2 py-1.5 rounded bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition text-neutral-700 dark:text-neutral-300 truncate"
            >
              🚀 {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Formato de Post / Instagram Dims */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-green-600" />
          Dimensões do Post
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(INSTAGRAM_FORMATS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => onChange({ format: key as PostFormat })}
              className={`p-2 rounded-lg border text-left transition ${
                details.format === key
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-600 text-green-700 dark:text-green-400 font-bold'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <p className="text-2xs font-bold leading-none">{item.name}</p>
              <p className="text-[10px] opacity-70 mt-1">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Upload de Imagem can be drag and dropped */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-green-600" />
          Imagem da Postagem
        </label>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${
            dragActive
              ? 'border-green-600 bg-green-50/55 dark:bg-green-950/10'
              : 'border-neutral-300 dark:border-neutral-800 hover:border-green-500 hover:bg-neutral-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {details.image ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-md overflow-hidden border border-neutral-200 shadow-sm">
                <img src={details.image} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <p className="text-3xs text-neutral-500">Clique ou arraste outra imagem para alterar</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-8 h-8 text-neutral-400" />
              <p className="text-2xs font-bold text-neutral-600 dark:text-neutral-300">
                Arraste ou clique para enviar foto
              </p>
              <p className="text-3xs text-neutral-400">Suporta JPEG, PNG, WEBP (Quadrado/Retrato recomendado)</p>
            </div>
          )}
        </div>

        {/* Quality Advisory Banner requested by user */}
        <div className="text-[10.5px] leading-relaxed p-3 py-2.5 rounded-xl border bg-amber-500/5 border-amber-500/20 text-neutral-400 dark:text-neutral-300 flex items-start gap-2.5 shadow-3xs">
          <HelpCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-[#f59e0b] block text-[9.5px] uppercase tracking-wider mb-0.5">Formatos Recomendados</span>
            Recomenda-se salvar as imagens em formato <strong className="text-neutral-700 dark:text-white font-black">PNG</strong> ou <strong className="text-neutral-700 dark:text-white font-black">JPG</strong> com peso máximo de <strong className="text-amber-500 font-extrabold">30 MB</strong> e em alta resolução para manter a qualidade da imagem ao ser exibida na rede.
          </div>
        </div>
      </div>

      {/* 3. Variações de Layout (9 Premium variations) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-green-600" />
          Tema do Layout (9 Variações Premium)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['noticia', 'evento', 'esportivo', 'comemoracao', 'minimalista', 'campanha', 'oportunidade', 'pesquisa', 'depoimento'] as PostLayout[]).map((layout) => (
            <button
              key={layout}
              onClick={() => onChange({ layout })}
              className={`p-2.5 rounded-lg border text-center font-bold capitalize transition text-2xs ${
                details.layout === layout
                  ? 'bg-green-600 text-white border-green-600 shadow-md'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {layout === 'noticia' && '📰 Notícia IFMA'}
              {layout === 'evento' && '🎓 Evento / Aula'}
              {layout === 'esportivo' && '⚽ Jogos Esportivos'}
              {layout === 'comemoracao' && '🎂 Comemorações'}
              {layout === 'minimalista' && '✒️ Minimalista'}
              {layout === 'campanha' && '📢 Campanha Jovem'}
              {layout === 'oportunidade' && '💼 Edital & Vagas'}
              {layout === 'pesquisa' && '🔬 Pesquisa & Ciência'}
              {layout === 'depoimento' && '🗣️ Voz & Orgulho'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Cores e Paletas Dinâmicas */}
      <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-green-600" />
            Paleta de Cores do Post
          </span>
          <button
            onClick={() => onChange({ isDarkTheme: !details.isDarkTheme })}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            title="Alternar Modo Escuro do Post"
          >
            {details.isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
          </button>
        </label>

        {/* Color Palette controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-3xs">
            <span className="text-neutral-500">Verde Primário:</span>
            <input 
              type="color" 
              value={details.accentColor} 
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="w-8 h-4 border rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-3xs">
            <span className="text-neutral-500">Vermelho Secundário:</span>
            <input 
              type="color" 
              value={details.secondaryColor} 
              onChange={(e) => onChange({ secondaryColor: e.target.value })}
              className="w-8 h-4 border rounded cursor-pointer"
            />
          </div>

          {/* Autopicker toggle if palette exists */}
          {extractedPalette.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-3xs">
                <input
                  type="checkbox"
                  checked={details.useExtractedPalette}
                  onChange={(e) => onChange({ useExtractedPalette: e.target.checked })}
                  className="rounded text-green-600 border-neutral-300 focus:ring-green-500"
                />
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  Usar paleta extraída da foto
                </span>
              </label>

              {/* Palette swatches output */}
              <div className="flex items-center gap-1 mt-2">
                {extractedPalette.map((col, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: col }}
                    title={`RGB Hex: ${col}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Campos de Textos */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-green-600" />
          Textos Institucionais
        </label>

        {/* Título */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Título Principal</span>
          <textarea
            value={details.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Novos Equipamentos no Campus Carolina!"
            rows={2}
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Subtítulo */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Subtítulo / Chamada complementar</span>
          <input
            type="text"
            value={details.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="Ex: Laboratórios de informática mais modernos"
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Categoria */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Tag da Categoria</span>
          <input
            type="text"
            value={details.category}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Ex: COMUNICADO, EVENTO, ESPORTES, OPINIÃO"
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Data ou Local */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Data / Cronograma do Post</span>
          <input
            type="text"
            value={details.date}
            onChange={(e) => onChange({ date: e.target.value })}
            placeholder="Ex: Segunda-feira, 25 de Maio"
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Nome do Evento */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Nome do Evento / Localização</span>
          <input
            type="text"
            value={details.event}
            onChange={(e) => onChange({ event: e.target.value })}
            placeholder="Ex: Auditório Principal ou carolina.ifma.edu.br"
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Descrição em parágrafo */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Descrição / Conteúdo</span>
          <textarea
            value={details.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Descrição com maiores detalhes para o centro ou rodapé da imagem..."
            rows={3}
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>

        {/* Créditos da Imagem */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">Créditos / Fonte da Foto</span>
          <input
            type="text"
            value={details.credits}
            onChange={(e) => onChange({ credits: e.target.value })}
            placeholder="Ex: Foto por João Silva / Dae IFMA"
            className="w-full text-xs p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
        </div>
      </div>

      {/* 6. IA Visual: Gemini Advisor */}
      <div className="bg-radial-gradient border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col gap-2">
        <button
          onClick={fetchCompositionSuggestion}
          disabled={loadingTip}
          className="w-full py-2 rounded-lg bg-black text-white hover:bg-neutral-900 border border-neutral-800 font-extrabold text-2xs uppercase tracking-wide flex items-center justify-center gap-1 px-4 duration-300"
        >
          {loadingTip ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          )}
          {loadingTip ? 'Analisando Conteúdo...' : 'Analisar Composição com Gemini IA'}
        </button>

        {compositionTip && (
          <div className="p-2.5 rounded bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-[10.5px] italic leading-relaxed text-neutral-600 dark:text-neutral-400">
            {compositionTip}
          </div>
        )}
      </div>
    </div>
  );
}
export default Sidebar;
