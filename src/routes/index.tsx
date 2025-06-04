import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layout/GuestLayout';
import PublicForm from '../pages/PublicForm';

export const router = createBrowserRouter([
  // ... existing routes ...
  {
    path: '/form/:id',
    element: (
      <GuestLayout>
        <PublicForm />
      </GuestLayout>
    ),
  },
]); 