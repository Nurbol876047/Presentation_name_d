import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  transpilePackages: ["three"],
  // the home directory above this project also has a package-lock.json —
  // pin the workspace root so Next/Turbopack does not pick it up
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
