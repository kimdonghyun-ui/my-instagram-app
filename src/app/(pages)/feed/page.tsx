'use client';

import { useEffect, useRef, useState } from 'react';
import { usePostStore } from '@/store/postStore';
import { Plus } from "lucide-react";
import PostCard from '@/components/PostCard';
import FeedWithBottomSheet from '@/components/FeedWithBottomSheet';
import { useRouter } from 'next/navigation';
import InfiniteScroll from '@/components/InfiniteScroll';

export default function FeedPage() {
  const { posts, isLoading, fetchPosts, postsHasMore } = usePostStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 3; // 한 번에 2개씩


  // 초기 1페이지
  useEffect(() => {
    fetchPosts({page, limit});
    return () => {
      // unmount 시점에 store의 posts 초기화
      usePostStore.setState({ posts: [], postsHasMore: true });
    };
  }, []);

  // onLoadMore
  const loadMore = async () => {
    const nextPage = page + 1;
    await fetchPosts({page: nextPage, limit});
    setPage(nextPage);
  };

  return (
    <main className="max-w-md mx-auto border-x border-gray-200 min-h-screen bg-gray-50">

      {/* ✅ 로딩 인디케이터 (로딩중 노출) */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white/50 z-50">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      {/* ✅ 게시물이 없을 때 */}
      {!isLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
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

      {/* ✅ InfiniteScroll = 무한 스크롤 컴포넌트 */}
      <InfiniteScroll
        onLoadMore={loadMore} // 무한스크롤 액션시 실행할 함수
        hasMore={postsHasMore} // 더 불러올 데이터가 있는지 여부(이건 api 응답 값에서 전역적으로 관리)
        isLoading={isLoading} // 로딩 상태
        loader={null} // 로딩 스피너(커스텀한걸 넣고싶으면 여기다 넣으면된 null은 기본 스피너)
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>

      {/* ✅ 댓글 모달 */}
      <FeedWithBottomSheet />
    </main>
  );
}
