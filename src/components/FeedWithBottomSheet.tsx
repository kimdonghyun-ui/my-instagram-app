'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePostStore } from '@/store/postStore';
import { useAuthStore } from '@/store/authStore';


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
                    {selectedPost?.attributes?.comments?.data?.map((c) => (
                        <div key={c.id} className="py-2 border-b border-gray-100">
                        <span className="font-semibold mr-2">
                            {c.attributes.author?.data?.attributes?.username}
                        </span>
                        <span>{c.attributes.content}</span>
                        </div>
                    ))}
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
