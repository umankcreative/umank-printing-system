import React from 'react';
import { PAPER_OPTIONS } from '../../types/';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface MaterialFormProps {
  paperType: string | null;
  setPaperType: (paperType: string | null) => void;
  paperGrammar: string | null;
  setPaperGrammar: (paperGrammar: string | null) => void;
  materialCostPerCm2: number;
  setMaterialCostPerCm2: (cost: number) => void;
  isPaperEnabled: boolean;
  setIsPaperEnabled: (enabled: boolean) => void;
  printType: 'Black & White' | 'Full Color' | null;
  setPrintType: (type: 'Black & White' | 'Full Color' | null) => void;
  printCostPerCm2: number;
  setPrintCostPerCm2: (cost: number) => void;
  isPrintingEnabled: boolean;
  setIsPrintingEnabled: (enabled: boolean) => void;
  finishingType: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null;
  setFinishingType: (type: 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya' | null) => void;
  customFinishing: string | null;
  setCustomFinishing: (finishing: string | null) => void;
  finishingCostPerCm2: number;
  setFinishingCostPerCm2: (cost: number) => void;
  isFinishingEnabled: boolean;
  setIsFinishingEnabled: (enabled: boolean) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  paperType,
  setPaperType,
  paperGrammar,
  setPaperGrammar,
  materialCostPerCm2,
  setMaterialCostPerCm2,
  isPaperEnabled,
  setIsPaperEnabled,
  printType,
  setPrintType,
  printCostPerCm2,
  setPrintCostPerCm2,
  isPrintingEnabled,
  setIsPrintingEnabled,
  finishingType,
  setFinishingType,
  customFinishing,
  setCustomFinishing,
  finishingCostPerCm2,
  setFinishingCostPerCm2,
  isFinishingEnabled,
  setIsFinishingEnabled,
}) => {
  const handleMaterialCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setMaterialCostPerCm2(parseFloat(value) || 0);
    }
  };

  const handlePrintCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setPrintCostPerCm2(parseFloat(value) || 0);
    }
  };

  const handleFinishingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setFinishingCostPerCm2(parseFloat(value) || 0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Paper Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-700">Paper Material</h4>
          <div className="cursor-pointer" onClick={() => setIsPaperEnabled(!isPaperEnabled)}>
            {isPaperEnabled ? (
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

        <div className={isPaperEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kertas <span className="text-red-500">*</span>
              </label>
              <select
                id="paperType"
                value={paperType || ''}
                onChange={(e) => {
                  setPaperType(e.target.value || null);
                  setPaperGrammar(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required={isPaperEnabled}
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
                value={paperGrammar || ''}
                onChange={(e) => setPaperGrammar(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled={!paperType}
                required={isPaperEnabled}
              >
                <option value="">Pilih ketebalan</option>
                {PAPER_OPTIONS.find((p) => p.name === paperType)?.grammars.map((grammar) => (
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
              name="materialCost"
              value={materialCostPerCm2 || ''}
              onChange={handleMaterialCostChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isPaperEnabled}
              disabled={!isPaperEnabled}
            />
          </div>
        </div>
      </div>

      {/* Printing Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-700">Printing</h4>
          <div className="cursor-pointer" onClick={() => setIsPrintingEnabled(!isPrintingEnabled)}>
            {isPrintingEnabled ? (
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

        <div className={isPrintingEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
          <div>
            <label htmlFor="printType" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Cetak <span className="text-red-500">*</span>
            </label>
            <select
              id="printType"
              value={printType || ''}
              onChange={(e) => setPrintType((e.target.value as 'Black & White' | 'Full Color') || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isPrintingEnabled}
            >
              <option value="">Pilih jenis cetak</option>
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
              name="printCost"
              value={printCostPerCm2 || ''}
              onChange={handlePrintCostChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isPrintingEnabled}
              disabled={!isPrintingEnabled}
            />
          </div>
        </div>
      </div>

      {/* Finishing Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-700">Finishing</h4>
          <div className="cursor-pointer" onClick={() => setIsFinishingEnabled(!isFinishingEnabled)}>
            {isFinishingEnabled ? (
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

        <div className={isFinishingEnabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
          <div>
            <label htmlFor="finishingType" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Finishing <span className="text-red-500">*</span>
            </label>
            <select
              id="finishingType"
              value={finishingType || ''}
              onChange={(e) => setFinishingType((e.target.value as 'Tanpa Finishing' | 'Doff' | 'Glossy' | 'Lainnya') || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isFinishingEnabled}
            >
              <option value="">Pilih jenis finishing</option>
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
                name="customFinishing"
                value={customFinishing || ''}
                onChange={(e) => setCustomFinishing(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required={isFinishingEnabled && finishingType === 'Lainnya'}
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
              name="finishingCost"
              value={finishingCostPerCm2 || ''}
              onChange={handleFinishingCostChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              required={isFinishingEnabled}
              disabled={!isFinishingEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialForm;
