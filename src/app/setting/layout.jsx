'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import metaa from '../../assets/img/pages/auth/registration/metaa.png'
import { ALargeSmall, ArrowDownToLine, AtSign, Baby, BadgeCheck, Ban, Bell, BellOff, BookText, CircleOff, CircleStar, CircleUserRound, Crown, HeartOff, Languages, LifeBuoy, Lock, Menu, MessageCircleDashed, MessageCircleReply, Repeat, ShieldCheck, ShieldPlus, SquareChartGantt, SquarePlay, User, UserRound, Users, UserX, Wallet, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import useDarkSide from '@/hook/useDarkSide'

const LayoutSet = ({ children }) => {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useDarkSide()

    return (
        <div className="flex flex-col md:flex-row  lg:gap-[10px]">

            <div className={`
                fixed top-0 left-0 h-[80vh] z-20 transition-transform duration-300 
                md:relative md:h-screen md:translate-x-0
                ${open ? "translate-x-0" : "-translate-x-full"} 
                md:w-[320px] lg:w-[400px] w-full p-[20px] overflow-y-auto scroll-smooth hidscrol
            `}>

                <div className="flex justify-end md:hidden mb-4">
                    <button onClick={() => setOpen(false)} className="p-2">
                        <X size={24} />
                    </button>
                </div>

                <p className='font-semibold text-[22px]'>{t('setting.settings')}</p>
                <div className='p-4 w-full md:w-[300px] mt-[20px] shadow-xl rounded-xl font-sans transition-transform duration-300 ease-in-out hover:scale-101'>
                    <Image
                        className="w-[100px] h-[110px] transition-transform duration-300 ease-in-out hover:scale-105"
                        src={metaa}
                        alt="meta"
                    />
                    <h2 className="text-lg font-semibold mb-3">{t('setting.center')}</h2>
                    <p className="text-sm text-gray-600 leading-snug">
                        {t('setting.desc')}
                    </p>

                    <div className="mt-[20px]">
                        <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                            <User />
                            <span className="text-base">{t('setting.lich')}</span>
                        </div>
                        <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                            <ShieldCheck />
                            <span className="text-base">{t('setting.pass')}</span>
                        </div>
                        <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                            <BookText />
                            <span className="text-base">{t('setting.news')}</span>
                        </div>
                    </div>

                    <a
                        href="https://accountscenter.instagram.com/?entry_point=app_settings"
                        className="block mt-6 text-sm text-[#0095f6] hover:underline"
                    >
                        {t('setting.silka')}
                    </a>
                </div>

                <p className='font-semibold text-[15px] text-gray-600 w-[300px] mt-[30px]'>{t('setting.insta')}</p>
                <Link href={'/setting/pro'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-4 rounded-md mt-[20px] transition-colors duration-300 ${pathname === "/setting/pro" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <CircleUserRound />
                        <p>{t('setting.profile')}</p>
                    </div>
                </Link>
                <Link href={'/setting/likes'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-4 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/likes" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Bell />
                        <p>{t('setting.notification')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>{t('setting.content')}</p>
                <Link href={'/setting/block-account'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/block-account" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Lock />
                        <p className='w-[100px]'>{t('setting.acc')}</p>
                    </div>
                </Link>
                <Link href={'/setting/blizki'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/blizki" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <CircleStar />
                        <p>{t('setting.lizki')}</p>
                    </div>
                </Link>
                <Link href={'/setting/block'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/block" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Ban />
                        <p>{t('setting.blocked')}</p>
                    </div>
                </Link>
                <Link href={'/setting/story'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/story" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <CircleOff />
                        <p>{t('setting.skrit')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>{t('setting.vami')}</p>
                <Link href={'/chats'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/message" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <MessageCircleReply />
                        <p className='w-[200px]'>{t('setting.soob')}</p>
                    </div>
                </Link>
                <Link href={'/setting/upr'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/upr" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <AtSign />
                        <p>{t('setting.metki')}</p>
                    </div>
                </Link>
                <Link href={'/setting/comment'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/comment" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <MessageCircleDashed />
                        <p>{t('setting.comment')}</p>
                    </div>
                </Link>
                <Link href={'/setting/repost'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/repost" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Repeat />
                        <p className='w-[200px]'>{t('setting.repost')}</p>
                    </div>
                </Link>
                <Link href={'/setting/RestrictedAccount'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/RestrictedAccount" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <UserX />
                        <p>{t('setting.ogr')}</p>
                    </div>
                </Link>
                <Link href={'/setting/words'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/words" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <ALargeSmall />
                        <p>{t('setting.slova')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>{t('setting.vidite')}</p>
                <Link href={'/setting/accountes-block'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/accountes-block" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <BellOff />
                        <p>{t('setting.accskrit')}</p>
                    </div>
                </Link>
                <Link href={'/setting/setContent'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/setContent" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <SquarePlay />
                        <p>{t('setting.nastoyka')}</p>
                    </div>
                </Link>
                <Link href={'/setting/heart'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/heart" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <HeartOff />
                        <p className='w-[200px]'>{t('setting.nravista')}</p>
                    </div>
                </Link>
                <Link href={'/setting/corol'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/corol" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Crown />
                        <p>{t('setting.platni')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>{t('setting.vawe')}</p>
                <Link href={'/setting/download'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/download" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <ArrowDownToLine />
                        <p className='w-[200px]'>{t('setting.arxiv')}</p>
                    </div>
                </Link>
                <Link href={'/setting/baby'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/baby" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Baby />
                        <p>{t('setting.spet')}</p>
                    </div>
                </Link>
                <Link href={'/setting/language'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/language" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Languages />
                        <p>{t('setting.yazik')}</p>
                    </div>
                </Link>
                <Link href={'/setting/sayt'}>
                    <div className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/sayt" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Wallet />
                        <p>{t('setting.sayt')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Семьям</p>
                <Link href={'/setting/family'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/family" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <Users />
                        <p>{t('setting.semya')}</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Для профессиональных аккаунтов</p>
                <Link href={'/setting/accountType'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/accountType" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <SquareChartGantt />
                        <p>Тип аккаунта и <br /> инструменты</p>
                    </div>
                </Link>
                <Link href={'/setting/show'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/show" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <BadgeCheck />
                        <p>Покажите, что ваш <br /> профиль подтвержден</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Информация и поддержка</p>
                <Link href={'/setting/help'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300 ${pathname === "/setting/help" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <LifeBuoy />
                        <p>Помощь</p>
                    </div>
                </Link>
                <Link href={'/setting/center'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/center" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <ShieldPlus />
                        <p>Центр <br /> конфиденциальности</p>
                    </div>
                </Link>
                <Link href={'/setting/statusAccount'}>
                    <div onClick={() => setOpen(false)} className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300 ${pathname === "/setting/statusAccount" ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                        <UserRound />
                        <p>Статус аккаунта</p>
                    </div>
                </Link>

            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-30 z-10 md:hidden"
                    onClick={() => setOpen(false)}
                ></div>
            )}


            <div className="md:hidden fixed top-0 p-2 bg-white w-full left-4 z-50">
                <button onClick={() => setOpen(true)}>
                    <Menu size={28} />
                </button>
            </div>

            <div className="w-full md:flex-1 lg:w-[1000px] overflow-auto">
                {children}
            </div>
        </div>
    )
}

export default LayoutSet
