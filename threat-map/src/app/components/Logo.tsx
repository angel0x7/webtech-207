'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/honeyblog.png"
        alt="HoneyBlog Logo"
        width={150}
        height={150}
        style={{ cursor: 'pointer' }}
      />
    </Link>
  );
}
