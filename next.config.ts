import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "happy-wife";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : {}),
  basePath: isGithubPages ? `/${repositoryName}` : "",
  assetPrefix: isGithubPages ? `/${repositoryName}/` : undefined,
  images: {
    unoptimized: isGithubPages,
  },
};

export default nextConfig;
