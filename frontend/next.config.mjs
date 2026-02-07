/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
        {
          source: '/socket.io/:path*',
          destination: 'http://localhost:3001/socket.io/:path*',
        },
      ],
    }
  },
}

export default nextConfig
