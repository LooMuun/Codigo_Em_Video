import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import iaLogo from '../assets/ia-cev.svg';
import iconAulas from "../assets/school.svg";
import iconMateriais from "../assets/materials.svg";
import iconAvaliacao from "../assets/avaliation.svg";
import workInProgress from "../assets/WorkInProgress.png";
import thumb1 from "../assets/thumb1.png";
import thumb2 from "../assets/thumb2.png";
import thumb3 from "../assets/thumb3.png";
import thumb4 from "../assets/thumb4.png";

import "../styles/Dashboard.css";

const Dashboard = () => { 
    const [abaAtiva, setAbaAtiva] = useState("cursos");
    const [moduloAtivo, setModuloAtivo] = useState<number | null>(null);

    const navigate = useNavigate();

    const thumbsModulos: Record<number, string> = {
        1: thumb1,
        2: thumb2,
        3: thumb3,
        4: thumb4
    };

    const conteudoModulos = {
        1: "Neste módulo introdutório, você explorará os fundamentos da Ciência de Dados e as etapas essenciais de um projeto na área, mergulhando na sintaxe da linguagem Python para dominar desde tipos básicos, variáveis e operadores até estruturas de controle de fluxo condicionais e de repetição. O conteúdo avança para a organização técnica de informações através de estruturas de dados fundamentais como listas, tuplas, conjuntos e dicionários, além de ensinar a definição e o uso de funções para a criação de códigos modulares e eficientes.",
        2: "Neste módulo, você aprenderá a aplicar o Python especificamente para a análise de dados, explorando as bibliotecas fundamentais que tornam a linguagem tão poderosa para a área. O foco central está no domínio da biblioteca Pandas para a manipulação de DataFrames, abordando desde a importação de diferentes formatos de arquivos até técnicas avançadas de filtragem, limpeza e transformação de dados brutos em informações estruturadas. Além disso, introduziremos conceitos de computação numérica e o uso de ferramentas essenciais para o tratamento de grandes volumes de dados, capacitando você a realizar operações complexas de forma eficiente e preparando o terreno para as etapas de análise estatística e visualização que virão a seguir no curso.",
        3: "Este módulo mergulha na análise exploratória de dados, unindo a programação Python aos conceitos fundamentais da estatística para transformar números em insights estratégicos. Você aprenderá a calcular e interpretar medidas de tendência central, dispersão e correlação, utilizando essas métricas para identificar padrões, detectar anomalias e compreender a distribuição das informações dentro de um conjunto de dados real. Por meio de técnicas de amostragem e testes iniciais, você desenvolverá a capacidade crítica de validar hipóteses e extrair conclusões fundamentadas, garantindo que a base de dados esteja matematicamente compreendida antes da etapa final de comunicação visual dos resultados.",
        4: "Este módulo final foca na comunicação visual de insights, ensinando como transformar análises complexas in gráficos claros, intuitivos e visualmente atraentes através das principais bibliotecas do Python, como Matplotlib e Seaborn. Você aprenderá a selecionar a visualização ideal para cada tipo de dado — desde séries temporais até distribuições de frequências e correlações — dominando técnicas de customização de cores, eixos e legendas para criar dashboards que contam histórias de forma eficiente. O objetivo é capacitar você a traduzir resultados técnicos em representações visuais poderosas, garantindo que as descobertas da ciência de dados sejam compreendidas por qualquer público e facilitem a tomada de decisão estratégica."
    };

    return (
        <div className="courses-dashboard-container" onClick={() => setModuloAtivo(null)}>
            
            {/* Elementos de efeito do Background Global (Bolas em blur) */}
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>
            
            {/* Navbar */}
            <nav className="navbar" onClick={(e) => e.stopPropagation()}>
                <img src={logoCev} alt="Logo" className="nav-logo" />
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
                {/* Aba cursos */}
                {abaAtiva === "cursos" && (
                    <div className="fade-in-container">
                        <div className="modules-grid">
                            {[1, 2, 3, 4].map((num) => (
                                <div 
                                    key={num} 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setModuloAtivo(moduloAtivo === num ? null : num);
                                    }}
                                    className={`module-card ${moduloAtivo !== null && moduloAtivo !== num ? "card-blur" : ""} ${moduloAtivo === num ? "card-selecionado" : ""}`}
                                    style={{ cursor: 'pointer' }} 
                                >
                                    <span className="module-tag">Módulo {num}</span>
                                    <div className="module-banner">
                                        <img src={thumbsModulos[num]} alt={`Miniatura Módulo ${num}`} />
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
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                setModuloAtivo(moduloAtivo === num ? null : num);
                                            }}
                                        >
                                            {moduloAtivo === num ? "Fechar" : "Ver Mais"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detalhes do Módulo Expandido */}
                        {moduloAtivo !== null && (
                            <div 
                                className="module-details-info-card fade-in-container" 
                                key={moduloAtivo}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="details-description">
                                    <p>{conteudoModulos[moduloAtivo as keyof typeof conteudoModulos]}</p>
                                </div>
                                <div className="details-actions-list">
                                    <ul>
                                        <li>
                                            <img src={iconAulas} alt="" className="detail-li-icon" /> 
                                            <span>Aulas</span>
                                        </li>
                                        <li>
                                            <img src={iconMateriais} alt="" className="detail-li-icon" /> 
                                            <span>Materiais</span>
                                        </li>
                                        <li>
                                            <img src={iconAvaliacao} alt="" className="detail-li-icon" /> 
                                            <span>Avaliação</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Aba Dashboard */}
                {abaAtiva === "dashboard" && (
                    <div className="wip-container fade-in-container" onClick={(e) => e.stopPropagation()}>
                        <h2>Esta pagina esta em desenvolvimento!</h2>
                        <img src={workInProgress} alt="Cody construtor atopo de placa escrita EM PROGRESSO" />
                    </div>
                )}

                {/* Botão IA Cody */}
                <button 
                    className="ia-fab" 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        navigate("/chat");   
                    }}
                >
                    <div className="ia-pulse">
                        <img src={iaLogo} alt="IA Assistente" className="ia-icon-img" />
                    </div>
                </button>
            </div>
        </div> 
    );
};

export default Dashboard;