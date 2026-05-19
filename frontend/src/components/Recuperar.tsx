import { Link } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import iconMail from "../assets/mail.svg";
import iconLock from "../assets/locked.svg";
import iconCheck from "../assets/check_circle.svg"
import React, { useState } from "react";

const Recuperar = () => {
    const [etapa, setEtapa] = useState("email");

    const handleProximaEtapa = (e: React.FormEvent) => {
        e.preventDefault();
        if (etapa === "email") setEtapa("codigo");
        else if (etapa === "codigo") setEtapa("sucesso");
    };

    return (
        <div className="auth-page">
            <div className="shape-blue-register"></div>
            <div className="shape-green-register"></div>

            <div className="auth-card-horizontal register-card">
                <div className="auth-header-container">
                    <div className="brand-header-row">
                        <img src={logoCev} alt="Logo" className="mini-logo" />
                        <div className="brand-text-stack">
                            <span className="brand-code">CÓDIGO</span>
                            <span className="brand-video">EM VÍDEO</span>
                        </div>
                    </div>
                    
                    <h2 className="register-title">
                        {etapa === "email" && "Recuperar Senha"}
                        {etapa === "codigo" && "Verificar Código"}
                        {etapa === "sucesso" && "Tudo Pronto!"}
                    </h2>
                </div>

                {/* Solicitar email */}
                {etapa === "email" && (
                    <form className="auth-form fade-in-container" onSubmit={handleProximaEtapa}>
                        <div className="input-group">
                            <label>E-mail</label>
                            <div className="input-wrapper">
                                <img src={iconMail} alt="" className="field-icon" />
                                <input type="email" placeholder="Digite seu e-mail cadastrado" required />
                            </div>
                        </div>
                        <button type="submit" className="auth-button">ENVIAR CÓDIGO</button>
                        <Link to='/' className="guest-link">Lembrou? Entrar</Link>
                    </form>
                )}

                {/* Validar código */}
                {etapa === "codigo" && (
                    <form className="auth-form fade-in-container" onSubmit={handleProximaEtapa}>
                        <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
                            Insira o código enviado para o seu e-mail.
                        </p>
                        <div className="input-group">
                            <label>Código de 6 dígitos</label>
                            <div className="input-wrapper">
                                <img src={iconLock} alt="" className="field-icon" />
                                <input 
                                    type="text" 
                                    placeholder="000000" 
                                    maxLength={6} 
                                    required 
                                    style={{ textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold', fontSize: '20px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="auth-button">VALIDAR</button>
                        <button type="button" className="guest-link" onClick={() => setEtapa("email")} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', margin: '15px auto 0' }}>
                            Reenviar e-mail
                        </button>
                    </form>
                )}

                {/* Tela de Sucesso */}
                {etapa === "sucesso" && (
                    <div className="auth-form fade-in-container success-container">
                    {}
                        <img src={iconCheck} alt="Sucesso" className="success-icon-svg" />
    
                        <p className="success-message"> Sua identidade foi confirmada! <br />
                        Agora você pode acessar sua conta.
                        </p>

                        <Link to="/" className="auth-button" style={{ textDecoration: 'none', display: 'block' }}>
                         VOLTAR PARA O LOGIN
                        </Link>
                    </div>
                    )}
            </div>
        </div>
    );
}

export default Recuperar;