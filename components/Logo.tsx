import Link from 'next/link';

type LogoProps = {
  variant?: 'dark' | 'light';
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = 'light', className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`brand ${variant === 'dark' ? 'brand-dark' : ''} ${className}`.trim()}
      aria-label="Creativatorss Event & Production"
    >
      <span>CREATIVATORSS</span>
      <small>EVENT &amp; PRODUCTION</small>
    </Link>
  );
}
