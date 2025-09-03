'use client'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import { useState } from 'react'
import toast from 'react-hot-toast'

const PostModal = () => {
	let { addPost } = useProfileStore()

	let [title, setTitle] = useState('')
	let [content, setContent] = useState('')
	let [file, setFile] = useState([])

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			let formData = new FormData()
			if (title) {
				formData.append('Title', title)
			}
			if (content) {
				formData.append('Content', content)
			}
			if (file) {
				for (let i = 0; i < file.length; i++) {
					formData.append(`Images`, file[i])
				}
			}
			await addPost(formData)
			toast('Successfuly added post')
			console.log(file)
			e.target.reset()
		} catch (error) {
			console.error(error)
			toast.error('Something went wrong!')
		}
	}

	const handleFileChange = e => {
		e.preventDefault()
		setFile(Array.from(e.target.files || []))
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-auto'>
				<form onSubmit={handleSubmit} className='p-6'>
					<h2 className='text-2xl font-bold text-gray-800 mb-6'>
						Create New Post
					</h2>

					<div className='mb-4'>
						<label
							htmlFor='title'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Title <span className='text-gray-500'>(can be empty)</span>
						</label>
						<input
							id='title'
							type='text'
							placeholder='Enter title...'
							value={title}
							onChange={e => setTitle(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='content'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Content <span className='text-gray-500'>(can be empty)</span>
						</label>
						<textarea
							id='content'
							placeholder='Enter content...'
							value={content}
							onChange={e => setContent(e.target.value)}
							rows={3}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
						/>
					</div>

					{/* File Input */}
					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Upload Images
						</label>
						<div className='flex items-center justify-center w-full'>
							<label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors'>
								<div className='flex flex-col items-center justify-center pt-5 pb-6'>
									<svg
										className='w-8 h-8 mb-4 text-gray-500'
										aria-hidden='true'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 20 16'
									>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
										/>
									</svg>
									<p className='mb-2 text-sm text-gray-500'>
										Click to upload or drag and drop
									</p>
									<p className='text-xs text-gray-500'>
										Multiple files supported
									</p>
								</div>
								<input
									type='file'
									multiple
									onChange={handleFileChange}
									className='hidden'
								/>
							</label>
						</div>
						{file.length > 0 && (
							<div className='mt-2'>
								<p className='text-sm text-gray-600'>
									{file.length} file(s) selected
								</p>
							</div>
						)}
					</div>

					<div className='flex gap-3 justify-end'>
						<button
							type='button'
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400'
						>
							Cancel
						</button>
						<button
							type='submit'
							className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							Share
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default PostModal
