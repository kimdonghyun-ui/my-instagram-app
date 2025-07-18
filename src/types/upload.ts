// 📌 Strapi 업로드 응답 타입 정의
export interface UploadResponseItem {
    id: number;                // 파일 ID
    name: string;              // 파일 이름
    alternativeText: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    formats?: any;             // 포맷별 정보 (필요시 세부 타입화 가능)
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;               // ✅ Cloudinary에 업로드된 URL
    previewUrl: string | null;
    provider: string;          // ex) "cloudinary"
    provider_metadata?: any;   // cloudinary 메타데이터
    createdAt: string;
    updatedAt: string;
  }
  
  // 응답 전체는 배열 형태
  export type UploadResponse = UploadResponseItem[];
  