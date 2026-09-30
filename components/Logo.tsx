import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  variant?: 'dark' | 'light';
  height?: number;
  priority?: boolean;
};

export function Logo({ height = 48, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="site-logo"
      aria-label="Creativatorss Event & Production"
    >
      <Image
        src="/images/creativatorss-logo-gold.png"
        alt="Creativatorss Event & Production"
        width={height}
        height={height}
        unoptimized
        priority={priority}
        style={{
          width: `${height}px`,
          height: `${height}px`,
          maxWidth: `${height}px`,
          maxHeight: `${height}px`,
          objectFit: 'contain',
          display: 'block',
          borderRadius: '50%',
        }}
      />
    </Link>
  );
}

