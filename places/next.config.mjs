/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 31536000,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.vercel.com',
                port: '',
                pathname: '**',
            }
        ]
    },
};

export default nextConfig;
