import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { MediaBackground } from '../../components/MediaBackground';
import { EventsPortfolio } from '../../components/EventsPortfolio';
import { pageMedia } from '../../data/media';

export default function Events() {
  return <main className="events-page events-premium-page">
    <section className="events-hero"><MediaBackground videoSrc="/videos/events-montage.mp4" poster={pageMedia.events.image} images={[pageMedia.events.image, '/images/testimonials/client-event-03.jpg', '/images/testimonials/client-event-02.jpg']} label="Creativatorss events montage" /><div className="events-hero-overlay" /><div className="container events-hero-content"><p className="eyebrow">OUR WORK</p><h1 className="display">Events we've<br /><em>brought to life.</em></h1><p>Bold productions, meaningful gatherings and live moments designed to stay with you.</p><Link href="#portfolio" className="events-scroll-link">Scroll to explore <ArrowDownRight size={17} /></Link><div className="events-hero-stats"><span><strong>500+</strong> Events</span><span><strong>12</strong> Cities</span><span><strong>10+</strong> Years</span></div></div></section>
    <div id="portfolio"><EventsPortfolio /></div>
    <section className="events-cta-band"><Image src="/images/testimonials/client-event-01.jpg" alt="Guests enjoying a Creativatorss event" fill sizes="100vw" /><div className="events-cta-overlay" /><div className="events-cta-content"><p className="eyebrow">HAVE AN EVENT IN MIND?</p><h2 className="display">Let&apos;s make it<br /><em>unforgettable.</em></h2><Link href="/contact" className="btn btn-gold">Plan your event <ArrowUpRight size={16} /></Link></div></section>
  </main>;
}
