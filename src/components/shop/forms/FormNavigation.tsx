
import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onCancel: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onCancel,
}) => {
  return (
    <div className="flex justify-between space-x-2 pt-4 border-t">
      <div>
        {currentStep > 0 && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
        >
          Batalkan
        </Button>
        
        <Button 
          type="submit"
          className="gap-2"
        >
          {currentStep === totalSteps - 1 ? (
            "Kirim Pesanan"
          ) : (
            <>
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormNavigation;
