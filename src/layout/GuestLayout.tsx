
import { Outlet } from 'react-router-dom';
import Header from '../components/guest/Header';

function GuestLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default GuestLayout;
