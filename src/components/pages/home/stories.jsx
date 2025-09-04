'use client'

import React from 'react'
import { useMyProfile } from '@/store/pages/chat/layout/store'
import { useChatById } from '@/store/pages/chat/pages/chat-by-id/store'
import { useDefaultChat } from '@/store/pages/chat/pages/default-chat/store'
import { useHome } from '@/store/pages/home/store'
import { Heart, SendHorizonal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Stories from 'react-insta-stories'
import 'swiper/css'
import 'swiper/css/effect-cube'
import { EffectCube } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import endImage from '../../../assets/img/pages/home/image 75.svg'
import userIMG from '../../../assets/img/pages/home/userDefault.png'

function SeeMoreInline({ userId, storId, onSend, liked, onToggleLike }) {
  const [value, setValue] = useState('')

  return (
    <div
      className="p-2 flex relative top-[545px] gap-2 rounded-md shadow-md w-[95%] m-auto"
      style={{ pointerEvents: 'auto', zIndex: 9999 }}
    >
      <form
        onSubmit={async e => {
          e.preventDefault()
          if (!value.trim()) return
          await onSend(userId, value.trim())
          setValue('')
        }}
        className="flex border w-[100%] rounded-full px-[10px] text-white border-white items-center gap-3"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="py-[4px] placeholder:text-white outline-none text-sm w-[94%] bg-transparent"
          style={{ pointerEvents: 'auto' }}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit" className="text-white">
          <SendHorizonal />
        </button>
      </form>

      <button
        onClick={onToggleLike}
        className="flex flex-col gap-2 items-center justify-center cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <Heart
          size={24}
          className={liked ? 'text-red-500' : 'text-white'}
          style={{ fill: liked ? 'currentColor' : 'none' }}
        />
      </button>
    </div>
  )
}
function SwiperStories({ indexUser = 0 }) {
  const { data, LikeStory } = useHome()
  const [paused, setPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [activeIndex, setActiveIndex] = useState(indexUser)
  const swiperRef = useRef(null)
  let [theme, setTheme] = useState(typeof window !== 'undefined' ? localStorage.getItem('theme') : '')
  const { get } = useDefaultChat()
  const { createChat } = useMyProfile()
  const { sendMessage } = useChatById()

  const [likedMap, setLikedMap] = useState({})

  useEffect(() => {
    const handleStorageChange = event => {
      if (event.key === 'theme') setTheme(event.newValue)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (!data) return
    const initial = {}
    data.forEach(user => {
      user.stories?.forEach(stor => {
        if (stor?.id != null) {
          initial[stor.id] = Boolean(stor.likeCount && stor.likeCount > 0)
        }
      })
    })
    setLikedMap(prev => ({ ...initial, ...prev }))
  }, [])

  async function handleCreateChat(id, textMessage) {
    try {
      await createChat(id)
      await get()

      const chat = useDefaultChat
        .getState()
        .chats?.data?.find(e => e.receiveUserId === id || e.sendUserId === id)
 
      if (chat?.chatId) {
        if (textMessage) {
          const formData = new FormData()
          formData.append('chatId', chat.chatId)
          formData.append('MessageText', textMessage)

          toast.success('Отправлено')
          await sendMessage(formData)
        }
      } else {
        toast.error('Chat not found for this user')
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const toggleLike = async storId => {
    setLikedMap(prev => {
      const cur = !!prev[storId]
      return { ...prev, [storId]: !cur }
    })

    try {
      await LikeStory(storId)
    } catch (err) {
      console.error('LikeStory error', err)
      setLikedMap(prev => ({ ...prev, [storId]: !prev[storId] }))
    }
  }

  const storiesData = useMemo(() => {
    if (!data) return []

    return data
      .filter(e => e?.stories?.length > 0)
      .map((user,i) => ({
        userName: user.userName,
        stories: user?.stories?.map((stor) => {
          const isVideo = stor.fileName?.endsWith('.mp4')
          return {
            url: `http://37.27.29.18:8003/images/${stor.fileName}`,
            type: isVideo ? 'video' : 'image',
            muted: isVideo ? isMuted : undefined,
            duration: isVideo ? 0 : 4000,
            header: {
              heading: user.userName,
              profileImage: user.userImage ? `http://37.27.29.18:8003/images/${user.userImage}` : userIMG.src,
            },
            seeMore: i !== 0
						? () => (
              <SeeMoreInline
                userId={user.userId}
                storId={stor.id}
                onSend={handleCreateChat}
                liked={!!likedMap[stor.id]}
                onToggleLike={() => toggleLike(stor.id)}
              />
            ) : undefined
          }
        }),
      }))
  }, [data, isMuted, likedMap]) 

  if (!storiesData.length) return null

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(indexUser)
      setActiveIndex(indexUser)
    }
  }, [indexUser])

  return (
    <div className="w-full h-[600px] flex justify-center items-center relative">
      <Swiper
        effect="cube"
        cubeEffect={{ shadow: false, slideShadows: false }}
        modules={[EffectCube]}
        onSwiper={swiper => (swiperRef.current = swiper)}
        onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
        allowTouchMove={false}
        className="w-[320px] h-[600px] rounded-2xl overflow-hidden shadow-lg"
      >
        {storiesData.map((user, index) => (
          <SwiperSlide key={index}>
            {activeIndex === index ? (
              <Stories
                stories={user.stories}
                width={320}
                height={600}
                loop={false}
                isPaused={paused}
                storyContainerStyles={{ pointerEvents: 'auto' }}
                onAllStoriesEnd={() => {
                  setTimeout(() => {
                    swiperRef.current?.slideTo(index + 1)
                  }, 0)
                }}
              />
            ) : (
              <div className="w-[320px] h-[600px] bg-black" />
            )}
          </SwiperSlide>
        ))}

        <SwiperSlide
          key={storiesData.length + 1}
          className="bg-white shadow-2xl shadow-white w-full text-center py-[50%] gap-[8px] h-auto flex flex-col justify-center items-center"
        >
          <Image alt="w" src={endImage} className="m-auto" />
          <div className="text-center w-full">
            <p className="text-[16px] font-[500]">You're all caught up</p>
            <p className="text-[12px] font-[400]">You've seen all new posts from the past 3 days.</p>
          </div>
          <Link href={'/'} className="text-[#3B82F6] hover:underline text-[14px] font-[500]">
            View older posts
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
export default React.memo(SwiperStories)