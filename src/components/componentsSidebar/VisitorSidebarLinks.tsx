'use client';

import Link from 'next/link';

export default function VisitorSidebarLinks() {
  return (
    <>
      <h6 className="text-warning">Les Tournois</h6>
      <ul className="list-unstyled">
        <li><a href="#" className="text-light text-decoration-none">Les prochains Tournoi</a></li>
        <li><a href="#" className="text-light text-decoration-none">Résultats publics</a></li>
        <li><a href="#" className="text-light text-decoration-none">Classement général</a></li>
      </ul>

      <h6 className="text-warning mt-3">Infos</h6>
      <ul className="list-unstyled">
        <li><Link href="/annonces" className="text-light text-decoration-none">Annonces</Link></li>
        <li><Link href="/annonces" className="text-light text-decoration-none">Réglement</Link></li>
      </ul>

      <h6 className="text-warning mt-3">Contact</h6>
      <ul className="list-unstyled">
        <li><Link href="/apropos" className="text-light text-decoration-none">À propos</Link></li>
        <li><Link href="/apropos" className="text-light text-decoration-none">Contact</Link></li>
      </ul>
    </>
  );
}
