/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.scdn.co",
      "mosaic.scdn.co",
      "platform-lookaside.fbsbx.com",
      "platform-lookaside.fbsbx.com",
      "scontent.ftpe8-4.fna.fbcdn.net",
      "scontent.ftpe8-1.fna.fbcdn.net",
      "scontent.ftpe8-2.fna.fbcdn.net",
      "scontent.ftpe8-3.fna.fbcdn.net",
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
