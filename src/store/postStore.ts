import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { toast } from 'react-hot-toast';
import { CommentEntity, PostEntity } from '@/types/index';
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




  // ✅ 댓글 모달 상태
  isCommentOpen: boolean;
  selectedPost: PostEntity | null;
  setCommentModal: (isOpen: boolean, post?: PostEntity) => void;
  addComment: (content: string, userId: number) => Promise<void>;

  setPosts: (posts: PostEntity[]) => void;
  reset: () => void;
}



export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,


  // ✅ 댓글 모달 상태 초기값
  isCommentOpen: false,
  selectedPost: null,

  // ✅ 피드 불러오기
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<StrapiResponse<PostEntity[]>>('/posts?populate[author]=profileImage&populate[image]=*&populate[likes]=*&populate[comments][populate]=author');
      
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
    set({ isLoading: true, error: null });
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
  
    const currentLikes = post.attributes.likes?.data?.map((u) => u.id) || [];
    const alreadyLiked = currentLikes.includes(userId);
  
    const newLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId)
      : [...currentLikes, userId];
  
    // ✅ 1. 클라이언트 상태 먼저 업데이트 (UI 깜빡임 최소화)
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            attributes: {
              ...p.attributes,
              likes: {
                data: newLikes.map((id) => ({ id })), // 최소한의 데이터만 넣기
              },
            },
          }
        : p
    );
    set({ posts: updatedPosts });
  
    // ✅ 2. 서버에 요청은 백그라운드로
    try {
      await fetchApi(`/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { likes: newLikes },
        }),
      });
      // ❌ fetchPosts() 호출하지 않음 → 깜빡임 방지
    } catch (err) {
      // 실패했을 경우 원래 상태로 롤백할 수 있음
      set({ posts }); // 이전 상태로 되돌림
      toast.error('게시물 좋아요 업데이트 실패!');
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // ✅ 댓글 모달 열기/닫기
  setCommentModal: (isOpen: boolean, post?: PostEntity) => set({isCommentOpen: isOpen, selectedPost: isOpen ? post ?? null : null,}),

  addComment: async (content, userId) => {
    const { selectedPost } = get(); // 이미 바텀시트 열때 함께 전달된 게시물 데이터(이미 해당게시물 데이터가 들어있음)
    if (!selectedPost) return;

    // ✅ Strapi로 댓글 POST
    // 1. 댓글 생성
    const commentRes = await fetchApi<StrapiResponse<CommentEntity>>('/comments', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          content,
          post: selectedPost.id,
          author: userId,
        },
      }),
    });
    const newCommentId = commentRes.data.id;

    // 2. Post 업데이트 (comments 배열에 추가)
    await fetchApi(`/posts/${selectedPost.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          comments: [
            ...(selectedPost.attributes.comments?.data.map((c) => c.id) || []),
            newCommentId,
          ],
        },
      }),
    });




    // ✅ 다시 게시물 목록 불러와서 상태 갱신
    await get().fetchPosts();

    // ✅ 현재 선택된 게시물도 최신 데이터로 갱신
    const updatedPost = get().posts.find((p) => p.id === selectedPost.id) || null;
    set({ selectedPost: updatedPost });
  },


  setPosts: (posts) => set({ posts }),
  reset: () => set({ posts: [], error: null, isLoading: false }),
}));
