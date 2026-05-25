import { Link } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import iconMail from "../assets/mail.svg";
import iconLock from "../assets/locked.svg";
import iconCheck from "../assets/check_circle.svg";
import imgMeshGradient from "../assets/image-mesh-gradient.png";
import React, { useState } from "react";

const Recuperar = () => {
    const [etapa, setEtapa] = useState("email");

    const handleProximaEtapa = (e: React.FormEvent) => {
        e.preventDefault();
        if (etapa === "email") setEtapa("codigo");
        else if (etapa === "codigo") setEtapa("sucesso");
    };

    return (
        <div className="courses-dashboard-container auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Shapes do Background Global */}
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>

            {/* CARD ÚNICO FLUTUANTE */}
            <div className="login-card fade-in-container">
                
                {/* LADO ESQUERDO: Conteúdo Centralizado e Limpo */}
                <div className="card-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    
                    {/* Títulos Dinâmicos (Sem o header repetido acima) */}
                    <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '6px' }}>
                        {etapa === "email" && "Recuperar Senha"}
                        {etapa === "codigo" && "Verificar Código"}
                        {etapa === "sucesso" && "Tudo Pronto!"}
                    </h2>
                    <p className="card-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {etapa === "email" && "Pronto para continuar de onde parou."}
                        {etapa === "codigo" && "Insira o código enviado para o seu e-mail."}
                        {etapa === "sucesso" && "Sua identidade foi confirmada!"}
                    </p>

                    {/* FORMULÁRIOS */}
                    {etapa === "email" && (
                        <form className="auth-form" onSubmit={handleProximaEtapa}>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={iconMail} alt="" className="field-icon" />
                                    <input type="email" placeholder="Digite seu e-mail cadastrado" required />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                ENVIAR CÓDIGO
                            </button>
                            <Link to='/' className="forgot-link" style={{ textAlign: 'center', marginTop: '14px' }}>
                                Lembrou? Entrar
                            </Link>
                        </form>
                    )}

                    {etapa === "codigo" && (
                        <form className="auth-form" onSubmit={handleProximaEtapa}>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={iconLock} alt="" className="field-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="000000" 
                                        maxLength={6} 
                                        required 
                                        style={{ 
                                            textAlign: 'center', 
                                            letterSpacing: '6px', 
                                            fontWeight: 'bold',
                                            fontSize: '15px'
                                        }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                                VALIDAR CÓDIGO
                            </button>
                            <button 
                                type="button" 
                                className="forgot-link" 
                                onClick={() => setEtapa("email")} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '14px auto 0' }}
                            >
                                Reenviar e-mail
                            </button>
                        </form>
                    )}

                    {etapa === "sucesso" && (
                        <div className="auth-form" style={{ alignItems: 'center' }}>
                            <img 
                                src={iconCheck} 
                                alt="Sucesso" 
                                style={{ 
                                    width: '56px', 
                                    height: '56px', 
                                    marginBottom: '16px',
                                    filter: 'invert(82%) sepia(51%) saturate(941%) hue-rotate(113deg) brightness(102%) drop-shadow(0 0 12px rgba(43, 241, 192, 0.85))'
                                }} 
                            />
                            <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', lineHeight: '1.6', marginBottom: '20px' }}>
                                Identidade confirmada. Agora você já pode acessar a plataforma com segurança.
                            </p>
                            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                VOLTAR PARA O LOGIN
                            </Link>
                        </div>
                    )}
                </div>

                {/* LADO DIREITO: Identidade Visual com o PNG Real */}
                <div className="card-right">
                    <img src={imgMeshGradient} alt="Fundo Gradiente" className="card-right-bg" />
                    <div className="card-right-content">
                        <img src={logoCev} alt="Logo Grande" className="brand-big-logo" />
                        <h1 className="brand-big-name">
                            CÓDIGO <br />
                            <span className="brand-highlight">EM VÍDEO</span>
                        </h1>
                    </div>
                    <div className="card-copyright">
                        &copy; 2026 Código em Vídeo. Todos os direitos reservados.
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Recuperar;