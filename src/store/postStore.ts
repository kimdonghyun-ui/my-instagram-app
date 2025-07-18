import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { toast } from 'react-hot-toast';
import { PostEntity } from '@/types/index';
import { StrapiResponse } from '@/types/strapi';
// import { uploadImage } from '@/utils/uploadImage';
import { useAuthStore } from './authStore';

interface PostStore {
  posts: PostEntity[];
  isLoading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  createPost: (userId: number, caption: string, imageId: number) => Promise<void>;
  toggleLike: (postId: number, userId: number) => Promise<void>;

  setPosts: (posts: PostEntity[]) => void;
  reset: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  // ✅ 피드 불러오기
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<StrapiResponse<PostEntity>>('/posts?populate[author]=profileImage&populate[image]=*&populate[likes]=*&populate[comments][populate]=author');
      
      set({ posts: response.data });
    } catch (err) {
      set({ error: '게시물 불러오기 실패' });
      toast.error('피드 불러오기 실패!');
    } finally {
      set({ isLoading: false });
    }
  },




  // ✅ 게시물 생성 (caption: 게시물 내용, imageId: 이미지 ID)
  createPost: async (userId: number, caption: string, imageId: number) => {
    set({ isLoading: true, error: null });
    try {
      // ✅ 게시물 생성
      await fetchApi('/posts', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            caption: caption,
            image: imageId,
            author: userId, // ✅ 작성자 ID를 넣어줘야 함
          },
        }),
      });
      // ✅ 3. 피드 새로고침
      await get().fetchPosts();
    } catch (err) {
      set({ error: '게시물 생성 실패' });
      toast.error('게시물 생성 실패!');
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ 좋아요 토글(postId: 게시물 ID, userId: 사용자 ID)
  toggleLike: async (postId: number, userId: number) => {
    // return;
    const { posts } = get(); // Zustand 상태에서 현재 posts 배열 가져오기
    const post = posts.find((p) => p.id === postId); // posts 데이터 중 postId 와 일치하는 데이터 찾기
    if (!post) return; // 해당 post를 못 찾으면 함수 종료

    const currentLikes = post.attributes.likes?.data?.map((u) => u.id) || []; // 현재 게시물의 좋아요 목록 추출(id만 배열로 추출)
    const alreadyLiked = currentLikes.includes(userId); // 현재 게시물의 좋아요 목록에 userId가 포함되어 있는지 확인

    const newLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId) // 포함되어 있으면 제거
      : [...currentLikes, userId]; // 포함되어 있지 않으면 추가


    try {
      // ✅ 게시물 좋아요 업데이트
      await fetchApi(`/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { likes: newLikes },
        }),
      });
      // ✅ 3. 피드 새로고침
      await get().fetchPosts();
    } catch (err) {
      set({ error: '게시물 좋아요 업데이트 실패' });
      toast.error('게시물 좋아요 업데이트 실패!');
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },




  setPosts: (posts) => set({ posts }),
  reset: () => set({ posts: [], error: null, isLoading: false }),
}));
