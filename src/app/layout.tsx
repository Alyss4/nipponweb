'use client';

import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icons/css/flag-icons.min.css';
import './globals.css';
import Link from 'next/link';
import UserSidebarInfo from '../components/UserSidebarInfo';
import { useState, useEffect } from 'react';
import VisitorSidebarLinks from '../components/componentsSidebar/VisitorSidebarLinks';
import CompetitorSidebarLinks from '@/components/componentsSidebar/CompetitorSidebarLinks';
import ManagerSidebarLinks from '@/components/componentsSidebar/ManagerSidebarLinks';
import AdministratorSidebarLinks from '@/components/componentsSidebar/AdministratorSidebarLinks';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setRole(storedRole);
  }, []);

  const renderSidebarLinks = () => {
    if (!isAuthenticated) {
      return <VisitorSidebarLinks />;
    }

    switch (role) {
      case 'c': // Compétiteur
        return <CompetitorSidebarLinks />;
      case 'g': // gestionnaire
        return <ManagerSidebarLinks />;
      case 'a': // Administrateur
        return <AdministratorSidebarLinks />;
      case 'u': // Utilisateur (même droit que visiteur)
      default:
        return <VisitorSidebarLinks />;
    }
  };

  return (
    <html lang="fr">
      <Head>
        <title>Tournois App</title>
        <meta name="description" content="Gérez vos tournois facilement" />
      </Head>
      <body className="d-flex" style={{ fontFamily: 'Luciole, sans-serif', minHeight: '100vh' }}>
        <aside className="text-light p-3 d-flex flex-column" style={{ width: '14%', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
          <h2 className="text-danger fs-5 mb-3">//NOM//</h2>
          <hr className="border-light w-100" />
          <div className="flex-grow-1">
            {renderSidebarLinks()}
            <h6 className="text-warning mt-3">Test</h6>
            <ul className="list-unstyled">
              <li><Link href="/roles" className="text-light text-decoration-none">Roles</Link></li>
            </ul>
          </div>
        </aside>
        
        <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="d-flex justify-content-end mb-3">
            <UserSidebarInfo />
            {!isAuthenticated && (
              <>
                <Link href="/inscription">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: 'var(--bg-button-primary)',
                      color: 'var(--text-button-primary)',
                      borderColor: 'var(--border-button-primary)',
                    }}
                  >
                    Inscription
                  </button>
                </Link>
                <Link href="/connexion">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: 'var(--bg-button-secondary)',
                      color: 'var(--text-button-secondary)',
                      borderColor: 'var(--border-button-secondary)',
                    }}
                  >
                    Se connecter
                  </button>
                </Link>
              </>
            )}
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
