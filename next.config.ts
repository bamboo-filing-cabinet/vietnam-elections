import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isProd = process.env.NODE_ENV === "production";
const repoPath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? repoPath : "",
  assetPrefix: isProd && repoPath ? `${repoPath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? repoPath : "",
  },
  images: { unoptimized: true },
};

export default nextConfig;
