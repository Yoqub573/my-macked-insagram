"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Heart, MessageCircle, SendHorizontal, Play, Pause, Volume2, VolumeX, X, Bookmark } from "lucide-react";
import { useRealsStore } from "./store";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Link from "next/link";
import ModalUsers from "@/components/pages/explore/ModalUsers";
import { useTranslation } from 'react-i18next';

const Reels = () => {
  let [rellIdx, setRellIdx] = useState(0);
  let [fullText, setFullText] = useState({});
  let [isPlay, setIsPlay] = useState(false);
  let [isMuted, setIsMuted] = useState(true);
  let [open, setOpen] = useState(false);
  let [newComment, setNewComment] = useState("");
  let [isMobile, setIsMobile] = useState(false); 
  let videoRef = useRef(null);

  let {
    rels,
    getRels,
    likeReals,
    postSaved,
    followUser,
    unfollowUser,
    addNewComent,
    deleteComment,
    currentUserId,
  } = useRealsStore();

  let {t} = useTranslation()

  let currentReel = useMemo(() => rels[rellIdx] || {}, [rels, rellIdx]);

  let modalStyle = useMemo(
    () => ({
      position: "absolute",
      top: "50%",
      left: isMobile ? "50%" : "88%", 
      transform: "translate(-50%, -50%)",
      width: isMobile ? "90%" : 330,
      bgcolor: "white",
      borderRadius: "12px",
      boxShadow: 24,
      p: 2,
      maxHeight: "80vh",
      overflowY: "auto",
    }),
    [isMobile]
  );


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  useEffect(() => {
    if (rels.length === 0) {
      getRels();
    }
  }, [getRels, rels.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && currentReel?.images) {
      video.src = `http://37.27.29.18:8003/images/${currentReel.images}`;
      video.load();
      setIsPlay(true);
      video.play().catch((err) => {
        console.error("Хатои бозӣ:", err);
        setIsPlay(false);
      });
    }
  }, [currentReel.images, rellIdx]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlay) {
        video.play().catch((err) => {
          console.error("Хатои бозӣ:", err);
          setIsPlay(false);
        });
      } else {
        video.pause();
      }
    }
  }, [isPlay]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setRellIdx((prev) => (prev < rels.length - 1 ? prev + 1 : 0));
        setIsPlay(true);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setRellIdx((prev) => (prev > 0 ? prev - 1 : rels.length - 1));
        setIsPlay(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rels.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlay((prev) => {
      console.log("Play/Pause тағйир ёфт:", !prev);
      return !prev;
    });
  }, []);
  

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
      console.log("Mute тағйир ёфт:", video.muted);
    }
  }, []);
  

  const truncateText = useCallback((text, maxlength) => {
    if (!text || text.length <= maxlength) return text || "";
    return text.slice(0, maxlength) + "...";
  }, []);
  

  const toggleFullText = useCallback((postId) => {
    setFullText((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);
  

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setNewComment("");
  }, []);

  

  const handleAddComment = useCallback(async () => {
    if (newComment.trim() && currentReel.postId) {
      await addNewComent({
        postId: currentReel.postId,
        commentText: newComment,
      });
      setNewComment("");
    }
  }, [newComment, currentReel.postId, addNewComent]);

  useEffect(() => {
    console.log("Current postFavorite:", currentReel.postFavorite);
  }, [currentReel.postFavorite]);

  return (
    <div className="w-[97%] m-auto sm:w-[40%] h-screen overflow-hidden sm:m-auto flex justify-center items-center">
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Typography className="text-lg font-semibold text-gray-800">{t("rells.comments rels")}</Typography>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {currentReel?.comments?.length > 0 ? (
              currentReel.comments.map((comment) => (
                <div key={comment.postCommentId} className="flex items-start gap-3">
                  <img
                    src={
                      comment.userImage
                        ? `http://37.27.29.18:8003/images/${comment.userImage}`
                        : "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={comment.userName}
                    className="w-10 h-10 border border-gray-300 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">{comment.userName}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.dateCommented).toLocaleString()}
                        </p>
                      </div>
                      {String(comment.userId) === String(currentUserId) && (
                        <button
                          onClick={() => deleteComment(currentReel.postId, comment.postCommentId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-800">{comment.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <Typography className="text-sm text-gray-500">{t("rells.no coment rels")}</Typography>
            )}
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("rells.add new comnets rels")}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {rels.length === 0 && (
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Stack>
      )}
      {rels.length > 0 && currentReel && (
        <div className="w-full relative rounded-md h-[95vh]">
          <video
            ref={videoRef}
            className="object-cover w-full h-full bg-black rounded-md"
            playsInline
            muted={isMuted}
            onClick={togglePlayPause}
          >
            Your browser does not support the video tag.
          </video>

          {!isPlay && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Play className="w-20 h-20 p-4 text-white bg-black bg-opacity-50 rounded-full" />
            </div>
          )}

          <div className="absolute top-[50%] flex flex-col gap-[20px] items-center text-white left-[92%] z-30">
            <div className="flex flex-col items-center text-center">
              <button onClick={() => likeReals(currentReel.postId)} className="cursor-pointer">
                <Heart
                  fill={currentReel.isLiked ? "red" : "none"}
                  stroke={currentReel.isLiked ? "red" : "white"}
                />
              </button>
              <span>{currentReel.postLikeCount}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <button onClick={handleOpen} className="cursor-pointer">
                <MessageCircle />
              </button>
              <span>{currentReel.commentCount}</span>
            </div>
            <div className="flex flex-col items-center">
            <ModalUsers
                            media={currentReel.images}
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  postSaved(currentReel.postId);
                  console.log("Bookmark клик шуд, postId:", currentReel.postId);
                }}
              >
                <Bookmark
                  fill={currentReel.postFavorite ? "white" : "none"}
                  stroke="white"
                  size={25}
                />
              </button>
            </div>
            <div className="flex mt-[5px] flex-col items-center">
              <button onClick={togglePlayPause}>
                {isPlay ? <Pause /> : <Play />}
              </button>
            </div>
          </div>

          <div className="absolute bottom-15 sm:bottom-4 left-5 text-white z-10 w-[90%] flex flex-col items-start gap-[10px]">
            <div className="flex items-center mb-2">
              <Link href={`/${currentReel.userId}`}>
                <img
                  src={
                    currentReel.userImage
                      ? `http://37.27.29.18:8003/images/${currentReel.userImage}`
                      : "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={currentReel.userName}
                  className="w-10 h-10 mr-3 border border-white rounded-full"
                />
              </Link>
              <Link href={`/${currentReel.userId}`}>
                <span className="font-semibold cursor-pointer">{currentReel.userName}</span>
              </Link>
              <button
                onClick={() =>
                  currentReel.isSubscriber ? unfollowUser(currentReel.userId) : followUser(currentReel.userId)
                }
                className="px-3 py-1 ml-4 text-sm text-black bg-white rounded-full"
              >
                {currentReel.isSubscriber ? t("rells.Unfollow Rels") : t("rells.Subcribe Rels")}
              </button>
            </div>
            {currentReel.content && (
              <div>
                <span>
                  {fullText[currentReel.postId]
                    ? currentReel.content
                    : truncateText(currentReel.content, 100)}
                </span>
                {currentReel.content.length > 100 && (
                  <button
                    className="ml-2 text-sm text-gray-300 underline"
                    onClick={() => toggleFullText(currentReel.postId)}
                  >
                    {fullText[currentReel.postId] ? t("rells.menshe") : t("rells.ewe")}
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-[15px]">
              <span className="font-[500]">🎵 {currentReel.userName} {t("rells.original audio")}</span>
              <div className="flex mt-[5px] flex-col items-center">
                <button onClick={toggleMute}>{isMuted ? <VolumeX /> : <Volume2 />}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Reels);