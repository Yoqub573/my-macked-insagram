'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { ArrowRight, Calendar, Loader, Search, User, UserPlusIcon, Video, X, XCircle } from "lucide-react"
import Suggetions from '@/components/pages/profile/profile-by-id/Suggetions';
import { useRouter } from 'next/navigation'
import { usegetUserStore } from '@/store/pages/search/store';
import { MdOutlineGridOn, MdOutlinePhotoCameraFront } from 'react-icons/md';
import { useUserId } from '@/hook/useUserId'
import FollowUser from '@/components/pages/profile/profile-by-id/FollowUser';
import FollowFollowers from '@/components/pages/profile/profile-by-id/FollowFollowers';
import FollowFollowings from '@/components/pages/profile/profile-by-id/FollowFollowings';
import Reel from '../../../public/reel.png'

import './style.css'
import useDarkSide from '@/hook/useDarkSide';
import throttleByAnimationFrame from 'antd/es/_util/throttleByAnimationFrame';
import { useTranslation } from 'react-i18next';

const style = (themeMode) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 550,
	height: 400,
	bgcolor: themeMode === 'dark' ? '#1e1e1e' : 'background.paper',
	color: themeMode === 'dark' ? '#f5f5f5' : '#1e1e1e',
	border: 'none',
	boxShadow: 24,
	borderRadius: "20px",
	'@media (max-width:600px)': { // 📱 для телефонов
		width: '90%',
		height: 'auto',
		borderRadius: "12px",
	},
})

const style2 = (themeMode) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: themeMode === 'dark' ? '#1e1e1e' : 'background.paper',
	color: themeMode === 'dark' ? '#f5f5f5' : '#1e1e1e',
	border: 'none',
	boxShadow: 24,
	borderRadius: "20px",
	'@media (max-width:600px)': {
		width: '95%',
		borderRadius: "12px",
	},
})

const skeletonStyle = (theme) => ({
	bgcolor: theme === 'dark' ? 'grey.900' : 'grey.300',
	borderRadius: "6px"
})


