import { Link } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import iconAvatar from "../assets/avatar.svg";
import iconMail from "../assets/mail.svg";
import iconLock from "../assets/locked.svg";
import iconEye from "../assets/eye.svg";
import "../styles/App.css";

const Cadastro = () => {
  return (
    <div className="auth-page">
      {/* Fundo */}
      <div key="register-blue" className="shape-blue-register"></div>
      <div key="register-green" className="shape-green-register"></div>

      {/* Card de Cadastro */}
      <div className="auth-card-horizontal register-card">
        <div className="auth-header-container">
          {/* Marca: Logo + Texto Centralizado */}
          <div className="brand-header-row">
            <img src={logoCev} alt="Logo" className="mini-logo" />
            <div className="brand-text-stack">
              <span className="brand-code">CÓDIGO</span>
              <span className="brand-video">EM VÍDEO</span>
            </div>
          </div>
          {/* Título da Ação */}
          <h2 className="register-title">Crie seu cadastro</h2>
        </div>
        <form className="auth-form">
          {/* Campo Usuário */}
          <div className="input-group">
            <label>Usuário</label>
            <div className="input-wrapper">
              <img src={iconAvatar} alt="" className="field-icon" />
              <input
                type="text"
                placeholder="Insira o seu nome de usuário"
                required
              />
            </div>
          </div>

          {/* Campo Email */}
          <div className="input-group">
            <label>E-mail</label>
            <div className="input-wrapper">
              <img src={iconMail} alt="" className="field-icon" />
              <input type="email" placeholder="Insira o seu e-mail" required />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="input-group">
            <label>Senha</label>
            <div className="input-wrapper">
              <img src={iconLock} alt="" className="field-icon" />
              <input type="password" placeholder="Insira sua senha" required />
              <img src={iconEye} alt="" className="eye-icon" />
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div className="input-group">
            <label>Confirmar Senha</label>
            <div className="input-wrapper">
              <img src={iconLock} alt="" className="field-icon" />
              <input
                type="password"
                placeholder="Confirme a sua senha"
                required
              />
              <img src={iconEye} alt="" className="eye-icon" />
            </div>
          </div>

          <button type="submit" className="auth-button">
            CADASTRAR
          </button>
          <Link to="/" className="guest-link">
            Já tem uma conta? Entrar
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
