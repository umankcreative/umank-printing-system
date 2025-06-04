import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { useBranches } from '../../hooks/useBranches';
// import { Contact } from '../../utils/dummyData';

interface Branch {
  id: string;
  name?: string;
  Phone?: string;
  location?: string;  // Changed from address to location
  contact?: string;
}

interface YourCompanySectionProps {
  yourCompany: Branch;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBranchSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  yourCompanyName?: string;
  yourCompanyPhone?: string;
  yourCompanyAddress?: string;
  setyourCompanyName?: (name: string) => void;
  setyourCompanyPhone?: (phone: string) => void;
  setyourCompanyAddress?: (address: string) => void;
}

const YourCompanySection: React.FC<YourCompanySectionProps> = ({
  // yourCompany,
  handleInputChange,
  yourCompanyName,
  setyourCompanyName,
  yourCompanyAddress,
  setyourCompanyAddress,
  // yourCompanyPhone,
  // setyourCompanyPhone


}) => {
  const { branches, loading: branchesLoading } = useBranches();

    const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const branchId = e.target.value;
      const selectedBranch = branches.find((c: Branch) => c.id === branchId);
      
      if (selectedBranch) {
        // Your data has name and location, but no Phone property
        if (setyourCompanyName) setyourCompanyName(selectedBranch.name);
        // if (setyourCompanyPhone) setyourCompanyPhone(selectedBranch.Phone ?? ''); // Remove this line since Phone doesn't exist in your data
        if (setyourCompanyAddress) setyourCompanyAddress(selectedBranch.location);
      }
    };
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Your Company</h2>
      <div className="mb-4">
        <label htmlFor="branchSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Branch
        </label>
        <select
          id="branchSelect"
          onChange={handleBranchSelect}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={branchesLoading}
        >
          <option value="">Select a branch...</option>
          {branches.map((branch: Branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="yourCompanyName"
          label="Name"
          value={yourCompanyName ?? ''}
          onChange={handleInputChange}
          name="yourCompanyName"
        />
        {/* <FloatingLabelInput
          id="yourCompanyPhone"
          label="Phone"
          value={yourCompanyPhone ?? ''}
          onChange={handleInputChange}
          name="phone"
        /> */}
      </div>
      <FloatingLabelInput
        id="yourCompanyAddress"
        label="Address"
        value={yourCompanyAddress ?? ''}
        onChange={handleInputChange}
        name="yourCompanyAddress"
        className="mt-4"
      />
    </div>
  );
};

export default YourCompanySection;
