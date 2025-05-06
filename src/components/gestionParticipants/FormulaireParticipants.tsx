'use client';
import React from 'react';
import { Input, Select, ButtonPrimaryy } from '../../components/ComponentForm';
import { Grade, Pays, Club, Participant } from '../gestionParticipants/types';

const sexeOptions = [
  { value: 'H', label: 'Homme' },
  { value: 'F', label: 'Femme' },
];

interface FormulaireParticipantProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddParticipant: () => void;
  newParticipant: Participant;
  grades: Grade[];
  pays: Pays[];
  clubs: Club[];
}

const FormulaireParticipant: React.FC<FormulaireParticipantProps> = ({
  handleInputChange,
  newParticipant,
  handleAddParticipant,
  grades,
  pays,
  clubs
}) => (
  <div className="mb-2">
    <h5 className="text-o-primary mb-3">Ajouter un participant</h5>
    <div className="row g-2">
      <div className="col-md-4">
        <Input
          type="text"
          placeholder="Nom"
          label="Nom"
          onChange={handleInputChange}
          value={newParticipant.nom}
          data-field="nom"
        />
      </div>
      <div className="col-md-4">
        <Input
          type="text"
          placeholder="Prénom"
          label="Prénom"
          onChange={handleInputChange}
          value={newParticipant.prenom}
          data-field="prenom"
        />
      </div>
      <div className="col-md-4">
        <Input
          type="date"
          label="Date de naissance"
          value={newParticipant.date_naissance}
          onChange={handleInputChange}
          data-field="date_naissance"
        />
      </div>
      <div className="col-md-4">
        <Input
          type="number"
          label="Poids"
          value={newParticipant.poids || ''}
          onChange={handleInputChange}
          data-field="poids"
        />
      </div>
      <div className="col-md-4">
        <Select
          label="Club"
          value={newParticipant.id_club ?? ''}
          onChange={handleInputChange}
          data-field="id_club"
          options={clubs.map((club) => ({ value: club.id.toString(), label: club.nom ?? 'Sans nom' }))}
        />
      </div>
      <div className="col-md-4">
        <Select
          label="Grade"
          value={newParticipant.id_grade ?? ''}
          onChange={handleInputChange}
          data-field="id_grade"
          options={grades.map((g) => ({ value: g.id.toString(), label: g.nom }))}
        />
      </div>
      <div className="col-md-4">
        <Select
          label="Sexe"
          value={newParticipant.sexe}
          onChange={handleInputChange}
          data-field="sexe"
          options={sexeOptions}
        />
      </div>
      <div className="col-md-4">
        <Select
          label="Pays"
          value={newParticipant.id_pays ?? ''}
          onChange={handleInputChange}
          data-field="id_pays"
          options={pays.map((p) => ({ value: p.id.toString(), label: `${p.drapeau_emoji ?? ''} ${p.nom}` }))}
        />
      </div>
    </div>
    <ButtonPrimaryy className="mt-3" onClick={handleAddParticipant}>Ajouter le participant</ButtonPrimaryy>
  </div>
);

export default FormulaireParticipant;
