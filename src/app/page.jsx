'use client'
import { useHome } from '@/store/pages/home/store'
import { Skeleton } from '@mui/material'
import { MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { EffectCube, Keyboard, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import image2 from '../assets/img/pages/home/image 69.svg'
import userIMG from '../assets/img/pages/home/userDefault.png'
import './globals.css'
import Link from 'next/link'
import SwiperStories from '@/components/pages/home/stories'
import Commentory from '@/components/pages/home/Commentory'
import { useUserStore } from '@/store/pages/explore/explorestore'
import * as React from 'react'
import Modal from '@mui/material/Modal'
import {
	CircleUserRound,
	SendHorizontal,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react'
import CommentInput from '@/components/pages/explore/Emogi'
import ModalUsers from '@/components/pages/explore/ModalUsers'
import Box from '@mui/material/Box'
import { Bookmark, Heart } from 'lucide-react'
import { useUserId } from '@/hook/useUserId'
import { useRouter } from 'next/navigation'
import BasicModal from '@/components/pages/explore/BasicModal'
import { useTranslation } from 'react-i18next'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '100%',
	maxWidth: 900,
	color: 'white',
	maxHeight: '90vh',
	overflow: 'hidden',
	borderRadius: '5px',
	'@media (max-width:768px)': {
		top: 0,
		transform: 'translate(-50%, 0)',
		height: '100vh',
		maxHeight: '100vh',
		borderRadius: 0,
	},
}
const mediaStyleModal = {
	width: '100%',
	objectFit: 'cover',
	borderRadius: '2px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}
export default function Main() {
	let {
		savePost,
		fetchUsers,
		postById,
		fetchPostById,
		deleteComment,
		addComment,
		unfollowUser,
		fetchUserFollows,
		Follow,
		FolowUser,
	} = useUserStore()
	const [open, setOpen] = React.useState(false)
	const [isMuted, setIsMuted] = React.useState(false)
	let [newcomit, setnewComit] = React.useState('')
	const [likedComments, setLikedComments] = React.useState({})
	let userId = useUserId()
	let [follow, setFollow] = React.useState(false)
	const videoRefs = useRef({})
	const { i18n } = useTranslation()
	let cnt = 3
	let router = useRouter()

	useEffect(() => {
		fetchUsers()
		fetchUserFollows(userId)
	}, [])

	async function RemoveComit(postCommentId) {
		await deleteComment(postCommentId)
	}

	const handleOpen = async id => {
		const isFollowed = FolowUser?.data?.some(
			e => e.userShortInfo.userId == postById.data?.userId
		)
		await fetchPostById(id)
		try {
			await fetchUserFollows(userId)
		} catch (err) {
			console.error('Ошибка при обновлении списка подписок в handleOpen:', err)
		}
		setFollow(Boolean(isFollowed))
		setOpen(true)
	}

	const toggleMute = () => {
		const video = videoRef.current
		if (video) {
			video.muted = !video.muted
			setIsMuted(video.muted)
		}
	}

	const handleAddComment = async () => {
		if (newcomit.trim() === '') return
		await addComment(newcomit, postById.data?.postId)
		await fetchPostById(postById.data?.postId)
		setnewComit('')
	}

	const handleLikeComment = commentId => {
		setLikedComments(prev => ({
			...prev,
			[commentId]: !prev[commentId],
		}))
	}

	async function hendlFollow(id) {
		const currentlyFollowed = FolowUser?.data?.some(
			e => e.userShortInfo.userId == id
		)

		try {
			if (currentlyFollowed) {
				await unfollowUser(id)
				setFollow(true)
			} else {
				await Follow(id)
				setFollow(false)
			}

			try {
				await fetchUserFollows(userId)
			} catch (err) {
				console.error('Ошибка при fetchUserFollows в hendlFollow:', err)
			}

			const updatedFollow = FolowUser?.data?.some(
				e => e.userShortInfo.userId == id
			)
		} catch (error) {
			console.error('Ошибка при подписке/отписке:', error)
		}
	}
	let {
		getUserStories,
		followUser,
		data,
		isLoading,
		posts,
		getUserPosts,
		isLoading2,
		likePost,
		commentPost,
		getUser,
		users,
		postSaved,
	} = useHome()
	const [mutedMap, setMutedMap] = useState({})
	const [stopMap, setStopMap] = useState({})
	const [commentsMap, setCommentsMap] = useState({})
	useEffect(() => {
		getUserPosts()
		getUser()
	}, [])
	const scrollRef = useRef(null)
	let isDown = false
	let startX
	let scrollLeft
	useEffect(() => {
		getUserStories()
	}, [])
	let [stories, setStories] = useState(false)
	let [idUser, setIdUser] = useState(0)
	let [muted, setMuted] = useState(true)
	let [comment, setComment] = useState('')
	const onMouseDown = e => {
		isDown = true
		startX = e.pageX - scrollRef.current.offsetLeft
		scrollLeft = scrollRef.current.scrollLeft
	}
	const onMouseLeave = () => {
		isDown = false
	}
	const onMouseUp = () => {
		isDown = false
	}
	const videoRef = React.useRef(null)
	const onMouseMove = e => {
		if (!isDown) return
		e.preventDefault()
		const x = e.pageX - scrollRef.current.offsetLeft
		const walk = (x - startX) * 2
		scrollRef.current.scrollLeft = scrollLeft - walk
	}
	let [theme, setTheme] = useState(
		typeof window !== 'undefined' ? localStorage.getItem('theme') : ''
	)
	useEffect(() => {
		const handleStorageChange = event => {
			if (event.key === 'theme') {
				setTheme(event.newValue)
			}
		}
		window.addEventListener('storage', handleStorageChange)
		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])
	let [comments, setComments] = useState(false)
	let [commentId, setCommentId] = useState({})
	let [commentStop, setCommentStop] = useState(false)
	let [commentMuted, setCommentMuted] = useState(true)
	let [Idx, setIdx] = useState('')
	let { t } = useTranslation()
	return (
		<div className='flex w-full items-start'>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					<div
						className={` flex flex-col lg:flex-row gap-[20px] h-[85vh] bg-[#272727]`}
					>
						{postById ? (
							<div className='lg:flex w-full gap-[20px]'>
								<div className='lg:w-[47%] '>
									{postById.data?.images?.[0] &&
										(() => {
											const el = postById.data.images[0]
											const mediaUrl = `http://37.27.29.18:8003/images/${el}`
											return (
												<div key={el}>
													<div className=' flex justify-end pr-4'>
														<button
															className='cursor-pointer lg:hidden absolute z-10 top-[10px] text-red-500'
															onClick={() => setOpen(false)}
														>
															<X size={30} />
														</button>
													</div>
													{el.endsWith('.mp4') ? (
														<div>
															<video
																ref={videoRef}
																src={mediaUrl}
																className='w-full lg:h-[85vh] h-[50vh] object-cover'
																playsInline
																autoPlay
																muted={isMuted}
																loop
															/>
															<div className=' flex justify-end pr-4'>
																<button
																	onClick={toggleMute}
																	className='absolute z-10 mt-[-40px]  text-white'
																>
																	{isMuted ? (
																		<VolumeX size={30} />
																	) : (
																		<Volume2 size={30} />
																	)}
																</button>
															</div>
														</div>
													) : (
														<img
															src={mediaUrl}
															draggable={false}
															alt={`Post by ${el.userName}`}
															className='lg:h-[85vh] h-[50vh]'
															style={mediaStyleModal}
														/>
													)}
												</div>
											)
										})()}
								</div>
								<div className='lg:w-[51%] lg:p-[20px] '>
									<div className='lg:p-0 p-[20px]'>
										<div className='flex  w-full justify-between pb-[20px]  items-center'>
											<div className='flex gap-[20px]'>
												<div>
													<img
														src={`http://37.27.29.18:8003/images/${postById.data?.userImage}`}
														className='w-[40px] h-[40px] rounded-full'
														alt='test'
													/>
												</div>
												<p
													onClick={() =>
														router.push(`/${postById.data?.userId}`)
													}
													className='font-medium cursor-pointer  min-w-20 max-w-40 text-[20px] lg:text-[25px] truncate'
												>
													{postById.data?.userName}
												</p>{' '}
												<br />
											</div>
											<button
												className='px-3 py-1 ml-4 text-sm cursor-pointer text-black bg-white rounded-full'
												onClick={() => hendlFollow(postById.data?.userId)}
											>
												{postById?.data?.isFollowing
													? t('exlpore.2')
													: t('exlpore.1')}
											</button>

											<button
												className='cursor-pointer lg:block hidden'
												onClick={() => setOpen(false)}
											>
												<X />
											</button>
										</div>
										<div className='overflow-y-auto overflow-x-hidden break-words select-none max-h-[53vh] space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
											{postById.data?.comments?.length > 0 ? (
												postById.data.comments.map(comment => (
													<div
														key={comment.id}
														className='flex items-center justify-between'
													>
														<div className='flex  gap-3 items-center flex-1 min-w-0'>
															{comment.userImage ? (
																<img
																	src={
																		comment.userImage
																			? `http://37.27.29.18:8003/images/${comment.userImage}`
																			: 'https://via.placeholder.com/40'
																	}
																	alt={comment.userName}
																	className='w-8 h-8 border border-gray-300 rounded-full'
																/>
															) : (
																<div>
																	<CircleUserRound
																		className='cursor-pointer'
																		size={34}
																		onClick={() =>
																			router.push(`/${comment.userId}`)
																		}
																		color='#ffffff'
																	/>
																</div>
															)}
															<div className='min-w-120'>
																<p className='text-[15px]  w-[90%] '>
																	{comment.comment}
																</p>
																{comment.dateCommented && (
																	<span className='text-[10px] text-gray-400 leading-0 self-end'>
																		{new Date(
																			comment.dateCommented
																		).toLocaleString([], {
																			year: 'numeric',
																			month: '2-digit',
																			day: '2-digit',
																			hour: '2-digit',
																			minute: '2-digit',
																		})}
																	</span>
																)}
															</div>
														</div>
														{comment.userId == userId ? (
															<div className='flex gap-[10px]'>
																<button
																	className='cursor-pointer hover:text-red-500'
																	onClick={() =>
																		RemoveComit(comment.postCommentId)
																	}
																>
																	<X />
																</button>
																<Heart
																	className='cursor-pointer'
																	onClick={() =>
																		handleLikeComment(comment.postCommentId)
																	}
																	size={20}
																	color='#ffffff'
																	fill={
																		likedComments[comment.postCommentId]
																			? 'red'
																			: 'nane'
																	}
																	stroke={
																		likedComments[comment.postCommentId]
																			? 'red'
																			: 'white'
																	}
																/>
															</div>
														) : (
															<Heart
																className='cursor-pointer'
																onClick={() =>
																	handleLikeComment(comment.postCommentId)
																}
																size={20}
																color='#ffffff'
																fill={
																	likedComments[comment.postCommentId]
																		? 'red'
																		: 'none'
																}
																stroke={
																	likedComments[comment.postCommentId]
																		? 'red'
																		: 'white'
																}
															/>
														)}
													</div>
												))
											) : (
												<p className='text-gray-400'>Нет комментариев</p>
											)}
										</div>
									</div>

									<div className='border-t fixed bottom-0 bg-[#272727] h-[120px] z-10 lg:w-[47%] w-[100%] lg:p-0 p-[20px] mt-[300px] pt-[10px]'>
										<div className='flex justify-between mb-2 pt-[10px]'>
											<div className='flex gap-4'>
												<button
													onClick={async () =>
														await likePost(postById.data?.postId)
													}
													className='cursor-pointer'
												>
													<Heart
														size={24}
														color='#ffffff'
														fill={postById.data?.postLike ? 'red' : 'none'}
														stroke={postById.data?.postLike ? 'red' : 'white'}
													/>
												</button>
												<MessageCircleMore size={24} color='#ffffff' />

												<div>
													<ModalUsers
														media={postById?.data?.images?.[0]}
														postId={postById.data?.postId}
													/>
												</div>
											</div>
											<button
												onClick={() => {
													savePost(postById.data?.postId)
												}}
											>
												<Bookmark
													fill={postById.data?.postFavorite ? 'white' : 'none'}
													size={24}
													color='#ffffff'
												/>
											</button>
										</div>

										<div className='mb-2'>
											<span className='font-bold'>
												{postById.data?.postLikeCount} {t('exlpore.3')}{' '}
												{t('exlpore.4')}
											</span>
										</div>

										<div className='flex gap-2'>
											<CommentInput
												value2={newcomit}
												onChange2={e => setnewComit(e.target.value)}
											/>
											<button
												onClick={handleAddComment}
												disabled={!newcomit.trim()}
												className='text-blue-500 disabled:text-gray-500'
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
			{stories && (
				<section className='fixed inset-0 p-[20px] w-[100%] z-[20] h-[100vh] bg-white'>
					<svg
						onClick={() => setStories(false)}
						className=' absolute right-[20px]'
						xmlns='http://www.w3.org/2000/svg'
						width='32'
						height='32'
						viewBox='0 0 32 32'
						fill='none'
					>
						<line
							x1='0'
							y1='0'
							x2='32'
							y2='32'
							stroke='black'
							strokeWidth='3'
						/>
						<line
							x1='32'
							y1='0'
							x2='0'
							y2='32'
							stroke='black'
							strokeWidth='3'
						/>
					</svg>
					<Link href={'/'}>
						<Image src={image2} className='w-auto' alt='' />
					</Link>
					<div className='flex items-center justify-center'>
						<SwiperStories indexUser={idUser} />
					</div>
				</section>
			)}
			{comments && (
				<div
					onClick={() => setComments(false)}
					className='inset-0 fixed z-[2018083900979878979086087687686896] w-[100%] h-[100vh] p-[20px] cursor-pointer bg-[#0000008F] flex items-start justify-end'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='18'
						height='18'
						viewBox='0 0 14 14'
						fill='none'
					>
						<path
							d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z'
							fill='#FFFFFF'
						/>
					</svg>
				</div>
			)}
			{comments && <Commentory UserId={Idx} />}
			<div className='md:px-[11%] px-[10px] pt-[40px] w-[100%] md:w-[70%]'>
				<div
					ref={scrollRef}
					onMouseDown={onMouseDown}
					onMouseLeave={onMouseLeave}
					onMouseUp={onMouseUp}
					onMouseMove={onMouseMove}
					className='pb-[20px] border-b border-b-[#E2E8F0] flex overflow-x-hidden overflow-y-hidden whitespace w-full select-none'
				>
					{(isLoading &&
						Array.from({ length: 10 }).map((_, i) => (
							<div
								key={`skeleton-${i}`}
								className='flex flex-col items-center px-[3px]'
							>
								<Skeleton
									sx={{
										bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
										'&::after': {
											background:
												theme == 'dark'
													? 'linear-gradient(90deg, #333, #444, #333)'
													: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
										},
									}}
									variant='circular'
									width={66}
									className='mx-[3px] md:mx-[6px]'
									height={66}
								/>
								<Skeleton variant='text' sx={{ fontSize: '12px' }} width={66} />
							</div>
						))) || (
						<div className='flex gap-[14px]'>
							{data?.map((e, i) => {
								return (
									<div key={i} className='flex items-end'>
										<div
											onClick={() => {
												if (e.stories.length > 0) {
													setIdUser(i)
													setStories(!stories)
												} else {
													setComments(true)
												}
											}}
											key={e.id || `story-${i}`}
											className='size-[80px] flex flex-col items-center'
										>
											<div
												className='rounded-full size-[72px] p-[2.5px] flex items-center justify-center'
												style={{
													background:
														'linear-gradient(180deg, #DE0046 0%, #F7A34B 100%)',
												}}
											>
												{(e.userImage == '' && (
													<Image
														draggable={false}
														className={`object-cover ${
															theme == 'dark' ? 'bg-black' : 'bg-white'
														} rounded-full p-[2.5px]`}
														src={userIMG}
														alt=''
														width={66}
														height={66}
													/>
												)) || (
													<Image
														draggable={false}
														className={`w-[64px] h-[64px] object-cover ${
															theme == 'dark' ? 'bg-black' : 'bg-white'
														} rounded-full p-[2.5px]`}
														src={`http://37.27.29.18:8003/images/${e.userImage}`}
														alt=''
														width={66}
														height={66}
													/>
												)}
											</div>
											<p className='text-[14px] font-[400]'>{e.userName}</p>
										</div>
										{i == 0 && (
											<div
												onClick={() => {
													setComments(true)
													setIdx(e.userId)
												}}
												className={`${
													theme == 'light' ? 'bg-white' : 'bg-black'
												} ml-[50px] mb-[10px] flex items-center justify-center p-[2px] rounded-full absolute`}
											>
												<button className='w-[22px] h-[22px] bg-[#3697EB] rounded-full text-white p-[5px] text-center flex items-center justify-center text-[23px]'>
													+
												</button>
											</div>
										)}
									</div>
								)
							})}
						</div>
					)}
				</div>
				<div className='w-[100%] flex flex-col'>
					{(isLoading2 &&
						Array.from({ length: 9 }).map((_, i) => (
							<div key={`skeleton-${i}`} className='flex flex-col px-[3px]'>
								<div className='flex items-center justify-between'>
									<div className='flex w-[100%] py-[12px] gap-[8px] items-center'>
										<Skeleton
											sx={{
												bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
												'&::after': {
													background:
														theme == 'dark'
															? 'linear-gradient(90deg, #333, #444, #333)'
															: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
												},
											}}
											variant='circular'
											width={42}
											className=''
											height={42}
										/>
										<div>
											<Skeleton
												sx={{
													fontSize: '14px',
													bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
													'&::after': {
														background:
															theme == 'dark'
																? 'linear-gradient(90deg, #333, #444, #333)'
																: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
													},
												}}
												variant='text'
												width={75}
											/>
										</div>
									</div>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
									>
										<path
											d='M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z'
											fill='#262626'
										/>
										<path
											d='M6.5 13.5C7.32843 13.5 8 12.8284 8 12C8 11.1716 7.32843 10.5 6.5 10.5C5.67157 10.5 5 11.1716 5 12C5 12.8284 5.67157 13.5 6.5 13.5Z'
											fill='#262626'
										/>
										<path
											d='M17.5 13.5C18.3284 13.5 19 12.8284 19 12C19 11.1716 18.3284 10.5 17.5 10.5C16.6716 10.5 16 11.1716 16 12C16 12.8284 16.6716 13.5 17.5 13.5Z'
											fill='#262626'
										/>
									</svg>
								</div>
								<Skeleton
									sx={{
										bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
										'&::after': {
											background:
												theme == 'dark'
													? 'linear-gradient(90deg, #333, #444, #333)'
													: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
										},
									}}
									variant='rectangular'
									className='rounded-2xl'
									height={400}
									width={'100%'}
								/>
								<div className='py-[16px] flex flex-col'>
									<Skeleton
										sx={{
											fontSize: '20px',
											bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
											'&::after': {
												background:
													theme == 'dark'
														? 'linear-gradient(90deg, #333, #444, #333)'
														: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
											},
										}}
										variant='text'
										width={'100%'}
									/>
									<Skeleton
										sx={{
											fontSize: '20px',
											bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
											'&::after': {
												background:
													theme == 'dark'
														? 'linear-gradient(90deg, #333, #444, #333)'
														: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
											},
										}}
										variant='text'
										width={'30%'}
									/>
								</div>
							</div>
						))) || (
						<>
							{posts?.data?.map((e, i) => {
								const muted = mutedMap[e.postId] ?? true
								const comments = commentsMap[e.postId] ?? true
								const toggleMuted = () => {
									setMutedMap(prev => ({
										...prev,
										[e.postId]: !muted,
									}))
								}
								const toggleStop = postId => {
									const video = videoRefs.current[postId]
									if (!video) return
									setStopMap(prev => {
										const isPlaying = !prev[postId]
										if (isPlaying) {
											video.play()
										} else {
											video.pause()
										}
										return {
											...prev,
											[postId]: !prev[postId],
										}
									})
								}
								const toggleComments = () => {
									setCommentsMap(prev => ({
										...prev,
										[e.postId]: !comments,
									}))
								}
								return (
									<div className='flex py-[10px] flex-col' key={e.postId || i}>
										<div className='flex items-center justify-between py-[12px]'>
											<div className='flex items-center gap-[8px]'>
												{(!data?.some(e2 => e2.userId === e.userId) && (
													<Link
														href={`${e.userId}`}
														className='rounded-full size-[42px] flex items-center justify-center'
													>
														{(e.userImage == '' && (
															<Image
																draggable={false}
																className={`size-[42px] object-cover ${
																	theme == 'dark' ? 'bg-black' : 'bg-white'
																} rounded-full p-[2px]`}
																src={userIMG}
																alt=''
																width={42}
																height={42}
															/>
														)) || (
															<Image
																draggable={false}
																className={`w-[34px] h-[34px] ${
																	theme == 'dark' ? 'bg-black' : 'bg-white'
																} size-[37px] rounded-full  p-[2px] object-cover`}
																src={`http://37.27.29.18:8003/images/${e.userImage}`}
																alt=''
																width={37}
																height={37}
															/>
														)}
													</Link>
												)) || (
													<div
														onClick={() => {
															data?.forEach((e2, i4) => {
																if (e2.userId === e.userId) {
																	setIdUser(i4)
																}
															})
															setStories(!stories)
														}}
														className='rounded-full size-[42px] p-[0.1px] flex items-center justify-center'
														style={{
															background:
																'linear-gradient(180deg, #DE0046 0%, #F7A34B 100%)',
														}}
													>
														{(e.userImage == '' && (
															<Image
																draggable={false}
																className={`size-[36px] object-cover ${
																	theme == 'dark' ? 'bg-black' : 'bg-white'
																} rounded-full p-[2px]`}
																src={userIMG}
																alt=''
																width={37}
																height={37}
															/>
														)) || (
															<Image
																draggable={false}
																className={`w-[34px] h-[34px] ${
																	theme == 'dark' ? 'bg-black' : 'bg-white'
																} size-[37px] rounded-full  p-[2px] object-cover`}
																src={`http://37.27.29.18:8003/images/${e.userImage}`}
																alt=''
																width={37}
																height={37}
															/>
														)}
													</div>
												)}
												<Link href={`/${e.userId}`} className='flex flex-col'>
													<p className='font-[600] text-[14px]'>{e.userName}</p>
												</Link>
											</div>
										</div>
										{e.images[0]?.endsWith('.mp4') ? (
											<div className='flex bg-black justify-end items-baseline-last'>
												<svg
													className={`md:my-[18%] my-[70%] mx-[38%] md:mx-[16%] ${
														stopMap[e.postId] ? 'hidden' : 'inline'
													} duration-1000 absolute`}
													xmlns='http://www.w3.org/2000/svg'
													width='76'
													height='76'
													viewBox='0 0 76 76'
													fill='none'
												>
													<path
														d='M38 0.5C17.3 0.5 0.5 17.3 0.5 38C0.5 58.7 17.3 75.5 38 75.5C58.7 75.5 75.5 58.7 75.5 38C75.5 17.3 58.7 0.5 38 0.5ZM30.5 54.875V21.125L53 38L30.5 54.875Z'
														fill='#F3F4F6'
													/>
												</svg>
												<video
													ref={el => (videoRefs.current[e.postId] = el)}
													src={`http://37.27.29.18:8003/images/${e.images[0]}`}
													muted={mutedMap[e.postId] ?? true}
													loop
													playsInline
													onClick={() => toggleStop(e.postId)}
													className='h-[90vh] m-auto'
												/>
												<svg
													className={`absolute mb-[10px]  ${
														!muted ? 'hidden' : 'inline'
													}`}
													onClick={toggleMuted}
													xmlns='http://www.w3.org/2000/svg'
													width='40'
													height='40'
													viewBox='0 0 40 40'
													fill='none'
												>
													<rect
														width='40'
														height='40'
														rx='20'
														fill='black'
														fillOpacity='0.7'
													/>
													<g clipPath='url(#clip0_8_2846)'>
														<path
															d='M13.6167 12.4417L12.4417 13.6167L16.075 17.25L15.8333 17.5H12.5V22.5H15.8333L20 26.6666V21.175L23.4833 24.6583C22.9417 25.0667 22.3333 25.3917 21.6666 25.5833V27.3C22.7833 27.05 23.8083 26.5333 24.675 25.8417L26.3833 27.55L27.5583 26.375L13.6167 12.4417ZM18.3333 22.6417L16.525 20.8333H14.1667V19.1666H16.525L17.2583 18.4333L18.3333 19.5083V22.6417ZM25.8333 20C25.8333 20.6833 25.7083 21.3417 25.4916 21.95L26.7667 23.225C27.2333 22.25 27.5 21.1583 27.5 20C27.5 16.4333 25.0083 13.45 21.6666 12.6917V14.4083C24.075 15.125 25.8333 17.3583 25.8333 20ZM20 13.3333L18.4333 14.9L20 16.4667V13.3333ZM23.75 20C23.75 18.525 22.9 17.2583 21.6666 16.6417V18.1333L23.7333 20.2C23.7416 20.1333 23.75 20.0666 23.75 20Z'
															fill='white'
														/>
													</g>
													<defs>
														<clipPath id='clip0_8_2846'>
															<rect
																width='20'
																height='20'
																fill='white'
																transform='translate(10 10)'
															/>
														</clipPath>
													</defs>
												</svg>
												<div
													className={`absolute mb-[10px]  bg-[#000000B2] size-[40px] ${
														muted ? 'hidden' : 'flex'
													} rounded-full  justify-center items-center`}
													onClick={toggleMuted}
													xmlns='http://www.w3.org/2000/svg'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='20'
														height='20'
														viewBox='0 0 24 24'
														fill='none'
													>
														<g clipPath='url(#clip0_2_11496)'>
															<path
																d='M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM10 8.82998V15.17L7.83 13H5V11H7.83L10 8.82998ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z'
																fill='#FFFFFF'
															/>
														</g>
														<defs>
															<clipPath id='clip0_2_11496'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
												</div>
											</div>
										) : (
											<>
												{(e.images.length <= 1 && (
													<>
														{e.images.map((image, i3) => {
															return (
																<div
																	key={i3}
																	className='w-[100%] bg-black max-h-[80vh]'
																>
																	<Image
																		key={i3}
																		src={`http://37.27.29.18:8003/images/${image}`}
																		width={900}
																		height={200}
																		style={{ height: '100%' }}
																		className='text-white max-h-[90vh] w-auto m-auto'
																		draggable={false}
																		alt='Not my problem ¯\_(ツ)_/¯,That is not my problem ¯\_(ツ)_/¯'
																	/>
																</div>
															)
														})}
													</>
												)) || (
													<Swiper
														slidesPerView={1}
														pagination={{ clickable: true }}
														keyboard={{
															enabled: true,
														}}
														style={{
															'--swiper-pagination-bullet-inactive-color':
																'#6A6A6A',
															'--swiper-pagination-color': '#ffffff',
														}}
														modules={[Pagination, Keyboard]}
														className='w-full h-[70vh] overflow-hidden'
													>
														{e.images.map((e, i) => (
															<SwiperSlide key={i}>
																<div className='relative w-full flex justify-center items-center bg-black h-full'>
																	<Image
																		src={`http://37.27.29.18:8003/images/${e}`}
																		alt={`Slide ${i + 1}`}
																		width={610}
																		height={600}
																		className='m-auto w-auto h-full'
																		priority={i === 0}
																	/>
																</div>
															</SwiperSlide>
														))}
													</Swiper>
												)}
											</>
										)}
										<div className='flex items-center py-[16px] justify-between'>
											<div className='flex items-start w-[120px] gap-[10px]'>
												<button
													onClick={async () => {
														await likePost(e.postId)
													}}
													style={{ cursor: 'pointer' }}
													className='cursor-pointer'
												>
													<Heart
														fill={e.postLike ? 'red' : 'none'}
														stroke={
															e.postLike
																? 'red'
																: theme == 'dark'
																? 'white'
																: 'black'
														}
													/>
												</button>
												<MessageCircleMore
													onClick={() => handleOpen(e.postId)}
												/>
												<div>
													<ModalUsers
														media={e?.images?.[0]}
														postId={e?.postId}
													/>
												</div>
											</div>
											<button
												onClick={() => {
													postSaved(e.postId)
												}}
											>
												<Bookmark
													fill={
														e.postFavorite
															? theme == 'dark'
																? 'white'
																: 'black'
															: 'none'
													}
													size={24}
													color={theme == 'dark' ? '#FFFFFF' : '#000000'}
												/>
											</button>
										</div>
										<div className='flex flex-col gap-[8px] w-[100%]'>
											<div className='flex items-center gap-[8px]'>
												{(e.userImage == '' && (
													<Image
														draggable={false}
														className={`size-[24px] object-cover ${
															theme == 'dark' ? 'bg-black' : 'bg-white'
														}
													 rounded-full p-[2px]`}
														src={userIMG}
														alt=''
														width={24}
														height={24}
													/>
												)) || (
													<Image
														draggable={false}
														className={`w-[34px] ${
															theme == 'dark' ? 'bg-black' : 'bg-white'
														} h-[34px]  size-[24px] rounded-full p-[2px] object-cover`}
														src={`http://37.27.29.18:8003/images/${e.userImage}`}
														alt=''
														width={24}
														height={24}
													/>
												)}
												<p>
													{`${
														e.postLike ? e.postLikeCount + 1 : e.postLikeCount
													} ${t('home.likes')}`}
												</p>
											</div>
											{e.content != null && (
												<div className='flex items-center gap-[10px]'>
													<p className='font-bold'>{e.userName}</p>
													{(e.content.length > 90 && (
														<p className='text-[12px] md:text-[14px] font-[400]'>
															{e.content.slice(0, 87)}...
														</p>
													)) || (
														<p className='text-[14px] font-[400]'>
															{e.content}
														</p>
													)}
													{e.content.length > 90 && (
														<p className='text-[#94A3B8] text-[14px] hover:underline font-[400]'>
															more
														</p>
													)}
												</div>
											)}
										</div>
									</div>
								)
							})}
						</>
					)}
				</div>
			</div>
			<div className='w-[30%] h-[100vh] right-0 py-[28px] hidden md:flex flex-col gap-[20px] sticky top-0'>
				<div>
					{(isLoading &&
						Array.from({ length: 1 }).map((_, i) => (
							<div
								key={`skeleton-${i}`}
								className='flex gap-[8px] items-center px-[3px]'
							>
								<Skeleton
									sx={{
										bgcolor: theme == 'dark' ? '#333' : '#e0e0e0',
										'&::after': {
											background:
												theme == 'dark'
													? 'linear-gradient(90deg, #333, #444, #333)'
													: 'linear-gradient(90deg, #e0e0e0, #f5f5f5, #e0e0e0)',
										},
									}}
									variant='circular'
									width={48}
									className='mx-[3px] md:mx-[6px]'
									height={48}
								/>
								<Skeleton variant='text' sx={{ fontSize: '12px' }} width={36} />
							</div>
						))) || (
						<div className='flex gap-[14px]'>
							<Link
								href={'/profile'}
								key={data[0]?.id || `story-${0}`}
								className='h-[80px] flex gap-[8px] items-center'
							>
								{(data[0]?.userImage == '' && (
									<Image
										draggable={false}
										className={`object-cover ${
											theme == 'dark' ? 'bg-black' : 'bg-white'
										} rounded-full p-[2.5px]`}
										src={userIMG}
										alt=''
										width={48}
										height={48}
									/>
								)) || (
									<div className='w-12 h-12'>
										<Image
											draggable={false}
											src={`http://37.27.29.18:8003/images/${data[0]?.userImage}`}
											width={48}
											height={48}
											alt={data[0]?.userName || 'User Avatar'}
											className='w-12 h-12 rounded-full object-cover'
										/>
									</div>
								)}
								<p className='text-[14px] font-[400]'>{data[0]?.userName}</p>
							</Link>
						</div>
					)}
				</div>
				<div className='w-full flex flex-col'>
					<p className='block text-[#64748B] text-[14px] font-[500] '>
						{t('home.Suggested_for_you')}
					</p>
					{users?.data?.slice(0, 5).map((e, i) => {
						return (
							<div key={i} className='py-[12px] pr-[8px] flex justify-between'>
								<Link href={`/${e.id}`} className='flex gap-[8px] items-center'>
									{(e.avatar == '' && (
										<Image
											draggable={false}
											className={`object-cover ${
												theme == 'dark' ? 'bg-black' : 'bg-white'
											} rounded-full p-[2.5px]`}
											src={userIMG}
											alt=''
											width={48}
											height={48}
										/>
									)) || (
										<Image
											draggable={false}
											className={`w-[48px] h-[48px] object-cover rounded-full`}
											src={`http://37.27.29.18:8003/images/${e.avatar}`}
											alt=''
											width={48}
											height={48}
										/>
									)}
									<div className='flex flex-col'>
										<p className='text-[16px] font-[500]'>{e.userName}</p>
										<p className='text-[12px] font-[400]'>{e.fullName}</p>
									</div>
								</Link>
								<button
									onClick={() =>
										e.isSubscriber
											? unfollowUser(e.userId)
											: followUser(e.userId)
									}
									className='px-3 py-1 ml-4 text-sm text-blue-600 hover:text-blue-500 active:text-blue-400 rounded-full'
								>
									{e.isSubscriber
										? t('rells.Unfollow Rels')
										: t('rells.Subcribe Rels')}
								</button>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
