import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import EventListing from './pages/EventListing';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import PaymentCheckout from './pages/PaymentCheckout';
import MyTickets from './pages/MyTickets';
import TicketDetail from './pages/TicketDetail';
import MyWaitlists from './pages/MyWaitlists';
import Profile from './pages/Profile';

import OrganizerEvents from './pages/organizer/Events';
import OrganizerCreateEvent from './pages/organizer/CreateEvent';
import OrganizerScanner from './pages/organizer/Scanner';
import OrganizerAttendees from './pages/organizer/Attendees';
import OrganizerAnalytics from './pages/organizer/Analytics';
import OrganizerReviews from './pages/organizer/Reviews';
import OrganizerPromote from './pages/organizer/Promote';
import OrganizerCoupons from './pages/organizer/Coupons';
import OrganizerGlobalAttendees from './pages/organizer/GlobalAttendees';
import OrganizerCopyrights from './pages/organizer/Copyrights';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminCoupons from './pages/admin/Coupons';
import AdminPromotions from './pages/admin/Promotions';
import AdminEvents from './pages/admin/Events';
import AdminOrganizers from './pages/admin/Organizers';
import AdminCopyrightReports from './pages/admin/CopyrightReports';
import AdminRevenue from './pages/admin/Revenue';
import AdminReviews from './pages/admin/Reviews';

// Static Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Help from './pages/Help';
import Pricing from './pages/Pricing';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('api_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventListing />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help" element={<Help />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected Attendee Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/payment-checkout" element={
          <ProtectedRoute>
            <PaymentCheckout />
          </ProtectedRoute>
        } />
        <Route path="/my-tickets" element={
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
        } />
        <Route path="/my-tickets/:reference" element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        } />
        <Route path="/my-waitlists" element={
          <ProtectedRoute>
            <MyWaitlists />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Organizer Console Routes */}
        <Route path="/organizer/events" element={
          <ProtectedRoute>
            <OrganizerEvents />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/create" element={
          <ProtectedRoute>
            <OrganizerCreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id/edit" element={
          <ProtectedRoute>
            <OrganizerCreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id/scan" element={
          <ProtectedRoute>
            <OrganizerScanner />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id/attendees" element={
          <ProtectedRoute>
            <OrganizerAttendees />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id/promote" element={
          <ProtectedRoute>
            <OrganizerPromote />
          </ProtectedRoute>
        } />
        <Route path="/organizer/analytics" element={
          <ProtectedRoute>
            <OrganizerAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/organizer/reviews" element={
          <ProtectedRoute>
            <OrganizerReviews />
          </ProtectedRoute>
        } />
        <Route path="/organizer/coupons" element={
          <ProtectedRoute>
            <OrganizerCoupons />
          </ProtectedRoute>
        } />
        <Route path="/organizer/attendees" element={
          <ProtectedRoute>
            <OrganizerGlobalAttendees />
          </ProtectedRoute>
        } />
        <Route path="/organizer/copyrights" element={
          <ProtectedRoute>
            <OrganizerCopyrights />
          </ProtectedRoute>
        } />

        {/* Admin Control Room Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/coupons" element={
          <ProtectedRoute>
            <AdminCoupons />
          </ProtectedRoute>
        } />
        <Route path="/admin/promotions" element={
          <ProtectedRoute>
            <AdminPromotions />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute>
            <AdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/admin/organizers/pending" element={
          <ProtectedRoute>
            <AdminOrganizers />
          </ProtectedRoute>
        } />
        <Route path="/admin/copyright-reports" element={
          <ProtectedRoute>
            <AdminCopyrightReports />
          </ProtectedRoute>
        } />
        <Route path="/admin/revenue" element={
          <ProtectedRoute>
            <AdminRevenue />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute>
            <AdminReviews />
          </ProtectedRoute>
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
