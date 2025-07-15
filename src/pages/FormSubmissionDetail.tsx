import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFormSubmissionValues } from '../services/formService';
import { Order } from '../types/api';
import Card from '../components/ui/Card';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface Value {
  id: string;
  element_id: string;
  element: {
    id: string;
    label: string;
    type: string;
    options?: { id: string; label: string }[];
  };
  value: string | null;
  file_url: string | null;
}

interface FormSubmission {
  order: Order;
  template: Template;
  data: Value[];
  // id: string;
  // template_id: string;
  // status: string;
  // created_at: string;
  // order_id?: string;
  // customer_id?: string;
}

const FormSubmissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFormSubmissionValues(id)
      .then(res => setSubmission(res as unknown as FormSubmission))
      .catch(() => setSubmission(null))
      .finally(() => setLoading(false));
  }, [id]);

  console.log('Fetching submission:', JSON.stringify(submission, null, 2));
  if (loading) return <div className="p-8">Loading...</div>;
  if (!submission) return <div className="p-8">Submission tidak ditemukan.</div>;

  return (
    <div>
      <Link to="/admin/form-submissions" className="text-blue-600 rounded-lg hover:underline mb-4 inline-block">&larr; Kembali ke Daftar</Link>
      <h1 className="text-2xl font-bold mb-4">Detail Kiriman Formulir</h1>
      <Card className="bg-white w-[50%] p-6 rounded shadow mb-6">
    
        <div className="flex justify-between flex-row mb-4">
          <div className='w-2/6'><strong>Order Status:</strong></div>
          <div className='w-4/6' >{submission.order.status}</div>
        </div>
        <div className="flex justify-between flex-row mb-4">
          <div className='w-2/6'><strong>Order dibuat:</strong></div>
          <div className='w-4/6' >{new Date(submission.order.created_at).toLocaleString()}</div>
        </div>
        <div className="flex justify-between flex-row mb-4">
          <div className='w-2/6'><strong>Order Deadline:</strong></div>
          <div className='w-4/6' >{new Date(submission.order.delivery_date).toLocaleString()}</div>
        </div>
        {submission.order.id && (
        <div className="flex justify-between flex-row mb-4">
          <div className='w-2/6'><strong>Order terkait:</strong></div>
          <div className='w-4/6' ><Link to={`/admin/orders/${submission.order.id}`} className="text-purple-600 hover:text-purple-800">#{submission.order.id.slice(0,8)}</Link></div>
        </div>
        )}
      
        {submission.order.customer && (
          <div className="flex justify-between flex-row mb-4">
          <div className='w-2/6'><strong>Pelanggan terkait:</strong></div>
          <div className='w-4/6' ><Link to={`/admin/customers/${submission.order.customer_id}`} className="text-purple-600 hover:text-purple-800">{submission.order.customer.name}</Link></div>
        </div>
          
        )}
      </Card>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Data dari Pelanggan - {submission.template.name} :  </h2>
        <ul>
          {submission.data.map(val => (
            <li key={val.id} className="mb-2">
              <span className="font-medium">{val.element.label} : </span> {val.value || '-'} <br />
              
              {val.file_url && (
                <div>
                  <a href={val.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Unduh File 
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