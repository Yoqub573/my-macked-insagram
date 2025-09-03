"use client";
import React from 'react'

const Corol = () => {
  return (
     <div className="p-6 flex flex-col items-center">
      <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
        <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
          <span className="text-5xl text-pink-500">!</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6">Нет платных подписок</h2>
      <p className="text-gray-500 mt-1 text-center">
        В настоящее время у вас нет активных платных подписок.
      </p>

      <div className="w-full border-t my-8"></div>

      <div className="w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-4">Настройки</h3>
        <div className="flex items-center justify-between py-4 border-b cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <span className="text-base">Помощь и поддержка</span>
          </div>
          <span className="text-gray-400 text-xl">›</span>
        </div>
      </div>
    </div>
  )
}

export default Corol