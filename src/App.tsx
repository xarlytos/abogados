import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expedientes from './pages/Expedientes'
import ExpedienteDetail from './pages/ExpedienteDetail'
import Calendario from './pages/Calendario'
import Clientes from './pages/Clientes'
import ClienteDetail from './pages/ClienteDetail'
import Informes from './pages/Informes'
import Mensajes from './pages/Mensajes'
import Facturacion from './pages/Facturacion'
import Biblioteca from './pages/Biblioteca'
import Tareas from './pages/Tareas'
import PortalCliente from './pages/PortalCliente'
import Audiencias from './pages/Audiencias'
import Cobranza from './pages/Cobranza'
import Gastos from './pages/Gastos'
import Plantillas from './pages/Plantillas'
import Notificaciones from './pages/Notificaciones'
import Bitacora from './pages/Bitacora'
import Proveedores from './pages/Proveedores'
import Contabilidad from './pages/Contabilidad'
import Admin from './pages/Admin'
import Tiempo from './pages/Tiempo'
import SignatureManagement from './pages/SignatureManagement'
import Prescripciones from './pages/Prescripciones'
import ConflictosPartesContrarias from './pages/ConflictosPartesContrarias'
import Conflictos from './pages/Conflictos'
import AnalisisConflictos from './pages/AnalisisConflictos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expedientes" element={<Expedientes />} />
        <Route path="/expedientes/:id" element={<ExpedienteDetail />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/:id" element={<ClienteDetail />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="/facturacion" element={<Facturacion />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/portal-cliente" element={<PortalCliente />} />
        <Route path="/audiencias" element={<Audiencias />} />
        <Route path="/cobranza" element={<Cobranza />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/plantillas" element={<Plantillas />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/bitacora" element={<Bitacora />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/contabilidad" element={<Contabilidad />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/tiempo" element={<Tiempo />} />
        <Route path="/firmas" element={<SignatureManagement />} />
        <Route path="/prescripciones" element={<Prescripciones />} />
        <Route path="/conflictos/partes" element={<ConflictosPartesContrarias />} />
        <Route path="/conflictos" element={<Conflictos />} />
        <Route path="/conflictos/analisis" element={<AnalisisConflictos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
