import { usegetUserStore } from '@/store/pages/search/store'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import defaultUser from '@/assets/img/pages/profile/profile/instauser (2).jpg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const Suggetions = () => {
    let { users, getUsers } = usegetUserStore()
    let randomUsers = users?.data?.slice(0, 12)
    let router = useRouter()
    let { t } = useTranslation()

    const containerRef = useRef(null)
    let width = 320

    const scrollRight = () => {
        containerRef.current.scrollBy({ left: width, behavior: 'smooth' });
    }

    const scrollLeft = () => {
        containerRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    }

    useEffect(() => { getUsers() }, [])

    return (
        <section className="mt-15">
            <div className="flex mb-5 justify-between">
                <h3 className="font-semibold">{t('profileById.Suggested')}</h3>
                <button className="text-[#4262ff]">{t('profileById.See')}</button>
            </div>
            <div className="flex items-center gap-5">
                <button onClick={scrollLeft}><ArrowLeft /></button>
                <div ref={containerRef} className="flex items-stretch gap-2.5 mb-10 overscroll-x-none overflow-x-scroll hide-scrollbar">
                    {randomUsers?.map(e => (
                        <div key={e.id}>
                            <div onClick={() => router.push(`/${e.id}`)} className='flex rounded-t text-center h-[165px] w-[175px] border-1 border-gray-300 flex-col items-center hover:bg-[#eeeeee] p-3'>
                                {e.avatar == '' ? <Image alt='image' src={defaultUser} className="rounded-full w-[74px] object-cover h-[74px]" width={74} height={74} /> : <Image src={`http://37.27.29.18:8003/images/${e.avatar}`} width={74} height={74} className="rounded-full w-[74px] object-cover h-[74px]" alt="avatar" />}
                                <p className="font-semibold">{e.userName}</p>
                                <p className='text-[14px]'>{e.fullName}</p>
                            </div>
                            <div className="border-1 border-gray-300 rounded-b border-t-0 flex justify-center p-3">
                                <button>{t('profileById.follow')}</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={scrollRight}><ArrowRight /></button>
            </div>
        </section>
    )
}

export default Suggetions