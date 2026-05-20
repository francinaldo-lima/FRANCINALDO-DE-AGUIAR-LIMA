# Gerador de Posts Institucionais - IFMA Campus Carolina 🏛️🎨

Uma plataforma web moderna e premium projetada para que gestores e profissionais de comunicação do **IFMA Campus Carolina** criem artes e legendas institucionais profissionais para o Instagram de forma automatizada e em poucos segundos.

## 🚀 Funcionalidades Principais

1. **Painel Administrativo Completo**:
   - Controle total sobre textos (Título, Subtítulo, Categoria do Post, Data/Cronograma, Nome do Evento, Créditos de Imagem).
   - Suporte a upload de imagem principal por clique ou **Arrastar e Soltar (Drag and Drop)**.

2. **6 Layouts Premium Diferentes**:
   - **📰 Notícia IFMA**: Foco em comunicados estruturados com tag de destaque.
   - **🎓 Evento / Aula**: Destaque em datas, locais e inscrições em formato glassmorphic.
   - **⚽ Jogos Esportivos**: Alta energia com faixas diagonais dinâmicas, inclinações e cores vivas.
   - **🎂 Comemorações**: Moldura circular de destaque com visual leve e elegante para datas comemorativas.
   - **✒️ Minimalista**: Muito espaço negativo, fontes finas premium, estilo editorial de excelente bom gosto.
   - **📢 Campanha Jovem**: Estilo campanhista com balões de recado diagonal, tags vibrantes e excelente legibilidade.

3. **5 Formatos Oficiais para Instagram**:
   - Story/Reels (1080 x 1920)
   - Retrato (1080 x 1440)
   - Retrato Feed 4:5 (1080 x 1350)
   - Quadrado (1080 x 1080)
   - Horizontal/Paisagem (1080 x 608)

4. **Legenda Inteligente com Gemini IA**:
   - Botão para gerar legenda para Instagram baseada em IA de forma instantânea.
   - Criação de copys polidas em tom institucional em português impecável, contendo emojis moderados, CTAs consistentes e hashtags oficiais do campus auto-geradas.

5. **IA Visual (Análises de Composição)**:
   - Dicas e estratégias dinâmicas para posicionar cores, escolher o fundo ideal e dar balanço estético.

6. **Diferenciais Premium**:
   - **Extração inteligente de cores**: Geração automática de paletas dinâmicas baseada na fotografia enviada.
   - **Histórico & Salvados**: Salva rascunhos no `localStorage` do navegador para carregar, duplicar e excluir posteriormente sem perdas.
   - **Modelos de Demonstração**: Um clique para rechear os dados com amostras acadêmicas realistas (Processo seletivo, SECITEC, Futsal, Homenagem do dia do estudante).
   - **Modo escuro dinâmico** para as artes produzidas.

## ⚙️ Tecnologias Utilizadas

- **React 19** & **Vite** para a interface do SPA.
- **Tailwind CSS v4** para layouts de altíssino capricho visual.
- **Express.js** no backend para proxy de chaves de API secretas.
- **@google/genai SDK** integrado ao modelo de alta velocidade `gemini-3.5-flash`.
- **html-to-image** e **jsPDF** para exportações limpas de alta qualidade (PNG, JPEG e PDF).

---

## 🛠️ Como Executar Localmente

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure suas chaves ambientais**:
   Copie o arquivo `.env.example` para `.env` e defina suas credenciais:
   ```env
   GEMINI_API_KEY="SUA_CHAVE_GEMINI"
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Gerar builds estáveis**:
   ```bash
   npm run build
   ```

---

## ☁️ Hospedagem na Vercel

O projeto foi projetado para portabilidade direta. Caso queira implantar na Vercel em modo Client-Side SPA completo:

1. Certifique-se de configurar a **Build Command**: `npm run build`
2. Configure **Output Directory**: `dist`
3. Configure sua variável ambiental `GEMINI_API_KEY` diretamente na aba **Settings > Environment Variables** do seu projeto na Vercel. 
