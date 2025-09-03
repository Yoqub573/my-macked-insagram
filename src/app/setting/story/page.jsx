"use client"
import React from 'react'
import { useTranslation } from 'react-i18next'


const Story = () => {
  let { t } = useTranslation()
  return (
    <div className='w-[90%] mx-auto py-[50px]'>
      <p className='font-bold text-3xl mb-[40px]'>{t("Help.11")}</p>
      <button className='border w-full flex justify-between p-[15px] font-bold text-2xl items-center rounded-[10px] hover:bg-gray-300 '>{t("Help.12")}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>

      </button>
    </div>
  )
}

export default Story