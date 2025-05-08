'use client'
import React from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ButtonPrimaryy, ButtonSecondaryy } from '../../components/componentsUI/ComponentForm'; 

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  tournoi?: { id: number } | null;
}

const LaModal: React.FC<ModalProps> = ({ opened, onClose, title, children, tournoi }) => {
  const router = useRouter();
  const [message, setMessage] = React.useState<string | null>(null);  // Ajouter un état pour le message

  const handleInscription = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/getIDCompetiteurUtilisateur', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (!data.id_competiteur && tournoi?.id) {
        // Si l'utilisateur n'a pas encore de compétiteur, le rediriger vers la page d'inscription
        router.push(`/inscriptiontournois?id=${tournoi.id}`);
      } else if (data.id_competiteur && tournoi?.id) {
        // Si l'utilisateur a déjà un ID compétiteur, l'inscrire au tournoi
        const inscriptionResponse = await fetch('http://localhost:8000/api/inscrireAuTournoiDejaCompetiteur', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            id_tournoi: tournoi.id,
            id_competiteur: data.id_competiteur,
          }),
        });

        const inscriptionData = await inscriptionResponse.json();

        if (inscriptionResponse.ok) {
          // Inscription réussie
          setMessage('Inscription réussie au tournoi');
        } else {
          // Afficher un message d'erreur venant du serveur
          setMessage(inscriptionData.message || 'Une erreur est survenue. Veuillez réessayer.');
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du compétiteur :", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  
  
  
  return (
    <AnimatePresence>
      {opened && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-lg w-full max-w-xs p-4 border-[12px] border-[#023047] absolute"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)', 
            }}
          >
            <div className="flex-o-row justify-between items-center mb-4">
              <h4 className="text-lg text-o-primary flex-1">{title}</h4>
              <ButtonPrimaryy
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 text-xl"
                aria-label="Fermer"
              >
                ×
              </ButtonPrimaryy>
            </div>

            <div className='text-o-primary'>{children}</div>
            {message && <div className='text-o-primary' >{message}</div>} 

            <div className="mt-4 text-right">
              <ButtonSecondaryy onClick={onClose} className="mx-2">
                Fermer
              </ButtonSecondaryy>
              {tournoi?.id && (
                <ButtonPrimaryy onClick={handleInscription}>
                  S'inscrire
                </ButtonPrimaryy>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaModal;
