'use client';

import { useEffect } from 'react';
import { usePostStore } from '@/store/postStore';
import { Plus } from "lucide-react";
import PostCard from '@/components/PostCard';
import FeedWithBottomSheet from '@/components/FeedWithBottomSheet';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const router = useRouter();


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="max-w-md mx-auto border-x border-gray-200 min-h-screen bg-gray-50">

      {isLoading && <p className="p-4 text-center text-gray-500">불러오는 중...</p>}
      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          {/* 카메라 아이콘이나 빈 상태 아이콘 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25M3 8.25l2.625-3.5A1.125 1.125 0 016.375 4.5h11.25c.36 0 .698.168.9.45l2.475 3.3M3 8.25h18M12 15.75a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
          <p className="text-lg font-semibold mb-1">아직 게시물이 없어요</p>
          <p className="text-sm text-gray-400">친구들을 팔로우하거나 새로운 게시물을 만들어보세요.</p>

          {/* ✅ 우측 하단 Floating 아이콘 버튼 */}
          <button
            onClick={() => router.push('/upload')}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-transform"
            aria-label="새 게시물 작성"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>

        </div>
      )}


      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <FeedWithBottomSheet />
    </main>
  );
}
