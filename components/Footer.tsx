'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import { site } from '../data/site';
import { services } from '../data/services';
import { Logo } from './Logo';

export function Footer() {
  const pathname = usePathname();
  const darkFooter = pathname === '/events' || pathname === '/gallery';

  return <footer><div className="footer-top container"><div><Logo variant={darkFooter ? 'light' : 'dark'} height={62} /><p className="footer-copy">We create considered events, bold productions and experiences that people remember.</p><div className="socials"><a href={site.instagram} aria-label="Instagram"><Instagram /></a><a href={site.facebook} aria-label="Facebook"><Facebook /></a><a href={site.youtube} aria-label="YouTube"><Youtube /></a><a href={site.linkedin} aria-label="LinkedIn"><Linkedin /></a></div></div><div><h4>Explore</h4><div className="footer-links"><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/events">Events</Link><Link href="/gallery">Gallery</Link><Link href="/blog">Journal</Link><Link href="/contact">Contact</Link></div></div><div><h4>Capabilities</h4><div className="footer-links">{services.slice(0, 6).map(s => <Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>)}</div></div><div><h4>Visit</h4><p className="footer-address">{site.address.map(a => <span key={a}>{a}</span>)}<span>{site.phone}</span><span>{site.alternatePhone}</span></p><Link className="footer-mail" href="/contact">Start a conversation <ArrowUpRight size={15} /></Link></div></div><div className="footer-bottom container"><span>© 2026 Creativatorss Event & Production. All Rights Reserved.</span><span><Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms">Terms & Conditions</Link></span></div></footer>;
}
