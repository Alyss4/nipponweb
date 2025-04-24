'use client'; 

import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icons/css/flag-icons.min.css';
import './globals.css';
import Link from 'next/link';
import UserSidebarInfo from '../components/UserSidebarInfo';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

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
            <h6 className="text-warning">Les Tournois</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Prochains</a></li>
              <li><a href="/resultats" className="text-light text-decoration-none">Résultats</a></li>
              <li><a href="/classement" className="text-light text-decoration-none">Classement</a></li>
            </ul>
            <h6 className="text-warning mt-3">Infos</h6>
            <ul className="list-unstyled">
              <li><a href="/annonces" className="text-light text-decoration-none">Annonces</a></li>
            </ul>
            <h6 className="text-warning mt-3">Contact</h6>
            <ul className="list-unstyled">
              <li><a href="/apropos" className="text-light text-decoration-none">À propos</a></li>
            </ul>
            <h6 className="text-warning mt-3">Test</h6>
            <ul className="list-unstyled">
              <li><a href="/roles" className="text-light text-decoration-none">Roles</a></li>
              <li><a href="/changemdp" className="text-light text-decoration-none">changemdp</a></li>
              <li><a href="/tournois" className="text-light text-decoration-none">tournois</a></li>
              <li><a href="/categorie" className="text-light text-decoration-none">categorie</a></li>
              <li><a href="/combat" className="text-light text-decoration-none">combat</a></li>
              <li><a href="/reglement" className="text-light text-decoration-none">Règlement</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="/classement" className="text-light text-decoration-none">Classement</a></li>
              <li><a href="/resultats" className="text-light text-decoration-none">Résultats</a></li>
            </ul>
          </div>
        </aside>

        <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="d-flex justify-content-end mb-3">
            <UserSidebarInfo />
            {!isAuthenticated && (
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
            )}
            {!isAuthenticated && (
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
            )}
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
