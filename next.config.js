/** @type {import('next').NextConfig} */
const nextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xrmidimages.s3.eu-north-1.amazonaws.com",

      },
    ],
  },
};

module.exports = nextConfig;
