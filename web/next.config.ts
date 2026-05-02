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
      '@/features': path.join(__dirname, '../mobile/features'),
      '@/lib/ai': path.join(__dirname, '../mobile/lib/ai'),
      '@/lib/dailyAlignmentTypes': path.join(__dirname, '../mobile/lib/dailyAlignmentTypes.ts'),
      '@/lib/dailyArthReflectionTypes': path.join(__dirname, '../mobile/lib/dailyArthReflectionTypes.ts'),
      '@/lib/vedic': path.join(__dirname, '../mobile/lib/vedic'),
    };

    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      ...(config.resolve.modules ?? []),
    ];

    return config;
  },
};

export default nextConfig;
