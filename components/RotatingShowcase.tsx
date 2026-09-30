'use client';
import Image from 'next/image';
import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';

type Slide={image:string;eyebrow:string;title:React.ReactNode;description:string};

export function RotatingShowcase({slides}:{slides:Slide[]}){
  const [active,setActive]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setActive(i=>(i+1)%slides.length),4200);return()=>window.clearInterval(timer)},[slides.length]);
  const slide=slides[active];
  const localImages=['/images/testimonials/client-event-01.jpg','/images/testimonials/client-event-02.jpg','/images/testimonials/client-event-03.jpg','/images/services/influencer/influencer-hero.jpg'];
  const imageSrc=slide.image.startsWith('http')?localImages[active%localImages.length]:slide.image;
  return <div className="rotating-showcase rotating-showcase-full"><div className="rotating-showcase-media rotating-image"><Image src={imageSrc} alt={slide.eyebrow} fill sizes="100vw"/></div><div className="rotating-showcase-shade"/><div key={active} className="rotating-showcase-copy"><p className="eyebrow">{slide.eyebrow}</p><h2 className="display">{slide.title}</h2><p>{slide.description}</p><a className="text-link" href="/gallery">Explore the gallery <ArrowUpRight size={16}/></a><div className="rotating-dots" aria-label="Showcase slides">{slides.map((_,i)=><button key={i} className={i===active?'is-active':''} onClick={()=>setActive(i)} aria-label={`Show slide ${i+1}`}/>)}</div></div></div>
}
