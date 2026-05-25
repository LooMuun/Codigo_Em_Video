import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iaLogo from "../assets/ia-cev.svg";
import { aiService } from "../services/api.service";
import MessageRenderer from "./MessageRenderer";
import "../styles/Chat.css";

interface ChatProps {
  isOpen?: boolean;
}

interface Mensagem {
  id: number;
  texto: string;
  enviadoPor: "user" | "ia";
}

const Chat = ({ isOpen = true }: ChatProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  /* RE ADICIONADO: Estado para controlar a abertura do menu de anexo */
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVoltar = () => {
    navigate("/dashboard");
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    const novaMensagem: Mensagem = {
      id: Date.now(),
      texto: messageToSend,
      enviadoPor: "user",
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInputMessage("");
    setIsLoading(true);
    setIsAttachOpen(false); // Fecha o menu ao enviar

    try {
      const data = await aiService.chat({ message: messageToSend });
      const respostaIA = data.response || data.message || "Sem resposta da IA";

      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          texto: respostaIA,
          enviadoPor: "ia",
        },
      ]);
    } catch (error: any) {
      console.error(error);
      const mensajeError = error.response?.data?.message || "Erro ao conectar com o Cody.";

      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now(),
          texto: Array.isArray(mensajeError) ? mensajeError.join("\n") : mensajeError,
          enviadoPor: "ia",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fullscreen-chat-container courses-dashboard-container">
      
      {/* Luzes orgânicas de fundo */}
      <div className="bg-glow-blue" style={{ opacity: 0.15 }}></div>
      <div className="bg-glow-green" style={{ opacity: 0.15 }}></div>

      {/* TOPBAR */}
      <div className="chat-topbar">
        <button type="button" className="btn-back-dashboard" onClick={handleVoltar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Voltar</span>
        </button>

        <div className="topbar-brand">
          <img src={iaLogo} alt="Cody Logo" className="topbar-logo" />
          <span className="topbar-title">Cody <span className="ia-badge">IA</span></span>
        </div>

        <div className="topbar-right-spacer" />
      </div>

      {/* ESTADO VAZIO */}
      {mensagens.length === 0 ? (
        <div className="chat-welcome-box fade-in-container">
          <div className="welcome-center-content">
            <div className="welcome-logo-wrapper">
              <img src={iaLogo} alt="Cody Central" className="welcome-center-logo" />
            </div>
            <h1>Como posso ajudar no seu código hoje?</h1>
            <p>Tire dúvidas sobre Python, Ciência de Dados ou peça ajuda com bugs.</p>
          </div>
        </div>
      ) : (
        /* FLUXO DE CONVERSA */
        <div className="chat-conversation-flow">
          <div className="chat-messages-container">
            {mensagens.map((msg) => (
              <div key={msg.id} className={`chat-full-row ${msg.enviadoPor === "user" ? "user-full-row" : "ia-full-row"}`}>
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    {msg.enviadoPor === "ia" ? (
                      <MessageRenderer content={msg.texto} />
                    ) : (
                      <p>{msg.texto}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* STATUS: Digitando */}
            {isLoading && (
              <div className="chat-full-row ia-full-row cody-loading-row">
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER COM O BOTÃO DE + TRAZIDO DE VOLTA */}
      <div className="chat-footer-wrapper">
        <form className="chat-fullscreen-input-form" onSubmit={handleEnviar}>
          
          {/* RE-ADICIONADO: Container do botão de anexo (+) e seu Dropdown */}
          <div className="attach-button-container">
            <button 
              type="button" 
              className={`btn-attach ${isAttachOpen ? 'active' : ''}`}
              onClick={() => setIsAttachOpen(!isAttachOpen)}
              disabled={isLoading}
            >
              {/* Ícone de Mais (+) nativo do design de vocês */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {/* Dropdown Menu que herda os estilos do vosso Chat.css */}
            {isAttachOpen && (
              <div className="attach-dropdown-menu">
                <button type="button" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span>Anexar Arquivo</span>
                </button>
                <button type="button" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  <span>Enviar Código</span>
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Pergunte qualquer coisa ao Cody..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            onFocus={() => setIsAttachOpen(false)} // Fecha o menu ao clicar no input
          />

          <button type="submit" className="btn-fullscreen-send" disabled={!inputMessage.trim() || isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;