import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.join(__dirname, '..'),
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@core': path.join(__dirname, '../core'),
    };

    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      ...(config.resolve.modules ?? []),
    ];

    return config;
  },
};

export default nextConfig;
