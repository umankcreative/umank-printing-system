import React, { useState } from 'react';

// --- 1. Definisi Tipe untuk Respons API Box ---
// Ini sangat penting untuk mendapatkan jaminan tipe dan autocompletion.
interface FileEntry {
  id: string;
  type: string;
  sequence_id: string;
  etag: string;
  sha1: string;
  name: string;
  // Anda bisa menambahkan properti lain yang relevan dari respons Box jika dibutuhkan
}

interface UploadResponse {
  entries: FileEntry[];
}

interface SharedLink {
  url: string;
  download_url?: string; // Tautan unduh opsional
  effective_access?: string;
  // ... properti lain dari shared link
}

interface FileUpdateResponse {
  id: string;
  name: string;
  shared_link: SharedLink | null; // Shared link bisa null jika belum diaktifkan
  // ... properti file lain setelah update
}

function BoxFileUpload(): JSX.Element { // Menambahkan tipe kembalian JSX.Element
  // --- 2. Anotasi Tipe untuk State ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [sharedLink, setSharedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // --- PENTING: GANTI DENGAN TOKEN AKSES BOX ANDA YANG SEBENARNYA ---
  const BOX_ACCESS_TOKEN: string = 'TpqBNY1nYMvPaeFYfYJKN3dxfZZV2Ywo';

  // --- 3. Anotasi Tipe untuk Argumen Fungsi ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedFile(event.target.files?.[0] || null); // Gunakan optional chaining dan nullish coalescing
    setUploadedFileId(null);
    setSharedLink(null);
    setError(null);
    setMessage(null);
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      setError('Mohon pilih file terlebih dahulu.');
      return;
    }

    // if (!BOX_ACCESS_TOKEN || BOX_ACCESS_TOKEN === 'IziF1ZyYeQPzvKrqe7lsZnXdSFm1etyp') {
    //   setError('Token akses Box belum diatur. Harap ganti YOUR_BOX_DEVELOPER_TOKEN dengan token Anda.');
    //   return;
    // }

    setUploading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();

    const attributes = JSON.stringify({
      name: selectedFile.name,
      parent: {
        id: '0'
      },
    });

    formData.append('attributes', attributes);
    formData.append('file', selectedFile);

    try {
      const uploadResponse = await fetch('https://upload.box.com/api/2.0/files/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BOX_ACCESS_TOKEN}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData: { message?: string } = await uploadResponse.json();
        throw new Error(
          `Gagal mengunggah file: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorData.message || 'Kesalahan tidak diketahui'}`
        );
      }

      // --- 4. Menggunakan Tipe yang Didefinisikan untuk Respons API ---
      const uploadData: UploadResponse = await uploadResponse.json();
      const fileId: string | undefined = uploadData.entries[0]?.id;

      if (!fileId) {
        throw new Error('File ID tidak ditemukan di respons unggahan.');
      }

      setUploadedFileId(fileId);
      setMessage(`File "${selectedFile.name}" berhasil diunggah dengan ID: ${fileId}`);

      const sharedLinkResponse = await fetch(`https://api.box.com/api/2.0/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${BOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shared_link: {
            access: 'open',
          },
        }),
      });

      if (!sharedLinkResponse.ok) {
        const errorData: { message?: string } = await sharedLinkResponse.json();
        throw new Error(
          `Gagal membuat shared link: ${sharedLinkResponse.status} ${sharedLinkResponse.statusText} - ${errorData.message || 'Kesalahan tidak diketahui'}`
        );
      }

      const sharedLinkData: FileUpdateResponse = await sharedLinkResponse.json();
      setSharedLink(sharedLinkData.shared_link?.url || null); // Penanganan null/undefined

      setMessage(prev => (prev ? prev + ` Shared link berhasil dibuat.` : `Shared link berhasil dibuat.`));

    } catch (err: any) { // Menggunakan 'any' untuk err yang tidak terduga, atau bisa lebih spesifik jika Anda tahu jenis kesalahan
      console.error('Error saat mengunggah atau membuat shared link:', err);
      setError((err as Error).message || 'Terjadi kesalahan tak terduga.'); // Type assertion untuk mengakses .message
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Unggah File ke Box dan Dapatkan Tautan Berbagi</h2>
      <p>
        <strong style={{ color: 'red' }}>Peringatan Keamanan:</strong> Dalam produksi, token akses Box
        harus didapatkan secara aman dari server backend, BUKAN disimpan di front-end.
      </p>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        disabled={uploading || !selectedFile}
        style={{
          padding: '10px 20px',
          backgroundColor: uploading ? '#cccccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {uploading ? 'Mengunggah...' : 'Unggah File ke Box'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}

      {uploadedFileId && (
        <p style={{ marginTop: '10px' }}>
          ID File yang Diunggah: <code style={{ backgroundColor: '#f0f0f0', padding: '3px 6px', borderRadius: '4px' }}>{uploadedFileId}</code>
        </p>
      )}

      {sharedLink && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e9f7ef', border: '1px solid #d0e9d0', borderRadius: '5px' }}>
          <p>Tautan Berbagi:</p>
          <a href={sharedLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', color: '#007bff' }}>
            {sharedLink}
          </a>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            (Akses setel ke 'terbuka'. Anda dapat mengubahnya di kode.)
          </p>
        </div>
      )}
    </div>
  );
}

export default BoxFileUpload;