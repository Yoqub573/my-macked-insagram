import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

let api = 'http://37.27.29.18:8003/'

export const useProfileByIdStore = create((set, get) => ({
    users: [],
    chats: [],
    posts: [],
    followers: [],
    followings: [],
    getProfileById: async (id) => {
        try {
            let { data } = await axiosRequest.get(`${api}UserProfile/get-user-profile-by-id?id=${id}`)
            set({ users: data })
        } catch (error) {
            console.error(error)
        }
    },
    getChats: async () => {
        let { data } = await axiosRequest.get(`Chat/get-chats`)
        set({ chats: data })
    },
    addChats: async (id) => {
        await axiosRequest.post(`Chat/create-chat?receiverUserId=${id}`)
        await get().getChats()
    },
    getPosts: async (id) => {
        try {
            let { data } = await axiosRequest.get(`Post/get-posts?UserId=${id}`)
            set({ posts: data })
        } catch (error) {
            console.error(error);
        }
    },
    getFollowers: async (id) => {
        try {
            let { data } = await axiosRequest.get(`FollowingRelationShip/get-subscribers?UserId=${id}`)
            set({ followers: data })
        } catch (error) {
            console.error(error)
        }
    },
    getFollowings: async (id) => {
        try {
            let { data } = await axiosRequest.get(`FollowingRelationShip/get-subscriptions?UserId=${id}`)
            set({ followings: data })
        } catch (error) {
            console.error(error)
        }
    },
    getUsers: async () => {
        try {
            let { data } = await axiosRequest.get(`/User/get-users?PageSize=${1000}`);
            set({ users: data })
        } catch (error) {
            console.error(error);
        }
    },
    follow: async (id) => {
        try {
            await axiosRequest.post(`FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`)
            await get().getProfileById(id)
        } catch (error) {
            console.error(error)
        }
    },
    unfollow: async (id) => {
        try {
            await axiosRequest.delete(`FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`)
            await get().getProfileById(id)
        } catch (error) {
            console.error(error)
        }
    },
    addPostFavorite: async (postId) => {
        const userId = get().user?.id
        try {
            await axiosRequest.post('Post/add-post-favorite', { userId, postId })
            await get().getPosts()
        } catch (error) {
            console.error(error)
        }
    }
}))