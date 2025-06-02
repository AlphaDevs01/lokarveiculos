import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public pages
import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import VehicleDetail from './pages/public/VehicleDetail';
import Login from './pages/admin/Login';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import AdminHome from './pages/admin/AdminHome';
import VehicleList from './pages/admin/VehicleList';
import AddVehicle from './pages/admin/AddVehicle';
import EditVehicle from './pages/admin/EditVehicle';

// App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public routes with header/footer */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="catalogo" element={<Catalog />} />
              <Route path="veiculo/:id" element={<VehicleDetail />} />
              <Route path="login" element={<Login />} />
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="veiculos" element={<VehicleList />} />
              <Route path="veiculos/novo" element={<AddVehicle />} />
              <Route path="veiculos/editar/:id" element={<EditVehicle />} />
            </Route>
          </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#1E3A8A',
                  color: '#fff',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#DC2626',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Public layout with header and footer
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="veiculo/:id" element={<VehicleDetail />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;