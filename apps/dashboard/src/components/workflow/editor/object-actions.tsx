interface ObjectActionsProps {
  isEditing: boolean;
}

export function ObjectActions({ isEditing }: ObjectActionsProps) {
  // We've moved the Add Field and Add Table buttons to their respective sections
  // This component is now empty but kept for potential future use
  if (!isEditing) return null;
  
  return null;
}