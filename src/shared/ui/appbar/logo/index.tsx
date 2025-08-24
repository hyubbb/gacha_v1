import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  variant?: 'word' | 'symbol';
};

export function Logo({ className, variant = 'word' }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <Image
        src="/assets/images/logo_word.svg"
        width={88}
        height={24}
        className="hidden h-[24px] lg:block"
        alt="questi"
        priority
      />
      <Image
        src="/assets/images/logo_symbol.svg"
        width={32}
        height={32}
        className="h-[32px] min-h-[32px] lg:hidden"
        alt="questi"
        priority
      />
    </Link>
  );
}
