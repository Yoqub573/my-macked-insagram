import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useHome = create((set, get) => ({
	data: [],
	users: [],
	posts: [],
	isLoading: false,
	isLoading2: false,
	getUserStories: async () => {
		try {
			set({ isLoading: true })
			let { data: data2 } = await axiosRequest('Story/get-stories')
			set(state => ({ data: data2 }))
		} catch (error) {
			console.error(error)
			set({ isLoading: true })
		} finally {
			set({ isLoading: false })
		}
	},
	getUser: async () => {
		try {
			let { data: data2 } = await axiosRequest(`User/get-users?PageSize=${Math.floor(Math.random() * 10) + 1}`)
			set(state => ({ users: data2 }))
		} catch (error) {
			console.error(error)
		} finally {
		}
	},
	getUserPosts: async () => {
		try {
			set({ isLoading2: true })
			let { data: data3 } = await axiosRequest('Post/get-posts')
			set({ posts: data3 })
		} catch (error) {
			console.error(error)
			set({ isLoading2: true })
		} finally {
			set({ isLoading2: false })
		}
	},
	likePost: async postId => {
		const prevPosts = get().posts
		set(state => ({
			posts: {
				...state.posts,
				data: state.posts.data.map(post =>
					post.postId === postId
						? {
								...post,
								postLike: !post.postLike,
								likeCount: post.postLike
									? post.likeCount - 1
									: post.likeCount + 1,
						  }
						: post
				),
			},
		}))
		try {
			await axiosRequest.post(`/Post/like-post?postId=${postId}`, {})
		} catch (error) {
			console.error('Error in Like', error)
			set({ posts: prevPosts })
		}
	},
	LikeStory: async postId => {
		const prevStories = get().data
		set(state => ({
			data: state.data.map(story =>
				story.id === postId
					? {
							...story,
							likeCount: story.postLike
								? story.likeCount - 1
								: story.likeCount + 1,
					  }
					: story
			),
		}))
		try {
			await axiosRequest.post(`/Story/LikeStory?storyId=${postId}`, {})
			set(state => ({ data: prevStories }))
		} catch (error) {
			console.error('Error in Like', error)
			set({ posts: prevPosts })
		}
	},
	commentPost: async comment => {
		const prevPosts = get().posts
		try {
			await axiosRequest.post(`/Post/add-comment`, comment)
		} catch (error) {
			console.error('Error in Like', error)
			set({ posts: prevPosts })
		}
	},
	postSaved: async postId => {
		try {
			await axiosRequest.post(`/Post/add-post-favorite`, { postId })
			set(state => ({
				users: {
					...state.users,
					data: state.users.data.map(user =>
						user.postId === postId ? { ...user, postFavorite: true } : user
					),
				},
				posts: {
					...state.posts,
					data: state.posts.data.map(post =>
						post.postId === postId ? { ...post, postFavorite: true } : post
					),
				},
			}))
		} catch (error) {
			console.error(error)
		}
	},
	postStory: async (formdata) => {
		try {
			 await axiosRequest.post('/Story/AddStories', formdata)
		} catch (error) {
			console.error(error);	
		}
	},
	followUser: async (id) => {
		try {
			await axiosRequest.post(`FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`,{})
		} catch (error) {
			console.error(error);
		}
	}
}))
