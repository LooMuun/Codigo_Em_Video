import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import "../styles/Perfil.css";

const Perfil = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    
    /* ESTADO REATIVO DO USUÁRIO */
    const [usuario, setUsuario] = useState({
        nome: "Diga seu Nome",
        nivel: 1,
        dataCadastro: "Maio de 2026",
        statusConta: "Ativa"
    });

    const [editNome, setEditNome] = useState(usuario.nome);
    
    const handleSalvar = () => {
        setUsuario({
            ...usuario,
            nome: editNome,
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-page-container">
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>

            {/* Navbar com o botão voltar no padrão Cody IA */}
            <nav className="navbar">
                <img src={logoCev} alt="Logo" className="nav-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")} />
                <div className="nav-menu">
                    <button 
                        type="button" 
                        className="btn-back-link" 
                        onClick={() => navigate("/dashboard")}
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="back-icon-svg"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Voltar</span>
                    </button>
                </div>
            </nav>

            {/* Conteúdo Principal */}
            <div className="profile-content-wrapper fade-in-container">
                
                {/* Card Principal de Informações */}
                <div className="profile-main-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-frame">
                            <img src={iconAvatar} alt="Foto de Perfil" />
                        </div>
                        <span className="profile-level-tag">Nível {usuario.nivel}</span>
                    </div>

                    <div className="profile-info-section">
                        {isEditing ? (
                            <div className="profile-edit-form">
                                <input 
                                    type="text" 
                                    value={editNome} 
                                    onChange={(e) => setEditNome(e.target.value)} 
                                    className="profile-input-edit"
                                />
                                <button type="button" className="btn-profile-save" onClick={handleSalvar}>
                                    Salvar Alterações
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="profile-user-name">{usuario.nome}</h1>
                                <button type="button" className="btn-profile-edit" onClick={() => setIsEditing(true)}>
                                    Editar Perfil
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Seção Lateral/Inferior */}
                <div className="profile-secondary-grid">
        

                    {/* Bloco de Informações do Usuário (Agnóstico e Limpo) */}
                    <div className="profile-section-card academic-details">
                        <h2>Dados da Conta</h2>
                        <div className="academic-info-list">
                            <div className="academic-item">
                                <span className="info-label">Membro desde:</span>
                                <span className="info-value">{usuario.dataCadastro}</span>
                            </div>
                            <div className="academic-item">
                                <span className="info-label">Status do Perfil:</span>
                                <span className="info-value text-green">{usuario.statusConta}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="profile-footer-spacing" style={{ height: '60px' }}></div>
        </div>
    );
};

export default Perfil;