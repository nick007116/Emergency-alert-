'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      try {
        const decoded = JSON.parse(atob(token)); // basic base64 decode
        if (Date.now() > decoded.exp) {
          localStorage.removeItem('adminToken');
          router.push('/');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        router.push('/');
      }
    }
  }, [router]);

  return <div>{children}</div>;
}