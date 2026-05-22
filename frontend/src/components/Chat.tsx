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

const Chat = ({
  isOpen = true,
}: ChatProps) => {
  const [inputMessage, setInputMessage] =
    useState("");

  const [mensagens, setMensagens] =
    useState<Mensagem[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVoltar = () => {
    navigate("/dashboard");
  };

  const handleEnviar = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !inputMessage.trim() ||
      isLoading
    ) {
      return;
    }

    const mensagemUsuario =
      inputMessage;

    const novaMensagem: Mensagem = {
      id: Date.now(),
      texto: mensagemUsuario,
      enviadoPor: "user",
    };

    // adiciona mensagem do usuário
    setMensagens((prev) => [
      ...prev,
      novaMensagem,
    ]);

    setInputMessage("");
    setIsLoading(true);

    try {
      const data =
        await aiService.chat({
          message: mensagemUsuario,
        });

      const respostaIA =
        data.response ||
        data.message ||
        "Sem resposta da IA";

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

  const mensagemErro =
    error.response?.data?.message ||
    "Erro ao conectar com o Cody.";

  setMensagens((prev) => [
    ...prev,
    {
      id: Date.now(),
      texto: Array.isArray(mensagemErro)
        ? mensagemErro.join("\n")
        : mensagemErro,
      enviadoPor: "ia",
    },
  ]);
}finally {
      setIsLoading(false);
    }
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"> <path d="M15 18l-6-6 6-6" /> </svg>
          <span>Voltar</span>
        </button>

        <div className="topbar-brand">
          <img
            src={iaLogo}
            alt="Cody Logo"
            className="topbar-logo"
          />

          <span className="topbar-title">
            Cody
          </span>
        </div>

        <div className="topbar-right-spacer" />
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

            <h1>
              Seja bem vindo! Qual a sua
              dúvida?
            </h1>
          </div>
        </div>
      ) : (
        <div className="chat-conversation-flow">
          <div className="chat-messages-container">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`chat-full-row ${
                  msg.enviadoPor ===
                  "user"
                    ? "user-full-row"
                    : "ia-full-row"
                }`}
              >
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    {msg.enviadoPor ===
                    "ia" ? (
                      <MessageRenderer
                        content={
                          msg.texto
                        }
                      />
                    ) : (
                      <p>
                        {msg.texto}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-full-row ia-full-row">
                <div className="chat-full-wrapper">
                  <div className="chat-full-content">
                    <p>
                      Cody está
                      digitando...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="chat-footer-wrapper">
        <form
          className="chat-fullscreen-input-form"
          onSubmit={handleEnviar}
        >
          <input
            type="text"
            placeholder="Pergunte ao Cody..."
            value={inputMessage}
            onChange={(e) =>
              setInputMessage(
                e.target.value
              )
            }
            disabled={isLoading}
          />

          <button
            type="submit"
            className="btn-fullscreen-send"
            disabled={isLoading}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;