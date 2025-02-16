// src/app/dashboard/layout.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Loading from '../../components/ui/Loading';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push('/login');
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <Loading isLoading={true} />;

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/account">Účet a Platby</Link></li>
            <li><Link href="/support">Podpora</Link></li>
            <li><Link href="/add-eshop">Přidat Eshop</Link></li>
            <li><Link href="/customize">Přizpůsobení</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
