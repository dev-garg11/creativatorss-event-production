import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { PageHero } from '../../components/PageHero';
import { GalleryExperience } from '../../components/GalleryExperience';
import { pageMedia } from '../../data/media';

export default function GalleryPage() {
  return <main className="gallery-page">
    <PageHero eyebrow="CAPTURED MOMENTS" title={<>The atmosphere<br /><em>in focus.</em></>} image={pageMedia.gallery.image} videoBackground videoSrc={pageMedia.gallery.video} fallbackImages={[pageMedia.gallery.image, '/images/testimonials/client-event-03.jpg', '/images/testimonials/client-event-02.jpg']} />
    <div className="gallery-scroll-indicator"><span>SCROLL TO EXPLORE</span><ChevronDown size={15} /></div>
    <GalleryExperience />
    <section className="gallery-cta"><Image src="/images/testimonials/client-event-02.jpg" alt="A beautifully produced event" fill sizes="100vw" /><div className="gallery-cta-shade" /><div className="gallery-cta-content"><p className="eyebrow">READY FOR YOUR NEXT MOMENT?</p><h2 className="display">Want your event captured<br /><em>like this?</em></h2><Link href="/contact" className="btn btn-gold">Plan Your Event <ArrowUpRight size={16} /></Link></div></section>
  </main>;
}
