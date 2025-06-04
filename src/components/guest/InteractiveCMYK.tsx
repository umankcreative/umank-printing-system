import React, { useState } from 'react';

const InteractiveCMYK: React.FC = () => {
  const [cyanValue, setCyanValue] = useState(100);
  const [magentaValue, setMagentaValue] = useState(100);
  const [yellowValue, setYellowValue] = useState(100);
  const [blackValue, setBlackValue] = useState(0);

  // Convert CMYK to RGB for display
  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    // Scale CMYK from 0-100 to 0-1
    const scaledC = c / 100;
    const scaledM = m / 100;
    const scaledY = y / 100;
    const scaledK = k / 100;

    // Calculate RGB
    const r = 255 * (1 - scaledC) * (1 - scaledK);
    const g = 255 * (1 - scaledM) * (1 - scaledK);
    const b = 255 * (1 - scaledY) * (1 - scaledK);

    // Return RGB values rounded to nearest integer
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    };
  };

  const currentRgb = cmykToRgb(
    cyanValue,
    magentaValue,
    yellowValue,
    blackValue
  );
  const rgbColor = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pengalaman Model Warna CMYK
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            CMYK (Cyan, Magenta, Yellow, Key/Black) adalah model warna yang digunakan dalam cetak warna. Atur slider untuk melihat bagaimana kombinasi yang berbeda membuat berbagai warna.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div
            className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-cyan-600">Cyan (C)</label>
                  <span className="text-gray-600">{cyanValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cyanValue}
                  onChange={(e) => setCyanValue(Number(e.target.value))}
                  className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-fuchsia-600">
                    Magenta (M)
                  </label>
                  <span className="text-gray-600">{magentaValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={magentaValue}
                  onChange={(e) => setMagentaValue(Number(e.target.value))}
                  className="w-full h-2 bg-fuchsia-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-yellow-600">
                    Yellow (Y)
                  </label>
                  <span className="text-gray-600">{yellowValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={yellowValue}
                  onChange={(e) => setYellowValue(Number(e.target.value))}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-gray-600">Black (K)</label>
                  <span className="text-gray-600">{blackValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={blackValue}
                  onChange={(e) => setBlackValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                />
              </div>

              <div className="mt-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    RGB Equivalent:
                  </p>
                  <code className="bg-white px-3 py-1 rounded text-sm font-mono">
                    rgb({currentRgb.r}, {currentRgb.g}, {currentRgb.b})
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div
            className="lg:w-1/2 flex justify-center"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="relative">
              <div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl transition-all duration-300"
                style={{ backgroundColor: rgbColor }}
              ></div>

              <div
                className="absolute -top-4 -left-4 bg-cyan-500 bg-opacity-90 text-white p-4 rounded-lg"
                data-aos="fade-down"
                data-aos-delay="600"
              >
                <p className="text-sm font-medium">C: {cyanValue}%</p>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-fuchsia-500 bg-opacity-90 text-white p-4 rounded-lg"
                data-aos="fade-down"
                data-aos-delay="800"
              >
                <p className="text-sm font-medium">M: {magentaValue}%</p>
              </div>

              <div
                className="absolute -bottom-4 -left-4 bg-yellow-400 bg-opacity-90 text-white p-4 rounded-lg"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                <p className="text-sm font-medium">Y: {yellowValue}%</p>
              </div>

              <div
                className="absolute -bottom-4 -right-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg"
                data-aos="fade-up"
                data-aos-delay="1200"
              >
                <p className="text-sm font-medium">K: {blackValue}%</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 text-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <p className="text-lg text-gray-700 mb-6">
            Layanan cetak profesional kami menggunakan model warna CMYK untuk menghasilkan warna yang cerah dan akurat untuk semua kebutuhan cetak Anda.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            Pelajari Lebih Lanjut tentang Manajemen Warna
          </button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCMYK;
