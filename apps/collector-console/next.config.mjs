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
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
