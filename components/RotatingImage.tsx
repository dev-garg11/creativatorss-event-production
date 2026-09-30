'use client';
import Image from 'next/image';
import {useEffect,useState} from 'react';

export function RotatingImage({images,alt,background=true}:{images:string[];alt:string;background?:boolean}){
  const [active,setActive]=useState(0);
  useEffect(()=>{const timer=window.setInterval(()=>setActive(i=>(i+1)%images.length),4200);return()=>window.clearInterval(timer)},[images.length]);
  return <div className={background?'rotating-image-background':'rotating-image-shell'} aria-label={alt}>{images.map((src,i)=><Image key={src} src={src} alt={`${alt} ${i+1}`} fill sizes="100vw" className={i===active?'is-active':''}/>)}</div>
}
