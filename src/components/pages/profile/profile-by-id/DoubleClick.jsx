'use client'
import { useUserStore } from '@/store/pages/explore/explorestore';
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'

const DoubleClick = ({ postById, getPostById, likePost }) => {
    const videoRef = useRef(null)
    const [isMuted, setIsMuted] = useState(true)

    const postId = postById?.data?.postId;

    const [isLiked, setIsLiked] = React.useState(!!postById?.data?.postLike);
    const [likeCount, setLikeCount] = React.useState(postById?.data?.postLikeCount ?? 0);
    const [burst, setBurst] = React.useState(false); // big heart overlay

    const [isPlaying, setIsPlaying] = React.useState(true);

    React.useEffect(() => {
        setIsLiked(!!postById?.data?.postLike);
        setLikeCount(postById?.data?.postLikeCount ?? 0);
    }, [postById?.data?.postId, postById?.data?.postLike, postById?.data?.postLikeCount]);


    const handleDoubleLike = async () => {
        setBurst(true);
        setTimeout(() => setBurst(false), 600);


        setIsLiked(true);
        setLikeCount(c => c + 1);

        try {
            await likePost(postId);
            await getPostById(postId);
        } catch (e) {
            setIsLiked(false);
            setLikeCount(c => c - 1);
        }
    };

    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current
        if (video) {
            video.muted = !video.muted
            setIsMuted(video.muted)
        }
    }

    return (
        <div>
            {postById.data?.images?.[0] && (() => {
                const media = postById.data.images[0];
                const mediaUrl = `http://37.27.29.18:8003/images/${media}`;

                return (
                    <div className="relative w-full h-full">
                        {media.endsWith('.mp4') ? (
                            <div
                                className="relative w-full h-[50vh] lg:h-[85vh] overflow-hidden"
                                onDoubleClick={handleDoubleLike}
                                onClick={handlePlayPause}
                            >
                                <video
                                    ref={videoRef}
                                    src={mediaUrl}
                                    className="w-[400] h-[610px] object-cover select-none"
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                    className="absolute bottom-4 right-4 bg-black/40 p-2 rounded-full"
                                >
                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                </button>

                                <AnimatePresence>
                                    {burst && (
                                        <motion.div
                                            key="burst"
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                            initial={{ scale: 0.3, opacity: 0 }}
                                            animate={{ scale: 1.15, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.45 }}
                                        >
                                            <Heart size={140} fill="red" stroke="red" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div
                                className="relative w-full h-[50vh] lg:h-[85vh] overflow-hidden"
                                onDoubleClick={handleDoubleLike}
                                onClick={handlePlayPause}
                            >
                                <Image
                                    src={mediaUrl}
                                    alt="user"
                                    width={400}
                                    height={400}
                                    className="w-[400] h-[610px] object-cover select-none"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                    className="absolute bottom-4 right-4 bg-black/40 p-2 rounded-full"
                                >
                                    {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                                </button>

                                <AnimatePresence>
                                    {burst && (
                                        <motion.div
                                            key="burst"
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                            initial={{ scale: 0.3, opacity: 0 }}
                                            animate={{ scale: 1.15, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.45 }}
                                        >
                                            <Heart size={140} fill="red" stroke="red" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    )
}

export default DoubleClick