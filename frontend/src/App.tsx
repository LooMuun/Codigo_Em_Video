import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login' 
import Cadastro from './components/Cadastro'
import Recuperar from './components/Recuperar'
import './styles/App.css';


function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path='/cadastro' element={<Cadastro />} /> 

        <Route path='/recuperar' element={<Recuperar />} /> 

      </Routes>
    </Router>
  );
}

export default App