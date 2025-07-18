// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import DarkModeToggle from '../DarkModeToggle';
// import { usePathname } from 'next/navigation';
// import { getTitleFromPath } from '@/utils/utils';

// import { LogOut, User, LayoutDashboard } from 'lucide-react';
// import { IconBtn } from '../ui/IconBtn';



// interface HeaderProps {
//   showBackButton?: boolean;
//   // title?: string;
// }

// export default function Header({ showBackButton = false }: HeaderProps) {
//   const path = usePathname();
//   // 로그인 페이지에서는 헤더를 표시하지 않음
//   // const showHeader = path !== '/login'; 레이아웃 파일로 헤더 노출 구분한게 아니라면 여기다 경로 추가해서 헤더 노출 구분
//   const showHeader = true;

//   const title = getTitleFromPath(path);
  

//   const router = useRouter();
//   const accessToken = useAuthStore((state) => state.accessToken);
//   const { performLogout } = useAuthStore();
  
//   const handleLogout = async () => {
//     await performLogout();
//     // router.push('/login');
//   };

//   return (
//     showHeader && (
//     <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
//       <div className="max-w-4xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-2 sm:gap-4 min-w-0">
//           {showBackButton && (
//             <button
//               onClick={() => router.back()}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0"
//             >
//               <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//           )}
//           <h1 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
//             {title}
//           </h1>
//         </div>

//         <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-end max-w-[70%] sm:max-w-none">
//           <DarkModeToggle />
//           {accessToken && (
//             <>
//               <IconBtn onClick={() => router.push('/')} icon={<LayoutDashboard />} title="홈" />
//               <IconBtn onClick={() => router.push('/profile')} icon={<User />} title="프로필" />
//               <IconBtn onClick={handleLogout} icon={<LogOut />} title="로그아웃" />
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//     )
//   );
// } 






// 'use client';

// import { useRouter, usePathname } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import DarkModeToggle from '../DarkModeToggle';
// import { getTitleFromPath } from '@/utils/utils';
// import { LogOut, User, LayoutDashboard } from 'lucide-react';
// import { IconBtn } from '../ui/IconBtn';
// import Image from 'next/image';

// interface HeaderProps {
//   showBackButton?: boolean;
// }

// export default function Header({ showBackButton = false }: HeaderProps) {
//   const router = useRouter();
//   const path = usePathname();
//   const showHeader = true; // 필요 시 경로별로 조건 추가 가능
//   const title = getTitleFromPath(path);

//   const accessToken = useAuthStore((state) => state.accessToken);
//   const { performLogout } = useAuthStore();

//   const handleLogout = async () => {
//     await performLogout();
//   };

//   if (!showHeader) return null;

//   return (
//     <header className="sticky top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
//       <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
//         {/* ===== 좌측 : 뒤로가기 or 로고 ===== */}
//         <div className="flex items-center gap-3 min-w-0">
//           {showBackButton ? (
//             <button
//               onClick={() => router.back()}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//           ) : (
//             <div className="flex items-center">
//               {/* 모바일용 로고 */}
//               <Image
//                 src="/logo-icon.svg" // public 폴더에 작은 로고 넣기
//                 alt="Instagram Logo"
//                 width={30}
//                 height={30}
//                 className="md:hidden cursor-pointer"
//                 onClick={() => router.push('/')}
//               />
//               {/* PC용 로고 */}
//               <Image
//                 src="/logo.svg" // public 폴더에 인스타 로고 넣기
//                 alt="Instagram"
//                 width={103}
//                 height={29}
//                 className="hidden md:block cursor-pointer"
//                 onClick={() => router.push('/')}
//               />
//             </div>
//           )}
//         </div>

//         {/* ===== 중앙 : 검색창 (PC에서만) ===== */}
//         <div className="hidden md:flex flex-1 justify-center">
//           <div className="relative w-full max-w-sm">
//             <input
//               type="text"
//               placeholder={title || '검색'}
//               className="w-full rounded-md bg-gray-100 dark:bg-gray-800 text-sm pl-10 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
//             />
//             <svg
//               className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* ===== 우측 : 다크모드 & 아이콘들 ===== */}
//         <div className="flex items-center gap-3">
//           <DarkModeToggle />
//           {accessToken && (
//             <>
//               <IconBtn
//                 onClick={() => router.push('/')}
//                 icon={<LayoutDashboard />}
//                 title="홈"
//               />
//               <IconBtn
//                 onClick={() => router.push('/profile')}
//                 icon={<User />}
//                 title="프로필"
//               />
//               <IconBtn
//                 onClick={handleLogout}
//                 icon={<LogOut />}
//                 title="로그아웃"
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }



