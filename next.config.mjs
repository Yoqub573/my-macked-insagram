//next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "tj"], // List of supported locales
    defaultLocale: "en", // Default locale
    localeDetection: false, // Automatically detect user language
  },
   images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '37.27.29.18',
        port: '8003',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
