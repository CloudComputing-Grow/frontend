import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Inventory from './pages/Inventory'
import Market from './pages/Market'
import MissionDashboard from './components/MissionDashboard';
import MissionDetail from './components/MissionDetail';
import AdminCertManager from './components/AdminCertManager';
import LastComplete from './components/LastComplete';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/market" element={<Market />} />
        <Route path="/missions" element={<MissionDashboard />} />
        <Route path="/dashboard" element={<MissionDetail />} />
        <Route path="/api/v1/missions/detail" element={<MissionDetail />} />
        <Route path="/admin/certs" element={<AdminCertManager />} />
        <Route path="/api/v1/admin/certs" element={<AdminCertManager />} />
        <Route path="/last-complete" element={<LastComplete />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App