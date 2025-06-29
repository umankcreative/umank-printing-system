import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFormSubmissions } from '../services/formService';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface FormSubmission {
  id: string;
  template_id: string;
  status: string;
  created_at: string;
  template: Template;
}

// interface PaginatedResponse {
//   data: FormSubmission[];
//   current_page: number;
//   last_page: number;
//   next_page_url: string | null;
//   prev_page_url: string | null;
//   total: number;
// }

const FormSubmissionList: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFormSubmissions()
      .then(res => setSubmissions(res.data))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Isian Form</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Template</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Dikirim pada</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id}>
                <td className="px-4 py-2 border">{sub.template?.name}</td>
                <td className="px-4 py-2 border">{sub.status}</td>
                <td className="px-4 py-2 border">{new Date(sub.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <Link to={`/admin/form-submissions/${sub.id}`} className="text-blue-600 hover:underline">
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">Tidak ada isian form yang dikirimkan.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FormSubmissionList;