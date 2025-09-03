'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';

const Blizki = () => {

  const {t} = useTranslation()

  return (
    <>

    <div className='w-[83%] m-auto p-[5px]  mt-[5%] flex flex-col items-start gap-[30px]'>
      <div className='flex items-center gap-[20px]'>
        <button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
    <h1 className='font-bold text-[20px]'>{t("blizki.blizki druzya")}</h1>
      </div>
      <div className='flex flex-col items-start gap-[7px]'>
        <span>{t("blizki.konffigure blizki")}</span>
        <span>{t("blizki.kak rabotaet")}</span>
      </div>
      <div className='flex items-center w-[100%] m-auto'>
        <button className='absolute left-[53%]'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg></button>
        <input className='border w-[95%] m-auto px-[55px] py-[8px] rounded-md' type="text" placeholder={t("blizki.search blizki")} />
      </div>
    </div>

    </>
  )
}

export default Blizki