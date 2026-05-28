import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Recuperar from './components/Recuperar';
import Dashboard from './pages/Home'; // Sua Home/Dashboard original
import Chat from './pages/Chat';
import Perfil from "./pages/Perfil";
import Aulas from './pages/Aulas'; // Sua tela de player de vídeo
import Configuracoes from "./pages/Configuracoes";
import './styles/App.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Suas rotas originais do sistema */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Se você acessar a home por '/' ou por '/dashboard' */}
          <Route path="/home" element={<Dashboard />} />      {/* Mantendo compatibilidade */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />

          {/* 🚀 A NOVA ROTA DO PLAYER: Captura o ID do módulo dinamicamente */}
          <Route path="/modulo/:moduloId/aulas" element={<Aulas />} />
        </Routes>
      </div>
    </Router>
  );
}