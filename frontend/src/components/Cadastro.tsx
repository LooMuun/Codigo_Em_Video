import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import logoCev from "../assets/logo-cev.svg";
import meshGradient from "../assets/image-mesh-gradient.png";
import { authService } from "../services/auth.service";

import "../styles/App.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        setError("Este e-mail já está cadastrado.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* fundo escuro com shapes originais */}
      <div className="shape-blue" />
      <div className="shape-green" />

      {/* card grande único: form (esq) + imagem (dir) */}
      <div className="login-card fade-in-container">

        {/* ── LADO ESQUERDO: formulário ── */}
        <div className="card-left">

          {success ? (
            <div className="success-container">
              <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="#25c19F" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <h2 className="card-title" style={{ textAlign: "center" }}>Conta criada!</h2>
              <p className="card-subtitle" style={{ textAlign: "center" }}>
                Redirecionando para o login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="card-title">Crie sua conta</h2>
              <p className="card-subtitle">Rápido, fácil e gratuito.</p>

              <div className="tab-row">
                <Link to="/login" className="tab-item">Entrar</Link>
                <span className="tab-item active">Cadastrar</span>
              </div>

              <form className="auth-form" onSubmit={handleRegister}>

                {/* Nome */}
                <div className="input-group">
                  <div className="input-wrapper">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="input-group">
                  <div className="input-wrapper">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                    </svg>
                    <input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="input-group">
                  <div className="input-wrapper">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div className="input-group">
                  <div className="input-wrapper">
                    <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m9 12 2 2 4-4" /><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Indicador de força de senha */}
                {password.length > 0 && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      <span className={`strength-bar ${password.length >= 1 ? "active weak" : ""}`} />
                      <span className={`strength-bar ${password.length >= 6 ? "active medium" : ""}`} />
                      <span className={`strength-bar ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? "active strong" : ""}`} />
                    </div>
                    <span className="strength-label">
                      {password.length < 6 ? "Fraca" : password.length < 10 ? "Média" : "Forte"}
                    </span>
                  </div>
                )}

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </button>

                <div className="divider">
                  <span className="divider-line" />
                  <span className="divider-text">ou cadastre com</span>
                  <span className="divider-line" />
                </div>

                <button type="button" className="btn-social">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Cadastrar com GitHub
                </button>

                <button type="button" className="btn-social">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Cadastrar com Google
                </button>

              </form>
            </>
          )}
        </div>

        {/* ── LADO DIREITO: imagem + logo ── */}
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

export default Register;