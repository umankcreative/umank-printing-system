import React from 'react';

interface DimensionsFormProps {
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
}

const DimensionsForm: React.FC<DimensionsFormProps> = ({
  width,
  setWidth,
  height,
  setHeight,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="width"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lebar (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tinggi (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">
              Preview Dimensi
            </h4>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div
              className="relative bg-blue-100 border border-blue-300 rounded-md flex items-center justify-center overflow-hidden"
              style={{
                width: `${Math.min(width * 2, 200)}px`,
                height: `${Math.min(height * 2, 200)}px`,
                maxWidth: '100%',
              }}
            >
              <span className="text-xs text-blue-800 font-medium">
                {width} cm × {height} cm
              </span>
              {/* Width indicator */}
              <div className="absolute top-0 left-0 w-full h-6 flex items-center justify-center">
                <div className="absolute w-full border-t border-blue-400 border-dashed"></div>
                <span className="bg-blue-100 px-1 text-xs text-blue-800 relative">
                  {width} cm
                </span>
              </div>
              {/* Height indicator */}
              <div className="absolute top-0 left-0 h-full w-6 flex items-center justify-center">
                <div className="absolute h-full border-l border-blue-400 border-dashed"></div>
                <span className="bg-blue-100 px-1 text-xs text-blue-800 relative transform -rotate-90">
                  {height} cm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionsForm;
