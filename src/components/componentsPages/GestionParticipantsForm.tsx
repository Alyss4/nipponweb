import React, { useState } from 'react';
import { Input, Select, Radio, ButtonSecondaryy } from '../../components/ComponentForm';
import { useParticipants } from '../../app/hooks/useParticipants';
import ParticipantTable from '../componentsTables/ParticipantTable';

// Définir un type pour les participants, basé sur l'objet participant attendu
interface Participant {
  nom: string;
  prenom: string;
  club: string;
  grade: string;
  genre: 'Homme' | 'Femme';
  dateInscription: string;
}

// Définir les props de GestionParticipants
interface GestionParticipantsProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const GestionParticipants: React.FC<GestionParticipantsProps> = () => {
  const [importType, setImportType] = useState<'CSV' | 'Manuellement'>('Manuellement');
  const {
    participants,
    newParticipant,
    handleInputChange,
    handleAddParticipant
  } = useParticipants();

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '1000px' }}>
      <h2 className="text-center text-primary mb-4">Gestion des Participants</h2>

      <div className="mb-3">
        <label className="form-label">Choisissez une méthode d'importation</label>
        <div className="d-flex">
          <Radio
            name="importType"
            label="Importer par CSV"
            checked={importType === 'CSV'}
            onChange={() => setImportType('CSV')}
          />
          <Radio
            name="importType"
            label="Saisir manuellement"
            checked={importType === 'Manuellement'}
            onChange={() => setImportType('Manuellement')}
          />
        </div>
      </div>

      {importType === 'Manuellement' && (
        <div className="mb-5">
          <h4>Ajouter un participant</h4>
          <div className="row g-2">
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Nom"
                label="Nom"
                value={newParticipant.nom}
                onChange={handleInputChange}
                data-field="nom"
              />
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Prénom"
                label="Prénom"
                value={newParticipant.prenom}
                onChange={handleInputChange}
                data-field="prenom"
              />
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Club"
                label="Club"
                value={newParticipant.club}
                onChange={handleInputChange}
                data-field="club"
              />
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Grade"
                label="Grade"
                value={newParticipant.grade}
                onChange={handleInputChange}
                data-field="grade"
              />
            </div>
            <div className="col-md-4">
              <Select
                label="Genre"
                value={newParticipant.genre}
                onChange={handleInputChange}
                options={[
                  { value: 'Homme', label: 'Homme' },
                  { value: 'Femme', label: 'Femme' }
                ]}
                data-field="genre"
              />
            </div>
            <div className="col-md-4">
              <Input
                type="date"
                placeholder="Date d'inscription"
                label="Date d'inscription"
                value={newParticipant.dateInscription}
                onChange={handleInputChange}
                data-field="dateInscription"
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button onClick={handleAddParticipant} className="btn btn-primary">
              Ajouter
            </button>
          </div>
        </div>
      )}

      {importType === 'CSV' && (
        <div className="mb-5">
          <h4>Importer un fichier CSV</h4>
          <Input
            value=""
            placeholder=""
            label="Fichier CSV"
            type="file"
            onChange={handleCSVImport}
          />
          <p className="text-muted mt-2">Format: nom, prénom, club, grade, genre, dateInscription</p>
        </div>
      )}

      {/* Utilisation du composant ParticipantTable */}
      <ParticipantTable participants={participants} />
    </div>
  );
};

export default GestionParticipants;
