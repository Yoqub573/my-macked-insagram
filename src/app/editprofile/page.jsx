'use client'
import useDarkSide from '@/hook/useDarkSide'
import { useProfileStore } from '@/store/pages/profile/profile/store'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import defaultUser from '../../assets/img/pages/profile/profile/instauser (2).jpg'

const Editprofile = () => {
	let {
		user,
		getProfileData,
		deleteProfilePhoto,
		updateProfilePhoto,
		updateProfileData,
	} = useProfileStore()

	let router = useRouter()

	let [aboutInp, setAboutInp] = useState('')
	let [genderInp, setGenderInp] = useState('0')

	useEffect(() => {
		getProfileData().then(() => {
			if (user) {
				setAboutInp(user.about || '')
				setGenderInp(user.gender == 'Male' ? '1' : '0' || '0')
			}
		})
		console.log(user)
	}, [])

	const [open, setOpen] = React.useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const [openEdit, setOpenEdit] = React.useState(false)
	const handleOpenEdit = () => setOpenEdit(true)
	const handleCloseEdit = () => setOpenEdit(false)
	let [photo, setPhoto] = useState(null)

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	}
	async function handleDeletePhoto() {
		try {
			deleteProfilePhoto()
			setOpen(false)
			alert('Photo has been successfuly removed')
			getProfileData()
		} catch (error) {
			alert('couldnt delete profile photo', error)
		}
	}

	async function handleSubmit(e) {
		e.preventDefault()
		if (photo === null) {
			alert('please input image!')
			handleCloseEdit()
			setPhoto(null)
		} else {
			try {
				const formData = new FormData()
				formData.append('imageFile', photo)
				updateProfilePhoto(formData)
				handleCloseEdit()
				alert('Photo successfuly updated')
				getProfileData()
				setPhoto(null)
			} catch (error) {
				alert("Couldn't update photo", error)
			}
		}
	}
	const handleFileChange = e => {
		setPhoto(e.target.files[0])
	}

	async function handleEditProfile(e) {
		e.preventDefault()
		if (aboutInp === '') {
			alert('Please fill out the inputs ')
		} else {
			let updateProfile = {
				about: aboutInp,
				gender: Number(genderInp),
			}
			console.log(updateProfile)
			await updateProfileData(updateProfile)
			router.push('/profile')
			alert('Profile successfuly updated!')
		}
	}

	return (
		<div className='pt-[5vh] h-[100vh] mb-[15vh] md:mb-0'>
			<section className='flex flex-col gap-[3vh] w-[80%] m-auto'>
				<h1 className='text-[#2563EB] font-bold text-[25px]'>
					Profile
					<span className='text-[#1E293B]'>{' > '} Edit profile</span>
				</h1>
				<div className=' rounded-2xl p-[15px] gap-y-[5vh] flex flex-col lg:flex-row items-center justify-between border border-gray-300'>
					<aside className='flex items-center gap-[10px]'>
						<div className='overflow-hidden flex items-center justify-center w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-[50%]'>
							<Image
								src={`http://37.27.29.18:8003/images/${user.image}`}
								alt='profile picture'
								width={500}
								height={500}
								className={`${user.image ? 'flex' : 'hidden'} `}
							/>
							<Image
								src={defaultUser}
								alt='default user'
								className={`${
									user.image ? 'hidden' : 'flex'
								} w-[100px] md:w-[140px] h-[100px] md:h-[140px] rounded-[50%]`}
							/>
						</div>
						<div>
							<div>
								<h1
									className='font-bold text-[#1E293B] text-[22px] w-[110px] 
								overflow-hidden text-ellipsis whitespace-nowrap '
								>
									{user.userName}
								</h1>
							</div>
							<div>
								<p className='font-normal text-[#64748B] text-[20px] w-[100px] overflow-hidden text-ellipsis whitespace-nowrap '>
									{user.firstName}
								</p>
								{user.lastName && (
									<p className='font-normal text-[#64748B] text-[20px]'>
										{user.userName}
									</p>
								)}
							</div>
						</div>
					</aside>
					<aside className='flex gap-[15px] lg:gap-[10px] text-[#FFFFFF]'>
						<button
							className=' rounded-[10px] px-[10px] py-[5px] text-[13px] lg:py-[10px] items-center bg-red-500 active:scale-95 transition-transform duration-100 ease-in'
							style={{ display: user.image ? 'flex' : 'none' }}
							onClick={handleOpen}
						>
							Delete photo
						</button>
						<button
							className=' rounded-[10px] px-[10px] py-[5px] text-[13px] lg:py-[10px] bg-blue-500 active:scale-95 transition-transform duration-100 ease-in'
							onClick={handleOpenEdit}
						>
							Change photo
						</button>
					</aside>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
					>
						<Box sx={style}>
							<h1 className='text-[25px] font-bold'>Are you sure?</h1>
							<p className='pt-[10px]'>
								You agree to proceed and delete your profile photo. You can then
								change profile photo with new photo
							</p>
							<button
								className=' rounded-[10px] px-[10px] md:px-[20px] py-[5px] text-[14px] md:text-[16px] md:py-[10px] bg-red-500 text-[#FFFFFF] mt-[20px] active:scale-95 transition-transform duration-100 ease-in'
								onClick={handleDeletePhoto}
							>
								Yes, delete
							</button>
						</Box>
					</Modal>
					<Modal open={openEdit} onClose={handleCloseEdit}>
						<Box sx={style}>
							<form action='' onSubmit={handleSubmit}>
								<h1 className='text-[25px] font-bold'>Please select file</h1>
								<input
									type='file'
									className='py-[20px]'
									onChange={handleFileChange}
								/>
								<div className='flex gap-[15px]'>
									<button
										className='px-[10px] py-[5px] rounded-[10px] text-[red] border active:scale-95 transition-transform duration-100 ease-in'
										onClick={handleCloseEdit}
									>
										Cancel
									</button>
									<button
										className='px-[10px] py-[5px] rounded-[10px] text-[blue] border active:scale-95 transition-transform duration-100 ease-in'
										type='submit'
									>
										Update
									</button>
								</div>
							</form>
						</Box>
					</Modal>
				</div>
				<div className='flex flex-col gap-[3vh]  '>
					<div className='flex flex-col gap-[2vh] w-[100%]'>
						<label htmlFor='' className='text-[#64748B] text-[20px]'>
							About :
						</label>
						<input
							type='text'
							style={{
								border: '1px solid #E2E8F0',
								borderRadius: '20px',
								height: '60px',
								color: '#64748B',
								padding: '10px',
							}}
							placeholder='Bio'
							value={aboutInp}
							onChange={e => setAboutInp(e.target.value)}
						/>
					</div>
					<div className='flex flex-col gap-[2vh]'>
						<label htmlFor='' className='text-[#64748B] text-[20px]'>
							Gender :
						</label>
						<select
							id=''
							label='Gender'
							style={{
								border: '1px solid #E2E8F0',
								borderRadius: '20px',
								height: '55px',
								color: '#64748B',
								padding: '10px',
							}}
							value={genderInp}
							onChange={e => setGenderInp(e.target.value)}
						>
							<option value='0'>Female</option>
							<option value='1'>Male</option>
						</select>
						<span className='text-[#64748B]'>
							This won’t be part of your public profile.
						</span>
					</div>
					<button
						className='bg-[#64748B] hover:bg-[#214b8e] text-[#FFFFFF] self-baseline px-[7%] py-[10px] rounded-2xl text-[20px] cursor-pointer active:scale-95 transition-transform duration-100 ease-in'
						onClick={handleEditProfile}
					>
						Submit
					</button>
				</div>
			</section>
		</div>
	)
}

export default Editprofile
