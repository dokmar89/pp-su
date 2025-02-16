// src/app/admin/layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import '../styles/admin.css'; // Vytvořte vlastní CSS styl pro admin rozhraní

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Administrace</h2>
        <nav>
          <ul>
            <li><Link href="/admin/dashboard">Dashboard</Link></li>
            <li><Link href="/admin/registrations">Registrace firem</Link></li>
            <li><Link href="/admin/companies">Správa firem</Link></li>
            <li><Link href="/admin/eshops">Správa eshopů</Link></li>
            <li><Link href="/admin/support-tickets">Support tickety</Link></li>
            <li><Link href="/admin/monitoring">Monitoring</Link></li>
            <li><Link href="/admin/configuration">Konfigurace</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
