export type PostLayout = 'noticia' | 'evento' | 'esportivo' | 'comemoracao' | 'minimalista' | 'campanha' | 'oportunidade' | 'pesquisa' | 'depoimento';

export type PostFormat = 'story' | 'retrato_3_4' | 'retrato_4_5' | 'quadrado' | 'horizontal_paisagem';

export interface FormatConfig {
  id: PostFormat;
  name: string;
  width: number;
  height: number;
  aspectClass: string;
  label: string;
}

export interface PostDetails {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  description: string;
  event: string;
  credits: string;
  image: string; // base64 or object URL of the uploaded image
  layout: PostLayout;
  format: PostFormat;
  accentColor: string; // Dynamic IFMA Green or custom extracted
  secondaryColor: string; // Dynamic IFMA Red or custom extracted
  darkBgColor: string; // Dynamic dark elegante color
  isDarkTheme: boolean;
  useExtractedPalette: boolean;
}

export interface SavedArt {
  id: string;
  name: string;
  details: PostDetails;
  createdAt: string;
}

export const INSTAGRAM_FORMATS: Record<PostFormat, FormatConfig> = {
  story: {
    id: 'story',
    name: 'Story / Reels (9:16)',
    width: 1080,
    height: 1920,
    aspectClass: 'aspect-[9/16]',
    label: '1080 x 1920 px'
  },
  retrato_3_4: {
    id: 'retrato_3_4',
    name: 'Retrato (3:4)',
    width: 1080,
    height: 1440,
    aspectClass: 'aspect-[3/4]',
    label: '1080 x 1440 px'
  },
  retrato_4_5: {
    id: 'retrato_4_5',
    name: 'Feed Retrato (4:5)',
    width: 1080,
    height: 1350,
    aspectClass: 'aspect-[4/5]',
    label: '1080 x 1350 px'
  },
  quadrado: {
    id: 'quadrado',
    name: 'Feed Quadrado (1:1)',
    width: 1080,
    height: 1080,
    aspectClass: 'aspect-square',
    label: '1080 x 1080 px'
  },
  horizontal_paisagem: {
    id: 'horizontal_paisagem',
    name: 'Feed Horizontal (16:9)',
    width: 1080,
    height: 608,
    aspectClass: 'aspect-[1080/608]',
    label: '1080 x 608 px'
  }
};
