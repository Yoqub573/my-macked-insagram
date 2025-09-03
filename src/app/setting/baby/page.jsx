"use client";

import { useState } from "react";

  const [enabled, setEnabled] = useState(false);

const Baby = () => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Специальные возможности</h2>
    
      <div className="flex items-center justify-between border rounded-2xl px-5 py-4 max-w-xl">
        <span className="text-base">Уменьшить движение</span>

        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <p className="text-gray-500 mt-3 text-sm max-w-xl">
        Уменьшите движение для визуальных эффектов в чатах.
      </p>
    </div>
  )
}

export default Baby