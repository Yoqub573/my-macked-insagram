'use client'
import React, { useState } from 'react'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Image from 'next/image'
import { useEffect } from 'react'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'
import { RxHamburgerMenu } from 'react-icons/rx'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineGridOn } from 'react-icons/md'
import { FaRegBookmark } from 'react-icons/fa'
import { MdOutlinePhotoCameraFront } from 'react-icons/md'
import useDarkSide from '@/hook/useDarkSide'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import toast from 'react-hot-toast'
import { useMediaQuery } from '@mui/material'
import { useUserId } from '@/hook/useUserId'

import { useProfileByIdStore } from '@/store/pages/profile/profile-by-id/store'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import {
	ArrowRight,
	Calendar,
	Loader,
	Search,
	User,
	X,
	XCircle,
} from 'lucide-react'
import { usegetUserStore } from '@/store/pages/search/store'
import './style.css'
import FollowFollowers from '@/components/pages/profile/profile-by-id/FollowFollowers'
import FollowFollowings from '@/components/pages/profile/profile-by-id/FollowFollowings'
import { useTranslation } from 'react-i18next'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 550,
	height: 400,
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: '20px',
}

const style2 = {
	width: 600,
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: 'none',
	boxShadow: 24,
	borderRadius: '20px',
}

const Layout = ({ children }) => {
	let { user: userer, getProfileData } = useProfileStore()
	let { t } = useTranslation()

	let router = useRouter()
	let pathname = usePathname()

	const isMobile = useMediaQuery('(max-width:768px)')

	const myUserId = useUserId()

	useEffect(() => {
		getProfileData()
	}, [])

	const [theme, setTheme] = useDarkSide()

	const styleBurgerIcon = {
		position: 'absolute',
		top: isMobile ? '50%' : '34%',
		left: isMobile ? '50%' : '79%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		width: 300,
		boxShadow: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'baseline',
		borderRadius: '10px',
		overflow: 'hidden',
		outline: '0',
	}

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: isMobile ? 270 : 550,
		height: 400,
		bgcolor: 'background.paper',
		border: 'none',
		boxShadow: 24,
		borderRadius: '20px',
	}

	const style2 = {
		width: isMobile ? 270 : 600,
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		border: 'none',
		boxShadow: 24,
		borderRadius: '20px',
	}

	const [openI, setOpenI] = React.useState(false)
	const handleIOpen = () => setOpenI(true)
	const handleIClose = () => setOpenI(false)

	const logOut = () => {
		localStorage.removeItem('access_token')
		router.push('/login')
		toast('Logged out!')
	}

	const getProfileById = useProfileByIdStore(state => state.getProfileById)
	const users = useProfileByIdStore(state => state.users)
	const [open, setOpen] = useState(false)
	const [focused, setFocused] = useState(false)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredUsers, setFilteredUsers] = useState([])
	const [focused2, setFocused2] = useState(false)
	const [loading2, setLoading2] = useState(false)
	const [search2, setSearch2] = useState('')
	const [filteredUsers2, setFilteredUsers2] = useState([])
	const [openAccountModal, setOpenAccountModal] = useState(null)
	const [openFollowings, setOpenFollowings] = useState(null)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	let user = users?.data


	const { getChats, followers, getFollowers, getFollowings, followings } =
		useProfileByIdStore()

	const SkeletonRow = () => (
		<Stack direction='row' spacing={2} alignItems='center' className='p-3'>
			<Skeleton variant='circular' width={44} height={44} />
			<Stack spacing={0.5} flex={1}>
				<Skeleton variant='text' width='60%' height={14} />
				<Skeleton variant='text' width='40%' height={12} />
			</Stack>
		</Stack>
	)
	const SkeletonRow2 = () => (
		<Stack direction='row' spacing={2} alignItems='center' className='p-3'>
			<Skeleton variant='circular' width={44} height={44} />
			<Stack spacing={0.5} flex={1}>
				<Skeleton variant='text' width='60%' height={14} />
				<Skeleton variant='text' width='40%' height={12} />
			</Stack>
		</Stack>
	)

	useEffect(() => {
		if (!search.trim()) {
			setFilteredUsers([])
			setLoading(false)
			return
		}

		setLoading(true)
		const delayDebounce = setTimeout(() => {
			const results =
				followers?.data?.filter(u =>
					u?.userShortInfo?.userName
						?.toLowerCase()
						.includes(search.toLowerCase())
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
			const results =
				followings?.data?.filter(u =>
					u?.userShortInfo?.userName
						?.toLowerCase()
						.includes(search2.toLowerCase())
				) || []
			setFilteredUsers2(results)
			setLoading(false)
		}, 500)

		return () => clearTimeout(delayDebounce)
	}, [search2, users])

	useEffect(() => {
		if (myUserId) {
			getProfileById(myUserId)
			getFollowers(myUserId)
			getFollowings(myUserId)
		}
	}, [myUserId, getProfileById, getFollowers, getFollowings])

	return (
		<div className='pt-[8%]'>
			<section className='flex gap-[5%] m-auto lg:w-[80%] justify-center'>
				<div className='hidden md:flex overflow-hidden items-center justify-center w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%] bg-gray-200'>
					<Image
						src={`http://37.27.29.18:8003/images/${userer.image}`}
						alt='profile picture'
						width={500}
						height={500}
						className={`${userer.image ? 'flex' : 'hidden'} h-full`}
					/>
					<Image
						src={defaultUser}
						alt='default user'
						className={`${
							userer.image ? 'hidden' : 'flex'
						} w-[160px] h-[160px] rounded-[50%]`}
					/>
				</div>
				<div className='flex flex-col gap-[20px]'>
					<div className='flex items-center md:gap-[40px]'>
						<h1
							className='font-bold text-[#1E293B] text-[20px] w-[120px] md:w-[130px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer'
							onClick={() => setOpenAccountModal(true)}
						>
							{userer.userName}
						</h1>
						<div className='flex items-center gap-[5px] md:gap-[10px]'>
							<button
								className={`cursor-pointer text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl active:scale-95 transition-transform duration-100 ease-in ${
									theme == 'light'
										? 'bg-[#F0F2F5] text-[#334155] hover:bg-gray-200'
										: 'bg-[#25292E] text-[#F4F4F4] hover:bg-gray-800'
								}`}
								onClick={() => router.push('/editprofile')}
							>
								{t('profile.editProfile')}
							</button>
							<button
								className={`cursor-pointer text-[10px] md:text-[16px] px-[10px] md:px-[20px] py-[5px] md:py-[10px] rounded-xl md:rounded-2xl active:scale-95 transition-transform duration-100 ease-in
								${
									theme == 'light'
										? 'bg-[#F0F2F5] text-[#334155] hover:bg-gray-200'
										: 'bg-[#25292E] text-[#F4F4F4] hover:bg-gray-800'
								}`}
							>
								{/* View archive */}
								{t('profile.View Archive')}
							</button>
							<button
								onClick={handleIOpen}
								className='outline-0 cursor-pointer'
							>
								<RxHamburgerMenu
									size={20}
									className='active:scale-95 transition-transform duration-100 ease-in'
								/>
							</button>
							<Modal
								open={openI}
								onClose={handleIClose}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={styleBurgerIcon}>
									<button className='cursor-pointer p-[12px] bg-white hover:bg-gray-200 w-full text-start'>
										{t('profile.QR code')}
									</button>
									<button
										className='cursor-pointer p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={() => router.push('/notification')}
									>
										{t('profile.Notidications')}
									</button>
									<button
										className='cursor-pointer p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={() => router.push('/setting/pro')}
									>
										{t('profile.Settings')}
									</button>
									<button
										className='text-[#EF4444] cursor-pointer p-[12px] bg-white hover:bg-gray-200 w-full text-start'
										onClick={logOut}
									>
										{t('profile.Log out')}
									</button>
								</Box>
							</Modal>
						</div>
					</div>
					<div className='flex items-center gap-[20px]'>
						{user?.subscribersCount ? (
							<Modal
								keepMounted
								open={open}
								onClose={handleClose}
								aria-labelledby='keep-mounted-modal-title'
								aria-describedby='keep-mounted-modal-description'
							>
								<Box sx={style}>
									<div className=''>
										<div className='flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between'>
											<div></div>
											<h3 className='font-semibold text-[18px]'>
												{t('profile.followers')}
											</h3>
											<button onClick={handleClose}>
												<X />
											</button>
										</div>
										<div className='relative m-4'>
											{!focused && (
												<Search
													size={18}
													className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'
												/>
											)}
											<input
												type='text'
												value={search}
												onChange={e => setSearch(e.target.value)}
												placeholder='Search'
												className={`py-2 w-full rounded-lg bg-[rgb(239,239,239)] pr-10 ${
													!focused ? 'pl-10' : 'pl-4'
												}`}
												onFocus={() => setFocused(true)}
												onBlur={() => setFocused(false)}
											/>

											{loading ? (
												<Loader
													className='absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin'
													size={18}
												/>
											) : (
												search && (
													<button
														type='button'
														onClick={() => setSearch('')}
														className='absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600'
													>
														<XCircle size={18} />
													</button>
												)
											)}
										</div>
										<div className='flex h-[270px] overflow-y-scroll flex-col'>
											{loading
												? Array.from({ length: 5 }).map((_, i) => (
														<SkeletonRow
															key={i}
															className='h-6 w-full rounded'
														/>
												  ))
												: filteredUsers?.map(e => (
														<div
															key={e.id}
															className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'
														>
															<div className='flex cursor-pointer items-center gap-5'>
																<Image
																	src={
																		e?.userShortInfo?.userPhoto
																			? `http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}`
																			: defaultUser
																	}
																	className='object-cover w-[44px] h-[44px] rounded-full'
																	width={44}
																	height={44}
																	alt='avatar'
																/>
																<div>
																	<p>{e?.userShortInfo?.userName}</p>
																	<p>{e?.userShortInfo?.fullname}</p>
																</div>
															</div>
															<FollowFollowers
																id={e?.userShortInfo?.userId}
																checkMyFollowings={false}
															/>
														</div>
												  ))}
											{!search &&
												!loading &&
												followers?.data?.map(e => (
													<div
														key={e.id}
														className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'
													>
														<div
															onClick={() =>
																router.push(`${e?.userShortInfo?.userId}`)
															}
															className='flex cursor-pointer items-center gap-5'
														>
															<Image
																src={
																	e?.userShortInfo?.userPhoto
																		? `http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}`
																		: defaultUser
																}
																className='object-cover w-[44px] h-[44px] rounded-full'
																width={44}
																height={44}
																alt='avatar'
															/>
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
														<FollowFollowers
															id={e?.userShortInfo?.userId}
															checkMyFollowings={false}
														/>
													</div>
												))}
										</div>
									</div>
								</Box>
							</Modal>
						) : null}
						{user?.subscriptionsCount ? (
							<Modal
								keepMounted
								open={openFollowings}
								onClose={() => setOpenFollowings(false)}
								aria-labelledby='keep-mounted-modal-title'
								aria-describedby='keep-mounted-modal-description'
							>
								<Box sx={style}>
									<div className=''>
										<div className='flex p-4 pb-2 border-b-1 border-gray-300 items-center justify-between'>
											<div></div>
											<h3 className='font-semibold text-[18px]'>
												{' '}
												{t('profile.following')}
											</h3>
											<button onClick={() => setOpenFollowings(false)}>
												<X />
											</button>
										</div>
										<div className='relative m-4'>
											{!focused2 && (
												<Search
													size={18}
													className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'
												/>
											)}
											<input
												type='text'
												value={search2}
												onChange={e => setSearch2(e.target.value)}
												placeholder='Search'
												className={`py-2 w-full rounded-lg bg-[rgb(239,239,239)] pr-10 ${
													!focused2 ? 'pl-10' : 'pl-4'
												}`}
												onFocus={() => setFocused2(true)}
												onBlur={() => setFocused2(false)}
											/>

											{loading2 ? (
												<Loader
													className='absolute right-3 top-6 -translate-y-1/2 text-gray-400 animate-spin'
													size={18}
												/>
											) : (
												search2 && (
													<button
														type='button'
														onClick={() => setSearch2('')}
														className='absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600'
													>
														<XCircle size={18} />
													</button>
												)
											)}
										</div>
										<div className='flex h-[270px] overflow-y-scroll flex-col'>
											{loading2
												? Array.from({ length: 5 }).map((_, i) => (
														<SkeletonRow2
															key={i}
															className='h-6 w-full rounded'
														/>
												  ))
												: filteredUsers2?.map(e => (
														<div
															key={e.id}
															className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'
														>
															<div
																onClick={() =>
																	router.push(`${e?.userShortInfo?.userId}`)
																}
																className='flex cursor-pointer items-center gap-5'
															>
																<Image
																	src={
																		e?.userShortInfo?.userPhoto
																			? `http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}`
																			: defaultUser
																	}
																	className='object-cover w-[44px] h-[44px] rounded-full'
																	width={44}
																	height={44}
																	alt='avatar'
																/>
																<div>
																	<p>{e?.userShortInfo?.userName}</p>
																	<p>{e?.userShortInfo?.fullname}</p>
																</div>
															</div>
															<FollowFollowings
																id={e?.userShortInfo?.userId}
																checkMyFollowings={true}
															/>
														</div>
												  ))}
											{!loading2 &&
												!search2 &&
												followings?.data?.map(e => (
													<div
														key={e.id}
														className='flex items-center justify-between hover:bg-[#eeeeee] rounded p-3'
													>
														<div
															onClick={() =>
																router.push(`${e?.userShortInfo?.userId}`)
															}
															className='flex cursor-pointer items-center gap-5'
														>
															<Image
																src={
																	e?.userShortInfo?.userPhoto
																		? `http://37.27.29.18:8003/images/${e?.userShortInfo?.userPhoto}`
																		: defaultUser
																}
																className='object-cover w-[44px] h-[44px] rounded-full'
																width={44}
																height={44}
																alt='avatar'
															/>
															<div>
																<p>{e?.userShortInfo?.userName}</p>
																<p>{e?.userShortInfo?.fullname}</p>
															</div>
														</div>
														<FollowFollowings
															id={e?.userShortInfo?.userId}
															checkMyFollowings={true}
														/>
													</div>
												))}
										</div>
									</div>
								</Box>
							</Modal>
						) : null}
						<Modal
							keepMounted
							open={openAccountModal}
							onClose={() => setOpenAccountModal(false)}
							aria-labelledby='keep-mounted-modal-title'
							aria-describedby='keep-mounted-modal-description'
						>
							<Box sx={style2}>
								<div className='p-4 border-b-1 border-gray-300 justify-center flex'>
									{t('profile.aboutThisAccount')}
								</div>
								<div className='flex flex-col gap-3 items-center text-center px-10 p-4'>
									<Image
										src={
											user?.image
												? `http://37.27.29.18:8003/images/${user?.image}`
												: defaultUser
										}
										alt='profile picture'
										width={78}
										height={78}
										className={`w-[78px] h-[78px] rounded-[200px] overflow-hidden`}
									/>
									<h3 className='font-bold text-[18px]'>{user?.userName}</h3>
									<h4 className='text-[12px]'>
										To help keep our community authentic, we’re showing
										information about accounts on Instagram. See why this
										information is important.
									</h4>
								</div>
								<div className='flex flex-col p-4 pb-4 gap-[10px]'>
									<div className='flex items-center gap-[10px]'>
										<Calendar />
										<div>
											<h3>Date joined</h3>
											<h3 className='text-gray-400'>
												{user?.dob
													? new Date(user.dob).toLocaleDateString('en-US', {
															month: 'long',
															year: 'numeric',
													  })
													: ''}
											</h3>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-[10px]'>
											<User />
											<h3>Former usernames</h3>
										</div>
										<div className='flex text-[gray] items-center gap-[10px]'>
											<span>2</span>
											<ArrowRight size={18} />
										</div>
									</div>
								</div>
								<div
									onClick={() => setOpenAccountModal(false)}
									className='p-4 border-t-1 border-gray-300 active:bg-[#eeeeee] rounded-b-[20px] justify-center cursor-pointer flex'
								>
									Close
								</div>
							</Box>
						</Modal>
						<div className='flex md:hidden overflow-hidden  items-center justify-center w-[100px] md:w-[160px] h-[100px] md:h-[160px] rounded-[50%]'>
							<Image
								src={`http://37.27.29.18:8003/images/${userer.image}`}
								alt='profile picture'
								width={500}
								height={500}
								className={`${userer.image ? 'flex' : 'hidden'} h-full`}
							/>
							<Image
								src={defaultUser}
								alt='default user'
								className={`${
									userer.image ? 'hidden' : 'flex'
								} w-[70px] rounded-[50%]`}
							/>
						</div>
						<p
							className='text-[#1E293B] block md:flex cursor-pointer items-baseline'
							onClick={() => router.push('/profile')}
						>
							{userer?.postCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{t('profile.post')}
							</span>
						</p>
						<p
							className='text-[#1E293B] block md:flex cursor-pointer items-baseline'
							onClick={handleOpen}
						>
							{userer?.subscribersCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{t('profile.followers')}
							</span>
						</p>
						<p
							className='text-[#1E293B] block md:flex cursor-pointer items-baseline'
							onClick={() => setOpenFollowings(true)}
						>
							{userer?.subscriptionsCount}
							<span className='text-[#64748B] block md:flex md:ml-[2px] text-[12px] lg:text-[18px]'>
								{t('profile.following')}
							</span>
						</p>
					</div>
					<div className='flex'>
						<p className='font-bold text-[#1E293B] text-[20px]'>
							{userer.firstName}
						</p>
						{userer.lastName && (
							<p className='font-bold text-[#1E293B] text-[20px]'>
								{userer.userName}
							</p>
						)}
					</div>
				</div>
			</section>
			<section className='h-[70px] md:h-[100px] w-[95%] md:w-[80%] overflow-x-hidden flex m-auto'></section>
			<div className='border-t-[#E2E8F0] border-t w-[95%] md:w-[80%] flex justify-center gap-[30px] md:gap-[150px] m-auto'>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile' ? '#2563EB' : '#64748B',
						borderTop: pathname === '/profile' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile')}
				>
					<MdOutlineGridOn size={30} />
					{/* <p className='text-[16px] md:text-[22px]'>{t('profile.Post')}</p> */}
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile/saved' ? '#2563EB' : '#64748B',
						borderTop:
							pathname === '/profile/saved' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile/saved')}
				>
					<FaRegBookmark size={30} />
					{/* <p className='text-[16px] md:text-[22px]'>{t('profile.Saved')}</p> */}
				</button>
				<button
					className='flex items-center gap-[10px] py-[10px] cursor-pointer '
					style={{
						color: pathname === '/profile/tagged' ? '#2563EB' : '#64748B',
						borderTop:
							pathname === '/profile/tagged' ? '2px solid #2563EB' : 'none',
					}}
					onClick={() => router.push('/profile/tagged')}
				>
					<MdOutlinePhotoCameraFront size={30} />
					{/* <p className='text-[16px] md:text-[22px]'>{t('profile.Tagged')}</p> */}
				</button>
			</div>
			<section className='w-[95%] md:w-[80%] flex m-auto'>{children}</section>
		</div>
	)
}

export default Layout
