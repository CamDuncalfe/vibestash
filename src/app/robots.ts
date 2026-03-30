import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth', '/review', '/api'],
      },
    ],
    sitemap: 'https://vibestash.fun/sitemap.xml',
  };
}
