import { Suspense } from 'react';
import FormulaireInscription from './components/FormulaireInscription';

export default function InscriptionTournoisPage() {
  return (
    <Suspense fallback={<div>Chargement du formulaire...</div>}>
      <FormulaireInscription />
    </Suspense>
  );
}
