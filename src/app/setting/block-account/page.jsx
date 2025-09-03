'use client'
import React, { useState } from 'react';
import { Switch } from 'antd';

const AccountBlock = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-6 font-sans">
      <h2 className="text-xl font-bold mb-4">Конфиденциальность аккаунта</h2>

      <div
        className={`flex items-center justify-between p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
          isPrivate
            ? 'border border-blue-500 bg-blue-50 hover:bg-blue-100'
            : 'border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => setIsPrivate(!isPrivate)}
      >
        <span className="text-base font-medium">Закрытый аккаунт</span>
        <Switch
          checked={isPrivate}
          onChange={setIsPrivate}
          size="default"
          className="bg-gray-300"
        />
      </div>

      <div className="mt-6 text-sm text-gray-600 space-y-3 leading-relaxed">
        <p>
          Если у вас общедоступный аккаунт, ваш профиль и публикации видны всем пользователям в сети Instagram и вне ее, даже если у них нет аккаунта Instagram.
        </p>
        <p>
          Если у вас закрытый аккаунт, только одобренные вами подписчики будут видеть ваши публикации, в том числе фото и видео на страницах хэштегов и мест, а также список ваших подписчиков и подписок. Определенная информация в вашем профиле, например фото профиля и имя пользователя, видна всем в сети Instagram и вне ее.{' '}
          <a href="#" className="text-blue-500 hover:underline">Подробнее</a>
        </p>
      </div>
    </div>
  );
};

export default AccountBlock;
