'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';
import Image from 'next/image';
import { uploadImage } from '@/utils/uploadImage';
import { toast } from 'react-hot-toast';
import { Heart, Image as ImageIcon, Users, UserPlus } from 'lucide-react';

export default function ProfileContent({ paramsUserId }: { paramsUserId: string }) { // paramsUserId = 프로필 페이지 유저의 id
  const { user, handleProfileUpdate, fetchUserById, toggleFollow, otherProfileData } = useAuthStore();
  const { fetchPostsByUser, otherPosts } = usePostStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    profileImage: user?.profileImage || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 내 프로필인지 아닌지 여부
  const isMyProfile = user?.id === Number(paramsUserId);

  // 카운트
  const followerCount = otherProfileData?.followers?.length || 0; // 팔로워 수
  const followingCount = otherProfileData?.following?.length || 0; // 팔로잉 수
  const likedPostsCount = otherProfileData?.likedPosts?.length || 0; // 찜한 게시물 수

  // 해당 유저속 데이터 확인해서 내가 팔로우한 유저인지 아닌지 여부
  const isFollowing = useMemo(() => {
    const followingIds = otherProfileData?.followers?.map((f) => f.id) || [];
    return followingIds.includes(Number(user?.id));
  }, [otherProfileData, user]);

  // 프로필 이미지 변경
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        const images = await uploadImage(event.target.files[0]);
        setEditedUser((prev) => ({ ...prev, profileImage: images.url }));
      } catch (error) {
        console.error('파일 변환 중 오류 발생:', error);
      }
    }
  };

  // 프로필 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      setIsEditing(false);
      await handleProfileUpdate(editedUser);
      toast.success('프로필이 업데이트되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 게시물 / 프로필 불러오기
  useEffect(() => {
    if (!paramsUserId) return;
    const loadData = async () => {
      try {
        await Promise.all([
          fetchPostsByUser(Number(paramsUserId)),
          fetchUserById(Number(paramsUserId)),
        ]);
      } catch (err) {
        console.error('유저 프로필 로딩 실패:', err);
      }
    };
    loadData();
  }, [paramsUserId]);

  // 프로필 수정 모드에 따른 상태 초기화
  useEffect(() => {
    setEditedUser({
      username: user?.username || '',
      email: user?.email || '',
      password: user?.email === 'hello@naver.com' ? 'hello123' : '',
      profileImage: user?.profileImage || '',
    });

    if (user?.email === 'hello@naver.com' && isEditing) {
      toast.success('테스트 계정은 이메일/비번 변경 불가');
    }
  }, [isEditing, user]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      {/* 상단 프로필 영역 */}
      {isMyProfile ? (
        <>
          <section className="bg-white dark:bg-gray-800 p-6 border-b">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                {editedUser.profileImage ? (
                  <Image
                    src={editedUser.profileImage}
                    alt={editedUser.username}
                    width={80}
                    height={80}
                    className="object-cover w-20 h-20"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">👤</div>
                )}
                {isEditing && (
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1 rounded-full shadow cursor-pointer"
                  >
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span className="text-xs">📷</span>
                  </label>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                      className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser((prev) => ({ ...prev, username: e.target.value }))}
                    />
                    <input
                      className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={editedUser.email === 'hello@naver.com'}
                    />
                    <input
                      type="password"
                      className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                      placeholder="새 비밀번호"
                      value={editedUser.password}
                      onChange={(e) => setEditedUser((prev) => ({ ...prev, password: e.target.value }))}
                      disabled={editedUser.email === 'hello@naver.com'}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
                      >
                        {isLoading ? '저장중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 rounded"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-xl font-bold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      프로필 수정
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="bg-white dark:bg-gray-800 p-6 border-b flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
              {otherProfileData?.profileImage ? (
                <Image
                  src={otherProfileData.profileImage}
                  alt={otherProfileData.username}
                  width={128}
                  height={128}
                  className="object-cover w-32 h-32"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                  👤
                </div>
              )}
            </div>
            <p className="text-xl font-bold">{otherProfileData?.username}</p>
            <p className="text-sm text-gray-500">{otherProfileData?.email}</p>
          </section>
        </>
      )}

      {/* 팔로우 버튼 */}
      {!isMyProfile && (
        <div className="bg-white dark:bg-gray-800 border-b py-4 flex justify-center">
          <button
            onClick={() => toggleFollow(Number(paramsUserId))}
            className={`px-6 py-2 font-medium rounded-full transition-colors duration-200 ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isFollowing ? '팔로잉 ✔️' : '팔로우 +'}
          </button>
        </div>
      )}

      {/* 게시물 수 / 팔로워 수 / 팔로잉 수 */}
      <section className="flex justify-around py-4 bg-white dark:bg-gray-800 border-b text-center">
        {isMyProfile && (
          <div className="flex flex-col items-center">
            <Heart className="w-5 h-5 mb-1 text-red-500" />
            <p className="font-bold">{likedPostsCount}</p>
            <p className="text-sm text-gray-500">찜한</p>
          </div>
        )}
        <div className="flex flex-col items-center">
          <ImageIcon className="w-5 h-5 mb-1 text-blue-500" />
          <p className="font-bold">{otherPosts.length}</p>
          <p className="text-sm text-gray-500">게시물</p>
        </div>
        <div className="flex flex-col items-center">
          <Users className="w-5 h-5 mb-1 text-green-500" />
          <p className="font-bold">{followerCount}</p>
          <p className="text-sm text-gray-500">팔로워</p>
        </div>
        <div className="flex flex-col items-center">
          <UserPlus className="w-5 h-5 mb-1 text-purple-500" />
          <p className="font-bold">{followingCount}</p>
          <p className="text-sm text-gray-500">팔로잉</p>
        </div>
      </section>

      {/* 게시물 리스트 */}
      <section className="grid grid-cols-3 gap-1 p-1">
        {otherPosts.map((post) => (
          <div key={post.id} className="relative aspect-square">
            {post.attributes.image?.data?.attributes?.url && (
              <Image
                src={post.attributes.image.data.attributes.url}
                alt="post"
                fill
                className="object-cover"
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
