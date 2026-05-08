/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cjdropshipping.com' },
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: '**.aliexpress.com' },
      { protocol: 'https', hostname: 'cbu01.alicdn.com' },
      { protocol: 'https', hostname: 'cf.cjdropshipping.com' },
      { protocol: 'https', hostname: 'oss-cf.cjdropshipping.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: '**.s3.amazonaws.com' },
    ],
  },
}

module.exports = nextConfig