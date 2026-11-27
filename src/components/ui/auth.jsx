/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getRole, isAuthenticated } from '@/lib/auth';
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
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const authenticated = isAuthenticated();

    if (!authenticated && !isPublicPath) {
      setAuthorized(false);
      router.replace('/login');
      return;
    }

    if (authenticated && isPublicPath) {
      const role = String(getRole() || '').toLowerCase();
      const target = ['superadmin', 'user-admin', 'moderator', 'support', 'admin'].includes(role)
        ? '/admin'
        : '/dashboard';
      router.replace(target);
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) return <Loading />;

  return children;
}
