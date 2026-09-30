'use client';
import { useEffect, useState } from 'react';

type Props = { videoSrc: string; poster: string; images: string[]; label: string; className?: string };

export function MediaBackground({ videoSrc, poster, images, label, className = '' }: Props) {
  const [fallback, setFallback] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => { if (!fallback) return; const timer = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 4500); return () => window.clearInterval(timer); }, [fallback, images.length]);
  return <>
    <video className={`media-video ${className}`} autoPlay muted loop playsInline poster={poster} onError={() => setFallback(true)} onEnded={() => setFallback(true)} aria-label={label}><source src={videoSrc} type="video/mp4" /></video>
    {fallback && <div className="media-fallback" style={{ backgroundImage: `url(${images[index]})` }} aria-label={`${label} image fallback`} />}
  </>;
}
