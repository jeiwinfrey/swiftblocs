/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['wglxywihelsohcslqwzb.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wglxywihelsohcslqwzb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
