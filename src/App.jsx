import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inventory from './pages/Inventory'
import Market from './pages/Market'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App