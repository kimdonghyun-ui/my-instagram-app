import Image from 'next/image';
import { PostEntity } from '@/types/index';
import { Heart, MessageCircle } from 'lucide-react';
import { IconBtn } from '@/components/ui/IconBtn';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: PostEntity;
}

export default function PostCard({ post }: PostCardProps) {
  const { image, author, caption, likes } = post.attributes;
  const username = author?.data?.attributes?.username || '알 수 없음';
  const { user } = useAuthStore();
  const { toggleLike, setCommentModal } = usePostStore();
  const router = useRouter();
  
  // 내가 좋아요 눌렀는지 여부
  const isLiked = !!likes.data.find((u) => u.id === user?.id);

  // 좋아요 누르기
  const handleLike = () => {
    if (!user) {
      console.log('로그인 안 됐을 때 처리');
      return;
    }
    toggleLike(post.id, user.id); // 좋아요 스토어 함수 실행(api 호출)
  };

  // 댓글 모달 열기
  const handleComment = () => {
    setCommentModal(true, post);
    console.log(true, post)
  };

  return (
    <article className="bg-white border-b border-gray-200">
      {/* 작성자 영역 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-3" onClick={() => router.push(`/profile/${author?.data?.id}`)}>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
            {/* 프로필 이미지 */}
            {author?.data?.attributes?.profileImage && (
              <Image
                src={author.data.attributes.profileImage}
                alt={username}
                width={36}
                height={36}
                className="w-9 h-9 object-cover"
                priority
              />
            )}
          </div>
          <span className="text-sm font-semibold">{username}</span>
        </div>
        {/* <MoreHorizontal className="w-5 h-5 text-gray-600" /> */}
      </div>

      {/* 게시물 이미지 */}
      {image?.data?.attributes?.url && (
        <div className="w-full relative">
          <Image
            src={
              image.data.attributes.formats?.small?.url ||
              image.data.attributes.url
            }
            alt={image.data.attributes.alternativeText || 'post image'}
            width={600}
            height={600}
            className="w-full object-cover aspect-square"
            priority
          />
        </div>
      )}

      {/* 인터랙션 버튼 */}
      <div className="flex justify-between items-center px-3 py-2">
        <div className="flex items-center space-x-3">
          <IconBtn onClick={handleLike} icon={<Heart />} isActive={isLiked} title="홈" />
          <IconBtn
            onClick={handleComment}
            icon={<MessageCircle />} title="홈" />

          {/* <Send className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" /> */}
        </div>
      </div>

      {/* 좋아요 수 */}
      <div className="px-3">
        <p className="text-sm font-semibold">
          {post.attributes.likes?.data?.length || 0} likes
        </p>
      </div>

      {/* 캡션 */}
      <div className="px-3 py-1 pb-3">
        <p className="text-sm">
          <span className="font-semibold mr-1">{username}</span>
          {caption}
        </p>
      </div>

    </article>
  );
}
