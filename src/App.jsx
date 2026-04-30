import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Treino from './pages/Treino'
import Login from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import Dieta from './pages/Dieta'
import Perfil from './pages/Perfil'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/treino' element={<Treino />} />
        <Route path='/dieta' element={<Dieta />} />
        <Route path='/perfil' element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
