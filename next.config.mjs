/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
    images: {
        domains: [
            'db-satnogs.freetls.fastly.net'
        ]
    }
};

export default nextConfig;
