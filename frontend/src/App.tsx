import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Recuperar from './components/Recuperar';
import Dashboard from './pages/Home';
import Chat from './pages/Chat';
import Perfil from "./pages/Perfil";
import Aulas from './pages/Aulas';
import Materiais from './pages/Materiais';
import Avaliacao from './pages/Avaliacao';
import Quiz from "./pages/Quiz";
import Configuracoes from "./pages/Configuracoes";
import './styles/App.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/modulo/:moduloId/aulas" element={<Aulas />} />
          <Route path="/modulo/:moduloId/materiais" element={<Materiais />} />
          <Route path="/modulo/:moduloId/avaliacao" element={<Avaliacao />} />
          <Route path="/modulo/:moduleId/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}