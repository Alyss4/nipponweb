'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export const dynamic = "force-dynamic";

interface Competiteur {
  prenom?: string;
  nom?: string;
}
interface Match {
  id: number;
  scoreP1: number;
  scoreP2: number;
  penaliteP1?: number;
  penaliteP2?: number;
  competiteur1?: Competiteur;
  competiteur2?: Competiteur;
}

const SOCKET_URL = "http://localhost:4000"; // adapte si besoin

export default function ScoreboardSpectateur() {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    if (!id) return;

    // 1. Charger le score initial au montage (optionnel mais recommandé)
    const fetchMatch = async () => {
      const res = await fetch(`${API_BASE_URL}/matchs/${id}`);
      const data = await res.json();
      setMatch(data);
    };
    fetchMatch();

    // 2. Brancher le socket pour recevoir le score en live
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('subscribeMatch', id);

    socketRef.current.on('scoreUpdate', ({ updates }) => {
      setMatch(updates);
    });

    // Nettoyage à la fermeture du composant
    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  if (!match) {
    return (
      <div style={{
        color: '#fff',
        textAlign: 'center',
        padding: 80,
        background: '#111',
        height: '100vh'
      }}>Chargement…</div>
    );
  }

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: 38, marginBottom: 36, letterSpacing: 2 }}>
        Scoreboard
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 70,
        marginBottom: 32,
      }}>
        {/* Joueur 1 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 18, color: '#fff' }}>
            {match.competiteur1?.prenom} {match.competiteur1?.nom}
          </div>
          <div style={{
            fontSize: 90,
            color: '#36e324',
            fontWeight: 'bold',
            background: '#222',
            borderRadius: 18,
            minWidth: 140,
            padding: '8px 28px'
          }}>
            {match.scoreP1 ?? 0}
          </div>
          <div style={{ fontSize: 18, marginTop: 14, color: '#bbb' }}>
            Pénalités : {match.penaliteP1 ?? 0}
          </div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 'bold', color: '#fff', margin: '0 18px' }}>VS</div>
        {/* Joueur 2 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 18, color: '#fff' }}>
            {match.competiteur2?.prenom} {match.competiteur2?.nom}
          </div>
          <div style={{
            fontSize: 90,
            color: '#e22c2c',
            fontWeight: 'bold',
            background: '#222',
            borderRadius: 18,
            minWidth: 140,
            padding: '8px 28px'
          }}>
            {match.scoreP2 ?? 0}
          </div>
          <div style={{ fontSize: 18, marginTop: 14, color: '#bbb' }}>
            Pénalités : {match.penaliteP2 ?? 0}
          </div>
        </div>
      </div>
      {/* (Optionnel) Ajoute un chrono, un titre de tournoi, etc */}
    </div>
  );
}
