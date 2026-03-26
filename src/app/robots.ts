import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/account/', '/checkout/'],
        },
        sitemap: 'https://simplifytech.eu/sitemap.xml',
    };
}
