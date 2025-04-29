'use client';

import Link from 'next/link';

export default function CompetitorSidebarLinks() {
  const titleStyle = { color: '#e83c28', fontSize: '120%' };

  return (
    <div className="mt-3">
      <h6 style={titleStyle} className="text-center"><strong>Mes Tournois</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">À venir</Link></li>
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Historique</Link></li>
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Mes Résultats</Link></li>
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Mes Matchs</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Classement</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Classement Général</Link></li>
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Tous les Tournois</Link></li>
        <li className="mb-2"><Link href="/annonces" className="text-light text-decoration-none">Annonces</Link></li>
        <li className="mb-2"><Link href="/reglement" className="text-light text-decoration-none">Règlement</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Mon Compte</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/profil" className="text-light text-decoration-none">Mon Profil</Link></li>
        <li className="mb-2"><Link href="/" className="text-light text-decoration-none">Mes Inscriptions</Link></li>
      </ul>

      <h6 style={titleStyle} className="mt-4 text-center"><strong>Infos</strong></h6>
      <ul className="list-unstyled text-center">
        <li className="mb-2"><Link href="/apropos" className="text-light text-decoration-none">À propos</Link></li>
        <li className="mb-2"><Link href="/contact" className="text-light text-decoration-none">Contact</Link></li>
      </ul>
    </div>
  );
}