// // components/Header.tsx
// 'use client';
// import { Home, Send, PlusSquare, Compass, Heart, LayoutDashboard, User } from 'lucide-react';
// import DarkModeToggle from '../DarkModeToggle';
// import Image from 'next/image';
// import { getTitleFromPath } from '@/utils/utils';
// import { usePathname } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';
// import { IconBtn } from '../ui/IconBtn';
// import { LogOut } from 'lucide-react';

// export default function Header() {
//   const path = usePathname();
//   const title = getTitleFromPath(path);
//   const router = useRouter();
//   const accessToken = useAuthStore((state) => state.accessToken);
//   const { performLogout } = useAuthStore();

//   const handleLogout = async () => {
//     await performLogout();
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
//       <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
//         {/* 왼쪽: 로고 */}
//         <div className="flex items-center space-x-2">
//           <Image
//             src="/logo.svg" // 인스타 로고 svg를 public 폴더에 넣어두면 돼
//             alt="Instagram"
//             width={103}
//             height={29}
//             className="hidden md:block"
//           />
//           <Image
//             src="/logo-icon.svg" // 모바일용 아이콘 로고
//             alt="Instagram"
//             width={24}
//             height={24}
//             className="md:hidden"
//           />
//         </div>

//         {/* 중앙: 검색창 (PC에서만 보여줌) */}
//         <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1">
//           <input
//             type="text"
//             placeholder="검색"
//             className="bg-transparent outline-none text-sm"
//           />
//         </div>

//         {/* 오른쪽: 아이콘들 */}
//         <div className="flex items-center space-x-5">
//         <Home className="w-6 h-6 cursor-pointer" />
//            <DarkModeToggle />
//            {accessToken && (
//             <>
//                <IconBtn onClick={() => router.push('/')} icon={<Home />} title="홈" />
//                <IconBtn onClick={() => router.push('/')} icon={<Send />} title="쪽지" />
//                <IconBtn onClick={() => router.push('/')} icon={<PlusSquare />} title="게시물 업로드" />
//                <IconBtn onClick={() => router.push('/')} icon={<Compass />} title="탐색" />
//                <IconBtn onClick={() => router.push('/')} icon={<Heart />} title="홈" />
//                <IconBtn onClick={() => router.push('/profile')} icon={<User />} title="프로필" />
//                <IconBtn onClick={handleLogout} icon={<LogOut />} title="로그아웃" />
//              </>
//            )}

//         </div>
//       </div>
//     </header>
//   );
// }




















'use client';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import DarkModeToggle from '../DarkModeToggle';
import { useAuthStore } from '@/store/authStore';
import { IconBtn } from '../ui/IconBtn';
import {
  Home,
  Send,
  PlusSquare,
  Compass,
  Heart,
  User,
  LogOut,
  Search,
} from 'lucide-react';

export default function Header({showBackButton = false}: {showBackButton?: boolean}) {
  const router = useRouter();
  const path = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { performLogout } = useAuthStore();

  const handleLogout = async () => {
    await performLogout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        {/* ✅ 왼쪽: 로고 */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          {/* PC용 로고 */}
          <Image
            src="/logo.svg"
            alt="Instagram"
            width={103}
            height={29}
            className="hidden md:block"
          />
          {/* 모바일용 로고 */}
          <Image
            src="/logo-icon.svg"
            alt="Instagram"
            width={28}
            height={28}
            className="md:hidden"
          />
        </div>

        {/* ✅ 중앙: 검색창 (PC에서만) */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="검색"
            className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* ✅ 오른쪽: 아이콘 메뉴 */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {accessToken ? (
            <>
              <IconBtn onClick={() => router.push('/')} icon={<Home />} title="홈" />
              <IconBtn onClick={() => router.push('/messages')} icon={<Send />} title="쪽지" />
              <IconBtn onClick={() => router.push('/upload')} icon={<PlusSquare />} title="만들기" />
              <IconBtn onClick={() => router.push('/explore')} icon={<Compass />} title="탐색" />
              <IconBtn onClick={() => router.push('/activity')} icon={<Heart />} title="알림" />
              <IconBtn onClick={() => router.push('/profile')} icon={<User />} title="프로필" />
              <IconBtn onClick={handleLogout} icon={<LogOut />} title="로그아웃" />
              <DarkModeToggle />
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                className="text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                로그인
              </button>
              <button
                onClick={() => router.push('/register')}
                className="text-sm font-medium text-blue-500 hover:text-blue-600"
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
