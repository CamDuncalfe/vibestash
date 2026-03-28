import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/review/'],
      },
    ],
    sitemap: 'https://vibestash.fun/sitemap.xml',
  };
}
