import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import iaLogo from "../assets/ia-cev.svg";
import api, { aiService } from "../services/api.service";
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

// Formato que o backend espera no histórico
interface HistoryMessage {
  role: "user" | "model";
  content: string;
}

const Chat = ({ isOpen = true }: ChatProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVoltar = () => navigate("/");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    setIsAttachOpen(false);
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedFile) || isLoading) return;

    const messageToSend = inputMessage || `Analise o arquivo: ${selectedFile?.name}`;

    const novaMensagem: Mensagem = {
      id: Date.now(),
      texto: selectedFile ? `${messageToSend} 📎 ${selectedFile.name}` : messageToSend,
      enviadoPor: "user",
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInputMessage("");
    setIsLoading(true);
    setIsAttachOpen(false);

    try {
      let respostaIA: string;

      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        form.append("message", messageToSend);
        // Envia o histórico para o backend manter contexto da conversa
        if (history.length > 0) {
          form.append("history", JSON.stringify(history));
        }

        const { data } = await api.post("/ai/chat-file", form);
        respostaIA = data.response || "Sem resposta da IA";

        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const data = await aiService.chat({ message: messageToSend, history });
        respostaIA = data.response || "Sem resposta da IA";
      }

      // Atualiza o histórico com a troca atual (formato do backend)
      setHistory((prev) => [
        ...prev,
        { role: "user", content: messageToSend },
        { role: "model", content: respostaIA },
      ]);

      setMensagens((prev) => [
        ...prev,
        { id: Date.now() + 1, texto: respostaIA, enviadoPor: "ia" },
      ]);
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.message || "Erro ao conectar com o Cody.";

      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now(),
          texto: Array.isArray(mensagemErro) ? mensagemErro.join("\n") : mensagemErro,
          enviadoPor: "ia",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fullscreen-chat-container courses-dashboard-container">
      {/* Luzes de fundo */}
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
          <span className="topbar-title">
            Cody <span className="ia-badge">IA</span>
          </span>
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
                      <MessageRenderer content={msg.texto} />
                    ) : (
                      <p>{msg.texto}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-full-row ia-full-row cody-loading-row">
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="chat-footer-wrapper">
        {/* Badge do arquivo selecionado */}
        {selectedFile && (
          <div className="selected-file-badge">
            {filePreview && (
              <div className="file-preview-container">
                <img src={filePreview} alt="Preview" className="file-preview-image" />
                <div className="file-preview-overlay">
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {!filePreview && (
              <div className="file-info">
                <span className="file-name">📎 {selectedFile.name}</span>
                <button
                  type="button"
                  className="btn-remove-file"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        <form className="chat-fullscreen-input-form" onSubmit={handleEnviar}>
          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.csv,.json,image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className="attach-button-container">
            <button
              type="button"
              className={`btn-attach ${isAttachOpen ? "active" : ""}`}
              onClick={() => setIsAttachOpen(!isAttachOpen)}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {isAttachOpen && (
              <div className="attach-dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  <span>Anexar Arquivo</span>
                </button>
                <button type="button" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
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
            onFocus={() => setIsAttachOpen(false)}
          />

          <button
            type="submit"
            className="btn-fullscreen-send"
            disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
          >
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