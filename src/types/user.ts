// User 관련 타입

// ✅ Strapi에서 내려오는 User 응답 타입
export interface UserEntity {
  id: number;
  attributes: {
    username: string;
    email: string;
    profileImage?: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
    bio?: string | null;
    isOnline?: boolean | null;
  };
}




