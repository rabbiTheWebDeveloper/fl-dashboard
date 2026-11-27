'use client';

import { useEffect } from 'react';
import { logout } from '@/lib/auth';

export default function Logout() {
  useEffect(() => {
    try {
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  }, []);

  return null;
}
