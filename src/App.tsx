import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './component/Header';
import { Sidebar } from './component/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Interfaces } from './pages/Interfaces';
import { DhcpClients } from './pages/DhcpClients';
import { PppoeClients } from './pages/PppoeClients';
import { HotspotClients } from './pages/HotspotClients';
import { Connections } from './pages/Connections';
import { Footer } from './component/Footer';
import LogsComponent from './pages/Logs';
import { NotFound } from './pages/NotFound';
import { IpAddressList } from './pages/IpAddressList';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import PrivateRoute from './component/PrivateRoute';
import ProfilePage from './pages/ProfilePage';



function AppLayout() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex min-h-screen">
      {!hideLayout && <Sidebar />}
      <main className="flex-1 p-4">
        {!hideLayout && <Header />}

        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/interfaces" element={ <PrivateRoute><Interfaces /></PrivateRoute>} />
          <Route path="/dhcp-clients" element={ <PrivateRoute><DhcpClients /></PrivateRoute>} />
          <Route path="/pppoe-clients" element={<PrivateRoute><PppoeClients /></PrivateRoute>} />
          <Route path="/hotspot-clients" element={ <PrivateRoute><HotspotClients /></PrivateRoute>} />
          <Route path="/active-connections" element={<PrivateRoute><Connections /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><LogsComponent /></PrivateRoute>} />
          <Route path="/ip-add" element={<PrivateRoute><IpAddressList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* Rotas de autenticação */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>

        {!hideLayout && <Footer />}
      </main>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
