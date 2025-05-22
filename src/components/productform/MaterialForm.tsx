import React from 'react';
import { PAPER_OPTIONS } from '../../types/';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface PaperGroupProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  paperType: string;
  setPaperType: (paperType: string) => void;
  paperGrammar: string;
  setPaperGrammar: (paperGrammar: string) => void;
  materialCostPerCm2: number;
  setMaterialCostPerCm2: (cost: number) => void;
}

interface PrintingGroupProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  printType: 'Black & White' | 'Full Color';
  setPrintType: (type: 'Black & White' | 'Full Color') => void;
  printCostPerCm2: number;
  setPrintCostPerCm2: (cost: number) => void;
}

interface FinishingGroupProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  finishingType: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya';
  setFinishingType: (type: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya') => void;
  customFinishing: string;
  setCustomFinishing: (finishing: string) => void;
  finishingCostPerCm2: number;
  setFinishingCostPerCm2: (cost: number) => void;
}

interface MaterialFormProps {
  paperGroup: {
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => void;
    paperType: string;
    setPaperType: (paperType: string) => void;
    paperGrammar: string;
    setPaperGrammar: (paperGrammar: string) => void;
    materialCostPerCm2: number;
    setMaterialCostPerCm2: (cost: number) => void;
  };
  printingGroup: {
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => void;
    printType: 'Black & White' | 'Full Color';
    setPrintType: (type: 'Black & White' | 'Full Color') => void;
    printCostPerCm2: number;
    setPrintCostPerCm2: (cost: number) => void;
  };
  finishingGroup: {
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => void;
    finishingType: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya';
    setFinishingType: (type: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya') => void;
    customFinishing: string;
    setCustomFinishing: (finishing: string) => void;
    finishingCostPerCm2: number;
    setFinishingCostPerCm2: (cost: number) => void;
  };
}

const PaperGroup: React.FC<PaperGroupProps> = ({
  isEnabled,
  setIsEnabled,
  paperType,
  setPaperType,
  paperGrammar,
  setPaperGrammar,
  materialCostPerCm2,
  setMaterialCostPerCm2,
}) => {
  const availableGrammars = PAPER_OPTIONS.find((p) => p.name === paperType)?.grammars || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-700">Paper Material</h4>
        <div className="cursor-pointer" onClick={() => setIsEnabled(!isEnabled)}>
          {isEnabled ? (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-green-600">Enabled</span>
              <ToggleRight className="h-6 w-6 text-green-500" />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Disabled</span>
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className={isEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kertas <span className="text-red-500">*</span>
            </label>
            <select
              id="paperType"
              value={paperType}
              onChange={(e) => {
                setPaperType(e.target.value);
                setPaperGrammar('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isEnabled}
            >
              <option value="">Pilih jenis kertas</option>
              {PAPER_OPTIONS.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paperGrammar" className="block text-sm font-medium text-gray-700 mb-1">
              Ketebalan Kertas <span className="text-red-500">*</span>
            </label>
            <select
              id="paperGrammar"
              value={paperGrammar}
              onChange={(e) => setPaperGrammar(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              disabled={!paperType}
              required={isEnabled}
            >
              <option value="">Pilih ketebalan</option>
              {availableGrammars.map((grammar) => (
                <option key={grammar} value={grammar}>
                  {grammar}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="materialCost" className="block text-sm font-medium text-gray-700 mb-1">
            Biaya Material per cm² (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="materialCost"
            value={materialCostPerCm2}
            onChange={(e) => setMaterialCostPerCm2(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required={isEnabled}
          />
        </div>
      </div>
    </div>
  );
};

const PrintingGroup: React.FC<PrintingGroupProps> = ({
  isEnabled,
  setIsEnabled,
  printType,
  setPrintType,
  printCostPerCm2,
  setPrintCostPerCm2,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-700">Printing</h4>
        <div className="cursor-pointer" onClick={() => setIsEnabled(!isEnabled)}>
          {isEnabled ? (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-green-600">Enabled</span>
              <ToggleRight className="h-6 w-6 text-green-500" />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Disabled</span>
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className={isEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
        <div>
          <label htmlFor="printType" className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Cetak <span className="text-red-500">*</span>
          </label>
          <select
            id="printType"
            value={printType}
            onChange={(e) => setPrintType(e.target.value as 'Black & White' | 'Full Color')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required={isEnabled}
          >
            <option value="Black & White">Black & White</option>
            <option value="Full Color">Full Color</option>
          </select>
        </div>

        <div>
          <label htmlFor="printCost" className="block text-sm font-medium text-gray-700 mb-1">
            Biaya Cetak per cm² (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="printCost"
            value={printCostPerCm2}
            onChange={(e) => setPrintCostPerCm2(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required={isEnabled}
          />
        </div>
      </div>
    </div>
  );
};

const FinishingGroup: React.FC<FinishingGroupProps> = ({
  isEnabled,
  setIsEnabled,
  finishingType,
  setFinishingType,
  customFinishing,
  setCustomFinishing,
  finishingCostPerCm2,
  setFinishingCostPerCm2,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-700">Finishing</h4>
        <div className="cursor-pointer" onClick={() => setIsEnabled(!isEnabled)}>
          {isEnabled ? (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-green-600">Enabled</span>
              <ToggleRight className="h-6 w-6 text-green-500" />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Disabled</span>
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className={isEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
        <div>
          <label htmlFor="finishingType" className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Finishing <span className="text-red-500">*</span>
          </label>
          <select
            id="finishingType"
            value={finishingType}
            onChange={(e) => setFinishingType(e.target.value as 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required={isEnabled}
          >
            <option value="Tanpa Finishing">Tanpa Finishing</option>
            <option value="Doff">Doff</option>
            <option value="Glossy">Glossy</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {finishingType === 'Lainnya' && (
          <div>
            <label htmlFor="customFinishing" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Finishing <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customFinishing"
              value={customFinishing}
              onChange={(e) => setCustomFinishing(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Specify custom finishing"
              required={isEnabled}
            />
          </div>
        )}

        <div>
          <label htmlFor="finishingCost" className="block text-sm font-medium text-gray-700 mb-1">
            Biaya Finishing per cm² (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="finishingCost"
            value={finishingCostPerCm2}
            onChange={(e) => setFinishingCostPerCm2(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required={isEnabled}
          />
        </div>
      </div>
    </div>
  );
};

const MaterialForm: React.FC<MaterialFormProps> = ({
  paperGroup,
  printingGroup,
  finishingGroup,
}) => {
  return (
    <div className="space-y-8">
      <PaperGroup {...paperGroup} />
      <PrintingGroup {...printingGroup} />
      <FinishingGroup {...finishingGroup} />
    </div>
  );
};

export default MaterialForm;
