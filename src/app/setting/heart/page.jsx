import { Switch } from '@mui/material'
import { Link } from 'lucide-react'
import React from 'react'

const Heart = () => {
  return (
    <div className='p-[50px] px-[70px]'>
      <p className='font-bold text-2xl'>Число отметок "Нравится" и репостов</p>
      <div className='flex justify-between mt-[40px]'>
        <p>Скрывать число отметок "Нравится" и поделившихся</p>
        <Switch />
      </div>
      <p className='text-gray-700 text-[13px] mt-[20px]'>В Instagram будет скрыто число отметок "Нравится" в публикациях и видео Reels от других аккаунтов. Вы можете скрыть число отметок "Нравится" для своих публикаций и видео Reels в разделе "Расширенные настройки", перед тем как поделиться.</p>
      <p className='text-gray-700 text-[13px] mt-[20px]'>В Threads число отметок "Нравится", просмотров, репостов и цитирований публикаций, размещенных другими профилями, будет скрыто. Вы можете скрыть эти данные в своих публикациях через меню настроек отдельной публикации. <span className='text-blue-500'>Подробнее</span> </p>
    </div>
  )
}

export default Heart