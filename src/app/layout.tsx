'use client';

import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icons/css/flag-icons.min.css';
import './globals.css';
import { useRouter, usePathname } from 'next/navigation'; 
import { UserProvider, useUser } from '../contexts/UserContext';
import UserSidebarInfo from '../components/componentsSidebar/UserSidebarInfo';
import VisitorSidebarLinks from '../components/componentsSidebar/VisitorSidebarLinks';
import CompetitorSidebarLinks from '@/components/componentsSidebar/CompetitorSidebarLinks';
import ManagerSidebarLinks from '@/components/componentsSidebar/ManagerSidebarLinks';
import AdministratorSidebarLinks from '@/components/componentsSidebar/AdministratorSidebarLinks';
import RetourButton from '@/components/ui/RetourButton';
import { ButtonPrimaryy, ButtonSecondaryy } from '@/components/ui/ComponentForm';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isScoreboardLive = pathname.startsWith('/scoreboard-live');

  const { isAuthenticated, email, role, logout } = useUser();
  const router = useRouter();

  const renderSidebarLinks = () => {
    if (!isAuthenticated) return <VisitorSidebarLinks />;
    switch (role) {
      case 'c': return <CompetitorSidebarLinks />;
      case 'g': return <ManagerSidebarLinks />;
      case 'a': return <AdministratorSidebarLinks />;
      default: return <VisitorSidebarLinks />;
    }
  };

  const handleInscription = () => router.push("/inscription");
  const handleConnexion = () => router.push("/connexion");
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <html lang="fr">
      <Head>
        <title>Tournois App</title>
        <meta name="description" content="Gérez vos tournois facilement" />
      </Head>
      <body className="d-flex" style={{ fontFamily: 'Luciole, sans-serif', minHeight: '100vh' }}>
        {isScoreboardLive ? (
          <>{children}</>
        ) : (
          <>
            <aside className="text-light p-3 d-flex flex-column" style={{ width: '13%', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
              <a href="/">
                <img src="/icon.png" alt="Logo Nippon Kempo" className="mx-auto d-block" style={{ width: '80%' }} />
              </a>
              <div className="flex-grow-1">
                {renderSidebarLinks()}
              </div>
            </aside>

            <main className="flex-grow-1 p-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="d-flex align-items-center justify-content-end mb-3">
                <UserSidebarInfo email={email} />
                {!isAuthenticated ? (
                  <>
                    <RetourButton />
                    <ButtonPrimaryy onClick={handleInscription}>Inscription</ButtonPrimaryy>
                    <ButtonSecondaryy onClick={handleConnexion}>Se connecter</ButtonSecondaryy>
                  </>
                ) : (
                  <>
                    <RetourButton />
                    <ButtonSecondaryy onClick={handleLogout}>Déconnexion</ButtonSecondaryy>
                  </>
                )}
              </div>
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  );
}

// Ce composant englobe toute ton app
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
