/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Loading from './loading';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/registration',
  '/account-verify',
  '/forgot-password',
];

export function Auth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const authenticated = isAuthenticated();

    if (!authenticated && !isPublicPath) {
      router.replace('/login');
      return;
    }

    if (authenticated && isPublicPath) {
      router.replace('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) return <Loading />;

  return children;
}
