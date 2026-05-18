import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EfeitoDigitacao from "./EfeitoDigitacao";
import iaLogo from "../assets/ia-cev.svg";
import "../styles/Chat.css";

interface ChatProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Chat = ({ isOpen = true, onClose }: ChatProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [mensagens, setMensagens] = useState<
    Array<{ id: number; texto: string; enviadoPor: "user" | "ia" }>
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVoltar = () => {
    navigate("/dashboard");
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const novaMensagem = {
      id: mensagens.length + 1,
      texto: inputMessage,
      enviadoPor: "user" as const,
    };

    setMensagens([...mensagens, novaMensagem]);
    setInputMessage("");
    setIsMenuOpen(false);

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          texto:
            "Essa é uma resposta automática do Cody simulando a integração com o back!",
          enviadoPor: "ia" as const,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fullscreen-chat-container">
      {/* TOPBAR */}
      <div className="chat-topbar">
        <button
          type="button"
          className="btn-back-dashboard"
          onClick={handleVoltar}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Voltar</span>
        </button>

        <div className="topbar-brand">
          <img src={iaLogo} alt="Cody Logo" className="topbar-logo" />
          <span className="topbar-title">Cody</span>
        </div>

        <div className="topbar-right-spacer"></div>
      </div>

      {mensagens.length === 0 ? (
        <div className="chat-welcome-box">
          <div className="welcome-center-content">
            <div className="welcome-logo-wrapper">
              <img
                src={iaLogo}
                alt="Cody Central"
                className="welcome-center-logo"
              />
            </div>
            <h1>Seja bem vindo! Qual a sua dúvida?</h1>
          </div>
        </div>
      ) : (
        <div className="chat-conversation-flow">
          <div className="chat-messages-container">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`chat-full-row ${msg.enviadoPor === "user" ? "user-full-row" : "ia-full-row"}`}
              >
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    {msg.enviadoPor === "ia" ? (
                      <EfeitoDigitacao texto={msg.texto} velocidade={15} />
                    ) : (
                      <p>{msg.texto}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chat-footer-wrapper">
        <form className="chat-fullscreen-input-form" onSubmit={handleEnviar}>
          <div className="attach-button-container">
            {isMenuOpen && (
              <div className="attach-dropdown-menu">
                <button type="button" className="dropdown-item">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>Enviar Arquivos</span>
                </button>
                <button type="button" className="dropdown-item">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Enviar Fotos</span>
                </button>
                <button type="button" className="dropdown-item">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <span>Importar código</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className={`btn-attach ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="Pergunte ao Cody..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />

          <button type="submit" className="btn-fullscreen-send">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
