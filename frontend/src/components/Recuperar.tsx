import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoCev from "../assets/logo-cev.svg";
import iconMail from "../assets/mail.svg";
import iconLock from "../assets/locked.svg";
import iconCheck from "../assets/check_circle.svg";
import imgMeshGradient from "../assets/image-mesh-gradient.png";
import { authService } from "../services/auth.service";
import { getUserFriendlyError } from "../utils/errorMessages";
import { ButtonLoading, LoadingOverlay } from "../components/ui";


const Recuperar = () => {
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [etapa, setEtapa] = useState("form");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecuperarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            await authService.recoverPassword({
                email,
                code: codigo,
                newPassword: novaSenha,
            });
            setEtapa("sucesso");
        } catch (err) {
            setErro(getUserFriendlyError(err, "recover-password"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="courses-dashboard-container auth-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading && <LoadingOverlay />}
            <div className="bg-glow-blue"></div>
            <div className="bg-glow-green"></div>

            <div className="login-card fade-in-container">
                <div className="card-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '6px' }}>
                        {etapa === "form" ? "Recuperar Senha" : "Senha Atualizada"}
                    </h2>
                    <p className="card-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {etapa === "form"
                            ? "Use o codigo do seu app autenticador para criar uma nova senha."
                            : "Agora voce ja pode entrar com sua nova senha."}
                    </p>

                    {erro && (
                        <p style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>
                            {erro}
                        </p>
                    )}

                    {etapa === "form" && (
                        <form className="auth-form" onSubmit={handleRecuperarSenha}>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={iconMail} alt="" className="field-icon" />
                                    <input
                                        type="email"
                                        placeholder="Digite seu e-mail cadastrado"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={iconLock} alt="" className="field-icon" />
                                    <input
                                        inputMode="numeric"
                                        placeholder="Codigo 2FA"
                                        maxLength={6}
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={iconLock} alt="" className="field-icon" />
                                    <input
                                        type="password"
                                        placeholder="Nova senha"
                                        minLength={6}
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <ButtonLoading isLoading={loading} className="btn-primary" type="submit" style={{ marginTop: '10px' }} disabled={loading || codigo.length < 6}>
                                {loading ? "ATUALIZANDO..." : "ATUALIZAR SENHA"}
                            </ButtonLoading>
                            <Link to='/' className="forgot-link" style={{ textAlign: 'center', marginTop: '14px' }}>
                                Lembrou? Entrar
                            </Link>
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
                                Senha alterada com seguranca usando seu codigo 2FA.
                            </p>
                            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ENTRAR
                            </Link>
                        </div>
                    )}
                </div>

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
                        2026 Codigo em Video. Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recuperar;
