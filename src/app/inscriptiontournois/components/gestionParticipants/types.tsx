export interface Grade {
    id: number;
    nom: string;
  }

export interface Pays {
    id: number;
    nom: string;
    nom_abrev?: string;
    drapeau_emoji?: string;
}
export interface Club {
    id: number;
    nom?: string;
}

  export interface Participant {
    id?: number;
    prenom: string;
    nom: string;
    date_naissance: string;
    sexe: 'H' | 'F' ;
    poids?: number;
    id_club?: number;
    id_grade?: number;
    id_pays?: number;
    inscription_status?: 'pending' | 'successful' | 'failed';
    created_at?: string;
    updated_at?: string;
  }
  
  export interface GestionParticipantsProps {
    formData: any;
  }
  