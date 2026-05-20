export function extractPaletteFromImage(imageSrc: string): Promise<string[]> {
  return new Promise((resolve) => {
    if (!imageSrc) {
      resolve([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve([]);
          return;
        }

        // Reduz a imagem para 30x30 pixels para processamento super rápido por média
        canvas.width = 30;
        canvas.height = 30;
        ctx.drawImage(img, 0, 0, 30, 30);

        const imgData = ctx.getImageData(0, 0, 30, 30).data;
        const colorCounts: Record<string, number> = {};

        // Percorre pixels de 4 em 4 bytes (R, G, B, A)
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Descarta pixels com opacidade baixa ou tons neutros extremos (quase branco absoluto ou preto absoluto)
          if (a < 220) continue;
          
          // Ignora cinzas, pretos e brancos puros para capturar cores ricas de destaque
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 235 || brightness < 20) continue;

          // Calcula desvio padrão simples para descartar cinzas neutros
          const avg = (r + g + b) / 3;
          const dev = Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
          if (dev < 18) continue; // Descarta cinza neutro

          // Binning de cor (agrupamento inteligente de tons parecidos)
          const binSize = 25;
          const roundedR = Math.round(r / binSize) * binSize;
          const roundedG = Math.round(g / binSize) * binSize;
          const roundedB = Math.round(b / binSize) * binSize;

          const key = `rgb(${roundedR},${roundedG},${roundedB})`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Ordenar cores por frequência
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([color]) => rgbToHex(color))
          .filter((hex): hex is string => hex !== null);

        // Retorna até 5 cores únicas mais dominantes filtrando duplicatas próximas
        const uniqueColors = Array.from(new Set(sortedColors)).slice(0, 5);
        resolve(uniqueColors);
      } catch (e) {
        console.error("Erro ao extrair paleta da imagem:", e);
        resolve([]);
      }
    };

    img.onerror = () => {
      resolve([]);
    };
  });
}

function rgbToHex(rgbStr: string): string | null {
  const parts = rgbStr.match(/\d+/g);
  if (!parts || parts.length < 3) return null;
  const r = parseInt(parts[0]);
  const g = parseInt(parts[1]);
  const b = parseInt(parts[2]);
  
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
