'use client';

import { useRouter, usePathname } from 'next/navigation';
import DarkModeToggle from '../DarkModeToggle';
import { useAuthStore } from '@/store/authStore';
import { IconBtn } from '../ui/IconBtn';
import {
  Home,
  PlusSquare,
  User,
  LogOut,
  Search,
  Instagram
} from 'lucide-react';

export default function Header({ showBackButton = false }: { showBackButton?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { performLogout, user } = useAuthStore();

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <header className="
      sticky top-0 z-50 
      bg-white dark:bg-gray-900
      border-b border-gray-200 dark:border-gray-700
      shadow-sm
      transition-colors duration-300
    ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* ✅ 왼쪽 로고 */}
        {path === '/feed' ? (
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <Instagram className="w-[28px] h-[28px] text-pink-500 dark:text-pink-400" />
            <span className="
              text-2xl font-extrabold
              bg-gradient-to-r from-pink-500 to-yellow-500
              bg-clip-text text-transparent
              tracking-tight
            ">
              MyGram
            </span>
          </div>
        ) : (
          <>
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </>
        )}

        {/* ✅ 중앙: 검색창 */}
        <div className="
          hidden md:flex items-center
          bg-gray-100 dark:bg-gray-800
          rounded-full px-3 py-1.5
          shadow-inner
        ">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="검색"
            className="
              bg-transparent outline-none text-sm
              text-gray-800 dark:text-gray-200
              placeholder-gray-400
            "
          />
        </div>

        {/* ✅ 오른쪽: 아이콘 메뉴 */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {accessToken ? (
            <>
              <IconBtn onClick={() => router.push('/feed')} icon={<Home />} title="홈" />
              <IconBtn onClick={() => router.push('/upload')} icon={<PlusSquare />} title="만들기" />
              <IconBtn onClick={() => router.push(`/profile/${user?.id}`)} icon={<User />} title="프로필" />
              <IconBtn onClick={handleLogout} icon={<LogOut />} title="로그아웃" />
              <DarkModeToggle />
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => router.push('/register')}
                className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
