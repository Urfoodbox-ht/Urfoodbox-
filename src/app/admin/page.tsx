'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '../../components/AdminDashboard.tsx';
import { TRANSLATIONS } from '../../i18n/translations.ts';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ufb_theme');
      const root = document.documentElement;
      root.classList.remove('dark', 'theme-brand');
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else if (savedTheme === 'brand') {
        root.classList.add('theme-brand');
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <AdminDashboard
      onExitAdmin={() => router.push('/')}
      onStorefrontUpdated={async () => {}}
      t={TRANSLATIONS.en}
    />
  );
}
