/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cmt/ui", "@cmt/api"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qlqyyestnd.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default nextConfig;
