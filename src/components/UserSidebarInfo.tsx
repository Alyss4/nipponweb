'use client';

import React, { useEffect, useState } from 'react';

export default function UserSidebarInfo() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEmail(null);
      return;
    }

    fetch('http://127.0.0.1:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data && data.email) {
          setEmail(data.email);
        }
      })
      .catch(() => {
        setEmail(null);
      });
  }, []);

  if (!email) return <h2 className="fs-5 mb-3 text-secondary">Invité</h2>;

  return <h2 className="text-danger fs-5 mb-3">{email}</h2>;
}
