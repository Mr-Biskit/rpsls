/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    HASHER_ADDRESS: process.env.HASHER_ADDRESS,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
  },
};
