/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Remove ignoreBuildErrors em produção - todos os erros de tipo devem ser corrigidos
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: '/socket.io/:path*',
          destination: `${socketUrl}/socket.io/:path*`,
        },
      ],
    }
  },
  // Configurações de produção
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
