'use client';

import React, { useEffect, useState } from 'react';

export default function UserSidebarInfo() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEmail(null);
      return;
    }

    const payload = getJwtPayload(token);
    console.log('Payload:', payload);
    if (!payload) {
      localStorage.removeItem('token');
      setEmail(null);
      return;
    }

    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      setEmail(null);
      return;
    }

    setEmail(payload.email || 'Utilisateur');
    setRole(payload.role || 'u');
  }, []);

  const getJwtPayload = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erreur lors du décodage du JWT:', e);
      return null;
    }
  };

  if (!email) return <p className="text-primary">Invité</p>;

  return (
    <div className='d-flex'>
      <p className="text-primary mb-1">{email}</p>
      <p className="text-primary">Rôle : {role === 'u' ? 'Utilisateur' : role === 'g' ? 'Gestionnaire' : role === 'a' ? 'Admin' : 'Visiteur'}</p>
    </div>
  );
}
