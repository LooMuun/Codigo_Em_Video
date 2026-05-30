import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.service";
import "../styles/Quiz.css";

interface Question {
  id: string;
  enunciado: string;
  opcoes: string[];
}

const Quiz = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    // dados fictícios para renderizar na tela, substituir por dados do banco
    const perguntasTeste = [
      {
        id: "teste-1",
        enunciado: "Qual técnica é altamente recomendada para resolver o problema de 'overplotting' (sobreposição massiva de pontos) em um Scatter Plot?",
        opcoes: [
          "Aumentar o tamanho de todos os marcadores e remover as linhas de grade.",
          "Utilizar o parâmetro 'alpha' para aplicar transparência aos pontos ou agrupar em Hexbin.",
          "Substituir imediatamente por um gráfico de pizza 3D para consolidar as proporções.",
          "Forçar o eixo Y a começar em um valor negativo flutuante."
        ]
      },
      {
        id: "teste-2",
        enunciado: "No Matplotlib, qual objeto representa a área efetiva onde os dados foram plotados?",
        opcoes: [
          "Figure (fig)",
          "Axes (ax)",
          "Pyplot (plt)",
          "GridSpec"
        ]
      }
    ];

    setQuestions(perguntasTeste);
  }, [moduleId]); 

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // comentando temporariamente a linha abaixo pro front não estourar erro de falta de backend:
      /* await api.post("/quiz-answers", {
        moduleId,
        answers: selectedAnswers,
      }); */
      setQuizFinished(true);
    } catch (error) {
      console.error("Erro ao enviar respostas do quiz:", error);
      alert("Houve um erro ao enviar sua avaliação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="avaliacao-loading">
        <div className="spinner"></div>
        <p>Carregando o desafio do módulo...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="avaliacao-success-container fade-in" style={{ padding: '40px 20px', minHeight: '100vh', overflowY: 'auto' }}>
        <div className="success-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="success-icon">🎉</div>
          <h1>Avaliação Concluída!</h1>
          <p style={{ marginBottom: '30px' }}>Confira abaixo a correção da sua avaliação:</p>
          <div className="correcao-lista" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '30px' }}>
            {questions.map((quest, qIndex) => {
              const respostaDoUsuario = selectedAnswers[quest.id];
              // usando dados de teste, assumir que a segunda opção (índice 1) é a correta para o mock.
              const respostaCorretaMock = quest.opcoes[1]; 
              const acertou = respostaDoUsuario === respostaCorretaMock;

              return (
                <div 
                  key={quest.id} 
                  className="correcao-item" 
                  style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: `1px solid ${acertou ? 'rgba(43, 241, 192, 0.2)' : 'rgba(ef, 44, 44, 0.2)'}` 
                  }}
                >
                  <h4 style={{ color: '#f1f5f9', marginBottom: '15px', fontSize: '1.05rem', lineHeight: '1.4' }}>
                    {qIndex + 1}. {quest.enunciado}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {quest.opcoes.map((opcao, oIndex) => {
                      const isUserSelection = respostaDoUsuario === opcao;
                      const isCorrectAnswer = respostaCorretaMock === opcao;

                      let borderColor = 'rgba(255,255,255,0.05)';
                      let bgColor = 'transparent';
                      let icon = '';

                      if (isCorrectAnswer) {
                        borderColor = '#2bf1c0';
                        bgColor = 'rgba(43, 241, 192, 0.05)';
                        icon = '   (Resposta Correta) ✅';
                      } else if (isUserSelection && !acertou) {
                        borderColor = '#ef4444';
                        bgColor = 'rgba(239, 68, 68, 0.05)';
                        icon = ' ❌ (Sua Resposta)';
                      }

                      return (
                        <div 
                          key={oIndex} 
                          style={{ 
                            padding: '12px 15px', 
                            borderRadius: '8px', 
                            border: `1px solid ${borderColor}`, 
                            background: bgColor,
                            color: isCorrectAnswer ? '#2bf1c0' : isUserSelection ? '#ef4444' : '#cbd5e1',
                            fontSize: '0.95rem',
                            display: 'flex',
                            justifyContent: 'between'
                          }}
                        >
                          <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{String.fromCharCode(65 + oIndex)})</span>
                          <span>{opcao} {icon}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn-final-voltar" onClick={() => navigate(`/modulo/${moduleId}/aulas`)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];

  return (
    <div className="avaliacao-fullscreen-container">
      <div className="bg-glow-blue" style={{ opacity: 0.1 }}></div>
      <div className="bg-glow-green" style={{ opacity: 0.1 }}></div>

      <div className="avaliacao-card fade-in">
        <div className="avaliacao-header">
          <button className="btn-abandonar" onClick={() => navigate("/home")}>
            ✕ Abandonar
          </button>
          <div className="progress-text">
            Questão <strong>{currentQuestionIndex + 1}</strong> de {questions.length}
          </div>
        </div>

        <div className="progress-bar-wrapper">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-body">
          <h2 className="question-enunciado">{currentQuestion.enunciado}</h2>
          
          <div className="options-grid">
            {currentQuestion.opcoes.map((opcao, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opcao;
              return (
                <button
                  key={index}
                  type="button"
                  className={`option-button ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectOption(currentQuestion.id, opcao)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{opcao}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="avaliacao-footer">
          <button 
            className="btn-nav-prev" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              className="btn-nav-next" 
              onClick={handleNext} 
              disabled={!isAnswered}
            >
              Próxima
            </button>
          ) : (
            <button 
              className="btn-nav-submit" 
              onClick={handleSubmit} 
              disabled={!isAnswered || isLoading}
            >
              {isLoading ? "Enviando..." : "Finalizar Prova"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;