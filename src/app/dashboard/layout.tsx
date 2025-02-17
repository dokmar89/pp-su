// src/app/dashboard/layout.tsx
'use client';

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
        // router.refresh(); // Refresh by měl být až po přesměrování, a to už se nestihne, odebereme ho.
        return; // Ukončíme funkci, aby se nepokračovalo dál.
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <Loading isLoading={true} />;

  return (
    <div className="flex"> {/* Použijeme Tailwind pro stylování */}
      <aside className="w-64 p-4 border-r border-gray-200"> {/* Tailwind styly */}
        <nav>
          <ul className="list-none p-0"> {/* Tailwind styly */}
            <li><Link href="/dashboard" className="block p-2 hover:bg-gray-100">Dashboard</Link></li> {/* Tailwind styly */}
            <li><Link href="/account" className="block p-2 hover:bg-gray-100">Účet a Platby</Link></li> {/* Tailwind styly */}
            <li><Link href="/support" className="block p-2 hover:bg-gray-100">Podpora</Link></li> {/* Tailwind styly */}
            <li><Link href="/add-eshop" className="block p-2 hover:bg-gray-100">Přidat Eshop</Link></li> {/* Tailwind styly */}
            {/* <li><Link href="/customize">Přizpůsobení</Link></li>  Tato stránka neexistuje, viz komentář níže */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4"> {/* Tailwind styly */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;