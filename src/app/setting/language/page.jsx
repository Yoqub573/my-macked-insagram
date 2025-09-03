"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const languages = [
    { code: "ru", label: t('setting.russian') },
    { code: "tj", label: t('setting.tajik') },
    { code: "en", label: t('setting.english') },
  ];

  const [search, setSearch] = useState("");

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-10 max-w-md mx-auto p-6 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-2">{t('setting.lang')}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {t('setting.text')}
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск"
        className="w-full px-4 py-2 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-3">
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border hover:bg-gray-50 transition ${
                i18n.language === lang.code
                  ? "border-blue-500 text-blue-600 font-medium"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                  ✓
                </span>
              )}
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-center">Язык не найден</p>
        )}
      </div>
    </div>
  );
};

export default Language;
