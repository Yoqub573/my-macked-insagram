'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';

const AccountBlock = () => {

  const {t} = useTranslation()

  return (
    <>

    <div className='w-[78%] m-auto p-[8px] mt-[5%]'>
    <div className='flex items-center gap-[7px]'>
      <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
      <h2 className='font-bold text-[20px]'>{t("words.skritiy akaunt")}</h2>
    </div>


    <p className='text-center mt-[150px] text-gray-600'>{t("words.net skritix polzovateley")}</p>

    </div>

    </>
  )
}

export default AccountBlock