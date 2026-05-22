import React from "react";
import { Link } from "react-router-dom";

import logoCev from "../assets/logo-cev.svg";
import meshGradient from "../assets/image-mesh-gradient.png";
import "../styles/App.css";

const Cadastro = () => {
  return (
    <div className="auth-page">
      <div className="shape-blue" />
      <div className="shape-green" />
      <div className="login-card fade-in-container">
        
        {/* LADO ESQUERDO: */}
        <div className="card-left">
          <h2 className="card-title">Crie sua conta</h2>
          <p className="card-subtitle">Junte-se a nós para começar a aprender.</p>

          <div className="tab-row">
            <Link to="/" className="tab-item">Entrar</Link>
            <span className="tab-item active">Cadastrar</span>
          </div>

          <form className="auth-form">
            {/* Campo Usuário */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input type="text" placeholder="Insira o seu nome de usuário" required />
              </div>
            </div>

            {/* Campo E-mail */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
                <input type="email" placeholder="Insira o seu e-mail" required />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input type="password" placeholder="Crie uma senha" required />
                <button type="button" className="eye-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div className="input-group">
              <div className="input-wrapper">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input type="password" placeholder="Confirme a sua senha" required />
                <button type="button" className="eye-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
              Cadastrar
            </button>
          </form>
        </div>

        {/*LADO DIREITO:*/}
        <div className="card-right">
          <img src={meshGradient} alt="" className="card-right-bg" />
          <div className="card-right-content">
            <img src={logoCev} alt="Logo" className="brand-big-logo" />
            <p className="brand-big-name">
              <span className="brand-highlight">CÓDIGO</span> EM VÍDEO
            </p>
          </div>
          <p className="card-copyright">© 2025 Código em Vídeo · Todos os direitos reservados</p>
        </div>

      </div>
    </div>
  );
};

export default Cadastro;