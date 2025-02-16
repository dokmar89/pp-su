"use client";
import React from 'react';
import Link from '../components/ui/Link';

const APIDocumentationPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Dokumentace</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <ul>
          <li><Link href="#autentizace">Autentizace</Link></li>
          <li><Link href="#overeni">Ověření věku</Link></li>
          <li><Link href="#dobijeni">Dobíjení peněženky</Link></li>
          <li><Link href="#sprava-eshopu">Správa eshopů</Link></li>
        </ul>
      </nav>
      <section id="autentizace">
        <h2>Autentizace</h2>
        <p>## Endpoint: /api/authenticate</p>
        <p>Popis: Tento endpoint slouží k autentizaci uživatele. ...</p>
      </section>
      <section id="overeni">
        <h2>Ověření věku</h2>
        <p>## Endpoint: /api/verify-age</p>
        <p>Popis: Tento endpoint slouží k ověření věku uživatele. ...</p>
      </section>
      <section id="dobijeni">
        <h2>Dobíjení peněženky</h2>
        <p>## Endpoint: /api/top-up</p>
        <p>Popis: Tento endpoint slouží k dobití peněženky uživatele. ...</p>
      </section>
      <section id="sprava-eshopu">
        <h2>Správa eshopů</h2>
        <p>## Endpoint: /api/manage-shop</p>
        <p>Popis: Tento endpoint slouží ke správě eshopů. ...</p>
      </section>
    </div>
  );
};

export default APIDocumentationPage;
