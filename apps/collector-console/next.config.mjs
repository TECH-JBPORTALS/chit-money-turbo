/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cmt/ui", "@cmt/api", "@cmt/validators", "@cmt/db"],
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
