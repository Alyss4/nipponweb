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
const sanitizeParticipant = (participant: any) => ({
  ...participant,
  id_grade: participant.id_grade ? Number(participant.id_grade) : null,
  id_club: participant.id_club ? Number(participant.id_club) : null,
  id_pays: participant.id_pays ? Number(participant.id_pays) : null,
  poids: participant.poids ? Number(participant.poids) : null,
});


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

      <Checkbox
        label="Autoriser les inscriptions externes"
        checked={autoriserInscriptionExterne}
        onChange={(e) => setAutoriserInscriptionExterne(e.target.checked)}
      />
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
      <div className="d-flex gap-2 mt-3">
        <ButtonPrimaryy
          onClick={async () => {
            const sanitized = participants.map(sanitizeParticipant);
            const tournoi = await handleCreateTournoi(formData, "lance", sanitized, ajoutParticipantsPlusTard);
            if (tournoi && tournoi.id) {
              router.push(`/poules/${tournoi.id}`);
            }
          }}
        >
          Continuer et lancer
        </ButtonPrimaryy>

        <ButtonSecondaryy
          onClick={async () => {
            const tournoi = await handleCreateTournoi(
              formData,
              "inscriptions_ouvertes",
              participants,
              ajoutParticipantsPlusTard
            );
            if (tournoi && tournoi.id) {
              router.push('/'); 
            }
          }}
        >
          Enregistrer et ouvrir les inscriptions
        </ButtonSecondaryy>

      </div>

      {!ajoutParticipantsPlusTard && <ParticipantTable participants={participants} />}
    </div>
  );
};

export default GestionParticipants;
