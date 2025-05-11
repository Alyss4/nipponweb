import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableCompetiteur from './DraggableCompetiteur';

interface Competiteur {
  id: number;
  nom: string;
  prenom: string;
}

interface Poule {
  id: number;
  competiteurs: Competiteur[];
}

interface DragDropPoulesProps {
  poules: Poule[];
  setPoules: (p: Poule[]) => void;
  competiteurs: Competiteur[];
}

// Composant pour rendre une zone "droppable"
function DroppableZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="border rounded p-4 bg-white min-h-[150px]">
      {children}
    </div>
  );
}

export default function DragDropPoules({ poules, setPoules, competiteurs }: DragDropPoulesProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  // Compétiteurs non encore placés dans une poule
  const assignedIds = poules.flatMap(p => p.competiteurs.map(c => c.id));
  const unassigned = competiteurs.filter(c => !assignedIds.includes(c.id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const [fromPouleId, fromCompetiteurId] = active.id.toString().split(':');
    const toPouleId = over.id.toString();

    const fromIndex = parseInt(fromPouleId);
    const toIndex = parseInt(toPouleId);

    const competiteur = competiteurs.find(c => c.id === +fromCompetiteurId);
    if (!competiteur) return;

    const updatedPoules = [...poules];

    // Retirer le compétiteur de toutes les poules
    updatedPoules.forEach(p => {
      p.competiteurs = p.competiteurs.filter(c => c.id !== competiteur.id);
    });

    // Ajouter à la nouvelle poule si toIndex >= 0
    if (toIndex >= 0 && toIndex < poules.length) {
      updatedPoules[toIndex].competiteurs.push(competiteur);
    }

    setPoules(updatedPoules);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">

        {/* Zone des non assignés */}
        <DroppableZone id="-1">
          <h3 className="font-bold mb-2">Non assignés</h3>
          <SortableContext
            items={unassigned.map(c => `-1:${c.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {unassigned.map(competiteur => (
              <DraggableCompetiteur
                key={`-1:${competiteur.id}`}
                id={`-1:${competiteur.id}`}
                nom={competiteur.nom}
                prenom={competiteur.prenom}
              />
            ))}
          </SortableContext>
        </DroppableZone>

        {/* Les poules */}
        {poules.map((poule, pouleIndex) => (
          <DroppableZone key={poule.id} id={`${pouleIndex}`}>
            <h3 className="font-bold mb-2">Poule {pouleIndex + 1}</h3>
            <SortableContext
              items={poule.competiteurs.map(c => `${pouleIndex}:${c.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {poule.competiteurs.map(competiteur => (
                <DraggableCompetiteur
                  key={`${pouleIndex}:${competiteur.id}`}
                  id={`${pouleIndex}:${competiteur.id}`}
                  nom={competiteur.nom}
                  prenom={competiteur.prenom}
                />
              ))}
            </SortableContext>
          </DroppableZone>
        ))}
      </div>
    </DndContext>
  );
}
