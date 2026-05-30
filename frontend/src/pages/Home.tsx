import api from "../services/api.service";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../components/ui";
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
import thumbFallback from "../assets/thumb1.png";
import "../styles/Home.css";
import { supabase } from "../lib/supabase";

interface ModuloData {
  id: string;
  title: string;
  description: string;
  img: string;
  createdAt: string;
}

interface ProgressData {
  id: string;
  userId: string;
  classroomId: string;
  completed: boolean;
  completedAt: string | null;
  classroom: {
    id: string;
    title: string;
    moduleId: string;
  };
}

interface UserData {
  id: string;
  email: string;
  avatar_url: string | null;
  user_metadata: any;
}

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState("cursos");
  const [moduloAtivo, setModuloAtivo] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const [modulos, setModulos] = useState<ModuloData[]>([]);
  const [progresso, setProgresso] = useState<ProgressData[]>([]);
  const [loadingModulos, setLoadingModulos] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [totalAulas, setTotalAulas] = useState(0);
  const [metricas, setMetricas] = useState({
    aulasAssistidas: 0,
    ofensiva: 0,
    progressoGeral: 0,
  });
  const [dadosEvolucao, setDadosEvolucao] = useState([
    { dia: "Seg", aulas: 0 },
    { dia: "Ter", aulas: 0 },
    { dia: "Qua", aulas: 0 },
    { dia: "Qui", aulas: 0 },
    { dia: "Sex", aulas: 0 },
    { dia: "Sáb", aulas: 0 },
    { dia: "Dom", aulas: 0 },
  ]);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  /* BUSCAR MÓDULOS PELO BACKEND */
  useEffect(() => {
    const fetchModulos = async () => {
      setLoadingModulos(true);
      try {
        const response = await api.get("/modules");
        if (response.data) setModulos(response.data);
      } catch (error) {
        console.error("Erro ao buscar módulos:", error);
      } finally {
        setLoadingModulos(false);
      }
    };

    fetchModulos();
  }, []);

  /* BUSCAR TOTAL DE AULAS */
  useEffect(() => {
    const fetchTotalAulas = async () => {
      try {
        const response = await api.get("/classrooms");
        if (response.data) setTotalAulas(response.data.length);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    };
    fetchTotalAulas();
  }, []);

  /* BUSCAR PROGRESSO DO USUÁRIO (via backend autenticado) */
  useEffect(() => {
    const fetchProgresso = async () => {
      setLoadingProgress(true);
      try {
        const response = await api.get("/progress");
        const data: ProgressData[] = response.data;

        setProgresso(data);

        /* ── Aulas assistidas ── */
        const concluidas = data.filter((p) => p.completed);
        const aulasAssistidas = concluidas.length;

        /* ── Progresso geral ── */
        const progressoGeral =
          totalAulas > 0 ? Math.round((aulasAssistidas / totalAulas) * 100) : 0;

        /* ── Ofensiva (dias consecutivos com pelo menos 1 aula) ── */
        const diasComAula = new Set(
          concluidas
            .filter((p) => p.completedAt)
            .map((p) => new Date(p.completedAt!).toDateString()),
        );
        let ofensiva = 0;
        const hoje = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(hoje);
          d.setDate(hoje.getDate() - i);
          if (diasComAula.has(d.toDateString())) {
            ofensiva++;
          } else {
            break;
          }
        }

        /* ── Evolução semanal (últimos 7 dias) ── */
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const contagem: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date(hoje);
          d.setDate(hoje.getDate() - i);
          contagem[d.toDateString()] = 0;
        }
        concluidas
          .filter((p) => p.completedAt)
          .forEach((p) => {
            const key = new Date(p.completedAt!).toDateString();
            if (key in contagem) contagem[key]++;
          });

        const evolucao = Object.entries(contagem).map(([dateStr, aulas]) => ({
          dia: diasSemana[new Date(dateStr).getDay()],
          aulas,
        }));

        setDadosEvolucao(evolucao);
        setMetricas({ aulasAssistidas, ofensiva, progressoGeral });
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Modo convidado: não logamos erro, apenas garantimos que o loading pare
          setProgresso([]);
        } else {
          console.error("Erro ao buscar progresso:", error);
        }
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgresso();
  }, [totalAulas]);

  /* CARREGAR USUÁRIO */
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("DEBUG HOME: Sessão Supabase", session);

      if (session?.user) {
        try {
          const response = await api.get("/users/me");
          const backendUser = response.data;
          console.log("DEBUG HOME: Dados Backend", backendUser);

          setUserData({
            id: session.user.id,
            email: session.user.email ?? "",
            avatar_url: backendUser?.img || session.user.user_metadata?.avatar_url || null,
            user_metadata: session.user.user_metadata,
          });
        } catch (err) {
          console.error("DEBUG HOME: Erro Backend", err);
          setUserData({
            id: session.user.id,
            email: session.user.email ?? "",
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
            user_metadata: session.user.user_metadata,
          });
        }
      }
    };
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("DEBUG HOME: AuthStateChange", _event, session);
      if (session?.user) {
        try {
          const response = await api.get("/users/me");
          const backendUser = response.data;
          setUserData({
            id: session.user.id,
            email: session.user.email ?? "",
            avatar_url: backendUser?.img || session.user.user_metadata?.avatar_url || null,
            user_metadata: session.user.user_metadata,
          });
        } catch {
          setUserData({
            id: session.user.id,
            email: session.user.email ?? "",
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
            user_metadata: session.user.user_metadata,
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  /* HELPER: progresso de um módulo específico (via classroom.moduleId) */
  const getProgressoModulo = (moduleId: string) => {
    const registros = progresso.filter(
      (p) => p.classroom?.moduleId === moduleId,
    );
    if (registros.length === 0) return 0;
    const concluidos = registros.filter((p) => p.completed).length;
    return Math.round((concluidos / registros.length) * 100);
  };

  return (
    <div
      className="courses-dashboard-container"
      onClick={() => {
        setModuloAtivo(null);
        setIsSidebarOpen(false);
      }}
    >
      {(loadingModulos || loadingProgress) && <LoadingOverlay />}
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

      {/* Sidebar de Perfil */}
      <div
        className={`profile-sidebar ${isSidebarOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-menu-links">
          <button
            className="sidebar-link-item"
            onClick={() => navigate("/perfil")}
          >
            <span>Meu Perfil</span>
          </button>

          {/* ADICIONE ESTE NOVO BOTÃO AQUI */}
          <button
            className="sidebar-link-item"
            onClick={() => navigate("/configuracoes")}
          >
            <span>Configurações</span>
          </button>

          <button
            className="sidebar-link-item"
            onClick={() => {
              setAbaAtiva("dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <span>Minhas Métricas</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={handleLogout}>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      <div className="courses-content">
        {/* =================== ABA CURSOS =================== */}
        {abaAtiva === "cursos" && (
          <div className="fade-in-container" style={{ position: "relative" }}>
            {loadingModulos ? (
              <div className="modules-loading">
                <div className="loading-spinner"></div>
                <p>Carregando módulos...</p>
              </div>
            ) : modulos.length === 0 ? (
              <div className="modules-empty">
                <p>Nenhum módulo disponível no momento.</p>
              </div>
            ) : (
              <div className="modules-grid">
                {modulos.map((modulo, index) => {
                  const pct = getProgressoModulo(modulo.id);
                  const isAtivo = moduloAtivo === modulo.id;
                  return (
                    <div
                      key={modulo.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        const novoAtivo = isAtivo ? null : modulo.id;
                        setModuloAtivo(novoAtivo);
                        if (novoAtivo) {
                          setTimeout(() => {
                            detailsRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            });
                          }, 50);
                        }
                      }}
                      className={`module-card ${
                        moduloAtivo !== null && !isAtivo ? "card-blur" : ""
                      } ${isAtivo ? "card-selecionado" : ""}`}
                    >
                      <span className="module-tag">Módulo {index + 1}</span>
                      <div className="module-banner">
                        <img
                          src={modulo.img || thumbFallback}
                          alt={modulo.title}
                          onError={(e) => {
                            e.currentTarget.src = thumbFallback;
                          }}
                        />
                      </div>
                      <div className="module-info">
                        <h3>{modulo.title}</h3>

                        {/* Barra de progresso por módulo */}
                        <div className="module-progress-bar-wrap">
                          <div
                            className="module-progress-bar-fill"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>

                        <button className="btn-ver-mais">
                          {isAtivo ? "Fechar" : "Ver Mais"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Card de detalhes renderizado FORA do grid, abaixo dos cards */}
            {moduloAtivo && modulos.find((m) => m.id === moduloAtivo) && (
              <div
                ref={detailsRef}
                className="module-details-info-card fade-in-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="details-description">
                  <p>
                    {modulos.find((m) => m.id === moduloAtivo)!.description}
                  </p>
                </div>
                <div className="details-actions-list">
                  <ul>
                    <li
                      onClick={() => navigate(`/modulo/${moduloAtivo}/aulas`)}
                      className="clickable-detail-item"
                    >
                      <img src={iconAulas} alt="" className="detail-li-icon" />
                      <span>Aulas</span>
                    </li>
                    <li className="disabled-detail-item">
                      <img
                        src={iconMateriais}
                        alt=""
                        className="detail-li-icon"
                      />
                      <span>Materiais</span>
                    </li>
                    <li className="disabled-detail-item">
                      <img
                        src={iconAvaliacao}
                        alt=""
                        className="detail-li-icon"
                      />
                      <span>Avaliação</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================== ABA DASHBOARD =================== */}
        {abaAtiva === "dashboard" && (
          <div
            className="dashboard-page-container fade-in-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Métricas */}
            {loadingProgress ? (
              <div className="modules-loading">
                <div className="loading-spinner"></div>
                <p>Carregando seus dados...</p>
              </div>
            ) : (
              <>
                <div className="metrics-grid">
                  <div className="metric-card card-fire">
                    <div className="card-header-metric">
                      <span className="card-metric-icon">🔥</span>
                      <span className="card-metric-title">
                        Dias de Ofensiva
                      </span>
                    </div>
                    <div className="card-metric-value">
                      {metricas.ofensiva}{" "}
                      <span className="value-unit">dias</span>
                    </div>
                    <p className="card-metric-footer">
                      {metricas.ofensiva === 0
                        ? "Comece a estudar hoje!"
                        : `${metricas.ofensiva} dia${metricas.ofensiva > 1 ? "s" : ""} seguido${metricas.ofensiva > 1 ? "s" : ""}!`}
                    </p>
                  </div>
                  <div className="metric-card card-time">
                    <div className="card-header-metric">
                      <span className="card-metric-icon">🎬</span>
                      <span className="card-metric-title">
                        Aulas Assistidas
                      </span>
                    </div>
                    <div className="card-metric-value">
                      {metricas.aulasAssistidas}{" "}
                      <span className="value-unit">de {totalAulas}</span>
                    </div>
                    <p className="card-metric-footer">
                      {totalAulas - metricas.aulasAssistidas} aulas restantes
                    </p>
                  </div>
                  <div className="metric-card card-progress">
                    <div className="card-header-metric">
                      <span className="card-metric-icon">🎯</span>
                      <span className="card-metric-title">Progresso Geral</span>
                    </div>
                    <div className="card-metric-value">
                      {metricas.progressoGeral}%
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${metricas.progressoGeral}%` }}
                      ></div>
                    </div>
                    <p className="card-metric-footer">do curso concluído</p>
                  </div>
                </div>

                {/* Gráfico de evolução semanal */}
                <div className="chart-section-container">
                  <div className="chart-header">
                    <h2>Aulas por Dia — Última Semana</h2>
                    <p>Aulas concluídas nos últimos 7 dias</p>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={dadosEvolucao}>
                        <defs>
                          <linearGradient
                            id="colorAulas"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2bf1c0"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#2bf1c0"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="dia"
                          stroke="rgba(255,255,255,0.4)"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          allowDecimals={false}
                          stroke="rgba(255,255,255,0.4)"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(15,20,30,0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value: number) => [
                            `${value} aula${value !== 1 ? "s" : ""}`,
                            "Concluídas",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="aulas"
                          stroke="#2bf1c0"
                          strokeWidth={2}
                          fill="url(#colorAulas)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* Cards dos módulos com progresso no dashboard */}
            <div className="dashboard-modules-section">
              <div className="section-header-row">
                <h2 className="section-title">Seus Módulos</h2>
                <span className="section-subtitle">
                  {modulos.length} módulos disponíveis
                </span>
              </div>
              {loadingModulos ? (
                <div className="modules-loading">
                  <div className="loading-spinner"></div>
                  <p>Carregando seus dados...</p>
                </div>
              ) : (
                <div className="dmr-cards-grid">
                  {modulos.map((modulo, index) => {
                    const pct = getProgressoModulo(modulo.id);
                    const isCompleto = pct === 100;
                    return (
                      <div
                        key={modulo.id}
                        className={`dmr-card ${isCompleto ? "dmr-card-done" : ""}`}
                        onClick={() => navigate(`/modulo/${modulo.id}/aulas`)}
                      >
                        {/* Thumbnail com overlay */}
                        <div className="dmr-card-thumb">
                          <img
                            src={modulo.img || thumbFallback}
                            alt={modulo.title}
                            onError={(e) => {
                              e.currentTarget.src = thumbFallback;
                            }}
                          />
                          <div className="dmr-card-overlay">
                            {isCompleto ? (
                              <span className="dmr-badge-done">
                                ✓ Concluído
                              </span>
                            ) : (
                              <span className="dmr-badge-idx">
                                Módulo {index + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="dmr-card-body">
                          <h4 className="dmr-card-title">{modulo.title}</h4>

                          {/* Barra de progresso */}
                          <div className="dmr-card-progress-wrap">
                            <div className="dmr-card-progress-bar">
                              <div
                                className="dmr-card-progress-fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="dmr-card-pct">{pct}%</span>
                          </div>

                          <span className="dmr-card-cta">
                            {pct === 0
                              ? "Começar →"
                              : isCompleto
                                ? "Revisar →"
                                : "Continuar →"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão IA */}
        <button
          className="ia-fab"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/chat");
          }}
        >
          <div className="ia-pulse">
            <img src={iaLogo} alt="IA" className="ia-icon-img" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
