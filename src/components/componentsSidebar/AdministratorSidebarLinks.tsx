'use client';

import Link from 'next/link';

export default function AdministratorSidebarLinks() {
  return (
    <>
      <h6 className="text-warning">Tournois</h6>
      <ul className="list-unstyled">
        <li><a href="#" className="text-light text-decoration-none">Création</a></li>
        <li><a href="#" className="text-light text-decoration-none">Modification</a></li>
        <li><a href="#" className="text-light text-decoration-none">Lancement</a></li>
        <li><a href="#" className="text-light text-decoration-none">Importation CSV</a></li>
      </ul>
      <h6 className="text-warning mt-3">Mes Tournois</h6>
      <ul className="list-unstyled">
        <li><Link href="/annonces" className="text-light text-decoration-none">A venir</Link></li>
        <li><Link href="/annonces" className="text-light text-decoration-none">Historique</Link></li>
        <li><Link href="/annonces" className="text-light text-decoration-none">Résultats</Link></li>
      </ul>
      <h6 className="text-warning mt-3">Dashboard</h6>
      <ul className="list-unstyled">
        <li><Link href="/apropos" className="text-light text-decoration-none">Notifications</Link></li>
        <li><Link href="/apropos" className="text-light text-decoration-none">Gérer les utilisateurs</Link></li>
      </ul>
      <h6 className="text-warning mt-3">Contact</h6>
      <ul className="list-unstyled">
        <li><Link href="/apropos" className="text-light text-decoration-none">A propos</Link></li>
        <li><Link href="/apropos" className="text-light text-decoration-none">Contacts</Link></li>
      </ul>
    </>
  );
}
