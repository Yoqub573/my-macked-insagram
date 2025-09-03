'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';

const Words = () => {

  const {t} = useTranslation()

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>

    <div className='w-[78%] m-auto  p-[7px] mb-[5%] mt-[5%] flex flex-col items-start gap-[20px]'>
    <h1 className='font-bold text-[20px]'>{t("words.skritie slova")}</h1>
    <span className='font-[500]'>{t("words.nejelatelniy komentari")}</span>
    <div className='border border-gray-500 rounded-md p-[15px] flex flex-col items-start gap-[30px]'>
    <div className='flex items-center justify-between'>
      <div className='flex flex-col items-start gap-[7px]'>
        <h2 className='text-[17px] font-[600]'>{t("words.skrivat komentari")}</h2>
        <span className='text-gray-600'>{t("words.pravila nomer1")}</span>
      </div>
      <button><Switch checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }}/></button>
    </div>
    <div className='flex items-center justify-between w-[100%]'>
      <div className='flex flex-col items-start gap-[7px]'>
        <h2 className='text-[17px] font-[600]'>{t("words.filtrasia comentari")}</h2>
        <span className='text-gray-600'>{t("words.pravila nomer2")}</span>
      </div>
      <button><Switch checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }}/></button>
    </div>
    <div className='flex items-center'>
      <div className='flex flex-col items-start gap-[7px]'>
        <h2 className='text-[17px] font-[600]'>{t("words.skrit zaprosi")}</h2>
        <span className='text-gray-600'>{t("words.pravila nomer3")}</span>
      </div>
      <button><Switch checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }}/></button>
    </div>
    </div>
    <h1 className='font-bold text-[18px]'>{t("words.opredelenie slova")}</h1>
    {/* <div className='border border-gray-500 rounded-md p-[15px] flex flex-col items-start gap-[30px] w-[100%]'>
    <h2 className='text-[16px] font-[500]'>{t("words.ypravlyat slova")}</h2>
    <div className='flex items-center justify-between w-[100%]'>
      <div className='flex flex-col items-start gap-[7px]'>
        <h2 className='text-[17px] font-[600]'>{t("words.filtrasia comentari")}</h2>
        <span className='text-gray-600'>{t("words.pravila nomer2")}</span>
      </div>
      <button><Switch checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }}/></button>
    </div>
    <div className='flex items-center justify-between w-[100%]'>
      <div className='flex flex-col items-start gap-[7px]'>
        <h2 className='text-[17px] font-[600]'>{t("words.filtrasia comentari")}</h2>
        <span className='text-gray-600'>{t("words.pravila nomer2")}</span>
      </div>
      <button><Switch checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }}/></button>
    </div>
    </div> */}
    </div>


    </>
  )
}

export default React.memo(Words)