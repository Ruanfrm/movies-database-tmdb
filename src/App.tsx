import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

export function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/interfaces" element={<Interfaces />} />
            <Route path="/dhcp-clients" element={<DhcpClients />} />
            <Route path="/pppoe-clients" element={<PppoeClients />} />
            <Route path="/hotspot-clients" element={<HotspotClients />} />
            <Route path="/active-connections" element={<Connections />} />
            <Route path="/logs" element={<LogsComponent/>} />

          </Routes>
        <Footer/>
        </main>
      </div>
    </Router>
  );
}
