import { create } from "zustand";
import axiosRequest from "@/lib/axiosRequest";

export const useRealsStore = create((set, get) => ({
  rels: [],
  currentIdx: 0,
  currentUserName: "",
  currentUserImage: "",
  currentUserId: "",

  setCurrentIdx: (idx) => set({ currentIdx: idx }),

  extractUserFromToken: () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("Токен ёфт нашуд! Илтимос, ворид шавед.");
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsed = JSON.parse(decodedPayload);

      return {
        userId: parsed.sid || "",
        userName: parsed.name || "Номаълум",
        userImage: parsed.sub || "",
      };
    } catch (error) {
      console.error("Хатогии декод кардани токен:", error.message);
      return null;
    }
  },

  initUserFromToken: () => {
    const userInfo = get().extractUserFromToken();
    if (userInfo) {
      set({
        currentUserId: userInfo.userId,
        currentUserName: userInfo.userName,
        currentUserImage: userInfo.userImage,
      });
    }
  },

  getRels: async (pageNumber = 1, pageSize = 100) => {
    get().initUserFromToken();
    try {
      const response = await axiosRequest.get("/Post/get-reels", {
        params: { pageNumber, pageSize },
      });

      set({
        rels: response.data.data.map((reel) => ({
          ...reel,
          isLiked: reel.postLike || false,
          postFavorite: reel.postFavorite || false,
          images: reel.images || "",
          userImage: reel.userImage || "",
          comments: reel.comments || [],
        })),
      });
    } catch (error) {
      console.error("Хатогии гирифтани рилс:", error.message, error.response?.data);
    }
  },

  likeReals: async (postId) => {
    const { rels } = get();
    const reelIndex = rels.findIndex((r) => String(r.postId) === String(postId));
    if (reelIndex === -1) {
      console.error("Рилс бо postId:", postId, "ёфт нашуд");
      return;
    }

    const prevReel = rels[reelIndex];
    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          isLiked: !prevReel.isLiked,
          postLikeCount: prevReel.isLiked ? prevReel.postLikeCount - 1 : prevReel.postLikeCount + 1,
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    try {
      const response = await axiosRequest.post(
        `/Post/like-post?postId=${postId}`,
        {},
      );

      if (response.data.statusCode !== 200) {
        throw new Error("Хатогии API лайк");
      }
    } catch (error) {
      console.error("Хатогии лайк/анлайк:", error.message, error.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
    }
  },

  followUser: async (id) => {
    const { rels } = get();
    const reelIndex = rels.findIndex((r) => String(r.userId) === String(id));
    if (reelIndex === -1) {
      console.error("Рилс бо userId:", id, "ёфт нашуд");
      return;
    }

    const prevReel = rels[reelIndex];
    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          isSubscriber: true,
          subscribersCount: (prevReel.subscribersCount || 0) + 1,
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    try {
      await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`,
        {},
      );
    } catch (error) {
      console.error("Хатогии пайравӣ кардан:", error.message, error.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
    }
  },

  unfollowUser: async (id) => {
    const { rels } = get();
    const reelIndex = rels.findIndex((r) => String(r.userId) === String(id));
    if (reelIndex === -1) {
      console.error("Рилс бо userId:", id, "ёфт нашуд");
      return;
    }

    const prevReel = rels[reelIndex];
    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          isSubscriber: false,
          subscribersCount: Math.max((prevReel.subscribersCount || 1) - 1, 0),
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    try {
      await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`,
      );
    } catch (error) {
      console.error("Хатогии қатъи пайравӣ:", error.message, error.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
    }
  },

  addNewComent: async ({ postId, commentText }) => {
    const { currentUserId, currentUserName, currentUserImage, rels } = get();
    if (!currentUserId) {
      console.error("Корбари ҷорӣ ёфт нашуд");
      return;
    }

    const reelIndex = rels.findIndex((r) => String(r.postId) === String(postId));
    if (reelIndex === -1) {
      console.error("Рилс бо postId:", postId, "ёфт нашуд");
      return;
    }

    const prevReel = rels[reelIndex];
    const tempId = `temp_${Date.now()}`;
    const tempComment = {
      postCommentId: tempId,
      userId: currentUserId,
      userName: currentUserName,
      userImage: currentUserImage,
      dateCommented: new Date().toISOString(),
      comment: commentText,
    };

    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          comments: [...prevReel.comments, tempComment],
          commentCount: (prevReel.commentCount || 0) + 1,
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    try {
      const res = await axiosRequest.post(
        "/Post/add-comment",
        { comment: commentText, postId },
      );
      const realId = res.data.data?.commentId;

      if (realId) {
        set({
          rels: [
            ...rels.slice(0, reelIndex),
            {
              ...prevReel,
              comments: prevReel.comments.map((c) =>
                c.postCommentId === tempId ? { ...c, postCommentId: realId } : c
              ),
            },
            ...rels.slice(reelIndex + 1),
          ],
        });
      }
    } catch (err) {
      console.error("Хатогии иловаи коммент:", err.message, err.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
    }
  },

  deleteComment: async (postId, commentId) => {
    const { rels, currentUserId } = get();
    const reelIndex = rels.findIndex((r) => String(r.postId) === String(postId));
    if (reelIndex === -1) {
      console.error("Рилс бо postId:", postId, "ёфт нашуд");
      return;
    }

    const prevReel = rels[reelIndex];
    const comment = prevReel.comments.find((c) => String(c.postCommentId) === String(commentId));
    if (!comment || String(comment.userId) !== String(currentUserId)) {
      console.error("Коммент ё корбар мувофиқ нест");
      return;
    }

    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          comments: prevReel.comments.filter((c) => String(c.postCommentId) !== String(commentId)),
          commentCount: Math.max((prevReel.commentCount || 1) - 1, 0),
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    if (String(commentId).startsWith("temp_")) return;

    try {
      await axiosRequest.delete(`/Post/delete-comment?commentId=${commentId}`, {
      });
    } catch (err) {
      console.error("Хатогии нест кардани коммент:", err.message, err.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
    }
  },

  postSaved: async (postId) => {
    const { rels } = get();
    const reelIndex = rels.findIndex((r) => String(r.postId) === String(postId));
    if (reelIndex === -1) {
      console.error("Рилс бо postId:", postId, "ёфт нашуд");
      return;
    }

    const prevReel = { ...rels[reelIndex] }; 
    set({
      rels: [
        ...rels.slice(0, reelIndex),
        {
          ...prevReel,
          postFavorite: !prevReel.postFavorite, 
        },
        ...rels.slice(reelIndex + 1),
      ],
    });

    console.log("PostFavorite тағйир ёфт:", !prevReel.postFavorite);

    try {
      const response = await axiosRequest.post(
        `/Post/add-post-favorite`,
        { postId },
      );
      console.log("API response:", response.data); 
    } catch (error) {
      console.error("Хатогии захира кардан:", error.message, error.response?.data);
      set({
        rels: [
          ...rels.slice(0, reelIndex),
          prevReel,
          ...rels.slice(reelIndex + 1),
        ],
      });
      console.log("PostFavorite барқарор шуд:", prevReel.postFavorite);
    }
  },
}));