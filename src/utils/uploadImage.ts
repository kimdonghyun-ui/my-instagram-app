import { fetchApi } from "@/lib/fetchApi";
import type { UploadResponse, UploadResponseItem } from "@/types/index";

// utils/uploadImage.ts
export async function uploadImage(file: File): Promise<UploadResponseItem> {
    const formData = new FormData();
    formData.append("files", file); // files는 Strapi의 필수 필드명
    
    const result = await fetchApi<UploadResponse>('/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    }, true);

    return result[0]; // ✅ Cloudinary 이미지 URL만 반환
  }
  