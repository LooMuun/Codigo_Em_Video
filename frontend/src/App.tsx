import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Recuperar from './components/Recuperar';
import Dashboard from './components/Home';
import Chat from './components/Chat';
import './styles/App.css';


function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/' element={<Dashboard />} />

        <Route path='/cadastro' element={<Cadastro />} /> 

        <Route path='/recuperar' element={<Recuperar />} /> 

        <Route path='/login' element={<Login />}></Route>

        <Route path='/chat' element={<Chat isOpen={true} />} />
      </Routes>
    </Router>
  );
}

export default App