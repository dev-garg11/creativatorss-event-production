import { MetadataRoute } from 'next';
import { services } from '../data/services';
import { posts } from '../data/content';
export default function sitemap(): MetadataRoute.Sitemap { const base='https://creativatorss.com'; const routes=['','about','services','events','gallery','blog','contact','privacy-policy','terms'].map(path=>({url:`${base}/${path}`,lastModified:new Date()})); return [...routes,...services.map(s=>({url:`${base}/services/${s.slug}`,lastModified:new Date()})),...posts.map(p=>({url:`${base}/blog/${p.slug}`,lastModified:new Date()}))]; }
