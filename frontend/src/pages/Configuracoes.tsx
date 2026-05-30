import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import { authService } from "../services/auth.service";
import "../styles/Configuracoes.css";

const Configuracoes = () => {
    const navigate = useNavigate();

    const [notificacoesEmail, setNotificacoesEmail] = useState(true);
    const [notificacoesPush, setNotificacoesPush] = useState(false);
    const [recovery2faEnabled, setRecovery2faEnabled] = useState(false);
    const [totpSecret, setTotpSecret] = useState("");
    const [totpUri, setTotpUri] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [securityMessage, setSecurityMessage] = useState("");
    const [securityError, setSecurityError] = useState("");
    const [securityLoading, setSecurityLoading] = useState(false);

    useEffect(() => {
        authService.getRecovery2faStatus()
            .then((data) => setRecovery2faEnabled(Boolean(data.enabled)))
            .catch(() => setSecurityError("Nao foi possivel carregar o status do 2FA."));
    }, []);

    const handleSetupRecovery2fa = async () => {
        setSecurityError("");
        setSecurityMessage("");
        setSecurityLoading(true);

        try {
            const data = await authService.setupRecovery2fa();
            setTotpSecret(data.secret);
            setTotpUri(data.otpauthUrl);
            setSecurityMessage("Adicione esta chave no seu app autenticador e confirme com o codigo gerado.");
        } catch {
            setSecurityError("Nao foi possivel gerar a chave de recuperacao.");
        } finally {
            setSecurityLoading(false);
        }
    };

    const handleEnableRecovery2fa = async () => {
        setSecurityError("");
        setSecurityMessage("");
        setSecurityLoading(true);

        try {
            await authService.enableRecovery2fa(totpCode);
            setRecovery2faEnabled(true);
            setTotpCode("");
            setSecurityMessage("2FA de recuperacao ativado com sucesso.");
        } catch {
            setSecurityError("Codigo invalido. Confira o app autenticador e tente novamente.");
        } finally {
            setSecurityLoading(false);
        }
    };

    return (
        <div className="settings-page-container">
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>

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

            <div className="settings-content-wrapper fade-in-container">
                <main className="settings-main-panel">
                    <div className="settings-section">
                        <h2>Configuracoes de Notificacao</h2>
                        <p className="section-subtitle">Escolha como e quando voce deseja receber alertas da plataforma.</p>

                        <div className="settings-row">
                            <div className="settings-info">
                                <h4>Alertas por E-mail</h4>
                                <p>Receba resumos de progresso semanal e novos conteudos lancados.</p>
                            </div>
                            <label className="settings-switch">
                                <input type="checkbox" checked={notificacoesEmail} onChange={(e) => setNotificacoesEmail(e.target.checked)} />
                                <span className="switch-slider"></span>
                            </label>
                        </div>

                        <div className="settings-row">
                            <div className="settings-info">
                                <h4>Notificacoes Push</h4>
                                <p>Receba avisos direto no navegador sobre sua ofensiva diaria de estudos.</p>
                            </div>
                            <label className="settings-switch">
                                <input type="checkbox" checked={notificacoesPush} onChange={(e) => setNotificacoesPush(e.target.checked)} />
                                <span className="switch-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-divider"></div>

                    <div className="settings-section">
                        <h2>Seguranca da Conta</h2>
                        <p className="section-subtitle">Gerencie suas credenciais de acesso para manter seu perfil seguro.</p>

                        <div className="settings-row-stack">
                            <h4>2FA para recuperar senha</h4>
                            <p>Ative uma chave local no seu app autenticador. Ela sera usada somente se voce esquecer a senha.</p>

                            <div className="settings-status-line">
                                Status: <strong>{recovery2faEnabled ? "Ativado" : "Desativado"}</strong>
                            </div>

                            {!totpSecret && (
                                <button type="button" className="btn-settings-action" onClick={handleSetupRecovery2fa} disabled={securityLoading}>
                                    {securityLoading ? "Gerando..." : recovery2faEnabled ? "Gerar nova chave" : "Ativar 2FA de recuperacao"}
                                </button>
                            )}

                            {totpSecret && (
                                <div className="settings-2fa-box">
                                    <label>Chave manual</label>
                                    <code>{totpSecret}</code>
                                    <label>URI para app autenticador</label>
                                    <textarea className="settings-textarea" value={totpUri} readOnly />
                                    <div className="settings-input-group">
                                        <input
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="Codigo do app"
                                            className="settings-input"
                                            value={totpCode}
                                            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                                        />
                                        <button type="button" className="btn-settings-action" onClick={handleEnableRecovery2fa} disabled={securityLoading || totpCode.length < 6}>
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {securityMessage && <p className="settings-success">{securityMessage}</p>}
                            {securityError && <p className="settings-error">{securityError}</p>}
                        </div>

                    </div>
                </main>
            </div>
            <div className="settings-footer-spacing" style={{ height: '60px' }}></div>
        </div>
    );
};

export default Configuracoes;
