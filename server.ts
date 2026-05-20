import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Check api health and config status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

// Endpoint to generate Instagram Captions
app.post("/api/generate-caption", async (req, res) => {
  const { title, subtitle, category, description, event, credits } = req.body;

  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "Chave do Gemini API não configurada no servidor. Por favor, adicione GEMINI_API_KEY no painel de segredos (Secrets)." 
      });
    }

    const systemInstruction = 
      "Você é um profissional de Comunicação Social e gestor de redes sociais experiente do IFMA (Instituto Federal do Maranhão) Campus Carolina. " +
      "Seu papel é redigir legendas oficiais, impecáveis e envolventes para as redes sociais institucionais. " +
      "Use um tom motivador, acadêmico, comunitário e receptivo. Escreva perfeitamente em Português do Brasil.";

    const prompt = `Gere uma legenda para o Instagram do IFMA Campus Carolina baseada nas informações de uma nova arte/post:
- Categoria da postagem: "${category || "Comunicado Geral"}"
- Título do post: "${title || ""}"
- Subtítulo: "${subtitle || ""}"
- Conteúdo / Descrição detalhada: "${description || "Sem descrição complementar"}"
- Nome do Evento relacionado: "${event || ""}"
- Créditos / Fotografia: "${credits || ""}"

A legenda deve ser muito profissional e estruturada da seguinte maneira:
1. Uma abertura impactante relacionada ao anúncio (use um ou dois emojis adequados no início).
2. O corpo do texto muito bem organizado com quebras de linha limpas para facilitar a leitura rápida no celular.
3. Se houver evento ou data, reforce a importância do cronograma e prazos.
4. Adicione uma Chamada para Ação (CTA) clara, direta e forte condizente (ex: 'Compartilhe com seus amigos!', 'Inscrições no link da nossa Bio!', 'Consulte o edital oficial no portal!').
5. Uma linha em branco seguida das hashtags oficiais e relevantes do campus (inclua obrigatoriamente: #IFMA #IFMACarolina #CampusCarolina #Educação #Maranhão #InstitutoFederal #FederalInstitute e de acordo com a categoria, inclua outras como #Vestibular, #Esporte, #Ciência, #Tecnologia, etc).

Retorne EXCLUSIVAMENTE o texto final da legenda pronto para publicação. Não adicione observações, intro do tipo 'Aqui está a legenda:' ou aspas em volta da legenda inteira.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ caption: response.text });
  } catch (error: any) {
    console.error("Erro na geração da legenda pelo Gemini:", error);
    res.status(500).json({ error: error.message || "Erro desconhecido ao gerar legenda pelo Gemini." });
  }
});

// Endpoint to generate creative layout suggestions based on text data
app.post("/api/suggest-composition", async (req, res) => {
  const { title, subtitle, category, description } = req.body;

  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "Chave do Gemini API não configurada no servidor." 
      });
    }

    const prompt = `Como designer gráfico especializado no estilo institucional do IFMA, analise o conteúdo para este post:
- Título: "${title}"
- Subtítulo: "${subtitle}"
- Categoria: "${category}"
- Descrição: "${description}"

Sugira uma sugestão concisa de design visual (até 3 linhas) que inclua:
1. Tipo de imagem ideal a ser buscada ou colocada no fundo.
2. Paleta complementar de destaque além de verde e vermelho.
3. Posição recomendada para o texto principal para dar equilíbrio.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    res.json({ suggestions: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro ao obter dicas de composição." });
  }
});

// Vite server middleware integration dynamically
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    
    // Ensure 404 fallback serves index.html in dev mode (Vite takes care of this, but we reinforce)
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const html = await vite.transformIndexHtml(url, `<!DOCTYPE html><html>...</html>`); // Will let Spa Fallback handle
        next();
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IFMA Generator Server] Servidor executando em http://localhost:${PORT}`);
    console.log(`[IFMA Generator Server] Gemini API configurada: ${!!process.env.GEMINI_API_KEY}`);
  });
}

startServer();
