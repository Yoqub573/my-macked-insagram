'use client'
import { Switch } from 'antd';
import React, { useState } from 'react'

const Repost = () => {
  const [isPrivates, setIsPrivates] = useState(false);
  const [isPrivated, setIsPrivated] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  return (
    <div className='p-[30px]'>
      <p className='font-bold text-2xl'>Репосты и повторное использование</p>
      <p className='font-bold text-lg mt-[30px]'>Разрешите людям делиться вашим контентом</p>

      <div className='border border-gray-400 mt-[30px] rounded-lg p-[20px]'>
        <div className='flex justify-between p-[20px]'>
          <p>Размещать публикации и видео Reels в историях</p>
          <Switch
            checked={isPrivates}
            onChange={setIsPrivates}
            size="default"
            className="bg-gray-300"
          />
        </div>
        <div className='flex justify-between p-[20px]'>
          <p>Истории в сообщениях</p>
          <Switch
            checked={isPrivated}
            onChange={setIsPrivated}
            size="default"
            className="bg-gray-300"
          />
        </div>
        <div className='flex justify-between p-[20px]'>
          <p>Репосты публикаций и видео Reels</p>
          <Switch
            checked={isPrivate}
            onChange={setIsPrivate}
            size="default"
            className="bg-gray-300"
          />
        </div>
      </div>

    </div>
  )
}

export default Repost