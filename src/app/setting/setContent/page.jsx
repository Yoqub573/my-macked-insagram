'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';

const SetContent = () => {

  const {t} = useTranslation()

  return (
    <>

    <div className='w-[78%] m-auto p-[8px] mt-[5%] flex flex-col items-start gap-[23px]'>
    <h2 className='font-bold text-[20px]'>{t("words.nastroyka kontenta")}</h2>
    <span className='text-[17px]'>{t("words.kontent iz akauntov")}</span>
    <span className='border border-r-gray-600 w-[100%] rounded-md px-[30px] py-[18px]'>{t("words.potensialno nepriemlimiy content")}</span>
    </div>

    </>
  )
}

export default SetContent