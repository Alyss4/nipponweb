'use client';

import Link from 'next/link';

export default function VisitorSidebarLinks() {
  const titleStyle = { color: '#e83c28', fontSize: '120%' };

  return (
    <div className="mt-3">
      <h6 style={titleStyle} className="text-center"><strong>Les Tournois</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Les prochains Tournoi</Link></li>
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Résultats publics</Link></li>
        <li className="mb-2"><Link href="#" className="text-light text-decoration-none">Classement général</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Informations</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/annonces" className="text-light text-decoration-none">Annonces</Link></li>
        <li className="mb-2"><Link href="/reglement" className="text-light text-decoration-none">Règlement</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Contact</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">À propos</Link></li>
        <li className="mb-2"><Link href="/contact" className="text-light text-decoration-none">Contact</Link></li>
      </ul>
    </div>
  );
}
