import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Recuperar from './components/Recuperar';
import Dashboard from './components/Home';
import Chat from './components/Chat';
import Perfil from "./components/Perfil";
import Configuracoes from "./components/Configuracoes";
import './styles/App.css';


function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/cadastro' element={<Cadastro />} /> 

        <Route path='/recuperar' element={<Recuperar />} /> 

        <Route path='/dashboard' element={<Dashboard />}></Route>

        <Route path='/chat' element={<Chat isOpen={true} />} />

        <Route path="/perfil" element={<Perfil />} />

        <Route path="/configuracoes" element={<Configuracoes />} />

      </Routes>
    </Router>
  );
}

export default App