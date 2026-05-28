import { useParams, useNavigate } from 'react-router-dom';
import "../styles/ModuloDetalhes.css";

// Descrições oficiais extraídas do seu documento do curso
const descricoesModulos: Record<string, { titulo: string; desc: string }> = {
  "1": {
    titulo: "Fundamentos e Percepção Visual",
    desc: "Este módulo mergulha na análise exploratória de dados, unindo a programação Python aos conceitos fundamentais da estatística para transformar números em insights estratégicos. Você aprenderá a calcular e interpretar medidas de tendência central, dispersão e correlação, utilizando essas métricas para identificar padrões, detectar anomalias e compreender a distribuição das informações dentro de um conjunto de dados real. Por meio de técnicas de amostragem e testes iniciais, você desenvolverá a capacidade crítica de validar hipóteses e extrair conclusões fundamentadas, garantindo que a base de dados esteja matematicamente compreendida antes da etapa final de comunicação visual dos resultados."
  },
  "2": {
    titulo: "Visualização com Matplotlib",
    desc: "Este módulo apresenta recursos fundamentais do Matplotlib para construção e organização de gráficos. Ao longo das aulas, o participante aprende a diferenciar abordagens de criação de gráficos, trabalhar com múltiplos painéis e explorar estruturas mais flexíveis como o GridSpec para composições visuais mais elaboradas e layouts assimétricos."
  }
  // Você pode adicionar as descrições dos módulos 3, 4 e 5 aqui se desejar!
};

export default function ModuloDetalhes() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  // Se não encontrar o id, assume o módulo 1 por padrão
  const idAtual = moduloId || "1";
  const dadosModulo = descricoesModulos[idAtual] || descricoesModulos["1"];

  return (
    <div className="modulo-detalhes-container">
      <div className="modulo-detalhes-card">
        
        {/* Bloco da Esquerda: Descrição da Ementa */}
        <section className="modulo-info-section">
          <p className="modulo-text-description">
            {dadosModulo.desc}
          </p>
        </section>

        {/* Divisor Vertical Interno */}
        <div className="modulo-vertical-divider" />

        {/* Bloco da Direita: Menu de Opções de Acesso */}
        <aside className="modulo-menu-section">
          <button 
            className="modulo-menu-item" 
            onClick={() => navigate(`/modulo/${idAtual}/aulas`)}
          >
            <span className="menu-icon">🎓</span>
            <span className="menu-text">Aulas</span>
          </button>

          <button className="modulo-menu-item disabled">
            <span className="menu-icon">📖</span>
            <span className="menu-text">Materiais</span>
          </button>

          <button className="modulo-menu-item disabled">
            <span className="menu-icon">👍</span>
            <span className="menu-text">Avaliação</span>
          </button>
        </aside>

      </div>
    </div>
  );
}