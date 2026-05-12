import { useState } from "react";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import iaLogo from '../assets/ia-cev.svg';
import "../styles/Dashbord.css";

const Dashboard = () => { 
    const [abaAtiva, setAbaAtiva] = useState("cursos");
    const [moduloAtivo, setModuloAtivo] = useState<number | null>(null);

    const conteudoModulos = {
        1: "Neste módulo introdutório, você explorará os fundamentos da Ciência de Dados e as etapas essenciais de um projeto na área, mergulhando na sintaxe da linguagem Python para dominar desde tipos básicos, variáveis e operadores até estruturas de controle de fluxo condicionais e de repetição. O conteúdo avança para a organização técnica de informações através de estruturas de dados fundamentais como listas, tuplas, conjuntos e dicionários, além de ensinar a definição e o uso de funções para a criação de códigos modulares e eficientes.",
        2: "Neste módulo, você aprenderá a aplicar o Python especificamente para a análise de dados, explorando as bibliotecas fundamentais que tornam a linguagem tão poderosa para a área. O foco central está no domínio da biblioteca Pandas para a manipulação de DataFrames, abordando desde a importação de diferentes formatos de arquivos até técnicas avançadas de filtragem, limpeza e transformação de dados brutos em informações estruturadas. Além disso, introduziremos conceitos de computação numérica e o uso de ferramentas essenciais para o tratamento de grandes volumes de dados, capacitando você a realizar operações complexas de forma eficiente e preparando o terreno para as etapas de análise estatística e visualização que virão a seguir no curso.",
        3: "Este módulo mergulha na análise exploratória de dados, unindo a programação Python aos conceitos fundamentais da estatística para transformar números em insights estratégicos. Você aprenderá a calcular e interpretar medidas de tendência central, dispersão e correlação, utilizando essas métricas para identificar padrões, detectar anomalias e compreender a distribuição das informações dentro de um conjunto de dados real. Por meio de técnicas de amostragem e testes iniciais, você desenvolverá a capacidade crítica de validar hipóteses e extrair conclusões fundamentadas, garantindo que a base de dados esteja matematicamente compreendida antes da etapa final de comunicação visual dos resultados.",
        4: "Este módulo final foca na comunicação visual de insights, ensinando como transformar análises complexas em gráficos claros, intuitivos e visualmente atraentes através das principais bibliotecas do Python, como Matplotlib e Seaborn. Você aprenderá a selecionar a visualização ideal para cada tipo de dado — desde séries temporais até distribuições de frequências e correlações — dominando técnicas de customização de cores, eixos e legendas para criar dashboards que contam histórias de forma eficiente. O objetivo é capacitar você a traduzir resultados técnicos em representações visuais poderosas, garantindo que as descobertas da ciência de dados sejam compreendidas por qualquer público e facilitem a tomada de decisão estratégica."
    };

    return (
        <div className="courses-dashboard-container">
            {/* Navbar permanece igual */}
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

            <div className="courses-content">
                {abaAtiva === "cursos" && (
                    <div className="fade-in-container">
                        <div className="modules-grid">
                            {[1, 2, 3, 4].map((num) => (
                                <div 
                                    key={num} 
                                    className={`module-card ${moduloAtivo !== null && moduloAtivo !== num ? "card-blur" : ""}`}
                                    >
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
                                        <button 
                                            className="btn-ver-mais" 
                                            /* Se clicar no que já está aberto, ele fecha (set null) */
                                            onClick={() => setModuloAtivo(moduloAtivo === num ? null : num)}
                                        >
                                            {moduloAtivo === num ? "Fechar" : "Ver Mais"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ver mais */}
                        {moduloAtivo !== null && (
    <div className="module-details-info-card fade-in-container" key={moduloAtivo}>
        <div className="details-description">
            {/* Aqui a mágica acontece: o texto muda conforme o número no estado */}
            <p>{conteudoModulos[moduloAtivo as keyof typeof conteudoModulos]}</p>
        </div>
        <div className="details-actions-list">
            <ul>
                <li><span>🎓</span> Aulas</li>
                <li><span>📖</span> Materiais</li>
                <li><span>✏️</span> Exercícios</li>
                <li><span>👍</span> Avaliação</li>
            </ul>
        </div>
    </div>
)}
                    </div>
                )}

                {/* Dashboard e Botão IA*/}
                {abaAtiva === "dashboard" && (
                    <div className="empty-state fade-in-container">
                        <h2>Seu progresso aparecerá aqui</h2>
                    </div>
                )}

                <button className="ia-fab">
                    <div className="ia-pulse">
                        <img src={iaLogo} alt="IA Assistente" className="ia-icon-img" />
                    </div>
                </button>
            </div>
        </div> 
    );
};

export default Dashboard;