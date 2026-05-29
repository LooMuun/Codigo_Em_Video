import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import iaLogo from "../assets/cody-regular.svg";
import iconAulas from "../assets/school.svg";
import iconMateriais from "../assets/materials.svg";
import iconAvaliacao from "../assets/avaliation.svg";
import thumb1 from "../assets/thumb1.png";
import thumb2 from "../assets/thumb2.png";
import thumb3 from "../assets/thumb3.png";
import thumb4 from "../assets/thumb4.png";
import "../styles/Home.css";
import { supabase } from "../lib/supabase";

interface UserData {
  id: string;
  email: string;
  avatar_url: string | null;
  user_metadata: any;
}

// Hook para detectar se é mobile (< 768px)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState("cursos");
  const [moduloAtivo, setModuloAtivo] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  /* ESTADOS DINÂMICOS */
  const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);
  const [metricas, setMetricas] = useState({
    ofensiva: 0,
    horasEstudo: 0,
    progressoGeral: 0,
  });

  const thumbsModulos: Record<number, string> = {
    1: thumb1,
    2: thumb2,
    3: thumb3,
    4: thumb4,
  };

  /* CARREGAR DADOS DO USUÁRIO DO LOCALSTORAGE */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        console.error("Erro ao parsear usuário", e);
      }
    }
  }, []);

  /* Função pra gerenciar o LogOut */
  const handleLogout = async () => {
    try{
      await supabase.auth.signOut(); //logout Supabase
  
      localStorage.removeItem("token"); //Limpa info de login do local Storage
      localStorage.removeItem("user"); 
  
      navigate("/"); //Redireciona :0
    } catch (error) {
    console.error("Erro ao fazer logout:", error);
    }
  };

  const conteudoModulos = {
    1: "Neste módulo introdutório, você explorará os fundamentos da Ciência de Dados e as etapas essenciais de um projeto na área, mergulhando na sintaxe da linguagem Python para dominar desde tipos básicos, variáveis e operadores até estruturas de controle de fluxo condicionais e de repetição. O conteúdo avança para a organização técnica de informações através de estruturas de dados fundamentais como listas, tuplas, conjuntos e dicionários, além de ensinar a definição e o uso de funções para a criação de códigos modulares e eficientes.",
    2: "Neste módulo, você aprenderá a aplicar o Python especificamente para a análise de dados, explorando as bibliotecas fundamentais que tornam a linguagem tão poderosa para a área. O foco central está no domínio da biblioteca Pandas para a manipulação de DataFrames, abordando desde a importação de diferentes formatos de arquivos até técnicas avançadas de filtragem, limpeza e transformação de dados brutos em informações estruturadas.",
    3: "Este módulo mergulha na análise exploratória de dados, unindo a programação Python aos conceitos fundamentais da estatística para transformar números em insights estratégicos. Você aprenderá a calcular e interpretar medidas de tendência central, dispersão e correlação, utilizando essas métricas para identificar padrões, detectar anomalias e compreender a distribuição das informações dentro de um conjunto de dados real.",
    4: "Este módulo final foca na comunicação visual de insights, ensinando como transformar análises complexas em gráficos claros, intuitivos e visualmente atraentes através das principais bibliotecas do Python, como Matplotlib e Seaborn. Você aprenderá a selecionar a visualização ideal para cada tipo de dado, dominando técnicas de customização de cores, eixos e legendas para criar dashboards que contam histórias de forma eficiente.",
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserData({
          id: session.user.id,
          email: session.user.email ?? "",
          avatar_url: session.user.user_metadata?.avatar_url ?? null,
          user_metadata: session.user.user_metadata,
        });
        return;
      }

      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUserData(JSON.parse(stored));
        } catch (e) {
          console.error("Erro ao parsear usuário", e);
        }
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUserData({
          id: session.user.id,
          email: session.user.email ?? "",
          avatar_url: session.user.user_metadata?.avatar_url ?? null,
          user_metadata: session.user.user_metadata,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const ModuleDetailsPanel = ({ num }: { num: number }) => (
    <div
      className="module-details-info-card fade-in-container"
      key={`details-${num}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="details-description">
        <p>
          {conteudoModulos[num as keyof typeof conteudoModulos]}
        </p>
      </div>
      <div className="details-actions-list">
        <ul>
          {/* Botão de Aulas */}
          <li
            onClick={() => navigate(`/modulo/${num}/aulas`)}
            style={{ cursor: "pointer" }}
            className="clickable-detail-item"
          >
            <img src={iconAulas} alt="" className="detail-li-icon" />
            <span>Aulas</span>
          </li>

          {/* Botão de Materiais — ATIVADO COM NAVEGAÇÃO DINÂMICA */}
          <li
            onClick={() => navigate(`/modulo/${num}/materiais`)}
            style={{ cursor: "pointer" }}
            className="clickable-detail-item"
          >
            <img src={iconMateriais} alt="" className="detail-li-icon" />
            <span>Materiais</span>
          </li>
          <li
            onClick={() => navigate(`/modulo/${num}/avaliacao`)}
            style={{ cursor: "pointer" }}
            className="clickable-detail-item"
          >
            <img src={iconAvaliacao} alt="" className="detail-li-icon" />
            <span>Avaliação</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div
      className="courses-dashboard-container"
      onClick={() => {
        setModuloAtivo(null);
        setIsSidebarOpen(false);
      }}
    >
      {/* Elementos de efeito do Background Global */}
      <div className="bg-glow-blue"></div>
      <div className="bg-glow-green"></div>

      {/* Navbar */}
      <nav className="navbar" onClick={(e) => e.stopPropagation()}>
        <img src={logoCev} alt="Logo" className="nav-logo" />
        <div className="nav-menu">
          <a
            href="#"
            className={abaAtiva === "cursos" ? "active" : ""}
            onClick={() => setAbaAtiva("cursos")}
          >
            Cursos
          </a>
          <a
            href="#"
            className={abaAtiva === "dashboard" ? "active" : ""}
            onClick={() => setAbaAtiva("dashboard")}
          >
            Dashboard
          </a>
        </div>

        <div
          className={`user-profile ${isSidebarOpen ? "active-avatar" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <img
            src={userData?.avatar_url || iconAvatar}
            alt="Perfil"
            onError={(e) => {
              e.currentTarget.src = iconAvatar;
            }}
          />
        </div>
      </nav>

      {/* SIDEBAR DE PERFIL */}
      <div
        className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-profile-header">
          <div className="sidebar-avatar-wrapper">
            <img
              src={userData?.avatar_url || iconAvatar}
              alt="Avatar do Usuário"
              onError={(e) => {
                e.currentTarget.src = iconAvatar;
              }}
            />
          </div>
          <h3>
            {userData?.user_metadata?.full_name ||
              userData?.user_metadata?.name ||
              userData?.email?.split("@")[0] ||
              "Usuário"}
          </h3>
          <p className="sidebar-student-sub">{userData?.email}</p>
          <span className="sidebar-level-badge">Nível 1</span>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-menu-links">
          <button
            type="button"
            className="sidebar-link-item"
            onClick={() => navigate("/perfil")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Meu Perfil</span>
          </button>

          <button
            type="button"
            className="sidebar-link-item"
            onClick={() => {
              setAbaAtiva("dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            <span>Minhas Métricas</span>
          </button>

          <button
            type="button"
            className="sidebar-link-item"
            onClick={() => navigate("/configuracoes")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Configurações</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-sidebar-logout"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      <div className="courses-content">
        {/* Aba cursos */}
        {abaAtiva === "cursos" && (
          <div className="fade-in-container">
            <div className="modules-grid">
              {[1, 2, 3, 4].map((num) => (
                <>
                  <div
                    key={num}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModuloAtivo(moduloAtivo === num ? null : num);
                    }}
                    className={`module-card ${moduloAtivo !== null && moduloAtivo !== num ? "card-blur" : ""} ${moduloAtivo === num ? "card-selecionado" : ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="module-tag">Módulo {num}</span>
                    <div className="module-banner">
                      <img
                        src={thumbsModulos[num]}
                        alt={`Miniatura Módulo ${num}`}
                      />
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

                  {/* Em mobile: renderiza o painel logo abaixo do card selecionado */}
                  {isMobile && moduloAtivo === num && (
                    <div key={`mobile-details-${num}`} className="module-card-details-mobile">
                      <ModuleDetailsPanel num={num} />
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Em desktop: renderiza o painel abaixo de todos os cards */}
            {!isMobile && moduloAtivo !== null && (
              <ModuleDetailsPanel num={moduloAtivo} />
            )}
          </div>
        )}

        {/* Aba Dashboard */}
        {abaAtiva === "dashboard" && (
          <div
            className="dashboard-page-container fade-in-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="metrics-grid">
              <div className="metric-card card-fire">
                <div className="card-header-metric">
                  <span className="card-metric-icon">🔥</span>
                  <span className="card-metric-title">Dias de Ofensiva</span>
                </div>
                <div className="card-metric-value">
                  {metricas.ofensiva}{" "}
                  <span className="value-unit">dias seguidos</span>
                </div>
                <p className="card-metric-footer">Não perca o ritmo hoje!</p>
              </div>

              <div className="metric-card card-time">
                <div className="card-header-metric">
                  <span className="card-metric-icon">⏱️</span>
                  <span className="card-metric-title">Tempo de Estudo</span>
                </div>
                <div className="card-metric-value">
                  {metricas.horasEstudo}{" "}
                  <span className="value-unit">horas</span>
                </div>
                <p className="card-metric-footer">
                  +12% a mais que a semana passada
                </p>
              </div>

              <div className="metric-card card-progress">
                <div className="card-header-metric">
                  <span className="card-metric-icon">🎯</span>
                  <span className="card-metric-title">Progresso Geral</span>
                </div>
                <div className="card-metric-value">
                  {metricas.progressoGeral}%{" "}
                  <span className="value-unit">concluído</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${metricas.progressoGeral}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="chart-section-container">
              <div className="chart-header">
                <h2>Desempenho Semanal</h2>
                <p>Minutos dedicados assistindo a códigos em vídeo por dia</p>
              </div>

              <div className="chart-wrapper" style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dadosEvolucao}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMinutos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3a6fff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3a6fff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                    <XAxis dataKey="dia" stroke="#64797c" tickLine={false} axisLine={false} dy={10} style={{ fontSize: "13px" }} />
                    <YAxis stroke="#64797c" tickLine={false} axisLine={false} dx={-10} style={{ fontSize: "13px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#161b22",
                        borderColor: "rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area type="monotone" dataKey="minutos" stroke="#3a6fff" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutos)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Botão Cody */}
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
