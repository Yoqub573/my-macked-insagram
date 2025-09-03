'use client'
import { FiMoreVertical } from 'react-icons/fi'
import { useTodoAsyncStore } from '@/store/pages/notification/store'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UsersList() {
	const {
		users,
		getUsers,
		toggleFollow,
		deleteUser,
		comments,
		getComments,
		loading,
		error,
	} = useTodoAsyncStore()
	const [openMenuId, setOpenMenuId] = useState(null)
	const {t} = useTranslation()

	useEffect(() => {
		getUsers()
		getComments()
	}, [])

	let router = useRouter()

	if (loading)
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
			</div>
		)

	if (error)
		return (
			<div className='flex justify-center items-center h-screen'>
				<p className='text-red-500 text-lg'>Ошибка: {error}</p>
			</div>
		)

	const toggleMenu = userId => {
		setOpenMenuId(openMenuId === userId ? null : userId)
	}

	return (
		<div className='max-w-2xl mx-auto px-4 sm:px-0 py-6 min-h-screen'>
			<div className=' top-0 z-10  bg-opacity-80 backdrop-blur-md py-4 border-b border-gray-200'>
				<h1 className='text-2xl font-bold'>{t("setting.notification")}</h1>
			</div>

			<div className='mt-6'>
				<h2 className='text-lg font-semibold mb-4'>{t("notice.week")}</h2>

				{users.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-10'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
							<svg
								className='w-8 h-8 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
								/>
							</svg>
						</div>
						<h3 className='text-lg font-medium text-gray-500'>
							Пользователей нет
						</h3>
					</div>
				) : (
					<div className='space-y-3'>
						{users.map(user => (
							<div
								key={user.id}
								className='flex items-center justify-between p-3 rounded-lg'
							>
								<div className='flex items-center space-x-3'>
									<div className='relative'>
										<Image
											src={
												user.avatar
													? `http://37.27.29.18:8003/images/${user.avatar}`
													: '/profile_default.png'
											}
											alt={user.fullName || 'User Avatar'}
											width={100}
											height={100}
											className='rounded-full w-13 h-13 object-cover border border-gray-200'
										/>
										<div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
									</div>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center space-x-1'>
											
											<p onClick={()=>router.push(`${user.userId}`)} className='font-semibold text-sm truncate cursor-pointer'>
												{user.userName}
											</p>
											<span className='text-gray-500 text-xs '>
												{t("notice.follow")}
											</span>
										</div>
										<p className='text-gray-500 text-xs truncate'>
											{user.fullName}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-2'>
									<button
										className={`text-sm font-medium px-4 py-1.5 rounded-md ${
											user.isFollowed
												? 'bg-gray-200 text-black'
												: 'bg-blue-500 text-white'
										}`}
										onClick={() => toggleFollow(user.userId)}
									>
										{user.isFollowed ? t("notice.unfollow") : t("notice.followback")}
									</button>

									<button
										onClick={() => toggleMenu(user.id)}
										className='p-1 rounded-full'
									>
										<FiMoreVertical className='text-gray-500' />
									</button>

									{openMenuId === user.id && (
										<div className='absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10'>
											<button
												className='block w-full text-left px-4 py-2 text-sm text-gray-700'
												onClick={() => {
													deleteUser(user.userId)
													setOpenMenuId(null)
												}}
											>
												Удалить
											</button>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='mt-8'>
				<h2 className='text-lg font-semibold mb-4'>{t("notice.comment")}</h2>

				{comments.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-10'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
							<svg
								className='w-8 h-8 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
								/>
							</svg>
						</div>
						<h3 className='text-lg font-medium text-gray-500'>
							Нет комментариев
						</h3>
					</div>
				) : (
					<div className='space-y-3'>
						{comments.map(comment => (
							<div
								key={comment.postCommentId}
								className='flex items-start p-3 rounded-lg'
							>
								<Image
									src={
										comment.userImage
											? `http://37.27.29.18:8003/images/${comment.userImage}`
											: '/profile_default.png'
									}
									alt={comment.userName || 'User Avatar'}
									width={100}
									height={100}
									className='rounded-full w-11 h-11 object-cover border border-gray-200 mr-3'
								/>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center space-x-2'>
										<p onClick={()=>router.push(`${comment.userId}`)}  className='font-semibold text-sm cursor-pointer '>{comment.userName}</p>
										<span className='text-gray-500 text-xs'>
											{new Date(comment.dateCommented).toLocaleString('ru-RU', {
												day: 'numeric',
												month: 'short',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									<p className='text-sm mt-1'>{comment.comment}</p>
									<div className='flex items-center mt-2 space-x-4'>
										<button className='text-xs text-gray-500'>{t("notice.answer")}</button>
										<button className='text-xs text-gray-500'>{t("notice.like")}</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
