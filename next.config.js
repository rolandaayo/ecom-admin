/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://ecom-admin-backend.vercel.app/api/products/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
