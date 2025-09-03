import React from 'react'
import savedIcon from '@/assets/img/pages/profile/profile/image_79-removebg-preview.png'
import Image from 'next/image'
import PostModal from '@/components/pages/profile/profile/postModal/postModal'

const Tagged = () => {
	return (
		<div className='flex flex-col gap-[10px] text-center items-center pt-[7vh] m-auto pb-[11vh]'>
			<Image src={savedIcon} alt='savedIcon' />
			<h1 className='text-[#1E293B] text-[18px] font-bold'>
				You have not tagged
			</h1>
			<p className='text-[#64748B]'>
				Here show the photos and videos in which you have been tagged
			</p>
		</div>
	)
}

export default Tagged
