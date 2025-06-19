import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFormSubmissionValues } from '../services/formService';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface Value {
  id: string;
  element_id: string;
  value: string | null;
  file_url: string | null;
}

interface FormSubmission {
  id: string;
  template_id: string;
  status: string;
  created_at: string;
  template: Template;
  values: Value[];
  order_id?: string;
  customer_id?: string;
}

const FormSubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFormSubmissionValues(id)
      .then(res => setSubmission(res as FormSubmission))
      .catch(() => setSubmission(null))
      .finally(() => setLoading(false));
  }, [id]);

  console.log(`Fetching submission: ${submission}`);
  if (loading) return <div className="p-8">Loading...</div>;
  if (!submission) return <div className="p-8">Submission not found.</div>;

  return (
    <div className="container mx-auto py-8">
      <Link to="/admin/form-submissions" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to List</Link>
      <h1 className="text-2xl font-bold mb-4">Submission Detail</h1>
      <div className="bg-white p-6 rounded shadow mb-6">
        <p><strong>Template:</strong> {submission.template?.name}</p>
        <p><strong>Status:</strong> {submission.status}</p>
        <p><strong>Submitted At:</strong> {new Date(submission.created_at).toLocaleString()}</p>
        {submission.order_id && (
          <p><strong>Related Order:</strong> <Link to={`/orders/${submission.order_id}`} className="text-blue-600 underline">{submission.order_id}</Link></p>
        )}
        {submission.customer_id && (
          <p><strong>Related Customer:</strong> <Link to={`/customers/${submission.customer_id}`} className="text-blue-600 underline">{submission.customer_id}</Link></p>
        )}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Data dari Konsumen : </h2>
        <ul>
          {submission?.map(val => (
            <li key={val.id} className="mb-2">
              <span className="font-medium">{val.element.label} : </span> {val.value || '-'} <br />
              
              {val.file_url && (
                <div>
                  <a href={val.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Download File
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormSubmissionDetail;