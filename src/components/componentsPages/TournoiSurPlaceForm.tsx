import React, { useState, FormEvent } from 'react';
import { Input, Select, Radio, ButtonPrimaryy } from '../ComponentForm';
import Link from 'next/link';

const TournoiSurPlaceForm: React.FC = () => {
  const [nom, setNom] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState('');
  const [importType, setImportType] = useState('Manuellement');
  const [genre, setGenre] = useState('');
  const [systeme, setSysteme] = useState('');
  const [message, setMessage] = useState('');
  const [participantsLimit, setParticipantsLimit] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (importType === 'CSV' && csvFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        console.log('CSV Content:', csvContent);
      };
      reader.readAsText(csvFile);
    }

    console.log({
      nom,
      grade,
      date,
      importType,
      genre,
      systeme,
      participantsLimit,
      sponsor,
    });

    setMessage('Tournoi ajouté avec succès ✅');
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <h2 className="text-center text-primary mb-4">Ajouter un tournoi sur place</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom du tournoi"
          type="text"
          placeholder="Entrez le nom du tournoi"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Select
          label="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          options={[
            '',
            'Ceinture blanche',
            'Ceinture jaune',
            'Ceinture orange',
            'Ceinture verte',
            'Ceinture bleue',
            'Ceinture marron',
            'Ceinture noire 1ere dan',
            'Ceinture noire 2eme dan',
            'Ceinture noire 3eme dan',
            'Ceinture noire 4eme dan',
            'Ceinture noire 5eme dan',
            'Ceinture noire 6eme dan',
          ]}
        />

        <Input
          label="Date du tournoi"
          type="date"
          placeholder="Date du tournoi"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Select
          label="Importation des participants"
          value={importType}
          onChange={(e) => setImportType(e.target.value)}
          options={['Manuellement', 'CSV']}
        />

        {importType === 'CSV' && (
          <div className="mb-3">
            <label className="form-label text-dark fw-bold">Importer un fichier CSV</label>
            <Input
              label="Fichier CSV"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label text-dark fw-bold">Genre</label>
          <div>
            <Radio
              label="Homme"
              name="genre"
              checked={genre === 'Homme'}
              onChange={() => setGenre('Homme')}
            />
            <Radio
              label="Femme"
              name="genre"
              checked={genre === 'Femme'}
              onChange={() => setGenre('Femme')}
            />
            <Radio
              label="Mixte"
              name="genre"
              checked={genre === 'Mixte'}
              onChange={() => setGenre('Mixte')}
            />
          </div>
        </div>

        <Select
          label="Système d’élimination"
          value={systeme}
          onChange={(e) => setSysteme(e.target.value)}
          options={['', 'Poule', 'Élimination directe']}
        />

        <Input
          label="Limite de participants"
          type="number"
          placeholder="Nombre maximum de participants"
          value={participantsLimit}
          onChange={(e) => setParticipantsLimit(e.target.value)}
        />

        <Input
          label="Sponsor du tournoi"
          type="text"
          placeholder="Nom du sponsor"
          value={sponsor}
          onChange={(e) => setSponsor(e.target.value)}
        />

        {message && <p className="text-success">{message}</p>}

        <div className="d-grid mt-3">
          <ButtonPrimaryy>Ajouter le tournoi</ButtonPrimaryy>
        </div>
      </form>

      <Link href="/gestionparticipants">
        <button
          className="btn"
          style={{
            backgroundColor: 'var(--bg-button-primary)',
            color: 'var(--text-button-primary)',
            borderColor: 'var(--border-button-primary)',
          }}
        >
          Aller à la gestion des participants
        </button>
      </Link>
    </div>
  );
};

export default TournoiSurPlaceForm;
