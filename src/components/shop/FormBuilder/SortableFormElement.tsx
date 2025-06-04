import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormElement } from '../../../types/formTypes';
import FormElementItem from './FormElementItem';

interface SortableFormElementProps {
  element: FormElement;
  onEdit: () => void;
  onDelete: () => void;
}

export const SortableFormElement: React.FC<SortableFormElementProps> = ({
  element,
  onEdit,
  onDelete,
}) => {
  console.log('Initializing sortable element:', {
    id: element.id,
    type: element.type,
    label: element.label
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FormElementItem
        element={element}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}; 