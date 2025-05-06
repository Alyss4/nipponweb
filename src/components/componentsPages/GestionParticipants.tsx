"use client";
import React, { useEffect, useState } from 'react';
import { Checkbox, ButtonPrimaryy, ButtonSecondaryy } from '../../components/ComponentForm';
import { useParticipants } from '../../app/hooks/useParticipants';
import ParticipantTable from '../componentsTables/ParticipantTable';
import OptionsImportation from '../gestionParticipants/OptionsImportation';
import FormulaireParticipant from '../gestionParticipants/FormulaireParticipants';
import { parseCSV } from '../gestionParticipants/parseCSV';
import { Grade, GestionParticipantsProps, Pays, Club } from '../gestionParticipants/types';
import { fetchGrades,fetchClub, fetchPays, handleCSVImport, handleCreateTournoi } from '../gestionParticipants/logic';

const GestionParticipants: React.FC<GestionParticipantsProps> = ({ formData }) => {
  const [importType, setImportType] = useState<'CSV' | 'Manuellement'>('Manuellement');
  const [ajoutParticipantsPlusTard, setAjoutParticipantsPlusTard] = useState(false);
  const [autoriserInscriptionExterne, setAutoriserInscriptionExterne] = useState(false);
  const { participants, setParticipants, newParticipant, handleInputChange, handleAddParticipant } = useParticipants();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [clubs, setClub] = useState<Club[]>([]);

  useEffect(() => { fetchGrades(setGrades); fetchPays(setPays); fetchClub(setClub); }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-o-primary mb-5">Gestion des Participants</h2>

      <ButtonSecondaryy onClick={() => console.log("Données du formulaire :", formData)}>
        Afficher les données du formulaire
      </ButtonSecondaryy>

      <Checkbox
        label="Ajouter les participants plus tard"
        checked={ajoutParticipantsPlusTard}
        onChange={(e) => setAjoutParticipantsPlusTard(e.target.checked)}
      />

      <OptionsImportation
        importType={importType}
        setImportType={setImportType}
        ajoutParticipantsPlusTard={ajoutParticipantsPlusTard}
        handleCSVImport={(e) => handleCSVImport(e, setParticipants)}
      />

      {!ajoutParticipantsPlusTard && (
        <FormulaireParticipant
          handleInputChange={handleInputChange}
          newParticipant={newParticipant}
          handleAddParticipant={handleAddParticipant}
          grades={grades}
          pays={pays}
          clubs={clubs}
        />
      )}

      <Checkbox
        label="Autoriser les inscriptions externes"
        checked={autoriserInscriptionExterne}
        onChange={(e) => setAutoriserInscriptionExterne(e.target.checked)}
      />

      <div className="d-flex gap-2 mt-3">
        <ButtonPrimaryy onClick={() => handleCreateTournoi(formData, "lance", participants, ajoutParticipantsPlusTard)}>
          Continuer et lancer
        </ButtonPrimaryy>
        <ButtonSecondaryy onClick={() => handleCreateTournoi(formData, "inscriptions_ouvertes", participants, ajoutParticipantsPlusTard)}>
          Enregistrer et ouvrir les inscriptions
        </ButtonSecondaryy>
      </div>

      {!ajoutParticipantsPlusTard && <ParticipantTable participants={participants} />}
    </div>
  );
};

export default GestionParticipants;
