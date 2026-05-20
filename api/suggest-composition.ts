import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

export default async function handler(req: Request, res: Response) {
  // Support CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { title, subtitle, category, description } = req.body || {};

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

    res.status(200).json({ suggestions: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro ao obter dicas de composição." });
  }
}
