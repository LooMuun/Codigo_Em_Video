import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Recuperar from './components/Recuperar';
import Dashboard from './pages/Home';
import Chat from './pages/Chat';
import Perfil from "./pages/Perfil";
import Aulas from './pages/Aulas';
import Configuracoes from "./pages/Configuracoes";
import './styles/App.css';
import { LoadingOverlay } from './components/ui/LoadingOverlay';

// ReRoute pra que se um usuario ja estiver logado a pagina de login seja pulada e va direto pra home
const PublicRoute = () =>{
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      //Check pra ver se nn ta logado por Email e Senha
      const token = localStorage.getItem("token");
      if (token){
        setIsAuthed(true);
        setIsLoading(false);
        return;
      }
      //Check pra ver se nn ta logado no SupaBase (Github ou Google)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthed(true);
      }

      setIsLoading(false);
    }

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return isAuthed ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route element={<PublicRoute />}>          
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar" element={<Recuperar />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/modulo/:moduloId/aulas" element={<Aulas />} />
        </Routes>
      </div>
    </Router>
  );
}