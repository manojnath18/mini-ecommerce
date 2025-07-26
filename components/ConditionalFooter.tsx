'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing on server and until mounted on client
  if (!mounted) return null;

  // Only render Footer on homepage '/'
  if (pathname === '/') {
    return <Footer />;
  }

  return null;
}
