import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Marketplace
import Landing from './pages/Landing';
import EventPage from './pages/EventPage';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Personal
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';

// Workspace
import OrgOnboarding from './pages/OrgOnboarding';
import Organizations from './pages/Organizations';
import OrgOverview from './pages/OrgOverview';
import OrgCreateEvent from './pages/OrgCreateEvent';
import OrgManageEvent from './pages/OrgManageEvent';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Marketplace */}
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Landing />} />
        <Route path="/events/:id" element={<EventPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Personal */}
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Workspace */}
        <Route path="/organizations/create" element={<ProtectedRoute><OrgOnboarding /></ProtectedRoute>} />
        <Route path="/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
        <Route path="/org/:orgId" element={<ProtectedRoute><OrgOverview /></ProtectedRoute>} />
        <Route path="/org/:orgId/events/create" element={<ProtectedRoute><OrgCreateEvent /></ProtectedRoute>} />
        <Route path="/org/:orgId/event/:eventId" element={<ProtectedRoute><OrgManageEvent /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
