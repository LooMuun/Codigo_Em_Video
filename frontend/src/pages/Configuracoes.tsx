import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import "../styles/Configuracoes.css";

const Configuracoes = () => {
    const navigate = useNavigate();

    // Estados simplificados para as notificações
    const [notificacoesEmail, setNotificacoesEmail] = useState(true);
    const [notificacoesPush, setNotificacoesPush] = useState(false);

    return (
        <div className="settings-page-container">
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>

            {/* Navbar padrão unificada */}
            <nav className="navbar">
                <img src={logoCev} alt="Logo" className="nav-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")} />
                <div className="nav-menu">
                    <button type="button" className="btn-back-link" onClick={() => navigate("/dashboard")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="back-icon-svg">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Voltar</span>
                    </button>
                </div>
            </nav>

            {/* Conteúdo Principal centralizado e unificado */}
            <div className="settings-content-wrapper fade-in-container">
                <main className="settings-main-panel">
                    
                    {/* Seção de Notificações */}
                    <div className="settings-section">
                        <h2>Configurações de Notificação</h2>
                        <p className="section-subtitle">Escolha como e quando você deseja receber alertas da plataforma.</p>

                        <div className="settings-row">
                            <div className="settings-info">
                                <h4>Alertas por E-mail</h4>
                                <p>Receba resumos de progresso semanal e novos conteúdos lançados.</p>
                            </div>
                            <label className="settings-switch">
                                <input type="checkbox" checked={notificacoesEmail} onChange={(e) => setNotificacoesEmail(e.target.checked)} />
                                <span className="switch-slider"></span>
                            </label>
                        </div>

                        <div className="settings-row">
                            <div className="settings-info">
                                <h4>Notificações Push</h4>
                                <p>Receba avisos direto no navegador sobre sua ofensiva diária de estudos.</p>
                            </div>
                            <label className="settings-switch">
                                <input type="checkbox" checked={notificacoesPush} onChange={(e) => setNotificacoesPush(e.target.checked)} />
                                <span className="switch-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Divisor estético entre as seções */}
                    <div className="settings-divider"></div>

                    {/* Seção de Segurança */}
                    <div className="settings-section">
                        <h2>Segurança da Conta</h2>
                        <p className="section-subtitle">Gerencie suas credenciais de acesso para manter seu perfil seguro.</p>

                        <div className="settings-row-stack">
                            <h4>Alterar Senha</h4>
                            <p>Recomendamos o uso de uma senha forte com caracteres especiais e números.</p>
                            
                            <div className="settings-input-group">
                                <input type="password" placeholder="Senha Atual" className="settings-input" />
                                <input type="password" placeholder="Nova Senha" className="settings-input" />
                            </div>
                            <button type="button" className="btn-settings-action">Atualizar Senha</button>
                        </div>
                    </div>

                </main>
            </div>
            <div className="settings-footer-spacing" style={{ height: '60px' }}></div>
        </div>
    );
};

export default Configuracoes;