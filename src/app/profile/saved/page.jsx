'use client'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Image from 'next/image'
import React, { use, useEffect } from 'react'
import savedIcon from '@/assets/img/pages/profile/profile/image_78-removebg-preview.png'
import { BookmarkIcon, Heart } from 'lucide-react'
import { FaComments } from 'react-icons/fa'
import useDarkSide from '@/hook/useDarkSide'

import { useUserStore } from '@/store/pages/explore/explorestore'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import {
	Bookmark,
	CircleUserRound,
	MessageCircleMore,
	SendHorizontal,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react'
import CommentInput from '@/components/pages/explore/Emogi'
import { useUserId } from '@/hook/useUserId'
import { useRouter } from 'next/navigation'
import ModalUsers from '@/components/pages/explore/ModalUsers'
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

const mediaStyle = {
	width: 'full',
	height: 'full',
	objectFit: 'cover',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}
const mediaStyleModal = {
	width: '100%',
	// height: '85vh',
	objectFit: 'cover',
	borderRadius: '2px',
	cursor: 'pointer',
	backgroundColor: '#f5f5f5',
}

const Saved = () => {
	let { favorites, getFavorites } = useProfileStore()
	let { getProfileData } = useProfileStore()

	const [theme] = useDarkSide()

	useEffect(() => {
		getFavorites()
		console.log(favorites)
	}, [])

	// modal post

	let {
		savePost,
		users,
		fetchUsers,
		postById,
		fetchPostById,
		deleteComment,
		addComment,
		unfollowUser,
		fetchUserFollows,
		Follow,
		FolowUser,
		likePost,
	} = useUserStore()
	const [open, setOpen] = React.useState(false)
	const [isMuted, setIsMuted] = React.useState(false)
	let [newcomit, setnewComit] = React.useState('')
	const [likedComments, setLikedComments] = React.useState({})
	let userId = useUserId()
	let [follow, setFollow] = React.useState(false)
	const videoRef = React.useRef(null)
	const { i18n } = useTranslation()
	const { t } = useTranslation()
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
			getProfileData()
		} catch (error) {
			console.error('Ошибка при подписке/отписке:', error)
		}
	}

	return (
		<div className='w-full'>
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
														draggable={false}
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
			<div className='flex flex-wrap gap-[0.5%] gap-y-[0.2vh] md:gap-y-[1vh] pb-[10vh] pt-[5vh] w-full'>
				{favorites?.data?.length > 0 ? (
					favorites.data.map((e, i) => (
						<div
							key={i}
							className='group relative w-[33%] h-[160px] sm:h-[300px] md:h-[380px] overflow-hidden flex items-center'
							style={{ backgroundColor: theme === 'dark' ? 'white' : 'black' }}
							onClick={() => handleOpen(e.postId)}
						>
							<div className='absolute top-2 right-2 z-10 p-1 text-black rounded-full'>
								<BookmarkIcon className='text-white w-5 h-5' />{' '}
							</div>
							{e.images[0].endsWith('.mp4') ? (
								<video src={`http://37.27.29.18:8003/images/${e.images[0]}`} />
							) : (
								<Image
									src={`http://37.27.29.18:8003/images/${e.images[0]}`}
									alt='post'
									width={300}
									height={300}
								/>
							)}
							<div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>

							<div className='absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold'>
								<div className='flex items-center gap-1'>
									<Heart fill='white' /> {e.postLikeCount}
								</div>
								<div className='flex items-center gap-1'>
									<FaComments /> {e.commentCount}
								</div>
							</div>
						</div>
					))
				) : (
					<div className='flex flex-col gap-[10px] text-center items-center py-[10px] m-auto'>
						<Image src={savedIcon} alt='savedIcon' />
						<h1 className='text-[#1E293B] text-[18px] font-bold'>Your saved</h1>
						<p className='text-[#64748B]'>Only you can see what you've saved</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Saved
