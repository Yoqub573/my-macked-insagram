'use client'

import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import { usegetUserStore } from '@/store/pages/search/store'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { FaCamera, FaComments } from 'react-icons/fa'
import { useUserStore } from "@/store/pages/explore/explorestore"
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Bookmark, Camera, CircleUserRound, Copy, EllipsisVertical, Heart, Loader, MessageCircle, MessageCircleMore, SendHorizontal, Volume2, VolumeX, X } from "lucide-react"
import CommentInput from "@/components/pages/explore/Emogi"
import { useUserId } from "@/hook/useUserId"
import Reel from '../../../public/reel.png'
import { useRealsStore } from '../reels/store';
import useDarkSide from '@/hook/useDarkSide';
import DoubleClick from '@/components/pages/profile/profile-by-id/DoubleClick';
import ModalUsers from '@/components/pages/explore/ModalUsers';
import { useTranslation } from 'react-i18next';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: '#272727',
    color: 'white',
    height: 600,
    overflow: 'hidden'
}

const mediaStyleModal = {
    width: '100%',
    objectFit: 'cover',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    // height: 100%
}

const Posts = () => {
    const { 'profile-by-id': profileId } = useParams()
    const { getPosts, posts } = useProfileByIdStore()
    const { getUsers } = usegetUserStore()
    const userId = useUserId()

    const [open, setOpen] = useState(false)
    const [newComit, setNewComit] = useState("")
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef(null)
    const { postSaved } = useRealsStore()

    let { savePost, users, fetchUsers, postById, fetchPostById, deleteComment, addComment, unfollowUser, fetchUserFollows, Follow, FolowUser, likePost, } = useUserStore();
    let [newcomit, setnewComit] = React.useState("");
    const [likedComments, setLikedComments] = React.useState({});
    let [follow, setFollow] = React.useState(false);
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    let router = useRouter();


    useEffect(() => {
        fetchUsers();
        fetchUserFollows(userId);
    }, []);


    async function RemoveComit(postCommentId) {
        await deleteComment(postCommentId);
    }


    const handleOpen = async (id) => {
        const isFollowed = FolowUser?.data?.some(
            (e) => e.userShortInfo.userId == postById.data?.userId
        );
        await fetchPostById(id);
        try {
            await fetchUserFollows(userId);
        } catch (err) {
            console.error("Ошибка при обновлении списка подписок в handleOpen:", err);
        }
        setFollow(Boolean(isFollowed));
        setOpen(true);
    };


    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = !video.muted;
            setIsMuted(video.muted);
        }
    };


    const handleAddComment = async () => {
        if (newcomit.trim() === "") return;
        await addComment(newcomit, postById.data?.postId);
        await fetchPostById(postById.data?.postId);
        setnewComit("");
    };


    const handleLikeComment = (commentId) => {
        setLikedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };


    async function hendlFollow(id) {
        const currentlyFollowed = FolowUser?.data?.some(
            (e) => e.userShortInfo.userId == id
        );

        try {
            if (currentlyFollowed) {
                await unfollowUser(id);
                setFollow(true);
            } else {
                await Follow(id);
                setFollow(false);
            }

            try {
                await fetchUserFollows(userId);
            } catch (err) {
                console.error("Ошибка при fetchUserFollows в hendlFollow:", err);
            }

            const updatedFollow = FolowUser?.data?.some(
                (e) => e.userShortInfo.userId == id
            );
        } catch (error) {
            console.error("Ошибка при подписке/отписке:", error);
        }
    }


    const handleLike = async () => {
        await likePost(postById?.data?.postId)
        await getPostById(postById?.data?.postId)
    }


    const handleBookmark = () => {
        console.log('Toggle bookmark for post', postById.data?.postId)
    }

    const [theme] = useDarkSide()

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            await getPosts(profileId);
            setLoading(false);
        };

        if (profileId) fetchPosts();
    }, [profileId, getPosts]);


    useEffect(() => { if (profileId) getPosts(profileId) }, [profileId, getPosts])
    useEffect(() => { getUsers() }, [getUsers])

    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {loading ? (
                    <Loader className="text-gray-400 animate-spin" size={43} />) : (
                    loading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="relative md:w-[310px] h-[190px] w-[113px] md:h-[414px] overflow-hidden rounded-[2px]">
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: theme === 'dark' ? 'grey.900' : 'grey.700',
                                    }}
                                />
                            </div>
                        ))
                    ) : posts?.data?.length ? (
                        posts.data
                            .slice()
                            .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
                            .map(post => {
                                const reels = post?.images?.find(media => media.endsWith(".mp4"));
                                return (
                                    <div
                                        key={post?.postId}
                                        className="relative overflow-hidden group cursor-pointer h-[190px] w-[113px] md:h-[414px] object-cover md:w-[310px]"
                                        onClick={() => handleOpen(post?.postId)}
                                    >
                                        {post?.images?.map((media, i) =>
                                            media.endsWith(".mp4") ? (
                                                <video
                                                    key={i}
                                                    src={`http://37.27.29.18:8003/images/${media}`}
                                                    className="h-full md:w-[310px] w-[113px] object-cover"
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <Image
                                                    key={i}
                                                    src={`http://37.27.29.18:8003/images/${media}`}
                                                    alt="image"
                                                    height={414}
                                                    width={310}
                                                    className="h-full md:w-[310px] w-[113px] object-cover"
                                                />
                                            )
                                        )}

                                        <div className="absolute inset-0 hover:bg-[#000000b3] bg-opacity-40 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center gap-1 text-white">
                                                <Heart fill="white" /> {post.postLikeCount}
                                            </div>
                                            <div className="flex items-center gap-1 text-white">
                                                <FaComments /> {post.commentCount}
                                            </div>
                                        </div>

                                        {reels ? (
                                            <div className="top-3 right-3 absolute">
                                                <Image src={Reel} alt="reel icon" width={20} height={20} />
                                            </div>
                                        ) : (
                                            <div className="top-3 right-3 absolute">
                                                <Copy size={20} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                    ) : (
                        <div className="col-span-3 flex flex-col font-extrabold items-center gap-5 text-center text-[30px] py-10">
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                <FaCamera size={62} color="#333" />
                            </div>
                            <h1>No Posts Yet</h1>
                        </div>
                    )
                )}
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className={` flex flex-col lg:flex-row gap-[20px] h-[85vh] bg-[#272727]`}>
                            {postById ? (
                                <div className="lg:flex w-full gap-[20px]">
                                    <div className="lg:w-[47%] ">
                                        <DoubleClick postById={postById} getPostById={fetchPostById} likePost={likePost} />
                                    </div>
                                    <div className="lg:w-[51%] lg:p-[20px] ">
                                        <div className="lg:p-0 p-[20px]">
                                            <div className="flex  w-full justify-between pb-[20px]  items-center">
                                                <div className="flex gap-[20px]">
                                                    <div>
                                                        <img
                                                            src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`}
                                                            className="w-[40px] h-[40px] rounded-full"
                                                            alt="test"
                                                        />
                                                    </div>
                                                    <p
                                                        onClick={() =>
                                                            router.push(`/${postById.data?.userId}`)
                                                        }
                                                        className="font-medium cursor-pointer  min-w-20 max-w-40 text-[20px] lg:text-[25px] truncate"
                                                    >
                                                        {postById.data?.userName}
                                                    </p>{" "}
                                                    <br />
                                                </div>
                                                <button
                                                    className="px-3 py-1 ml-4 text-sm cursor-pointer text-black bg-white rounded-full"
                                                    onClick={() => hendlFollow(postById.data?.userId)}
                                                >
                                                    {postById?.data?.isFollowing
                                                        ? t("exlpore.2")
                                                        : t("exlpore.1")}
                                                </button>

                                                <button
                                                    className="cursor-pointer lg:block hidden"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <X />
                                                </button>
                                            </div>
                                            <div className="overflow-y-auto overflow-x-hidden break-words select-none max-h-[53vh] space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                                {postById.data?.comments?.length > 0 ? (
                                                    postById.data.comments.map((comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex  gap-3 items-center flex-1 min-w-0">
                                                                {comment.userImage ? (
                                                                    <img
                                                                        src={
                                                                            comment.userImage
                                                                                ? `http://37.27.29.18:8003/images/${comment.userImage}`
                                                                                : "https://via.placeholder.com/40"
                                                                        }
                                                                        alt={comment.userName}
                                                                        className="w-8 h-8 border border-gray-300 rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div>
                                                                        <CircleUserRound
                                                                            className="cursor-pointer"
                                                                            size={34}
                                                                            onClick={() =>
                                                                                router.push(`/${comment.userId}`)
                                                                            }
                                                                            color="#ffffff"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="min-w-120">
                                                                    <p className="text-[15px]  w-[90%] ">
                                                                        {comment.comment}
                                                                    </p>
                                                                    {comment.dateCommented && (
                                                                        <span className="text-[10px] text-gray-400 leading-0 self-end">
                                                                            {new Date(
                                                                                comment.dateCommented
                                                                            ).toLocaleString([], {
                                                                                year: "numeric",
                                                                                month: "2-digit",
                                                                                day: "2-digit",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {comment.userId == userId ? (
                                                                <div className="flex gap-[10px]">
                                                                    <button
                                                                        className="cursor-pointer hover:text-red-500"
                                                                        onClick={() =>
                                                                            RemoveComit(comment.postCommentId)
                                                                        }
                                                                    >
                                                                        <X />
                                                                    </button>
                                                                    <Heart
                                                                        className="cursor-pointer"
                                                                        onClick={() =>
                                                                            handleLikeComment(comment.postCommentId)
                                                                        }
                                                                        size={20}
                                                                        color="#ffffff"
                                                                        fill={
                                                                            likedComments[comment.postCommentId]
                                                                                ? "red"
                                                                                : "nane"
                                                                        }
                                                                        stroke={
                                                                            likedComments[comment.postCommentId]
                                                                                ? "red"
                                                                                : "white"
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Heart
                                                                    className="cursor-pointer"
                                                                    onClick={() =>
                                                                        handleLikeComment(comment.postCommentId)
                                                                    }
                                                                    size={20}
                                                                    color="#ffffff"
                                                                    fill={
                                                                        likedComments[comment.postCommentId]
                                                                            ? "red"
                                                                            : "none"
                                                                    }
                                                                    stroke={
                                                                        likedComments[comment.postCommentId]
                                                                            ? "red"
                                                                            : "white"
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400">Нет комментариев</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t fixed bottom-0 bg-[#272727] h-[120px] z-10 lg:w-[47%] w-[100%] lg:p-0 p-[20px] mt-[300px] pt-[10px]">
                                            <div className="flex justify-between mb-2 pt-[10px]">
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={async () =>
                                                            await likePost(postById.data?.postId)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Heart
                                                            size={24}
                                                            color="#ffffff"
                                                            fill={postById.data?.postLike ? "red" : "none"}
                                                            stroke={postById.data?.postLike ? "red" : "white"}
                                                        />
                                                    </button>
                                                    <MessageCircleMore size={24} color="#ffffff" />

                                                    <div>
                                                        <ModalUsers
                                                            media={postById?.data?.images?.[0]}
                                                            postId={postById.data?.postId}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        savePost(postById.data?.postId);
                                                    }}
                                                >
                                                    <Bookmark
                                                        fill={postById.data?.postFavorite ? "white" : "none"}
                                                        size={24}
                                                        color="#ffffff"
                                                    />
                                                </button>
                                            </div>

                                            <div className="mb-2">
                                                <span className="font-bold">
                                                    {postById.data?.postLikeCount} {t("exlpore.3")} {t("exlpore.4")}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <CommentInput
                                                    value2={newcomit}
                                                    onChange2={(e) => setnewComit(e.target.value)}
                                                />
                                                <button
                                                    onClick={handleAddComment}
                                                    disabled={!newcomit.trim()}
                                                    className="text-blue-500 disabled:text-gray-500"
                                                >
                                                    <SendHorizontal size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>Загрузка...</p>
                                </div>
                            )}
                        </div>
                    </Box>
                </Modal>

            </div >
        </>

    )
}

export default Posts
