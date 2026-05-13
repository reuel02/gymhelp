import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Treino from './pages/Treino'
import Login from './pages/Login'
import { Cadastro } from './pages/Cadastro'
import Dieta from './pages/Dieta'
import Perfil from './pages/Perfil'
import Metricas from './pages/Metricas'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import InstallPrompt from './components/PWA/InstallPrompt'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/esqueci-senha' element={<EsqueciSenha />} />
        <Route path='/redefinir-senha' element={<RedefinirSenha />} />
        <Route path='/treino' element={<Treino />} />
        <Route path='/dieta' element={<Dieta />} />
        <Route path='/metricas' element={<Metricas />} />
        <Route path='/perfil' element={<Perfil />} />
      </Routes>
      <InstallPrompt />
    </BrowserRouter>
  )
}

export default App
