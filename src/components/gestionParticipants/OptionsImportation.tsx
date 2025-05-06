import React from 'react';
import { Input, Radio, Select, ButtonPrimaryy } from '../componentsUI/ComponentForm';

interface Props {
  importType: 'CSV' | 'Manuellement';
  setImportType: (value: 'CSV' | 'Manuellement') => void;
  ajoutParticipantsPlusTard: boolean;
  handleCSVImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionsImportation: React.FC<Props> = ({ importType, setImportType, ajoutParticipantsPlusTard, handleCSVImport }) => (
  <div className="mb-3 mt-3">
    <h5 className="form-label text-o-primary mb-3">Choisissez une méthode d'importation</h5>
    <div className="d-flex justify-content-between w-50">
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

    {importType === 'CSV' && (
      <div className="mb-5">
        <h4>Importer un fichier CSV</h4>
        <Input
          value=""
          placeholder=""
          type="file"
          label="Fichier CSV"
          onChange={handleCSVImport}
        />
        <p className="text-muted mt-2">Format: nom, prénom, club, grade, sexe, dateInscription</p>
      </div>
    )}
  </div>
);

export default OptionsImportation;
