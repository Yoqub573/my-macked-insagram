"use client"
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Upr = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className='w-[90%] mx-auto mb-[30px] max-h-[95vh] overflow-y-auto overflow-x-hidden'>
      <p className='font-bold text-2xl my-[20px]'>{t("Help.13")}</p>
      <p className='font-mono text-gray-700 text-[20px]'>{t("Help.14")}</p>
      <p className='text-[15px] text-gray-500'>{t("Help.15")}</p>
      <div className='grid gap-[20px] mt-[50px]'>

      <div className='border p-[10px] rounded-2xl'>
        <FormControl>
          <RadioGroup
            aria-labelledby="controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label={t("Help.16")}
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={t("Help.17")}
            />
            <FormControlLabel
              value="Test"
              control={<Radio />}
              label={t("Help.18")}
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className='border p-[10px] rounded-2xl'>
        <FormControl>
          <RadioGroup
            aria-labelledby="controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="Test1"
              control={<Radio />}
              label={t("Help.19")}
            />

          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <p className='text-gray-700 font-bold text-[20px]'>{t("Help.20")}</p>
        <p className='text-gray-500 text-[15px]'>{t("Help.21")}</p>
        <div className='border p-[10px] rounded-2xl mt-[30px]'>
          <FormControl>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="female1"
                control={<Radio />}
                label={t("Help.22")}
              />
              <FormControlLabel
                value="male2"
                control={<Radio />}
                label={t("Help.23")}
              />
              <FormControlLabel
                value="Test2"
                control={<Radio />}
                label={t("Help.24")}
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Upr
