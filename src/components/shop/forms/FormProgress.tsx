
import React from 'react';
import { Progress } from '../../ui/progress';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, totalSteps }) => {
  const calculateProgress = () => {
    return ((currentStep + 1) / totalSteps) * 100;
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Langkah {currentStep + 1} dari {totalSteps}
        </span>
      </div>
      <Progress value={calculateProgress()} className="h-2" />
    </div>
  );
};

export default FormProgress;
