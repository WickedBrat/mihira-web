import type { MetadataRoute } from 'next';

const siteUrl = 'https://getmihira.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date('2026-04-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date('2026-04-28'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
