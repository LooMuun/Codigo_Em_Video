import { useState } from "react";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import "../styles/Dashbord.css";

const Dashboard = () => { 
    const [abaAtiva, setAbaAtiva] = useState("cursos")
    return (
        <div className="courses-dashboard-container">
            {/* Navbar */}
            <nav className="navbar">
                <img src={logoCev} alt="" className="nav-logo" />
                <div className="nav-menu"> 
                    <a href="#" className={abaAtiva === "cursos" ? "active" : ""} 
                    onClick={() => setAbaAtiva("cursos")}>Cursos</a>
                    <a href="#" className={abaAtiva === "dashboard" ? "active" : ""} 
                    onClick={() => setAbaAtiva("dashboard")}>Dashboard</a>
                </div>
                <div className="user-profile">
                    <img src={iconAvatar} alt="Perfil" />
                </div>
            </nav>
            {/* Cursos */}
            <div className="courses-content">
                {abaAtiva === "cursos" && (
                    <div className="modules-grid fade-in-container">
                        {[1, 2, 3, 4].map((num) => (
                            <div className="module-card" key={num}>
                                <span className="module-tag">Módulo {num}</span>
                                <div className="module-banner">
                                    <img src={`/assets/thumb${num}.png`} alt="" />
                            </div>
                            <div className="module-info">
                                <h3>
                                    {num === 1 && "Fundamentos de Ciência de Dados e Linguagem Python"}
                                    {num === 2 && "Python para Ciência de Dados"}
                                    {num === 3 && "Exploração de Dados e Estatística"}
                                    {num === 4 && "Visualização de Dados"}
                                </h3>
                                <button className="btn-ver-mais">Ver Mais</button>
                            </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Dashboard PLACEHOLDER */}
                {abaAtiva === "dashboard" && (
                    <div className="empty-state fade-in-container">
                        <h2>Seu progresso aparecerá aqui</h2>
                    </div>
                )}

                {/*Botão IA*/}
                <button className="ia-fab">
                    <div className="ia-pulse">
                        
                    </div>
                </button>
            </div>
        </div> 
    )
}

export default Dashboard;