'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Instagram } from 'lucide-react';

const loginMessages = [
  {
    title: 'MyGram',
    subtitle: '나만의 인스타그램을 만들어보세요',
  },
]

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('hello@naver.com');
  const [password, setPassword] = useState('hello123');
  const { handleLogin, isLoading } = useAuthStore();

  const [message, setMessage] = useState(loginMessages[0])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ identifier, password });
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loginMessages.length)
    setMessage(loginMessages[randomIndex])
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-10">

        {/* 왼쪽 영역 - 인스타처럼 폰 이미지나 설명 넣을 수 있음 */}
        <div className="hidden md:block">
          <Instagram className="w-[200px] h-[200px] text-gray-500" />
        </div>

        {/* 오른쪽 로그인 카드 */}
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-8 shadow-sm">
            {/* 로고 영역 */}
            <h1 className="text-center text-4xl font-extrabold text-gray-800 dark:text-white tracking-wide mb-1">
              {message.title}
            </h1>
            <p className="text-center text-sm text-gray-500 mb-6">
              {message.subtitle}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="이메일"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600
                            bg-gray-50 dark:bg-gray-700 text-sm
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600
                            bg-gray-50 dark:bg-gray-700 text-sm
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                            placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-md
                          hover:bg-blue-600 focus:ring-2 focus:ring-blue-400
                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    로그인 중...
                  </div>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            {/* ✅ Heroku 슬립 안내 문구 */}
            {/* <p className="text-center text-xs text-red-500 mt-4 font-medium">
              ※ 첫 로그인 시, 백엔드 서버 기동으로 인해 약간의 지연이 발생할 수 있습니다.
            </p> */}


          </div>

          {/* 회원가입 안내 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center text-sm mt-4">
            계정이 없으신가요?{' '}
            <a href="/register" className="text-blue-500 font-semibold hover:underline">
              가입하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}