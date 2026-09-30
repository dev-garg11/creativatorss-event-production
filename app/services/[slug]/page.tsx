import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, Play } from 'lucide-react';
import { services, getService } from '../../../data/services';
import { portfolio } from '../../../data/content';
import { CTA } from '../../../components/Sections';

const visualSets: Record<string, string[]> = {
  'influencer-shoot': [
    '/images/services/influencer/influencer-creative.jpg',
    '/images/services/influencer/influencer-fashion.jpg',
    '/images/services/influencer/influencer-studio.jpg'
  ],
  'fashion-show': ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'],
  'corporate-events': ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85'],
  'wedding-planning': ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85']
};

const defaultVisuals = ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85'];

export function generateStaticParams(){ return services.map(s => ({ slug: s.slug })); }

export default function ServiceDetail({ params }: { params: { slug: string } }) {
  const s = getService(params.slug); if (!s) notFound();
  const visuals = visualSets[s.slug] || [s.image, ...defaultVisuals];
  const offers = s.slug === 'influencer-shoot'
    ? ['Creative campaign direction', 'Location and set styling', 'Influencer coordination', 'Short-form video production', 'Photography and retouching', 'Social-first content delivery']
    : ['Creative concept and direction', 'Planning and production coordination', 'Talent, artist or partner management', 'Set, stage and visual experience', 'On-ground execution and support', 'Post-event wrap-up and delivery'];
  const steps = [['01','BRIEF','Understand the objective, audience and desired feeling.'],['02','CREATE','Shape the visual direction, references and experience.'],['03','PRODUCE','Coordinate people, places, production and details.'],['04','DELIVER','Edit, present and deliver a polished final result.']];
  return <main>
    <section className="detail-hero service-detail-hero">
      {s.video ? <video className="detail-hero-video" autoPlay muted loop playsInline poster={s.image} aria-label={`${s.name} service video`}><source src={s.video} type="video/mp4"/></video> : <Image className="detail-hero-image" src={s.image} alt={s.name} fill sizes="100vw"/>}
      <div className="service-hero-copy reveal"><p className="eyebrow">{s.category} · CREATIVATORSS</p><h1 className="display">{s.name}</h1><p>{s.short}</p><Link className="btn btn-gold" href="/contact">Plan this experience <ArrowUpRight size={16}/></Link></div>
    </section>

    <section className="service-intro section"><div className="container service-intro-grid"><div className="reveal"><p className="eyebrow">THE APPROACH</p><h2 className="display">Make the idea<br/><em>impossible to ignore.</em></h2></div><div className="reveal delay"><p>{s.short}</p><p>We combine a clear creative point of view with the calm, detailed execution that makes a live experience feel effortless. Every choice is built around your audience, your story and the moment you want to create.</p><div className="service-mini-stats"><span><strong>01</strong> One connected team</span><span><strong>02</strong> Concept to completion</span></div></div></div></section>

    <section className="service-offers section"><div className="container"><div className="section-head"><div><p className="eyebrow">WHAT WE OFFER</p><h2 className="display">Details that make<br/><em>the difference.</em></h2></div><span className="service-play"><Play size={15} fill="currentColor"/> {s.category}</span></div><div className="offer-grid">{offers.map((offer,i)=><div className="offer-card reveal" key={offer}><span>0{i+1}</span><Check size={18}/><h3>{offer}</h3><p>Thoughtful planning, creative craft and precise delivery around your brief.</p></div>)}</div></div></section>

    <section className="service-gallery section"><div className="container"><p className="eyebrow">VISUAL LANGUAGE</p><h2 className="display">A feeling, captured<br/><em>frame by frame.</em></h2><div className="service-gallery-grid">{visuals.map((image,i)=><div className={`image-wrap service-gallery-image service-gallery-${i+1}`} key={image}><Image src={image} alt={`${s.name} visual ${i+1}`} fill sizes="(max-width:700px) 90vw, 45vw"/></div>)}</div></div></section>

    <section className="service-process section"><div className="container"><p className="eyebrow">OUR PROCESS</p><h2 className="display">From first thought<br/><em>to final frame.</em></h2><div className="service-process-grid">{steps.map(step=><div className="service-process-step reveal" key={step[0]}><span>{step[0]}</span><div><h3>{step[1]}</h3><p>{step[2]}</p></div></div>)}</div></div></section>

    <section className="section work"><div className="container"><p className="eyebrow">RELATED WORK</p><h2 className="display" style={{fontSize:55,margin:'18px 0 45px'}}>More moments we've<br/><em>brought to life.</em></h2><div className="work-grid">{portfolio.slice(0,2).map(p=><Link href="/events" className="project" key={p.title}><div className="image-wrap" style={{position:'relative',height:350}}><Image src={p.image} alt={p.title} fill sizes="50vw"/></div><div className="project-info"><h3>{p.title}</h3><span>{p.location} <ArrowUpRight size={15}/></span></div></Link>)}</div></div></section>
    <CTA/>
  </main>;
}
