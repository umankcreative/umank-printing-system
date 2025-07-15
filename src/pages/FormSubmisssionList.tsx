import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFormSubmissions } from '../services/formService';
import { Order } from '../types/api';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface FormSubmission {
  id: string;
  template_id: string;
  order_id: string;
  order: Order;
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
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Template</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No Order</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deadline</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dikirim pada</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-8 text-gray-500">
              Tidak ada isian form yang dikirimkan.
            </td>
          </tr>
              ) : (
          submissions.map(sub => (
            <tr key={sub.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 border-b">{sub.template?.name}</td>
              <td className="px-6 py-4 border-b">
                <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${
              sub.status === 'submitted'
                ? 'bg-green-100 text-green-800'
                : sub.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
                >
            {sub.status}
                </span>
              </td>
              <td className="px-6 py-4 border-b">
                <Link
                    to={`/admin/orders/${sub.order_id}`}
                    className="text-purple-600 hover:text-purple-800"
                >#{sub.order_id.slice(0, 8)}
              </Link></td>
              <td className="px-6 py-4 border-b">{new Date(sub.created_at).toLocaleString()}</td>
              <td className="px-6 py-4 border-b">
                {sub.order.delivery_date
                  ? new Date(sub.order.delivery_date).toLocaleString()
                  : '-'}
              </td>
              <td className="px-6 py-4 border-b">
                <Link
            to={`/admin/form-submissions/${sub.id}`}
            className="inline-block px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
            Detail
                </Link>
              </td>
            </tr>
          ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormSubmissionList;