'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { portfolio } from '../data/content';

const filters = ['ALL', 'INFLUENCER', 'FASHION', 'BRAND', 'PRODUCT LAUNCH', 'CORPORATE', 'CELEBRITY', 'WEDDING'];

export function EventsPortfolio() {
  const [active, setActive] = useState('ALL');
  const [selected, setSelected] = useState<(typeof portfolio)[number] | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('category')?.toUpperCase();
    if (initial && filters.includes(initial)) setActive(initial);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = useMemo(() => active === 'ALL' ? portfolio : portfolio.filter((item) => item.category === active), [active]);
  const setFilter = (filter: string) => {
    setActive(filter);
    const url = new URL(window.location.href);
    if (filter === 'ALL') url.searchParams.delete('category');
    else url.searchParams.set('category', filter.toLowerCase());
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  return <>
    <div className="events-scroll-progress" style={{ width: `${progress}%` }} />
    <section className="events-portfolio section"><div className="container">
      <div className="events-portfolio-heading"><div><p className="eyebrow">THE EXPERIENCE LIBRARY</p><h2 className="display">Every event has<br /><em>its own rhythm.</em></h2></div><p>From first concept to final applause, explore the energy, craft and atmosphere behind the work.</p></div>
      <div className="events-filter-wrap" role="tablist" aria-label="Filter events">{filters.map((filter) => <button key={filter} role="tab" aria-selected={active === filter} className={active === filter ? 'active' : ''} onClick={() => setFilter(filter)}>{filter === 'ALL' ? 'All' : filter.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}<span>{filter === 'ALL' ? portfolio.length : portfolio.filter((item) => item.category === filter).length}</span></button>)}</div>
    {visible.length ? <div className="events-card-grid" key={active}>{visible.map((item, index) => <button className={`events-card events-card-${index + 1}`} key={item.title} onClick={() => setSelected(item)}><div className="events-card-image"><Image src={item.image} alt={`${item.title} - ${item.category} event`} fill sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 560px" /><span className="events-card-chip">{item.category}</span><div className="events-card-overlay"><span>View Event</span><ArrowUpRight size={17} /></div></div><div className="events-card-info"><div><h3>{item.title}</h3><p>{item.type} <i>·</i> {item.location}</p></div><ArrowUpRight className="events-card-arrow" size={20} /></div></button>)}</div> : <div className="events-empty"><p className="eyebrow">NO EVENTS YET</p><h3 className="display">A new story is<br /><em>on its way.</em></h3><Link href="/contact" className="btn btn-gold">Plan your event <ArrowUpRight size={16} /></Link></div>}
    </div></section>
    {selected && <div className="event-modal" role="dialog" aria-modal="true" aria-label={`${selected.title} event details`} onClick={() => setSelected(null)}><div className="event-modal-card" onClick={(event) => event.stopPropagation()}><button className="event-modal-close" onClick={() => setSelected(null)} aria-label="Close event details"><X size={22} /></button><div className="event-modal-image"><Image src={selected.image} alt={selected.title} fill sizes="90vw" /></div><div className="event-modal-copy"><p className="eyebrow">{selected.category} · {selected.year}</p><h2 className="display">{selected.title}</h2><p>{selected.type} in {selected.location}, crafted with creative direction, production and precise execution.</p><Link href="/contact" className="btn btn-gold">Plan a similar event <ArrowUpRight size={16} /></Link></div></div></div>}
    {showTop && <button className="events-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUpRight size={17} /></button>}
  </>;
}
