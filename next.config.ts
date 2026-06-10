import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "happy-wife";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? `/${repositoryName}` : "",
  assetPrefix: isGithubPages ? `/${repositoryName}/` : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
