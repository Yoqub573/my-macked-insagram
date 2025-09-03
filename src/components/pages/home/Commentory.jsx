'use client'

import { useHome } from '@/store/pages/home/store'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import userIMG from '../../../assets/img/pages/home/userDefault.png'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Commentory({ UserId, setClose }) {
  let {getUserStories, postStory} = useHome()
	const [theme, setTheme] = useState(
		typeof window !== 'undefined' ? localStorage.getItem('theme') || '' : ''
	)

	useEffect(() => {
		const handleStorageChange = event => {
			if (event.key === 'theme') setTheme(event.newValue || '')
		}
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', handleStorageChange)
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('storage', handleStorageChange)
			}
		}
	}, [])

	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(null)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState('')
	const inputRef = useRef(null)
	const previousUrl = useRef(null)

	const revokePrevUrl = () => {
		if (previousUrl.current) {
			URL.revokeObjectURL(previousUrl.current)
			previousUrl.current = null
		}
	}

	const onFileChange = e => {
		const f = e.target.files?.[0]
		if (!f) return

		if (!f.type.startsWith('image/')) {
			setMessage('Поддерживаются только изображения (JPEG/PNG/WebP/GIF).')
			e.target.value = ''
			return
		}

		setFile(f)
		revokePrevUrl()
		const url = URL.createObjectURL(f)
		previousUrl.current = url
		setPreviewUrl(url)
		setMessage('')
	}


	const onClear = () => {
		setFile(null)
		setPreviewUrl(null)
		revokePrevUrl()
		if (inputRef.current) inputRef.current.value = ''
		setMessage('')
	}

	const onSave = async e => {
		e.preventDefault()
		if (!file) return

		try {
			setSaving(true)
			setMessage('')
      
			const formData = new FormData()
			formData.append('Image', file)
			await postStory(formData)
      
      getUserStories()
			setMessage('Файл успешно загружен!')
			onClear()
		} catch (err) {
			console.error(err)
			setMessage(`Ошибка при сохранении: ${err.message}`)
		} finally {
			setSaving(false)
		}
	}

	useEffect(() => () => revokePrevUrl(), [])
	let {t} = useTranslation()
	return (
		<form
			onSubmit={onSave}
			className={`fixed w-[90%] md:w-[60%] m-auto inset-0 h-[60vh] md:h-[72vh] ${
				theme === 'dark' ? 'bg-[#212328] text-white' : 'bg-white text-[#111]'
			} z-[999999999999] shadow-2xl p-6 flex flex-col gap-4`}
		>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg md:text-xl font-semibold'>{t("home.Loading_history")}</h2>
				<button
					type='button'
					onClick={onClear}
					className='px-3 py-1 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50'
					disabled={!file && !previewUrl}
				>
					Clear
				</button>
			</div>

			<div
				className={`border-2 border-dashed h-[80%] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 ${
					theme === 'dark'
						? 'border-gray-600 bg-[#1a1c20]'
						: 'border-gray-300 bg-gray-50'
				}`}
			>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					onChange={onFileChange}
					className='hidden'
					id='commentory-file-input'
				/>
				<label
					htmlFor='commentory-file-input'
					className='cursor-pointer px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 active:scale-[0.99]'
				>
					Выбрать файл
				</label>

				<div className='w-full max-w-[520px] aspect-video relative overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50'>
					{previewUrl ? (
						<img
							src={previewUrl}
							alt='Предпросмотр'
							className='object-contain w-full h-full'
						/>
					) : (
						<div className='flex flex-col items-center gap-2 opacity-70'>
							<Image
								src={userIMG}
								alt='placeholder'
								width={72}
								height={72}
								className='opacity-60'
							/>
							<span>Предпросмотр появится здесь</span>
						</div>
					)}
				</div>
			</div>

			<div className='flex items-center gap-3'>
				<button
					type='submit'
					disabled={!file || saving}
					className={`px-5 ml-auto py-2 rounded-xl font-medium disabled:opacity-50 ${
						theme === 'dark'
							? 'bg-white text-black hover:opacity-90'
							: 'bg-black text-white hover:opacity-90'
					}`}
				>
					{saving ? 'Сохранение…' : 'Сохранить'}
				</button>
				{message && <span className='text-sm opacity-80'>{message}</span>}
			</div>
		</form>
	)
}

