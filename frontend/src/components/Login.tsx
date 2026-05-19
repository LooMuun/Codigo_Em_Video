import React from "react";
import logoCev from "../assets/logo-cev.svg";
import iconMail from "../assets/mail.svg";
import iconLock from "../assets/locked.svg";
import iconEye from "../assets/eye.svg";
import "../styles/App.css";

const Login = () => {
  return (
    <div className="auth-page">
      <div key="login-blue" className="shape-blue"></div>
      <div key="login-green" className="shape-green"></div>

      <div className="login-wrapper fade-in-container">
        {/* Lado Esquerdo*/}
        <div className="auth-card-horizontal">
          <div className="auth-header">
            <img src={logoCev} alt="Mini Logo" className="mini-logo" />
            <h2>Seja bem-vindo!</h2>
          </div>

          <form className="auth-form">
            <div className="input-group">
              <div className="label-row">
                <label>E-mail</label>
                <a href="/cadastro" className="link-text">
                  Novo aqui? Cadastre-se
                </a>
              </div>
              <div className="input-wrapper">
                <img src={iconMail} alt="" className="field-icon" />
                <input type="email" placeholder="Seu e-mail aqui" required />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label>Senha</label>
                <a href="/recuperar" className="link-text">
                  Esqueceu sua senha?
                </a>
              </div>
              <div className="input-wrapper">
                <img src={iconLock} alt="" className="field-icon" />
                <input type="password" placeholder="Sua senha aqui" required />
                <img src={iconEye} alt="" className="eye-icon" />
              </div>
            </div>

            <button type="submit" className="auth-button">
              ENTRAR
            </button>
            <p className="guest-link">Entrar como Convidado</p>
          </form>
        </div>

        {/* Lado Direito*/}
        <div className="brand-section">
          <img src={logoCev} alt="Logo Grande" className="big-logo" />
          <h1 className="platform-name">
            <span className="highlight-code">CÓDIGO</span>
            <br />
            EM VÍDEO
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
