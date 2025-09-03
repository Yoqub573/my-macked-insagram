'use client'
import React from 'react'
import { useTranslation } from 'react-i18next';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';


const Comment = () => {
  const {t} = useTranslation()

  
  const [selectedValue, setSelectedValue] = React.useState('a');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const [checked1, setChecked1] = React.useState(true);

  const handleChange1 = (event) => {
    setChecked1(event.target.checked);
  };


  return (
    <>

    <div className='w-[77%] mt-[5%]  p-[10px] m-auto flex flex-col items-start gap-[35px]'>
    <h1 className='font-bold text-[20px]'>{t("commentsSettings.comentSetings")}</h1>
    <div className='flex flex-col items-start gap-[15px]'>
      <span className='font-[500]'>{t("commentsSettings.saveComents")}</span>
      <div>
        <button><Radio {...controlProps('c')}sx={{'& .MuiSvgIcon-root': {fontSize: 28,},}}/></button>
        <span className='font-[500]'>{t("commentsSettings.my followers")}</span>
      </div>
      <div>
        <button><Radio {...controlProps('d')}sx={{'& .MuiSvgIcon-root': {fontSize: 28,},}}/></button>
        <span className='font-[500]'>{t("commentsSettings.vzaimnie followers")}</span>
      </div>
      <div>
        <button><Radio {...controlProps('q')}sx={{'& .MuiSvgIcon-root': {fontSize: 28,},}}/></button>
        <span className='font-[500]'>{t("commentsSettings.vikl")}</span>
      </div>
      <div className='flex items-center justify-between w-[100%]'>
        <span>{t("commentsSettings.save coments gif")}</span>
        <button><Switch
      checked={checked1}
      onChange={handleChange1}
      slotProps={{ input: { 'aria-label': 'controlled' } }}
    /></button>
      </div>
      <div>
        <span>{t("commentsSettings.people saved coments is gif")}</span>
      </div>
    </div>
    </div>


    </>
  )
}

export default Comment