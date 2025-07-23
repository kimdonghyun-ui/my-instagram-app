'use client';
import { ReactNode, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => Promise<void> | void; // 비동기도 가능하게
  hasMore: boolean;
  isLoading: boolean;
  loader?: ReactNode;
}

export default function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  loader,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
        isFetchingRef.current = true;
        try {
          await onLoadMore();
        } finally {
          isFetchingRef.current = false;
        }
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    if (!hasMore) return; // 더 이상 불러올 게 없으면 observer 안 붙임
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px', // 미리당김
      threshold: 0.1,
    });
    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver, hasMore]);

  return (
    <div className="w-full">
      {children}
      {hasMore && <div ref={observerRef} className="h-10" />}
      {isLoading && (loader || (
        <div className="flex justify-center items-center space-x-2 p-4">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      ))}
    </div>
  );
}
