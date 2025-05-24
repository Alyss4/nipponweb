"use client";
import React, { useEffect, useState } from 'react';
import { Input, Select, ButtonPrimaryy, Checkbox, ButtonSecondaryy } from '../ui/ComponentForm';
import { useParticipants } from '../../hooks/useParticipants';
import ParticipantTable from '../componentsTables/ParticipantTable';
import OptionsImportation from '../../app/inscriptiontournois/components/gestionParticipants/OptionsImportation';
import FormulaireParticipant from '../../app/inscriptiontournois/components/gestionParticipants/FormulaireParticipants';
import { parseCSV } from '../../app/inscriptiontournois/components/gestionParticipants/parseCSV';
import { Grade, GestionParticipantsProps, Pays, Club } from '../../app/inscriptiontournois/components/gestionParticipants/types';
import { fetchGrades,fetchClub, fetchPays, handleCSVImport, handleCreateTournoi } from '../../app/inscriptiontournois/components/gestionParticipants/logic';
import { useRouter } from 'next/navigation';

const GestionParticipants: React.FC<GestionParticipantsProps> = ({ formData }) => {
  const [importType, setImportType] = useState<'CSV' | 'Manuellement'>('Manuellement');
  const [ajoutParticipantsPlusTard, setAjoutParticipantsPlusTard] = useState(false);
  const [autoriserInscriptionExterne, setAutoriserInscriptionExterne] = useState(false);
  const { participants, setParticipants, newParticipant, handleInputChange, handleAddParticipant } = useParticipants();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [pays, setPays] = useState<Pays[]>([]);
  const [clubs, setClub] = useState<Club[]>([]);
  const router = useRouter();

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
      {!ajoutParticipantsPlusTard && (
        <>
        <OptionsImportation
          importType={importType}
          setImportType={setImportType}
          ajoutParticipantsPlusTard={ajoutParticipantsPlusTard}
          handleCSVImport={(e) => handleCSVImport(e, setParticipants)}
        />
        {importType === 'Manuellement' && (
          <FormulaireParticipant
            handleInputChange={handleInputChange}
            newParticipant={newParticipant}
            handleAddParticipant={handleAddParticipant}
            grades={grades}
            pays={pays}
            clubs={clubs}
            />
          )}
        </>
      )}

      <Checkbox
        label="Autoriser les inscriptions externes"
        checked={autoriserInscriptionExterne}
        onChange={(e) => setAutoriserInscriptionExterne(e.target.checked)}
      />

      <div className="d-flex gap-2 mt-3">
        <ButtonPrimaryy
          onClick={async () => {
            const tournoi = await handleCreateTournoi(formData, "lance", participants, ajoutParticipantsPlusTard);
            if (tournoi && tournoi.id) {
              router.push(`/poules/${tournoi.id}`);
            }
          }}
        >
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
