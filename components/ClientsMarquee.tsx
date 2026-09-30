'use client';

import { clients, Client } from '../data/clients';

function ClientCard({ client, decorative = false }: { client: Client; decorative?: boolean }) {
  return <div className="client-card" tabIndex={decorative ? -1 : 0}>
    <span className="client-name">{client.name}</span>
  </div>;
}

function ClientRow({ items, reverse = false }: { items: Client[]; reverse?: boolean }) {
  const repeated = [...items, ...items];
  return <div className={`clients-marquee-row${reverse ? ' reverse' : ''}`} aria-label="Client logos"><div className="clients-marquee-track">{repeated.map((client, index) => <ClientCard client={client} key={`${client.name}-${index}`} />)}</div><div className="clients-marquee-track" aria-hidden="true">{repeated.map((client, index) => <ClientCard decorative client={client} key={`${client.name}-duplicate-${index}`} />)}</div></div>;
}

export function ClientsMarquee() {
  const midpoint = Math.ceil(clients.length / 2);
  const firstRow = clients.slice(0, midpoint);
  const secondRow = clients.slice(midpoint);
  return <section className="clients-section" aria-labelledby="clients-heading"><div className="clients-divider" /><div className="container clients-heading"><div><p className="eyebrow">TRUSTED BY</p><h2 id="clients-heading" className="display">Brands That<br /><em>Trust Us.</em></h2></div><div><p className="clients-subtext">From luxury automobiles and hotels to fashion, retail and media, leading brands have trusted us with their moments that matter.</p><div className="clients-stats"><span><strong>40+</strong> Brands</span><span><strong>500+</strong> Events</span><span><strong>10+</strong> Years</span></div></div></div><div className="clients-marquee" aria-label="Our client brands"><ClientRow items={firstRow} /><ClientRow items={secondRow} reverse /></div></section>;
}
