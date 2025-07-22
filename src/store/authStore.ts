import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Login, LoginResponse, AuthUser, Register, ProfileUpdate } from '../types/auth';
import { fetchApi } from "@/lib/fetchApi";
import { toast } from 'react-hot-toast';
import { useRedirectStore } from './redirectStore';


export interface AuthUserWithRelations extends AuthUser {
  followers?: AuthUser[];    // many-to-many라면 배열
  following?: AuthUser[];
  likedPosts?: LikedPost[];  // LikedPost 타입을 별도로 정의
}


interface AuthStore {
  error: string | null;
  isLoading: boolean;
  accessToken: string | null;
  user: AuthUser | null;
  otherProfileData: AuthUserWithRelations | null;
  setIsLoading: (isLoading: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (data: AuthUser) => void;


  toggleFollow: (targetUserId: number) => Promise<void>;

  // 로그인 처리
  handleLogin: (data: Login) => Promise<void>;
  // 회원가입 처리
  handleRegister: (data: Register) => Promise<void>;
  // 프로필 업데이트 처리
  handleProfileUpdate: (data: ProfileUpdate) => Promise<void>;
  // 특정 유저 정보 가져오기
  fetchUserById: (id: number) => Promise<void>;
  // 로그아웃 처리
  performLogout: () => Promise<void>;
  // 스토어 초기화
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      error: null,
      isLoading: false,
      accessToken: null,
      user: null,
      otherProfileData: null,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
     
      setAccessToken: (data) => set({ accessToken: data }),
      
      setUser: (data) => set({ user: data }),

      // handleLogin = 로그인 처리
      handleLogin: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchApi<LoginResponse>("/auth/local", {
            method: "POST",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
            body: JSON.stringify(data),
          }, false);
          const { jwt, user } = response;

          set({ accessToken: jwt, user: user });

          // ✅ 2. Next.js API 호출하여 쿠키 저장 (쿠키 이름을 동적으로 전달)
          const resCookie = await fetch("/api/set-cookie", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "accessToken", // ✅ 원하는 쿠키 이름 설정
                value:jwt,
                action: "set",
            }),
          });

          if (!resCookie.ok) {
            console.warn("accessToken 쿠키 설정 실패");
          }

          toast.success('로그인 성공!');
          useRedirectStore.getState().setLinkName('/feed'); // ✅ 로그인 후 리다이렉트 처리

        } catch (err) {
          set({ error: '로그인 실패!' });
          toast.error('로그인 실패!');
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // handleRegister = 회원가입 처리
      handleRegister: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await fetchApi<LoginResponse>("/auth/local/register", {
            method: "POST",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
            body: JSON.stringify(data),
          }, false);
          toast.success('회원가입 성공!');
          await get().handleLogin({ 
            identifier: data.email,
            password: data.password 
          });
        } catch (err) {
          set({ error: '회원가입 실패!' });
          toast.error('회원가입 실패!');
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // handleProfileUpdate = 프로필 업데이트 처리
      handleProfileUpdate: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = get().user;
          const response = await fetchApi<AuthUser>(`/users/${user?.id}`, {
            method: "PUT",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
            body: JSON.stringify(data),
          }, false);
          console.log("response", response);
          set({ user: response });
          toast.success('프로필 업데이트 성공!');
        } catch (err) {
          set({ error: '프로필 업데이트 실패!' });
          toast.error('프로필 업데이트 실패!');
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },


      // fetchUserById = 특정 유저 정보 가져오기
      fetchUserById: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
    
          // ✅ Strapi에서 특정 유저 가져오기
          const data = await fetchApi<AuthUserWithRelations>(`/users/${id}?populate=profileImage,following,followers,likedPosts`, {
            method: 'GET',
            credentials: 'include',
          });
          // return data;
          set({ otherProfileData: data });
        } catch (err: any) {
          console.error('유저 정보 불러오기 실패', err);
          set({ error: err.message || '유저 불러오기 실패', isLoading: false });
        }
      },



      // toggleFollow = 팔로우/언팔로우 처리
      toggleFollow: async (targetUserId: number) => {
        const { user, otherProfileData } = get();
        if (!user || !otherProfileData) {
          toast.error("로그인이 필요합니다.");
          return;
        }
      
        // 현재 상대방 프로필의 followers 배열
        const currentFollowers = otherProfileData.followers || [];
      
        // ✅ 실패 시 롤백할 원본 followers 배열을 백업
        const prevFollowers = currentFollowers;
      
        // 내가 이 사람을 팔로우했는지: followers 배열 안에 내 id가 있는지 확인
        const isFollowing = currentFollowers.some((f) => f.id === user.id);
      
        // UI에 바로 반영할 followers 배열 준비
        const updatedFollowers = isFollowing
          ? currentFollowers.filter((f) => f.id !== user.id) // 내 id 제거 (언팔)
          : [...currentFollowers, user]; // 내 정보 추가 (팔로우)
      
        // ✅ 1. 먼저 UI 상태를 갱신 (다시 GET 안 해도 UI가 즉시 업데이트됨)
        set((state) => ({
          otherProfileData: {
            ...state.otherProfileData!,
            followers: updatedFollowers,
          },
        }));
      
        try {
          set({ isLoading: true });
      
          // ✅ 2. 백엔드에 PUT 전송
          const currentFollowingIds: number[] = []; // user.following이 없으니 빈 배열에서 시작
          const newFollowingIds = isFollowing
            ? currentFollowingIds.filter((id) => id !== targetUserId)
            : [...currentFollowingIds, targetUserId];
      
          await fetchApi(`/users/${user.id}`, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
              following: newFollowingIds,
            }),
          });
      
          toast.success(isFollowing ? "언팔로우 했습니다." : "팔로우 했습니다.");
        } catch (err) {
          console.error("팔로우/언팔로우 실패:", err);
          toast.error("팔로우/언팔로우 실패!");
      
          // 🔥 실패 시 UI 상태를 롤백
          set((state) => ({
            otherProfileData: {
              ...state.otherProfileData!,
              followers: prevFollowers, // 원래 상태로 되돌림
            },
          }));
        } finally {
          set({ isLoading: false });
        }
      },
      
      
      // performLogout = 로그아웃 처리
      performLogout: async () => {
        set({ isLoading: true, error: null });
        try {
 
          await fetchApi("/auth/logout", {
            method: "POST",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
          }, false);

          toast.success('로그아웃 성공!');
        } catch (err) {

          //refreshToken 쿠키 삭제(위에 로그아웃 api 실패시를 대비)
          await fetch("/api/set-cookie", {
            method: "POST",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "refreshToken",
              action: "delete",
            }),
          });
          toast.success('로그아웃 실패지만 강제로 로그아웃 처리!');
        } finally {
          set({ isLoading: false });

          // HttpOnly 쿠키 제거 요청 (Next.js API route)
          //accessToken 쿠키 삭제
          await fetch("/api/set-cookie", {
            method: "POST",
            credentials: "include", //httpOnly 쿠키 를 제어하려면 필요
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "accessToken",
                action: "delete",
            }),
          });

          //##### 스토어 초기화(Zustand) 시작#####
          get().reset(); //localStorage + 메모리 상태 초기화

          useRedirectStore.getState().setLinkName('/login'); // 로그인 페이지로 리다이렉트(.ts에서는 router를 사용못하므로 해결책으로 사용)

          //##### 스토어 초기화(Zustand) 끝#####

        }
      },

      // reset = 스토어 초기화
      reset: () => {
        set({
          accessToken: null,
          user: null,
          error: null,
          isLoading: false,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth-store',
      //partialize = 이거 내부에 넣는 항목만 로컬스토리지에 저장이 됨(partialize 사용안하면 모든 항목이 저장됨)
      partialize: (state) => ({
        user: state.user,
        // accessToken: state.accessToken, 토큰은 보안성 정보이므로 로컬 스토리지에 저장하지 않음
      }),
    }
  )
);
