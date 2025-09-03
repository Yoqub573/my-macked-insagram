import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Image from "next/image";
import { Heart, MessageCircle, SendHorizontal, Volume2, VolumeX, Bookmark, X, CircleUserRound } from "lucide-react";
import CommentInput from "@/components/pages/explore/Emogi";
import { useUserStore } from "@/store/pages/explore/explorestore";
import { useUserId } from "@/hook/useUserId";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 1000,
    bgcolor: "#272727",
    color: "white",
    borderRadius: 4,
    overflow: "hidden"
};

const mediaStyleModal = {
    width: "100%",
    objectFit: "cover",
    borderRadius: "2px",
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
};

const PostsModal = ({ open, handleClose, postById }) => {
    const { likePost, likedPosts, AddComit, deletComit } = useUserStore();
    const userId = useUserId();
    const [commentInput, setCommentInput] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) return;
        await AddComit(commentInput, postById.postId);
        setCommentInput("");
    };

    const handleDeleteComment = async (commentId) => {
        await deletComit(commentId);
    }

    const handleLike = async () => {
        await likePost(postById.postId);
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {postById ? (
                    <div className="flex flex-col md:flex-row h-[80vh]">
                        <div className="md:w-2/5 w-full relative bg-black flex items-center justify-center">
                            {postById.images?.[0] && (() => {
                                const el = postById.images[0];
                                const mediaUrl = `http://37.27.29.18:8003/images/${el}`;
                                return (
                                    <div key={el}>
                                        {el.endsWith(".mp4") ? (
                                            <div>
                                                <video
                                                    ref={videoRef}
                                                    src={mediaUrl}
                                                    className="w-full lg:h-[85vh] h-[50vh] object-cover"
                                                    playsInline
                                                    autoPlay
                                                    muted={isMuted}
                                                    loop
                                                />
                                                <button
                                                    onClick={toggleMute}
                                                    className="absolute top-4 right-4 text-white z-10"
                                                >
                                                    {isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
                                                </button>
                                            </div>
                                        ) : (
                                            <img src={mediaUrl} alt="post media" style={mediaStyleModal} />
                                        )}
                                        <button onClick={handleClose} className="absolute top-2 right-2 text-red-500 z-10">
                                            <X size={30} />
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="md:w-3/5 w-full flex flex-col p-4 overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`http://37.27.29.18:8003/images/${postById.userImage}`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <p className="text-lg font-semibold">{postById.userName}</p>
                                </div>
                                <button className="text-blue-500 font-bold">Follow</button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {postById.comments?.length > 0 ? (
                                    postById.comments.map((c) => (
                                        <div key={c.postCommentId} className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {c.userImage ? (
                                                    <img src={`http://37.27.29.18:8003/images/${c.userImage}`} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <CircleUserRound size={40} color="#ffffff" />
                                                )}
                                                <div>
                                                    <p className="text-sm">{c.comment}</p>
                                                    {c.dateCommented && (
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(c.dateCommented).toLocaleString([], {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {c.userId === userId ? (
                                                <button onClick={() => handleDeleteComment(c.postCommentId)}>
                                                    <Heart fill="red" />
                                                </button>
                                            ) : (
                                                <Heart />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No comments yet</p>
                                )}
                            </div>

                            {/* Add comment */}
                            <div className="flex gap-2 items-center border-t border-gray-700 pt-2">
                                <CommentInput value2={commentInput} onChange2={(e) => setCommentInput(e.target.value)} />
                                <button onClick={handleAddComment}>
                                    <SendHorizontal />
                                </button>
                            </div>

                            {/* Like / Share / Bookmark */}
                            <div className="flex justify-between mt-4">
                                <div className="flex gap-3">
                                    <button onClick={handleLike}>
                                        <Heart fill={likedPosts?.[postById.postId] ? "red" : "none"} />
                                    </button>
                                    <MessageCircle />
                                    <SendHorizontal />
                                </div>
                                <Bookmark />
                            </div>

                            <p className="mt-2 font-bold">{postById.postLikeCount} likes</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-white p-4">Loading...</p>
                )}
            </Box>
        </Modal>
    );
};

export default PostsModal;