'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import frame168 from '../../../assets/img/pages/auth/registration/Frame 168.png'
import image71 from '../../../assets/img/pages/auth/registration/image 71.png'
import image72 from '../../../assets/img/pages/auth/registration/image 72.png'
import image73 from '../../../assets/img/pages/auth/registration/image 73.png'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRegisterStore } from '@/store/pages/auth/registration/registerStore'

export default function Login() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()
	const [showPassword, setShowPassword] = useState(false)
	const addLogin = useRegisterStore(state => state.addLogin)
	const isLoading = useRegisterStore(state => state.isLoading)
	const router = useRouter()

	const onSubmit = async data => {
		const result = await addLogin({
			userName: data.userName,
			password: data.password,
		})

		if (result?.success) {
			reset()
			toast.success('Login successful!')
			if (typeof window != 'undefined') {
				localStorage.setItem('access_token', result?.data?.data)
			}
			router.push('/')
		} else {
			toast.error('Login failed. Please try again.')
		}
	}

  return (
    <div className="flex justify-around w-[80%] m-auto items-center">
      <Toaster />
      <div className="hidden md:block">
        <Image src={image71} alt="phone" />
        <p className="text-[#64748B] text-center mt-[20px]">Установите приложение</p>
        <div className="flex items-center justify-center gap-[10px] mt-[20px]">
          <Image src={image72} alt="Google Play" />
          <Image src={image73} alt="Microsoft" />
        </div>
      </div>

			<div className='flex items-center justify-center min-h-screen w-[400px]'>
				<div className='bg-white border border-gray-300 rounded-lg p-8 w-full  max-w-sm shadow-sm'>
					<div className='flex flex-col items-center mb-6'>
						<Image src={frame168} alt='Instagram' />
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
						<input
							type='text'
							placeholder='User Name'
							{...register('userName', { required: 'This field is required' })}
							className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400'
						/>
						{errors.userName && (
							<p className='text-red-500 text-xs'>{errors.userName.message}</p>
						)}

						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								{...register('password', { required: 'Password is required' })}
								className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400'
							/>
							<span
								onClick={() => setShowPassword(!showPassword)}
								className='absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer select-none'
							>
								{showPassword ? <Eye /> : <EyeOff />}
							</span>
						</div>
						{errors.password && (
							<p className='text-red-500 text-xs'>{errors.password.message}</p>
						)}

						<button
							type='submit'
							disabled={isLoading}
							className={`w-full text-white font-semibold py-2 rounded-md transition ${
								isLoading
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-blue-500 hover:bg-blue-600'
							}`}
						>
							{isLoading ? 'Logging in...' : 'Log in'}
						</button>

						<Link href={'/registration'}>
							<p className='text-[#3B82F6] text-center'>Forgot password?</p>
						</Link>
					</form>

					<div className='mt-6 border-t pt-4 text-center'>
						<p className='text-sm'>
							Don't have an account?{' '}
							<Link
								href='/registration'
								className='text-blue-500 font-semibold'
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
