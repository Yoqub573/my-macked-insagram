import { create } from 'zustand'
import axiosRequest from '@/lib/axiosRequest'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

let api = 'http://37.27.29.18:8003'

export const useProfileStore = create((set, get) => ({
	user: {},
	favorites: {},
	posts: {},
	userById: {},
	// decodeToken: {},
	// jwtDecode: () => {
	// 	try {
	// 		let token = localStorage.getItem('access_token')
	// 		set({ decodeToken: jwtDecode(token) })
	// 		console.log(decodeToken)
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// },
	getProfileData: async () => {
		try {
			const { data } = await axiosRequest.get(
				`${api}/UserProfile/get-my-profile`
			)
			set({ user: data.data })
		} catch (error) {
			console.error('failed to get', error)
		}
	},
	deleteProfilePhoto: async () => {
		try {
			await axiosRequest.delete(`${api}/UserProfile/delete-user-image-profile`)
			await get().getProfileData()
		} catch (error) {
			console.error('Couldnt delete user photo', error)
		}
	},
	updateProfilePhoto: async formData => {
		try {
			const token = localStorage.getItem('access_token')
			await axiosRequest.put(
				'http://37.27.29.18:8003/UserProfile/update-user-image-profile',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			await get().getProfileData()
		} catch (error) {
			console.error(error)
		}
	},
	updateProfileData: async updateProfile => {
		try {
			const token = localStorage.getItem('access_token')
			await axios.put(
				`http://37.27.29.18:8003/UserProfile/update-user-profile`,
				updateProfile,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			await get().getProfileData()
		} catch (error) {
			console.error(error)
		}
	},
	getFavorites: async () => {
		try {
			const { data } = await axiosRequest.get(
				`${api}/UserProfile/get-post-favorites`
			)
			set({ favorites: data })
		} catch (error) {
			console.error(error)
		}
	},
	getPosts: async () => {
		try {
			const { data } = await axiosRequest.get(`${api}/Post/get-my-posts`)
			set({ posts: data })
		} catch (error) {
			console.error(error)
		}
	},
	getUserById: async id => {
		try {
			const { data } = await axiosRequest.get(
				`${api}/UserProfile/get-user-profile-by-id?id=${id}`
			)
			set({ userById: data })
		} catch (error) {
			console.error(error)
		}
	},
	addPost: async formData => {
		try {
			await axiosRequest.post(`${api}/Post/add-post`, formData)
			await get().getProfileData()
			await get().getPosts()
		} catch (error) {
			console.error(error)
		}
	},
	deletePost: async postId => {
		try {
			await axiosRequest.delete(`${api}/Post/delete-post?id=${postId}`)
			await get().getProfileData()
			await get().getPosts()
		} catch (error) {
			console.error('Could not delete post', error)
		}
	},
}))
