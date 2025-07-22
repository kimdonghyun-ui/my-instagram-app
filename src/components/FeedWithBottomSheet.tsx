'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function FeedWithBottomSheet() {
    const [newComment, setNewComment] = useState('');
    const { user } = useAuthStore();
    const { isCommentOpen, selectedPost, setCommentModal, addComment } = usePostStore();

    // ✅ 댓글 모달 닫기
    const closeComments = () => {
        setCommentModal(false);
        setNewComment(''); // 인풋 초기화
    };

    // ✅ 댓글 추가
    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;
        
        await addComment(newComment, user.id);
        setNewComment(''); // 인풋 초기화
    };


    return (
        <>
            {/* 바텀시트 */}
            <AnimatePresence>
                {isCommentOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Dimmed background */}
                    <div
                    className="absolute inset-0 bg-black/40"
                    onClick={closeComments}
                    ></div>

                    {/* Bottom sheet */}
                    <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative mt-auto bg-white rounded-t-2xl max-h-[80vh] w-full flex flex-col"
                    >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2"></div>

                    {/* 헤더 */}
                    <div className="flex justify-between items-center px-4 pb-2 border-b">
                        <h2 className="font-bold text-lg">댓글</h2>
                        <button onClick={closeComments}>
                        <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* 댓글 리스트 */}
                    <div className="flex-1 overflow-y-auto px-4">
                    {selectedPost?.attributes?.comments?.data?.map((c) => {
                        const author = c.attributes.author?.data?.attributes;
                        const createdAt = new Date(c.attributes.createdAt);
                        const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: ko });
                        return (
                        <div key={c.id} className="flex items-start py-3 border-b border-gray-100">
                            {/* ✅ 프로필 이미지 */}
                            <div className="mr-3 flex-shrink-0">
                            {author?.profileImage ? (
                                <Image
                                src={author.profileImage}
                                alt={author.username}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-10 h-10"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                👤
                                </div>
                            )}
                            </div>

                            {/* ✅ 내용 영역 */}
                            <div className="flex-1">
                            {/* 첫 번째 줄: 이름 + 시간 */}
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="font-semibold text-gray-800 mr-2">{author?.username}</span>
                                <span>{timeAgo}</span>
                            </div>
                            {/* 두 번째 줄: 내용 */}
                            <p className="text-sm text-gray-800 mt-1">{c.attributes.content}</p>
                            </div>
                        </div>
                        );
                    })}
                    </div>


                    {/* 댓글 입력 */}
                    <div className="p-3 border-t flex items-center gap-2">
                        <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // ✅ 기본 submit 막기
                                handleAddComment();
                            }
                            }}
                        placeholder="댓글 달기..."
                        className="flex-1 p-2 border rounded-lg text-sm"
                        />
                        <button
                        onClick={(e) => {
                            e.preventDefault(); // ✅ 기본 submit 막기
                            handleAddComment();
                            
                            }}
                        className="text-blue-500 font-bold text-sm"
                        >
                        게시
                        </button>
                    </div>
                    </motion.div>
                </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
