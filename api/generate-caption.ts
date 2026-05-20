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

  const { title, subtitle, category, description, event, credits } = req.body || {};

  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "Chave do Gemini API não configurada no servidor. Por favor, adicione GEMINI_API_KEY no painel de segredos (Secrets) ou variáveis de ambiente do Vercel." 
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

    res.status(200).json({ caption: response.text });
  } catch (error: any) {
    console.error("Erro na geração da legenda pelo Gemini:", error);
    res.status(500).json({ error: error.message || "Erro desconhecido ao gerar legenda pelo Gemini." });
  }
}
