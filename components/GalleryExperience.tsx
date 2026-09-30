'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { gallery } from '../data/content';

const categories = ['ALL', 'FASHION', 'PRODUCT LAUNCH', 'INFLUENCER', 'CORPORATE', 'CELEBRITY', 'WEDDING'];
const serviceLinks: Record<string, string> = { FASHION: '/services/fashion-show', 'PRODUCT LAUNCH': '/services/product-launches', INFLUENCER: '/services/influencer-shoot', CORPORATE: '/services/corporate-events', CELEBRITY: '/services/celebrity-management', WEDDING: '/services/wedding-planning' };

export function GalleryExperience() {
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState<number | null>(null);
  const visible = useMemo(() => filter === 'ALL' ? gallery : gallery.filter((item) => item.category === filter), [filter]);
  const activeIndex = selected === null ? -1 : visible.findIndex((item) => item.id === selected);
  const activeItem = activeIndex >= 0 ? visible[activeIndex] : null;

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected(visible[(activeIndex + 1) % visible.length]?.id ?? null);
      if (event.key === 'ArrowLeft') setSelected(visible[(activeIndex - 1 + visible.length) % visible.length]?.id ?? null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [activeItem, activeIndex, visible]);

  return <section className="gallery-experience section"><div className="container">
    <div className="gallery-heading"><div><p className="eyebrow">CAPTURED MOMENTS</p><h2 className="display">A glimpse of<br /><em>the atmosphere.</em></h2></div><p>Light, movement and the details that turn an event into a memory.</p></div>
    <div className="gallery-filters" role="tablist" aria-label="Gallery categories">{categories.map((category) => <button key={category} role="tab" aria-selected={filter === category} className={filter === category ? 'active' : ''} onClick={() => { setFilter(category); setSelected(null); }}>{category === 'ALL' ? 'All' : category.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}</button>)}</div>
    {visible.length ? <div className="gallery-mosaic" key={filter}>{visible.map((item, index) => <div className={`gallery-tile gallery-tile-${index + 1}`} key={item.id} role="button" tabIndex={0} onClick={() => setSelected(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(item.id); }} aria-label={`Open ${item.title}, ${item.category}`}><Image src={item.image} alt={`${item.title} - ${item.category}`} fill sizes="(max-width:700px) 92vw, (max-width:1024px) 50vw, 33vw" loading={index > 2 ? 'lazy' : undefined} /><span className="gallery-tile-shade" /><span className="gallery-tile-label">{item.category} <ArrowUpRight size={14} /></span><span className="gallery-tile-caption">{item.title}</span>{serviceLinks[item.category] && <Link className="gallery-tile-service-link" href={serviceLinks[item.category]} onClick={(event) => event.stopPropagation()}>View service <ArrowUpRight size={13} /></Link>}</div>)}</div> : <div className="gallery-empty"><p className="eyebrow">NOTHING HERE YET</p><h3 className="display">A new moment is<br /><em>being captured.</em></h3><button className="btn btn-dark" onClick={() => setFilter('ALL')}>View all moments</button></div>}
  </div>
  {activeItem && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${activeItem.title} gallery image`} onClick={() => setSelected(null)}><div className="gallery-lightbox-card" onClick={(event) => event.stopPropagation()}><button className="gallery-lightbox-close" onClick={() => setSelected(null)} aria-label="Close image"><X size={22} /></button><button className="gallery-lightbox-prev" onClick={() => setSelected(visible[(activeIndex - 1 + visible.length) % visible.length].id)} aria-label="Previous image"><ArrowLeft size={22} /></button><div className="gallery-lightbox-image"><Image src={activeItem.image} alt={activeItem.title} fill sizes="90vw" /></div><button className="gallery-lightbox-next" onClick={() => setSelected(visible[(activeIndex + 1) % visible.length].id)} aria-label="Next image"><ArrowRight size={22} /></button><div className="gallery-lightbox-copy"><p className="eyebrow">{activeItem.category}</p><h3>{activeItem.title}</h3><p>{activeItem.type} · {activeItem.location} · {activeItem.year}</p><Link href="/contact" className="text-link">Plan a similar event <ArrowUpRight size={15} /></Link></div></div></div>}
  </section>;
}
