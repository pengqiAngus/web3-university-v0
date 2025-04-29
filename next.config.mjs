// next.config.js
import { codeInspectorPlugin } from "code-inspector-plugin";

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