const ProfileById = ({ children }) => {
	const userId = useUserId()
	const { 'profile-by-id': profileId } = useParams()
	const getProfileById = useProfileByIdStore(state => state.getProfileById)
	const users = useProfileByIdStore(state => state.users)
	const [open, setOpen] = useState(false)
	const [focused, setFocused] = useState(false)
	const [loading, setLoading] = useState(false)
	const [loadings, setLoadings] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredUsers, setFilteredUsers] = useState([])
	const [focused2, setFocused2] = useState(false)
	const [loading2, setLoading2] = useState(false)
	const [search2, setSearch2] = useState('')
	const [filteredUsers2, setFilteredUsers2] = useState([])
	const [openSuggest, setOpenSuggest] = useState(null)
	const [openAccountModal, setOpenAccountModal] = useState(null)
	const [openFollowings, setOpenFollowings] = useState(null)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	let user = users?.data

	let pathname = usePathname()
	const router = useRouter()

	const [theme] = useDarkSide()

	const { users: infoUsers, getUsers } = usegetUserStore()

	const { addChats, getChats, followers, getFollowers, getFollowings, followings, getPosts, posts } = useProfileByIdStore()

	let getId = infoUsers?.data?.find(e => e.id === profileId).id

	async function createChat() {
		await addChats(getId)
		await getChats()

		const chat = useProfileByIdStore.getState().chats?.data?.find(e => e.receiveUserName === user.userName)

		if (chat?.chatId) {
			router.push(`/chats/${chat.chatId}`)
		} else {
			console.error("Chat not found for this user")
		}
	}

	const SkeletonRow = () => (
		<Stack direction="row" spacing={2} alignItems="center" className="p-3">
			<Skeleton variant="circular" width={44} height={44} />
			<Stack spacing={0.5} flex={1}>
				<Skeleton variant="text" width="60%" height={14} />
				<Skeleton variant="text" width="40%" height={12} />
			</Stack>
		</Stack>
	)

	const SkeletonRow2 = () => (
		<Stack direction="row" spacing={2} alignItems="center" className="p-3">
			<Skeleton variant="circular" width={44} height={44} />
			<Stack spacing={0.5} flex={1}>
				<Skeleton variant="text" width="60%" height={14} />
				<Skeleton variant="text" width="40%" height={12} />
			</Stack>
		</Stack>
	)

	let { t } = useTranslation()

	useEffect(() => {
		if (!search.trim()) {
			setFilteredUsers([])
			setLoading(false)
			return
		}

		setLoading(true)
		const delayDebounce = setTimeout(() => {
			const results = followers?.data?.filter(u =>
				u?.userShortInfo?.userName?.toLowerCase().includes(search.toLowerCase())
			) || []
			setFilteredUsers(results)
			setLoading(false)
		}, 500)

		return () => clearTimeout(delayDebounce)
	}, [search, users])

	useEffect(() => {
		if (!search2.trim()) {
			setFilteredUsers2([])
			setLoading(false)
			return
		}

		setLoading(true)
		const delayDebounce = setTimeout(() => {
			const results = followings?.data?.filter(u =>
				u?.userShortInfo?.userName?.toLowerCase().includes(search2.toLowerCase())
			) || []
			setFilteredUsers2(results)
			setLoading(false)
		}, 500)

		return () => clearTimeout(delayDebounce)
	}, [search2, users])

	useEffect(() => {
		if (profileId) {
			getProfileById(profileId)
			getFollowers(profileId)
			getFollowings(profileId)
		}
	}, [profileId, getProfileById, getFollowers, getFollowings])

	useEffect(() => {
		getChats()
		getUsers()
	}, [])

	useEffect(() => {
		setLoadings(true)
		getProfileById(profileId).finally(() => setLoadings(false))
	}, [profileId])

	useEffect(() => { if (profileId) getPosts(profileId) }, [profileId, getPosts])

	const video = posts?.data?.map(e => e?.images?.some(media => media.endsWith(".mp4")))

	return (
		<div className='md:pl-[8%] p-[10px] md:p-[8%]'>
			<section className="flex justify-start gap-5 md:gap-20 ">
				{loadings ? (
					<Skeleton sx={skeletonStyle(theme)}
						variant="circular"
						width={160}
						height={160}
						animation="wave"
					/>
				) : (
					<Image
						src={
							user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser
						}
						alt="profile picture"
						width={150}
						height={150}
						className="rounded-full w-[77px] md:w-[150px] object-cover h-[77px] md:h-[150px]"
					/>
				)}
				<div className="flex flex-col gap-[20px]">
					<div className="flex items-center gap-[40px]">
						{loadings ? (
							<Skeleton sx={skeletonStyle(theme)} variant="text" width={120} height={30} />
						) : (
							<h1
								onClick={() => setOpenAccountModal(true)}
								className="font-bold cursor-pointer text-[#1E293B] text-[20px]"
							>
								{user?.userName}
							</h1>
						)}
						<div className="flex items-center gap-[10px]">
							{loadings ? (
								<>
									<Skeleton variant="rectangular" width={80} height={32} />
									<Skeleton variant="rectangular" width={80} height={32} />
								</>
							) : (
								<>
									<div className="flex gap-[10px] items-center">
										<FollowUser />
										<button
											onClick={createChat}
											className={`${theme == 'dark' ? "bg-[#25292e] text-white" : "bg-[#F3F4F6]"} text-[12px] md:block hidden md:text-[14px] font-medium py-[7px] px-4 rounded-lg`}
										>
											{t('profileById.message')}
										</button>
									</div>

									<button
										onClick={() => setOpenSuggest(!openSuggest)}
										className={`${theme == 'dark' ? "bg-[#25292e] text-white" : "bg-[#F3F4F6]"} text-[12px] md:text-[14px] font-medium py-[7px] px-4 rounded-lg`}
									>
										<UserPlusIcon
											size={18}
											fill={`${openSuggest ? "black" : "none"}`}
										/>
									</button>
								</>
							)}
						</div>
					</div>

					<div className="flex items-center gap-[20px]">
						{user?.subscribersCount ?
							<Modal
								keepMounted
								open={open}
								onClose={handleClose}
								aria-labelledby="keep-mounted-modal-title"
								aria-describedby="keep-mounted-modal-description"
							>
								<Box sx={style(theme)}>
									<div className="">
										<div className="flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between">
											<div></div>
											<h3 className='font-semibold text-[18px]'>Followers</h3>
											<button onClick={handleClose}><X /></button>
										</div>
										<div className="relative m-4">
											{!focused && (
												<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
											)}
											<input
												type="text"
												value={search}
												onChange={(e) => setSearch(e.target.value)}
												placeholder="Search"
												className={`py-2 w-full rounded-lg ${theme == 'dark' ? "bg-[#131313]" : "bg-[rgb(239,239,239)]"} pr-10 ${!focused ? 'pl-10' : 'pl-4'}`}
												onFocus={() => setFocused(true)}
												onBlur={() => setFocused(false)}
											/>

											{loading ? (
												<Loader className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
											) : (
												search && (
													<button
														type="button"
														onClick={() => setSearch('')}
														className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
													>
														<XCircle size={18} />
													</button>
												)
											)}
										</div>
										<div className="flex h-[270px] overflow-y-scroll flex-col">
											{loading ? (
												Array.from({ length: 5 }).map((_, i) => (
													<SkeletonRow sx={skeletonStyle(theme)} key={i} className="h-6 w-full rounded" />
												))) : (
												filteredUsers?.map(e => (
													<div key={e.id} className={`flex items-center justify-between ${theme == 'dark' ? "hover:bg-[#494949]" : "hover:bg-[#eeeeee]"} rounded p-3`}>
														<div className='flex cursor-pointer items-center gap-5'>
															<Image src={e?.userShortInfo?.userPhoto ?
																`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
																className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
														<FollowFollowers id={e?.userShortInfo?.userId} checkMyFollowings={false} />
													</div>
												))
											)}
											{!search && !loading && (
												followers?.data?.map(e => (
													<div key={e.id} className={`flex items-center justify-between ${theme == 'dark' ? "hover:bg-[#494949]" : "hover:bg-[#eeeeee]"} rounded p-3`}>
														<div onClick={() => router.push(`${e?.userShortInfo?.userId}`)} className='flex cursor-pointer items-center gap-5'>
															<Image src={e?.userShortInfo?.userPhoto ?
																`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
																className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
														<FollowFollowers id={e?.userShortInfo?.userId} checkMyFollowings={false} />
													</div>
												))
											)}
										</div>
									</div>
								</Box>
							</Modal> : null}

						{user?.subscriptionsCount ?
							<Modal
								keepMounted
								open={openFollowings}
								onClose={() => setOpenFollowings(false)}
								aria-labelledby="keep-mounted-modal-title"
								aria-describedby="keep-mounted-modal-description"
							>
								<Box sx={style(theme)}>
									<div className="">
										<div className="flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between">
											<div></div>
											<h3 className='font-semibold text-[18px]'>{t("profileById.followings")}</h3>
											<button onClick={() => setOpenFollowings(false)}><X /></button>
										</div>
										<div className="relative m-4">
											{!focused2 && (
												<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
											)}
											<input
												type="text"
												value={search2}
												onChange={(e) => setSearch2(e.target.value)}
												placeholder={`${t("profileById.search")}`}
												className={`py-2 w-full rounded-lg ${theme == 'dark' ? "bg-[#131313]" : "bg-[rgb(239,239,239)]"} pr-10 ${!focused2 ? 'pl-10' : 'pl-4'}`}
												onFocus={() => setFocused2(true)}
												onBlur={() => setFocused2(false)}
											/>

											{loading2 ? (
												<Loader className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin" size={18} />
											) : (
												search2 && (
													<button
														type="button"
														onClick={() => setSearch2('')}
														className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
													>
														<XCircle size={18} />
													</button>
												)
											)}
										</div>
										<div className="flex h-[270px] overflow-y-scroll flex-col">
											{loading2 ? (
												Array.from({ length: 5 }).map((_, i) => (
													<SkeletonRow2 key={i} className="h-6 w-full rounded" />
												))) : (
												filteredUsers2?.map(e => (
													<div key={e.id} className={`flex items-center justify-between ${theme == 'dark' ? "hover:bg-[#494949]" : "hover:bg-[#eeeeee]"} rounded p-3`}>
														<div onClick={() => router.push(`${e?.userShortInfo?.userId}`)} className='flex cursor-pointer items-center gap-5'>
															<Image src={e?.userShortInfo?.userPhoto ?
																`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
																className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
													</div>
												))
											)}
											{!loading2 && !search2 && (
												followings?.data?.map(e => (
													<div key={e.id} className={`flex items-center justify-between ${theme == 'dark' ? "hover:bg-[#494949]" : "hover:bg-[#eeeeee]"} rounded p-3`}>
														<div onClick={() => router.push(`${e?.userShortInfo?.userId}`)} className='flex cursor-pointer items-center gap-5'>
															<Image src={e?.userShortInfo?.userPhoto ?
																`http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}` : defaultUser}
																className='object-cover w-[44px] h-[44px] rounded-full' width={44} height={44} alt="avatar" />
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
													</div>
												))
											)}
										</div>
									</div>
								</Box>
							</Modal> : null}
						<Modal
							keepMounted
							open={openAccountModal}
							onClose={() => setOpenAccountModal(false)}
							aria-labelledby="keep-mounted-modal-title"
							aria-describedby="keep-mounted-modal-description"
						>
							<Box sx={style2(theme)}>
								<div className='p-4 border-b-1 border-gray-300 justify-center flex'>{t("profileById.about")}</div>
								<div className="flex flex-col gap-3 items-center text-center px-10 p-4">
									<Image
										src={user?.image ? `http://37.27.29.18:8003/images/${user?.image}` : defaultUser}
										alt='profile picture'
										width={78}
										height={78}
										className={`w-[78px] h-[78px] rounded-[200px] overflow-hidden`}
									/>
									<h3 className='font-bold text-[18px]'>{user?.userName}</h3>
									<h4 className='text-[12px]'>{t("profileById.info")}</h4>
								</div>
								<div className="flex flex-col p-4 pb-4 gap-[10px]">
									<div className="flex items-center gap-[10px]">
										<Calendar />
										<div>
											<h3>Date joined</h3>
											<h3 className='text-gray-400'>
												{user?.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
											</h3>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-[10px]">
											<User />
											<h3>Former usernames</h3>
										</div>
										<div className="flex text-[gray] items-center gap-[10px]">
											<span>2</span>
											<ArrowRight size={18} />
										</div>
									</div>
								</div>
								<div onClick={() => setOpenAccountModal(false)} className='p-4 border-t-1 border-gray-300 active:bg-[#eeeeee] rounded-b-[20px] justify-center cursor-pointer flex'>{t("profileById.close")}</div>
							</Box>
						</Modal>
						{loadings ? (
							<>
								<Skeleton sx={skeletonStyle(theme)} width={60} height={20} />
								<Skeleton sx={skeletonStyle(theme)} width={80} height={20} />
								<Skeleton sx={skeletonStyle(theme)} width={90} height={20} />
							</>
						) : (
							<>
								<p className={`${theme == 'dark' ? "text-[#fff]" : "text-[#1E293B]"} block md:flex`}>
									{user?.postCount}
									<span className={`${theme == 'dark' ? "text-gray-400" : "text-[#64748B]"} block md:flex md:ml-[2px]`}>
										{t("profileById.posts")}
									</span>
								</p>
								<p
									onClick={handleOpen}
									className={`${theme == 'dark' ? "text-[#fff]" : "text-[#1E293B]"} block cursor-pointer md:flex`}
								>
									{user?.subscribersCount}
									<span className={`${theme == 'dark' ? "text-gray-400" : "text-[#64748B]"} block md:flex md:ml-[2px]`}>
										{t("profileById.followers")}
									</span>
								</p>
								<p
									onClick={() => setOpenFollowings(true)}
									className={`${theme == 'dark' ? "text-[#fff]" : "text-[#1E293B]"} block cursor-pointer md:flex`}
								>
									{user?.subscriptionsCount}
									<span className={`${theme == 'dark' ? "text-gray-400" : "text-[#64748B]"} block md:flex md:ml-[2px]`}>
										{t("profileById.followings")}
									</span>
								</p>
							</>
						)}
					</div>

					<div className="flex">
						{loadings ? (
							<Skeleton sx={skeletonStyle(theme)} width={140} height={28} />
						) : (
							<>
								<p className="font-bold text-[#1E293B] text-[20px]">
									{user?.firstName}
								</p>
								{user?.lastName && (
									<p className="font-bold text-[#1E293B] text-[20px]">
										{user?.userName}
									</p>
								)}
							</>
						)}
					</div>
				</div>
			</section>
			{openSuggest && (
				<Suggetions />
			)}
			<div className='flex justify-center mt-10 md:justify-around'>
				<button
					className='flex items-center gap-[10px] py-[10px]'
					style={{
						color: pathname === `/${profileId}` ? '#2563EB' : '#64748B',
						borderTop: pathname === `/${profileId}` ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push(`/${profileId}`)}
				>
					<MdOutlineGridOn size={30} />
				</button>
				{video && (
					<button
						className='flex items-center gap-[10px] py-[10px]'
						style={{
							color: pathname === `/${profileId}/Reels` ? '#2563EB' : '#64748B',
							borderTop:
								pathname === `/${profileId}/Reels` ? '2px solid #2563EB' : 'none',
						}}
						onClick={() => router.push(`/${profileId}/Reels`)}
					>
						<Image src={Reel} alt='reel icon' width={30} height={30} />
					</button>
				)}
				<button
					className='flex items-center gap-[10px] py-[10px]'
					style={{
						color: pathname === `/${profileId}/tagged` ? '#2563EB' : '#64748B',
						borderTop:
							pathname === `/${profileId}/tagged` ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push(`/${profileId}/tagged`)}
				>
					<MdOutlinePhotoCameraFront size={30} />
				</button>
			</div>
			<section className='flex justify-center'>{children}</section>
			{!user?.postCount && (
				<Suggetions />
			)}
		</div>
	);
}

export default ProfileById;
