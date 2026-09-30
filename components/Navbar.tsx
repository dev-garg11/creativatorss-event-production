'use client';

import Link from 'next/link';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { services } from '../data/services';
import { Logo } from './Logo';

type NavGroup = { name: string; href: string; children?: { name: string; href: string }[] };

const navGroups: NavGroup[] = [
  { name: 'About', href: '/about', children: [{ name: 'Our Story', href: '/about' }, { name: 'Our Approach', href: '/about#approach' }, { name: 'Why Creativatorss', href: '/about#why' }] },
  { name: 'Services', href: '/services', children: services.map(s => ({ name: s.name, href: `/services/${s.slug}` })) },
  { name: 'Events', href: '/events', children: [{ name: 'All Events', href: '/events' }, { name: 'Featured Work', href: '/events#featured' }, { name: 'Start a Project', href: '/contact' }] },
  { name: 'Gallery', href: '/gallery', children: [{ name: 'All Moments', href: '/gallery' }, { name: 'Fashion & Production', href: '/gallery#fashion' }, { name: 'Brand Experiences', href: '/gallery#brand' }] },
  { name: 'Blog', href: '/blog', children: [{ name: 'All Journal', href: '/blog' }, { name: 'Event Planning', href: '/blog#event-planning' }, { name: 'Production', href: '/blog#production' }, { name: 'Brand Activations', href: '/blog#brand-activations' }] },
  { name: 'Contact', href: '/contact', children: [{ name: 'Enquire Now', href: '/contact' }, { name: 'WhatsApp Us', href: 'https://wa.me/918626000002' }] },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => { setOpen(false); setMobileGroup(''); };

  return <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
    <div className="nav-logo-wrap">
      <Logo variant={scrolled ? 'dark' : 'light'} height={52} priority />
    </div>
    <nav>{navGroups.map(g => <div className="nav-dropdown" key={g.name}><Link className="services-trigger" href={g.href}>{g.name}<ChevronDown size={14} /></Link><div className="dropdown-panel">{g.children?.map((item, i) => <Link href={item.href} key={item.name}><span>{g.name === 'Services' ? services[i]?.number : '→'}</span>{item.name}<ArrowUpRight size={13} /></Link>)}</div></div>)}</nav>
    <Link href="/contact" className="nav-cta">Plan Your Event <ArrowUpRight size={15} /></Link>
    <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    {open && <div className="mobile-nav">
      <div className="mobile-nav-logo"><Logo variant="light" height={40} /></div>
      {navGroups.map(g => <div className="mobile-nav-group" key={g.name}><button className="mobile-services-trigger" onClick={() => setMobileGroup(mobileGroup === g.name ? '' : g.name)}>{g.name}<ChevronDown className={mobileGroup === g.name ? 'rotate' : ''} size={15} /></button>{mobileGroup === g.name && <div className="mobile-service-list"><Link onClick={close} href={g.href}>View {g.name}</Link>{g.children?.map(item => <Link onClick={close} key={item.name} href={item.href}>{item.name}</Link>)}</div>}</div>)}
      <Link onClick={close} className="btn btn-gold" href="/contact">Plan Your Event</Link>
    </div>}
  </header>;
}
