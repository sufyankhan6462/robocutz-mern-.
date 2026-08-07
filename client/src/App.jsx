import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Barbers from './pages/public/Barbers';
import BarberDetails from './pages/public/BarberDetails';
import Services from './pages/public/Services';
import Gallery from './pages/public/Gallery';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Staff & Admin Pages
import StaffLayout from './pages/admin/StaffLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import AppointmentsManager from './pages/admin/AppointmentsManager';
import POSScreen from './pages/admin/POSScreen';
import BarbersManager from './pages/admin/BarbersManager';
import ServicesManager from './pages/admin/ServicesManager';
import ProductsManager from './pages/admin/ProductsManager';
import StaffAccountsManager from './pages/admin/StaffAccountsManager';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [initialBarberId, setInitialBarberId] = useState(null);

  const handleOpenBooking = (barberId = null) => {
    setInitialBarberId(barberId);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-zinc-100 flex flex-col justify-between">
      
      {/* Universal Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialBarberId={initialBarberId}
      />

      <Routes>
        
        {/* Public Website Routes with Navbar & Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar onOpenBooking={() => handleOpenBooking()} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home onOpenBooking={() => handleOpenBooking()} />} />
                  <Route path="/barbers" element={<Barbers onOpenBooking={() => handleOpenBooking()} />} />
                  <Route path="/barber/:id" element={<BarberDetails onOpenBooking={(id) => handleOpenBooking(id)} />} />
                  <Route path="/services" element={<Services onOpenBooking={() => handleOpenBooking()} />} />
                  <Route path="/gallery" element={<Gallery onOpenBooking={() => handleOpenBooking()} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Customer Protected Dashboard */}
                  <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                    <Route path="/dashboard" element={<CustomerDashboard onOpenBooking={() => handleOpenBooking()} />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* Staff & Admin Internal Management Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'receptionist', 'barber']} />}>
          <Route path="/admin" element={<StaffLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="appointments" element={<AppointmentsManager />} />
            <Route path="pos" element={<POSScreen />} />
            <Route path="barbers" element={<BarbersManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="staff" element={<StaffAccountsManager />} />
            <Route path="reports" element={<ReportsAnalytics />} />
          </Route>
        </Route>

      </Routes>
    </div>
  );
}
