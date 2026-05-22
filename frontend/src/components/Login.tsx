import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import logoCev from "../assets/logo-cev.svg";
import { authService } from "../services/auth.service";

import "../styles/App.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");
  const [rememberMe, setRememberMe]     = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    try {
      setIsLoading(true);
      const data  = await authService.login({ email, password });
      const token = data.access_token || data.token;
      if (!token) throw new Error("Token não retornado");
      localStorage.setItem("token", token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="shape-blue" />
      <div className="shape-green" />

      <div className="login-card fade-in-container">

        {/* ── LADO ESQUERDO: formulário ── */}
        <div className="card-left">
          <h2 className="card-title">Seja bem-vindo!</h2>
          <p className="card-subtitle">Pronto para continuar de onde parou.</p>

          <div className="tab-row">
            <span className="tab-item active">Entrar</span>
            <Link to="/cadastro" className="tab-item">Cadastrar</Link>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>

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

            <div className="input-group">
              <div className="input-wrapper">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
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

            <div className="options-row">
              <label className="remember-label">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Lembrar de mim</span>
              </label>
              <Link to="/recuperar" className="forgot-link">Esqueceu a senha?</Link>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Login"}
            </button>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">ou continue com</span>
              <span className="divider-line" />
            </div>

            <button type="button" className="btn-social">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Entrar com GitHub
            </button>

            <button type="button" className="btn-social">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Entrar com Google
            </button>

          </form>
        </div>

        {/* ── LADO DIREITO: gradient + logo ── */}
        <div className="card-right">
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

export default Login;