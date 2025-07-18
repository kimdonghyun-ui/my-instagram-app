'use client';

import { useEffect } from 'react';
import { usePostStore } from '@/store/postStore';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
  const { posts, isLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="max-w-md mx-auto border-x border-gray-200 min-h-screen bg-gray-50">

      {isLoading && <p className="p-4 text-center text-gray-500">불러오는 중...</p>}
      {!isLoading && posts.length === 0 && (
        <p className="p-4 text-center text-gray-500">게시물이 없습니다.</p>
      )}

      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
