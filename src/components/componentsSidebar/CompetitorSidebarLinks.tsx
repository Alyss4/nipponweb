'use client';

import Link from 'next/link';

export default function CompetitorSidebarLinks() {
  return (
    <>
      <h6 className="text-warning mt-3">Mes Tournois</h6>
      <ul className="list-unstyled">
        <li><Link href="/" className="text-light text-decoration-none">À venir</Link></li>
        <li><Link href="/" className="text-light text-decoration-none">Historique</Link></li>
        <li><Link href="/" className="text-light text-decoration-none">Mes Résultats</Link></li>
        <li><Link href="/" className="text-light text-decoration-none">Mes Matchs</Link></li>
      </ul>
      <h6 className="text-warning mt-3">Classement</h6>
      <ul className="list-unstyled">
        <li><Link href="/" className="text-light text-decoration-none">Classement Général</Link></li>
        <li><Link href="/" className="text-light text-decoration-none">Tous les Tournois</Link></li>
        <li><Link href="/annonces" className="text-light text-decoration-none">Annonces</Link></li>
        <li><Link href="/reglement" className="text-light text-decoration-none">Règlement</Link></li>
      </ul>
      <h6 className="text-warning mt-3">Mon Compte</h6>
      <ul className="list-unstyled">
        <li><Link href="/profil" className="text-light text-decoration-none">Mon Profil</Link></li>
        <li><Link href="/" className="text-light text-decoration-none">Mes Inscriptions</Link></li>
      </ul>
      <h6 className="text-warning mt-3">Infos</h6>
      <ul className="list-unstyled">
        <li><Link href="/apropos" className="text-light text-decoration-none">À propos</Link></li>
        <li><Link href="/contact" className="text-light text-decoration-none">Contact</Link></li>
      </ul>
    </>
  );
}
