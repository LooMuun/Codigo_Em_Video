import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Avaliacao.css';

export default function Avaliacao() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [nota, setNota] = useState<number>(0);
  const [hoverNota, setHoverNota] = useState<number>(0);
  const [comentario, setComentario] = useState<string>('');
  const [enviado, setEnviado] = useState<boolean>(false);

  const titulosModulos: Record<string, string> = {
    "1": "Fundamentos e Percepção Visual",
    "2": "Visualização com Matplotlib",
    "3": "Os 5 Gráficos Essenciais",
    "4": "Visualizações Avançadas com Matplotlib e Seaborn",
    "5": "Boas Práticas e Storytelling Visual"
  };

  const nomeModulo = titulosModulos[moduloId || "1"] || "Módulo Geral";

  const lidarComEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (nota === 0) return;
    
    // No futuro, aqui vai o insert do Supabase
    setEnviado(true);
  };

  return (
    <div className="evaluation-page-container">
      {/* Botão de Voltar Unificado */}
      <button type="button" className="btn-back-dashboard" onClick={() => navigate('/dashboard')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Voltar</span>
      </button>

      <header className="evaluation-header">
        <h1>Avaliação do Módulo</h1>
        <p className="evaluation-subtitle">Módulo {moduloId || "1"} • {nomeModulo}</p>
      </header>

      <main className="evaluation-card-box">
        {!enviado ? (
          <form onSubmit={lidarComEnvio} className="evaluation-form">
            <div className="evaluation-section">
              <label className="section-label">Sua nota para este módulo:</label>
              <div className="stars-rating-container">
                {[1, 2, 3, 4, 5].map((estrela) => {
                  const ativa = estrela <= (hoverNota || nota);
                  return (
                    <button
                      key={estrela}
                      type="button"
                      className={`star-btn ${ativa ? 'active-star' : ''}`}
                      onClick={() => setNota(estrela)}
                      onMouseEnter={() => setHoverNota(estrela)}
                      onMouseLeave={() => setHoverNota(0)}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill={ativa ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                  );
                })}
              </div>
              {nota > 0 && (
                <span className="rating-feedback-text">
                  {nota === 1 && "⭐ Ruim"}
                  {nota === 2 && "⭐⭐ Regular"}
                  {nota === 3 && "⭐⭐⭐ Bom"}
                  {nota === 4 && "⭐⭐⭐⭐ Muito Bom"}
                  {nota === 5 && "⭐⭐⭐⭐⭐ Excelente!"}
                </span>
              )}
            </div>

            <div className="evaluation-section">
              <label htmlFor="comments" className="section-label">O que você achou do conteúdo, didática e exemplos? (Opcional)</label>
              <textarea
                id="comments"
                placeholder="Deixe seu feedback para nos ajudar a melhorar o curso..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={500}
                className="evaluation-textarea"
              />
              <span className="char-count">{comentario.length}/500</span>
            </div>

            <button
              type="submit"
              disabled={nota === 0}
              className="evaluation-submit-btn"
            >
              Enviar Avaliação
            </button>
          </form>
        ) : (
          <div className="evaluation-success-box">
            <div className="success-icon-wrapper">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2bf1c0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Obrigado pelo feedback!</h2>
            <p>Sua avaliação foi registrada com sucesso!</p>
            <button type="button" className="btn-success-back" onClick={() => navigate('/dashboard')}>
              Voltar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}