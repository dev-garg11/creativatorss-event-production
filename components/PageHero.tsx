import Image from 'next/image';
import { video, images } from '../data/site';
import { MediaBackground } from './MediaBackground';

type Props = { eyebrow: string; title: React.ReactNode; image: string; videoBackground?: boolean; videoSrc?: string; fallbackImages?: string[]; description?: string };

export function PageHero({ eyebrow, title, image, videoBackground = false, videoSrc = video.hero, fallbackImages = [image, images.hero, images.stage, images.aboutSmall], description }: Props) {
  return <section className="page-hero page-hero-media">
    {videoBackground ? <MediaBackground videoSrc={videoSrc} poster={image} images={fallbackImages} label={`${eyebrow} background video`} className="page-hero-video" /> : <Image className="page-hero-image" src={image} alt="Creativatorss event experience" fill sizes="100vw" />}
    <div className="page-hero-overlay" />
    <div className="page-hero-content container reveal"><p className="eyebrow">{eyebrow}</p><h1 className="display">{title}</h1>{description && <p>{description}</p>}</div>
  </section>;
}
