import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.service";
import { supabase } from "../lib/supabase";
import iconAvatar from "../assets/avatar.svg";
import logoCev from "../assets/logo-cev.svg";
import "../styles/Perfil.css";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  img: string | null;
  createdAt: string;
}

type SaveStatus = "idle" | "saving" | "success" | "error";

const Perfil = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Campos do formulário */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaForm, setShowSenhaForm] = useState(false);

  /* Feedback */
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMsg, setSaveMsg] = useState("");
  const [senhaStatus, setSenhaStatus] = useState<SaveStatus>("idle");
  const [senhaMsg, setSenhaMsg] = useState("");

  /* Carrega dados do usuário */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. Buscar usuário do Supabase primeiro (sempre disponível se estiver logado)
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        console.log("DEBUG PERFIL: Dados Supabase", supabaseUser);

        let backendUser = null;
        try {
          const response = await api.get("/users/me");
          backendUser = response.data;
          console.log("DEBUG PERFIL: Dados Backend", backendUser);
        } catch (err) {
          console.error("DEBUG PERFIL: Erro ao buscar backend (404 ou outro):", err);
        }

        // 2. Definir a imagem final (Prioridade: Backend -> Supabase -> Fallback)
        const finalImg = backendUser?.img || supabaseUser?.user_metadata?.avatar_url || null;

        // 3. Atualizar estados
        if (backendUser) {
          setUser(backendUser);
          setName(backendUser.name || "");
          setEmail(backendUser.email || "");
        } else if (supabaseUser) {
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name: supabaseUser.user_metadata?.full_name || null,
            img: null,
            createdAt: new Date().toISOString(), // Fallback
          });
          setName(supabaseUser.user_metadata?.full_name || "");
          setEmail(supabaseUser.email || "");
        }

        setImgUrl(finalImg || "");
      } catch (err) {
        console.error("DEBUG PERFIL: Erro crítico ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  /* Salvar nome, email e foto */
  const handleSalvarPerfil = async () => {
    if (!user) return;
    setSaveStatus("saving");
    try {
      const payload: Record<string, string> = {};
      if (name !== user.name) payload.name = name;
      if (email !== user.email) payload.email = email;
      if (imgUrl !== (user.img || "")) payload.img = imgUrl;

      if (Object.keys(payload).length === 0) {
        setSaveStatus("idle");
        return;
      }

      const { data } = await api.put(`/users/${user.id}`, payload);
      setUser({ ...user, ...data });
      setSaveStatus("success");
      setSaveMsg("Perfil atualizado com sucesso!");
    } catch {
      setSaveStatus("error");
      setSaveMsg("Erro ao salvar. Tente novamente.");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  /* Alterar senha */
  const handleAlterarSenha = async () => {
    if (!user) return;
    if (novaSenha !== confirmarSenha) {
      setSenhaStatus("error");
      setSenhaMsg("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setSenhaStatus("error");
      setSenhaMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSenhaStatus("saving");
    try {
      await api.put(`/users/${user.id}`, { password: novaSenha });
      setSenhaStatus("success");
      setSenhaMsg("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setShowSenhaForm(false);
    } catch {
      setSenhaStatus("error");
      setSenhaMsg("Erro ao alterar senha. Tente novamente.");
    } finally {
      setTimeout(() => setSenhaStatus("idle"), 3000);
    }
  };

  const avatarSrc = imgUrl || user?.img || iconAvatar;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="profile-page-container">
      <div className="bg-glow-blue"></div>
      <div className="bg-glow-green"></div>

      {/* Navbar */}
      <nav className="navbar">
        <img
          src={logoCev}
          alt="Logo"
          className="nav-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
        <div className="nav-menu">
          <button
            type="button"
            className="btn-back-link"
            onClick={() => navigate("/dashboard")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="back-icon-svg">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Voltar</span>
          </button>
        </div>
      </nav>

      {loading ? (
        <div className="perfil-loading">
          <div className="loading-spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      ) : (
        <div className="profile-content-wrapper fade-in-container">

          {/* ── Card Hero ── */}
          <div className="profile-hero-card">
            {/* Avatar */}
            <div className="perfil-avatar-col">
              <div className="perfil-avatar-ring">
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="perfil-avatar-img"
                  onError={(e) => { e.currentTarget.src = iconAvatar; }}
                />
              </div>
              <span className="profile-level-tag">Nível 1</span>
            </div>

            {/* Info */}
            <div className="perfil-hero-info">
              <h1 className="profile-user-name">
                {user?.name || user?.email?.split("@")[0] || "Usuário"}
              </h1>
              <p className="profile-user-sub">{user?.email}</p>
              {user?.createdAt && (
                <p className="perfil-since">
                  Membro desde {formatDate(user.createdAt)}
                </p>
              )}
            </div>
          </div>

          {/* ── Grid de formulários ── */}
          <div className="perfil-forms-grid">

            {/* Formulário: Dados Pessoais */}
            <div className="profile-section-card">
              <h2>Dados do Perfil</h2>
              <p className="section-subtitle">Atualize seu nome, e-mail e foto</p>

              <div className="perfil-form">
                {/* Avatar URL */}
                <div className="perfil-field">
                  <label className="perfil-label">URL da Foto de Perfil</label>
                  <div className="perfil-avatar-url-row">
                    <input
                      type="text"
                      className="perfil-input"
                      placeholder="https://exemplo.com/foto.jpg"
                      value={imgUrl}
                      onChange={(e) => setImgUrl(e.target.value)}
                    />
                    {imgUrl && (
                      <img
                        src={imgUrl}
                        alt="preview"
                        className="perfil-avatar-preview"
                        onError={(e) => { e.currentTarget.src = iconAvatar; }}
                      />
                    )}
                  </div>
                </div>

                {/* Nome */}
                <div className="perfil-field">
                  <label className="perfil-label">Nome</label>
                  <input
                    type="text"
                    className="perfil-input"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="perfil-field">
                  <label className="perfil-label">E-mail</label>
                  <input
                    type="email"
                    className="perfil-input"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Feedback */}
                {saveStatus === "success" && (
                  <p className="perfil-feedback perfil-feedback-ok">✓ {saveMsg}</p>
                )}
                {saveStatus === "error" && (
                  <p className="perfil-feedback perfil-feedback-err">✕ {saveMsg}</p>
                )}

                <button
                  className="btn-profile-save perfil-btn-full"
                  onClick={handleSalvarPerfil}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>

            {/* Formulário: Senha + Conta */}
            <div className="perfil-right-col">

              {/* Card Segurança */}
              <div className="profile-section-card">
                <h2>Segurança</h2>
                <p className="section-subtitle">Altere sua senha de acesso</p>

                {!showSenhaForm ? (
                  <button
                    className="btn-profile-edit perfil-btn-full"
                    onClick={() => setShowSenhaForm(true)}
                  >
                    🔒 Alterar Senha
                  </button>
                ) : (
                  <div className="perfil-form">
                    <div className="perfil-field">
                      <label className="perfil-label">Nova Senha</label>
                      <input
                        type="password"
                        className="perfil-input"
                        placeholder="Mínimo 6 caracteres"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                      />
                    </div>
                    <div className="perfil-field">
                      <label className="perfil-label">Confirmar Senha</label>
                      <input
                        type="password"
                        className="perfil-input"
                        placeholder="Repita a nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                      />
                    </div>

                    {senhaStatus === "success" && (
                      <p className="perfil-feedback perfil-feedback-ok">✓ {senhaMsg}</p>
                    )}
                    {senhaStatus === "error" && (
                      <p className="perfil-feedback perfil-feedback-err">✕ {senhaMsg}</p>
                    )}

                    <div className="perfil-btn-row">
                      <button
                        className="btn-profile-save"
                        onClick={handleAlterarSenha}
                        disabled={senhaStatus === "saving"}
                      >
                        {senhaStatus === "saving" ? "Salvando..." : "Confirmar"}
                      </button>
                      <button
                        className="btn-profile-edit"
                        onClick={() => { setShowSenhaForm(false); setSenhaStatus("idle"); }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Dados da Conta */}
              <div className="profile-section-card">
                <h2>Dados da Conta</h2>
                <div className="academic-info-list">
                  <div className="academic-item">
                    <span className="info-label">Membro desde</span>
                    <span className="info-value">
                      {user?.createdAt ? formatDate(user.createdAt) : "—"}
                    </span>
                  </div>
                  <div className="academic-item">
                    <span className="info-label">Status</span>
                    <span className="info-value text-green">Ativa</span>
                  </div>
                  <div className="academic-item">
                    <span className="info-label">Plano</span>
                    <span className="info-value-badge">Gratuito</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} />
    </div>
  );
};

export default Perfil;