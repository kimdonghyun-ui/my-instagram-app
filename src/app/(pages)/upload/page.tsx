'use client';

import { useState } from 'react';
import { usePostStore } from '@/store/postStore';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/utils/uploadImage';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function UploadPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { createPost } = usePostStore();
  const [caption, setCaption] = useState('');
//   const [file, setFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<number | null>(null); //프로필 이미지
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0]; // ✅ 선택된 파일 객체
        setPreview(URL.createObjectURL(file));
        try {
          setIsUploading(true);
          const images = await uploadImage(file); // ✅ 이미지를 cloudinary 서버에 업로드
          setImageId(images.id); // ✅ 상태 업데이트
          console.log("이미지 업로드 결과:", images.url);
        } catch (error) {
          console.error("파일 변환 중 오류 발생:", error);
          setPreview(null);
        } finally {
          setIsUploading(false);
        }
      }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id;
        if (!userId) return toast.error('로그인 후 게시물을 작성해주세요.');
        if (!imageId) return toast.error('이미지를 선택해주세요.');
        if (!caption) return toast.error('문구를 입력해주세요.');
        try {
            setIsUploading(true);
            await createPost(userId, caption, imageId);
            toast.success('업로드 성공!');
            router.push('/feed');
        } catch {
            toast.error('업로드 실패!');
        } finally {
            setIsUploading(false);
        }
    };

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">게시물 업로드</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이미지 미리보기 */}
        {preview && (
          <div className="w-full aspect-square overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="object-cover w-full h-full" />
          </div>
        )}

        {/* 파일 선택 */}
        <input
            // required
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border rounded-md cursor-pointer"
        />

        {/* 캡션 입력 */}
        <textarea
            // required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="문구 입력..."
          className="w-full p-2 border rounded-md resize-none"
        />

        {/* 업로드 버튼 */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          {isUploading ? '업로드 중...' : '업로드'}
        </button>
      </form>
    </main>
  );
}
