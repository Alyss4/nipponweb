'use client';

import Link from 'next/link';

export default function AdministratorSidebarLinks() {
  const titleStyle = { color: '#e83c28', fontSize: '120%' };

  return (
    <div className="mt-3">
      <h6 style={titleStyle} className="text-center"><strong>Tournois</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Création</Link></li>
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Modification</Link></li>
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Lancement</Link></li>
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Importation CSV</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Mes Tournois</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/annonces" className="text-light text-decoration-none">A venir</Link></li>
        <li className="mb-2"><Link href="/annonces" className="text-light text-decoration-none">Historique</Link></li>
        <li className="mb-2"><Link href="/annonces" className="text-light text-decoration-none">Résultats</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Dashboard</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">Notifications</Link></li>
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">Gérer les utilisateurs</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Contact</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">A propos</Link></li>
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">Contacts</Link></li>
      </ul>
    </div>
  );
}
