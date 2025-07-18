// Media(이미지) 관련 타입

export interface Media {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string | null;
      caption?: string | null;
      formats?: {
        thumbnail?: { url: string; width?: number; height?: number };
        small?: { url: string; width?: number; height?: number };
        medium?: { url: string; width?: number; height?: number };
        large?: { url: string; width?: number; height?: number };
      };
    };
  } | null;
}
