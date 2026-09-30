import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { CTA, Why } from '../../components/Sections';
import { images } from '../../data/site';
import { pageMedia, serviceVideos } from '../../data/media';
import { services } from '../../data/services';
import { RotatingShowcase } from '../../components/RotatingShowcase';
import { RotatingImage } from '../../components/RotatingImage';

const pillars = [
  ['01', 'Curiosity', 'We look beyond the obvious to find the idea that makes an experience feel personal.'],
  ['02', 'Precision', 'A strong creative idea deserves an equally considered production plan.'],
  ['03', 'Togetherness', 'The best work happens when clients, partners and our team move as one.'],
];
const capabilityLinks = services.slice(0, 7);

export default function About() {
  return <main className="about-page-dark">
    <section className="about-split-hero"><div className="about-split-hero-copy"><p className="eyebrow">ABOUT CREATIVATORSS</p><h1 className="display">We turn ideas<br /><em>into experiences.</em></h1><p>A creative event and production partner for brands, people and moments that deserve to be remembered.</p><Link className="btn btn-gold" href="/contact">Start a conversation <ArrowUpRight size={16} /></Link></div><div className="about-split-hero-image"><div className="about-hero-rotating"><RotatingImage images={['/images/testimonials/client-event-03.jpg','/images/testimonials/client-event-02.jpg','/images/services/influencer/influencer-hero.jpg','/images/testimonials/client-event-01.jpg']} alt="Creativatorss live event production" /></div></div></section>
    <section className="section about-story"><div className="container about-story-grid"><div className="reveal"><p className="eyebrow">WHO WE ARE</p><h2 className="display">Built around<br />the <em>moment.</em></h2><div className="gold-line" /></div><div className="reveal delay"><p>Creativatorss is a full-service Event and Brand Management Company based in Chandigarh. We bring creative thinking, production craft and calm, considered execution together under one roof.</p><p>From the first sketch of an idea to the final guest leaving the room, we work as an extension of your team - listening closely, thinking boldly and caring about every detail.</p></div></div></section>
    <section className="section about-rotating-banner about-philosophy-rotating"><div className="container"><RotatingShowcase slides={[
      { image: '/images/testimonials/client-event-01.jpg', eyebrow: 'OUR PHILOSOPHY', title: <>Make it feel<br /><em>inevitable.</em></>, description: 'When the idea, atmosphere and execution align, the experience feels effortless. That is the standard we bring to every brief.' },
      { image: '/images/testimonials/client-event-02.jpg', eyebrow: 'MOMENTS IN MOTION', title: <>Every frame has<br /><em>a feeling.</em></>, description: 'Ideas move, light changes and the atmosphere evolves. Our work is designed to feel alive from the first reveal to the final farewell.' },
      { image: '/images/testimonials/client-event-03.jpg', eyebrow: 'THE BIG REVEAL', title: <>Details become<br /><em>memories.</em></>, description: 'From the first light cue to the final applause, every detail is shaped to make the room feel unforgettable.' },
      { image: '/images/services/influencer/influencer-hero.jpg', eyebrow: 'ENERGY ON STAGE', title: <>Make the moment<br /><em>move.</em></>, description: 'We bring people, production and creative direction together so every event has its own rhythm.' },
    ]} /></div></section>
    <section className="section about-pillars"><div className="container"><p className="eyebrow">HOW WE THINK</p><div className="about-pillars-grid">{pillars.map(([number, title, copy]) => <div className="about-pillar reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>
    <section className="section about-capabilities"><div className="container"><p className="eyebrow">OUR CAPABILITIES</p><h2 className="display about-cap-title">One team for<br /><em>the whole picture.</em></h2><div className="about-capability-card-grid">{capabilityLinks.map((item) => <Link className="about-capability-card" href={`/services/${item.slug}`} key={item.slug}><div className="about-capability-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 560px) 90vw, (max-width: 820px) 45vw, 30vw" /></div><div className="about-capability-card-body"><div className="about-capability-number"><span>{item.number}</span><Check size={16} /></div><h3>{item.name}</h3><p>{item.short}</p><ArrowUpRight className="about-cap-arrow" size={18} /></div></Link>)}</div></div></section>
    <section className="about-work-motion"><div className="container about-work-motion-grid"><div><p className="eyebrow">OUR WORK IN MOTION</p><h2 className="display">Every event has a story.<br /><em>Every production has a moment.</em></h2><p>See the energy, people and production craft behind the work.</p><Link className="text-link" href="/gallery">Explore the gallery <ArrowUpRight size={16} /></Link></div><div className="about-work-video"><video autoPlay muted loop playsInline controls preload="metadata" poster={images.stage} aria-label="Creativatorss event and production showreel"><source src="/videos/about-creativatorss-montage.mp4" type="video/mp4" /></video></div></div></section>
    <section className="about-wedding-video"><video autoPlay muted loop playsInline preload="metadata" poster={images.about} aria-label="Wedding planning production"><source src={serviceVideos.wedding} type="video/mp4" /></video><div className="about-wedding-shade" /><div className="about-wedding-copy"><p className="eyebrow">WEDDING PLANNING</p><h2 className="display">Beautifully planned.<br /><em>Personally remembered.</em></h2><p>From intimate celebrations to large wedding productions, we bring together planning, decor, entertainment, coordination and creative details to create a celebration that feels personal.</p><Link className="btn btn-gold" href="/services/wedding-planning">Explore wedding planning <ArrowUpRight size={16} /></Link></div></section>
    <section className="about-people-note"><div className="container"><p className="eyebrow">THE PEOPLE BEHIND THE EXPERIENCE</p><h2 className="display">A network of planners, creative directors, photographers, production teams, models, artists, vendors and coordinators - working together to make the moment happen.</h2></div></section>
    <div id="why"><Why /></div><CTA />
  </main>;
}
