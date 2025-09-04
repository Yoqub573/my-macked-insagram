'use client'

import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useHome = create((set, get) => ({
  data: [],
  users: [],
  posts: [],
  isLoading: false,
  isLoadingPosts: false,

  // универсальная функция для запросов с загрузкой
  fetchData: async ({ key, url, loadingKey }) => {
    try {
      if (loadingKey) set({ [loadingKey]: true })
      const { data } = await axiosRequest(url)
      set({ [key]: data })
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    } finally {
      if (loadingKey) set({ [loadingKey]: false })
    }
  },

  getUserStories: () => get().fetchData({ key: 'data', url: 'Story/get-stories', loadingKey: 'isLoading' }),
  getUserPosts: () => get().fetchData({ key: 'posts', url: 'Post/get-posts', loadingKey: 'isLoadingPosts' }),
  getUser: (pageSize = 10) => get().fetchData({ key: 'users', url: `User/get-users?PageSize=${pageSize}` }),

  // лайк поста
  likePost: async postId => {
    const prevPosts = get().posts
    set(state => ({
      posts: {
        ...state.posts,
        data: state.posts.data.map(post =>
          post.postId === postId
            ? { ...post, postLike: !post.postLike, likeCount: post.postLike ? post.likeCount - 1 : post.likeCount + 1 }
            : post
        ),
      },
    }))
    try {
      await axiosRequest.post(`/Post/like-post?postId=${postId}`, {})
    } catch (error) {
      console.error('Error liking post', error)
      set({ posts: prevPosts })
    }
  },

  likeStory: async storyId => {
    const prevStories = get().data
    set(state => ({
      data: state.data.map(story =>
        story.id === storyId
          ? { ...story, likeCount: story.postLike ? story.likeCount - 1 : story.likeCount + 1 }
          : story
      ),
    }))
    try {
      await axiosRequest.post(`/Story/LikeStory?storyId=${storyId}`, {})
    } catch (error) {
      console.error('Error liking story', error)
      set({ data: prevStories })
    }
  },

  commentPost: async comment => {
    const prevPosts = get().posts
    try {
      await axiosRequest.post(`/Post/add-comment`, comment)
    } catch (error) {
      console.error('Error commenting post', error)
      set({ posts: prevPosts })
    }
  },

  postSaved: async postId => {
    try {
      await axiosRequest.post(`/Post/add-post-favorite`, { postId })
      set(state => ({
        users: {
          ...state.users,
          data: state.users.data.map(user => (user.postId === postId ? { ...user, postFavorite: true } : user)),
        },
        posts: {
          ...state.posts,
          data: state.posts.data.map(post => (post.postId === postId ? { ...post, postFavorite: true } : post)),
        },
      }))
    } catch (error) {
      console.error('Error saving post', error)
    }
  },

  postStory: async formdata => {
    try {
      await axiosRequest.post('/Story/AddStories', formdata)
    } catch (error) {
      console.error('Error posting story', error)
    }
  },

  followUser: async id => {
    try {
      await axiosRequest.post(`FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`, {})
    } catch (error) {
      console.error('Error following user', error)
    }
  },
}))
