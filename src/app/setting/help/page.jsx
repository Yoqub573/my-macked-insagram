"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'

const Help = () => {
 
    let {t}=useTranslation()
  return (
    <div className='w-[90%] mx-auto'>
      <p className='flex gap-[20px] font-black text-3xl items-center my-[30px]'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        <span> {t("Help.1")}</span>
       
      </p>
      <div className='grid gap-[10px] font-bold text-2xl mt-[50px]'>
        <div>
          <button className='flex border border-gray-700 p-[15px] rounded justify-between w-full hover:bg-gray-200'>{t("Help.2")}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div>

          <button className='flex border border-gray-700 p-[15px] rounded justify-between w-full hover:bg-gray-200'>{t("Help.3")}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div>

          <button className='flex border border-gray-700 p-[15px] rounded justify-between w-full hover:bg-gray-200'>{t("Help.4")}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div>

          <button className='flex border border-gray-700 p-[15px] rounded justify-between w-full hover:bg-gray-200'>{t("Help.5")}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Help