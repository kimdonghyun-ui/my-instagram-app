'use client';

import { useState, useRef, useEffect } from 'react';
import { PostEntity } from '@/types';
import Image from 'next/image';
import { uploadImage } from '@/utils/uploadImage';
import { usePostStore } from '@/store/postStore';
import toast from 'react-hot-toast';

interface EditPostModalProps {
  post: PostEntity | null;
  onClose: () => void;
//   onSave?: (editedPost: PostEntity) => void;
}

export default function EditPostModal({ post, onClose }: EditPostModalProps) {
  
    const { editPost } = usePostStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null); // input 태그를 ref로 저장








const [initialCaption, setInitialCaption] = useState(''); // 초기 게시물 내용 저장
const [initialImage, setInitialImage] = useState<string | null>(null); // 초기 이미지 url 저장

const [caption, setCaption] = useState(''); // 게시물 내용 저장
const [imageId, setImageId] = useState<number | null>(null); //프로필 이미지
const [preview, setPreview] = useState<string | null>(null); // 이미지 url 저장

useEffect(() => {
  if (post) {
    const caption = post.attributes.caption || '';
    const image = post.attributes.image?.data?.attributes.url || null;

    // 초기 상태 저장
    setInitialCaption(caption);
    setInitialImage(image);

    // 현재 상태 초기화
    setCaption(caption);
    setPreview(image);
  }
}, [post]);





if (!post) return null;
const isChanged = caption !== initialCaption || preview !== initialImage; // 변경된 내용이 있는지 없는지 체크


const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0]; // ✅ 선택된 파일 객체
        setPreview(URL.createObjectURL(file));
        try {
            const images = await uploadImage(file); // ✅ 이미지를 cloudinary 서버에 업로드
            setImageId(images.id); // ✅ 상태 업데이트
            console.log("이미지 업로드 결과:", images.url);
        } catch (error) {
            console.error("파일 변환 중 오류 발생:", error);
            setPreview(initialImage); // 오류 발생시 초기 이미지 복구
        }
    }
};




  const handleSave = async () => {

    if(caption.trim() === '') return toast.error('내용을 입력해주세요');
    if(!imageId) return toast.error('이미지를 선택해주세요');

    editPost(post.id, caption, imageId);


    // if (onSave) onSave(updatedPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">게시물 수정</h2>

        {/* ✅ 이미지 미리보기 */}
        {preview && (
          <div className="mb-4 relative aspect-square rounded overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="100px"
              className="object-cover rounded"
            />
          </div>
        )}

        {/* ✅ 이미지 선택 버튼 */}
        <div className="mb-4 text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
          >
            이미지 변경
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* ✅ 캡션 수정 */}
        <textarea
          className="w-full p-2 border rounded mb-4 bg-transparent text-sm"
          rows={4}
          value={caption}
          placeholder="내용을 입력해주세요"
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* ✅ 액션 버튼 */}
        <div className="flex justify-end gap-2">
            <button
                onClick={onClose}
                className="px-4 py-1 bg-gray-300 text-black rounded"
            >
                취소
            </button>
            <button
                onClick={handleSave}
                disabled={!isChanged || caption.trim() === ''}
                className={`
                    px-4 py-1 rounded text-white transition-colors duration-200
                    ${!isChanged || caption.trim() === ''
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600'}
                `}
            >
                저장
            </button>
        </div>
      </div>
    </div>
  );
}
