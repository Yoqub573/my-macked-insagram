import React from 'react'

const RestrictedAccount = () => {
  return (
    <div className='p-[50px]'>
      <p className='font-bold text-2xl'>Аккаунты с ограничениями</p>
      <p className='text-gray-600 mt-[30px]'>Оградите себя от нежелательного внимания, не блокируя ваших знакомых и не отменяя подписку на них. Перейдя в их профиль, вы можете установить для них ограничения. Подробнее об этой функции</p>
      <p className='mt-[150px] text-gray-700 text-center'>Нет аккаунтов, которым вы ограничили доступ.</p>
    </div>
  )
}

export default RestrictedAccount