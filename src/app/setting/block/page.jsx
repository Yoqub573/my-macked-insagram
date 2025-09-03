"use client"
import React from 'react'
import { useTranslation } from 'react-i18next'

const Block = () => {
  let {t}=useTranslation()
  return (
    <div className='mx-[10px] py-[30px]'>
      <button className='flex gap-[20px] items-center font-medium text-3xl'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        {t("Help.8")}
      </button>
      <p className='text-gray-500 my-[20px] lg:mx-[50px] mx-0'>  {t("Help.9")}</p>
      <div className='flex justify-center items-center py-[100px] text-gray-500'>
        <p>  {t("Help.10")}</p>
      </div>
    </div>
  )
}

export default Block