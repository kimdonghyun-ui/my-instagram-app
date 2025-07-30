import { create } from 'zustand';
import { fetchApi } from '@/lib/fetchApi';
import { toast } from 'react-hot-toast';
import { CommentEntity, PostEntity } from '@/types/index';
import { StrapiResponse } from '@/types/strapi';
// import { uploadImage } from '@/utils/uploadImage';
// import { useAuthStore } from './authStore';

interface PostStore {
  posts: PostEntity[];
  postsHasMore: boolean;
  otherPosts: PostEntity[];
  otherPostsHasMore: boolean;
  isLoading: boolean;
  error: string | null;

  fetchPosts: ({page, limit, query}: {page: number, limit: number, query?: string}) => Promise<void>;
  fetchPostsByUser: (userId: number,page: number, limit: number) => Promise<void>; // ✅ 유저별 게시물 가져오기

  createPost: (userId: number, caption: string, imageId: number) => Promise<void>;
  toggleLike: (postId: number, userId: number) => Promise<void>;




  // ✅ 댓글 모달 상태
  isCommentOpen: boolean;
  selectedPost: PostEntity | null;
  setCommentModal: (isOpen: boolean, post?: PostEntity) => void;
  addComment: (content: string, userId: number) => Promise<void>;

  deletePost: (postId: number) => Promise<void>;

  editPost: (postId: number, caption: string, imageId: number) => Promise<void>;

  setPosts: (posts: PostEntity[]) => void;
  reset: () => void;
}



export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  postsHasMore: true,
  otherPosts: [],
  otherPostsHasMore: true,

  isLoading: false,
  error: null,


  // ✅ 댓글 모달 상태 초기값
  isCommentOpen: false,
  selectedPost: null,

  // ✅ 피드 불러오기
  fetchPosts: async ({page, limit, query}: {page: number, limit: number, query?: string}) => {
    console.log('fetchPosts', page, limit, query);
    set({ isLoading: true, error: null });
    try {
    // 기본 쿼리
    let url = `/posts?pagination[page]=${page}&pagination[pageSize]=${limit}` +
              `&sort[0]=createdAt:desc` + // ✅ 최신순으로 정렬
              `&populate[author]=profileImage&populate[image]=*&populate[likes]=*&populate[comments][populate]=author`;
    // ✅ 검색어가 있으면 유저명 OR 게시물 내용 검색 쿼리 추가
    if (query && query.trim() !== '') {
      const q = encodeURIComponent(query.trim());
      url += `&filters[$or][0][author][username][$containsi]=${q}` +
             `&filters[$or][1][caption][$containsi]=${q}`;
    }
    const response = await fetchApi<StrapiResponse<PostEntity[]>>(url);
      const pageCount = response.meta.pagination.pageCount;
      set((state) => {
        // 검색 중이면 기존 posts를 초기화하고 새로운 결과로 덮기
        const merged = page === 1 ? response.data : [...state.posts, ...response.data];
        return {
          posts: merged,
          postsHasMore: page < pageCount,
          isLoading: false,
          error: null,
        };
      });
    } catch {
      set({ error: '게시물 불러오기 실패' });
      toast.error('피드 불러오기 실패!');
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ 유저별 게시물 가져오기
  fetchPostsByUser: async (userId: number,page: number, limit: number) => {
    set({ isLoading: true });
    try {
      const response = await fetchApi<StrapiResponse<PostEntity[]>>(
        `/posts?pagination[page]=${page}&pagination[pageSize]=${limit}` +
        `&sort[0]=createdAt:desc` + // ✅ 최신순으로 정렬
        `&filters[author][id][$eq]=${userId}&populate[image]=*`
      );
      const pageCount = response.meta.pagination.pageCount;
      set((state) => {
        const merged = [...state.otherPosts, ...response.data];
        return {
          otherPosts: merged,
          otherPostsHasMore: page < pageCount, // 한 번에 결정
          isLoading: false,
          error: null,
        };
      });
    } catch {
      set({ error: '사용자 게시물 불러오기 실패' });
    } finally {
      set({ isLoading: false , error: null });
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
      await get().fetchPosts({page: 1, limit: 3});
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
    await get().fetchPosts({page: 1, limit: 3});

    // ✅ 현재 선택된 게시물도 최신 데이터로 갱신
    const updatedPost = get().posts.find((p) => p.id === selectedPost.id) || null;
    set({ selectedPost: updatedPost });
  },

  // ✅ 게시물 삭제
  deletePost: async (postId) => {
    let toastId = ''
    set({ isLoading: true, error: null });
    try {
      // ✅ 1. API 요청
      await fetchApi(`/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // ✅ 2. 상태에서 삭제된 포스트 제거
      set((state) => ({
        otherPosts: state.otherPosts.filter((post) => post.id !== postId),
      }));

      toastId = toast.success('삭제 완료!', { duration: 3000 }) 
    } catch (error) {
      toastId = toast.error('삭제에 실패했습니다.', { duration: 3000 }) 
      console.error('삭제 오류:', error);
    } finally {
      set({ isLoading: false });
      setTimeout(() => {
        //toast.custom 사용한 팝업 통해서 호출한 경우 토스트 팝업이 안닫히는 문제가 있어서 아래처럼 3초후 닫기 강제로 해줌
        toast.dismiss(toastId);
      }, 3000);
    }
  },




// ✅ 게시물 수정
  editPost: async (postId, caption, imageId) => {
    // console.log('editPost', postId, caption, imageId);
    set({ isLoading: true, error: null });
    try {
      // ✅ 게시물 생성
      const response = await fetchApi<StrapiResponse<PostEntity>>(`/posts/${postId}?populate[image]=*`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
          data: {
            caption: caption,
            image: imageId,
            // author: userId, // ✅ 작성자 ID를 넣어줘야 함
          },
        }),
      });

      // console.log('response', response);

      // ✅ 상태값 업데이트
      set((state) => ({
        otherPosts: state.otherPosts.map((post) =>
          post.id === postId ? response.data : post
        ),
      }));

      toast.success('수정 완료!');
    } catch (err) {
      console.error(err);
      toast.error('게시물 수정 실패');
      set({ error: '게시물 수정 실패' });
    } finally {
      set({ isLoading: false });
    }
  },



  

  setPosts: (posts) => set({ posts }),
  reset: () => set({ posts: [], error: null, isLoading: false }),
}));
