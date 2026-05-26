import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import logoCev from "../assets/logo-cev.svg";
import meshGradient from "../assets/image-mesh-gradient.png";
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
      <div className="shape-blue"></div>
      <div className="shape-green"></div>

      <div className="login-wrapper fade-in-container">
        {/* Lado Esquerdo */}
        <div className="auth-card-horizontal">
          <div className="auth-header">
            <img
              src={logoCev}
              alt="Mini Logo"
              className="mini-logo"
            />
            <h2>Seja bem-vindo!</h2>
          </div>

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >
            <div className="input-group">
              <div className="input-wrapper">
                <img
                  src={iconMail}
                  alt=""
                  className="field-icon"
                />

                <input
                  type="email"
                  placeholder="Seu e-mail aqui"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

          {/* Senha */}
            <div className="input-group">
              <div className="input-wrapper">
                <img
                  src={iconLock}
                  alt=""
                  className="field-icon"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Sua senha aqui"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <img
                  src={iconEye}
                  alt="mostrar senha"
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading
                ? "ENTRANDO..."
                : "ENTRAR"}
            </button>

            <p className="guest-link">
              Entrar como Convidado
            </p>
          </form>
        </div>

        {/* Lado Direito */}
        <div className="brand-section">
          <img
            src={logoCev}
            alt="Logo Grande"
            className="big-logo"
          />

          <h1 className="platform-name">
            <span className="highlight-code">
              CÓDIGO
            </span>

            <br />

            EM VÍDEO
          </h1>
        </div>

      </div>
    </div>
  );
};

export default Login;