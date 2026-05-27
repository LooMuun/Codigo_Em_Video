import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const dadosDosModulos: Record<
  string, 
  { 
    titulo: string; 
    aulas: { 
      id: number; 
      titulo: string; 
      tempo: string; 
      conteudos: string[];
    }[] 
  }
> = {
  "1": {
    titulo: "Fundamentos e Percepção Visual",
    aulas: [
      { 
        id: 1, 
        titulo: "A Ciência por Trás do Data Viz", 
        tempo: "12 min",
        conteudos: [
          "Importância de revelar padrões",
          "Tabelas vs. Gráficos explicativos",
          "O Quarteto de Anscombe",
          "O ciclo de vida de uma visualização"
        ]
      },
      { 
        id: 2, 
        titulo: "Atributos Pré-atentivos", 
        tempo: "15 min",
        conteudos: [
          "Conceito de design pré-atentivo",
          "Processamento visual automático",
          "Uso de cor, tamanho e forma",
          "Hierarquia de Cleveland e McGill"
        ]
      },
      { 
        id: 3, 
        titulo: "Tipos de Dados e Escalas", 
        tempo: "18 min",
        conteudos: [
          "Escalas nominais, ordinais e numéricas",
          "Escolha ideal do tipo de gráfico",
          "Erros clássicos de escala no Eixo Y",
          "Análise precisa e mensagens honestas"
        ]
      }
    ]
  },
  "2": {
    titulo: "Visualização com Matplotlib",
    aulas: [
      { 
        id: 1, 
        titulo: "Pyplot Implícito e Orientação a Objetos", 
        tempo: "15 min",
        conteudos: [
          "Ecossistema Matplotlib e pyplot",
          "Gráficos rápidos com plt.plot()",
          "Abordagem implícita vs. explícita",
          "Manipulação com 'fig' e 'ax'"
        ]
      },
      { 
        id: 2, 
        titulo: "Grades Simples com subplots()", 
        tempo: "14 min",
        conteudos: [
          "Múltiplos gráficos na mesma figura",
          "Grades regulares com plt.subplots()",
          "Matrizes de eixos e iteração",
          "Ajustes finos de layout"
        ]
      },
      { 
        id: 3, 
        titulo: "Layouts Assimétricos com GridSpec", 
        tempo: "20 min",
        conteudos: [
          "Uso do matplotlib.gridspec",
          "Limitações do subplots()",
          "Gráficos principais e auxiliares",
          "Composições para Dashboards"
        ]
      }
    ]
  },
  "3": {
    titulo: "Os 5 Gráficos Essenciais",
    aulas: [
      { 
        id: 1, 
        titulo: "Gráfico de Barras", 
        tempo: "12 min",
        conteudos: [
          "Comparação de categorias",
          "Ordenação estratégica das barras",
          "Uso de sns.barplot() no Seaborn",
          "Cuidados para evitar distorções"
        ]
      },
      { 
        id: 2, 
        titulo: "Gráfico de Pizza", 
        tempo: "10 min",
        conteudos: [
          "Partes de um todo e percentuais",
          "Uso e sintaxe do plt.pie()",
          "Limitações severas de leitura",
          "Quando trocar por gráfico de barras"
        ]
      },
      { 
        id: 3, 
        titulo: "Histograma", 
        tempo: "15 min",
        conteudos: [
          "Distribuição de frequências",
          "Gráficos de barras vs. Histogramas",
          "Uso de sns.histplot()",
          "Impacto do número de caixas (bins)"
        ]
      },
      { 
        id: 4, 
        titulo: "Boxplot", 
        tempo: "18 min",
        conteudos: [
          "Resumo gráfico de distribuições",
          "Mediana, Quartis e IQR",
          "Uso de sns.boxplot()",
          "Detecção ágil de outliers"
        ]
      },
      { 
        id: 5, 
        titulo: "Gráfico de Violino", 
        tempo: "16 min",
        conteudos: [
          "Visualização de densidade e forma",
          "Uso de sns.violinplot()",
          "Paralelo entre Boxplot e Violino",
          "Análise de concentração e subgrupos"
        ]
      }
    ]
  },
  "4": {
    titulo: "Visualizações Avançadas com Matplotlib e Seaborn",
    aulas: [
      { 
        id: 1, 
        titulo: "Gráficos de Dispersão, Alpha e Hexbin", 
        tempo: "18 min",
        conteudos: [
          "Scatter plots para duas variáveis",
          "O problema do overplotting",
          "Transparência com o parâmetro 'alpha'",
          "Gráfico Hexbin para alta densidade"
        ]
      },
      { 
        id: 2, 
        titulo: "Regressão Visual com Regplot e Lmplot", 
        tempo: "15 min",
        conteudos: [
          "Linhas de tendência em dispersões",
          "Uso do sns.regplot() e 'ci=None'",
          "Intervalos de confiança visuais",
          "Segmentação com sns.lmplot()"
        ]
      },
      { 
        id: 3, 
        titulo: "Séries Temporais com Gráfico de Linha", 
        tempo: "22 min",
        conteudos: [
          "Evolução ao longo do tempo",
          "Tratamento de datas com pd.to_datetime()",
          "Ordenação com sort_values()",
          "Uso do sns.lineplot() e marcadores"
        ]
      },
      { 
        id: 4, 
        titulo: "Escalas e Distorções Visuais", 
        tempo: "14 min",
        conteudos: [
          "Parametrização de escalas e impactos",
          "Eixos Y zero vs. eixos flutuantes",
          "Limites com a função set_ylim()",
          "Discussão ética sobre honestidade"
        ]
      },
      { 
        id: 5, 
        titulo: "FacetGrid e Comparação por Grupos", 
        tempo: "20 min",
        conteudos: [
          "Pequenos múltiplos contra poluição",
          "Uso prático do sns.FacetGrid()",
          "Destaques com fill_between()",
          "Padronização de eixos Y"
        ]
      }
    ]
  },
  "5": {
    titulo: "Boas Práticas e Storytelling Visual",
    aulas: [
      { 
        id: 1, 
        titulo: "Gráfico Poluído vs. Gráfico Limpo", 
        tempo: "15 min",
        conteudos: [
          "Remoção de 'chartjunk' e excessos",
          "Princípios de minimalismo visual",
          "Destaque seletivo com cores",
          "Substituição por rótulos diretos"
        ]
      },
      { 
        id: 2, 
        titulo: "Títulos, Rótulos e Anotações", 
        tempo: "12 min",
        conteudos: [
          "Títulos genéricos vs. analíticos",
          "Rótulos explicativos sem ambiguidade",
          "Contexto com ax.annotate()",
          "Conectando narrativas ao gráfico"
        ]
      },
      { 
        id: 3, 
        titulo: "Uso Estratégico de Cores", 
        tempo: "18 min",
        conteudos: [
          "Cores com significado analítico",
          "Evitando paletas decorativas",
          "Linhas de referência no ponto zero",
          "Comparação rápida de metas"
        ]
      },
      { 
        id: 4, 
        titulo: "Escalas Proporcionais e Honestidade Visual", 
        tempo: "15 min",
        conteudos: [
          "Como escalas distorcem diferenças",
          "Integridade visual em relatórios",
          "Uso correto de set_ylim()",
          "Inserção de rótulos percentuais"
        ]
      },
      { 
        id: 5, 
        titulo: "Adaptação de Gráficos para Apresentações", 
        tempo: "20 min",
        conteudos: [
          "Gráficos de Notebook vs. Slides",
          "Hierarquia visual e tipografia ampliada",
          "Remoção de eixos redundantes",
          "Preparação para comunicação executiva"
        ]
      }
    ]
  }
};

export default function Aulas() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();
  
  const idChave = moduloId && dadosDosModulos[moduloId] ? moduloId : "1";
  const moduloAtual = dadosDosModulos[idChave];
  
  // Alteração: Iniciamos com null para que nenhum conteúdo/vídeo apareça sem o clique inicial
  const [aulaAtivaId, setAulaAtivaId] = useState<number | null>(null);
  const [videoIniciado, setVideoIniciado] = useState<boolean>(false);

  // Reseta estados se mudar de módulo na URL
  useEffect(() => {
    setAulaAtivaId(null);
    setVideoIniciado(false); 
  }, [moduloId]);

  // Função inteligente que abre ou fecha a aula ao clicar
  const manipularCliqueAula = (id: number) => {
    if (aulaAtivaId === id) {
      // Se clicou na mesma aula ativa, ela "sobe" (fecha)
      setAulaAtivaId(null);
      setVideoIniciado(false);
    } else {
      // Se clicou em outra aula, abre ela e o vídeo normalmente
      setAulaAtivaId(id);
      setVideoIniciado(true);
    }
  };

  const aulaAtual = moduloAtual?.aulas.find(aula => aula.id === aulaAtivaId);

  if (!moduloAtual) {
    return (
      <div style={{ color: '#fff', padding: '40px', textAlign: 'center', backgroundColor: '#060913', minHeight: '100vh' }}>
        <h2>Módulo não encontrado</h2>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="video-page-container" style={{ backgroundColor: '#060913', minHeight: '100vh', color: '#fff', padding: '40px' }}>
      
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Voltar ao Dashboard
      </button>

      <header className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{moduloAtual.titulo}</h1>
        <p style={{ color: '#9ca3af' }}>Módulo {idChave} • {moduloAtual.aulas.length} aulas disponíveis</p>
      </header>

      <div className="main-content-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        
        {/* Player de Vídeo Dinâmico */}
        <section className="video-player-container" style={{ background: '#0b1120', borderRadius: '16px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          {videoIniciado && aulaAtual ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(58, 111, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a6fff', fontSize: '1.5rem', margin: '0 auto 16px auto', border: '1px solid rgba(58, 111, 255, 0.4)' }}>
                ▶
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#ffffff' }}>
                Reproduzindo: {aulaAtual.titulo}
              </h3>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h2>Pronto para começar?</h2>
              <p style={{ color: '#9ca3af', marginBottom: '20px', marginTop: '10px' }}>Selecione uma aula na barra lateral para iniciar o vídeo.</p>
            </div>
          )}
        </section>

        {/* Barra Lateral Direita com Efeito Desdobrável */}
        <aside className="sidebar-lessons" style={{ background: '#0b1120', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Conteúdo do Módulo</h3>
          <div className="lessons-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {moduloAtual.aulas.map((aula, index) => {
              const isAtiva = aula.id === aulaAtivaId;
              return (
                <div 
                  key={aula.id}
                  onClick={() => manipularCliqueAula(aula.id)}
                  className={`lesson-card-item ${isAtiva ? 'active-lesson' : ''}`}
                >
                  <div className="lesson-badge">AULA {(index + 1).toString().padStart(2, '0')}</div>
                  <div className="lesson-title">{aula.titulo}</div>
                  <div className="lesson-duration">⏱️ {aula.tempo}</div>
                  
                  {/* Container expandido que agora fecha ao clicar novamente */}
                  {isAtiva && (
                    <div className="lesson-embedded-contents">
                      <div className="embedded-divider"></div>
                      <div className="embedded-section-title">Conteúdos abordados:</div>
                      <ul>
                        {aula.conteudos.map((topico, idx) => (
                          <li key={idx}>{topico}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

      </div>
    </div>
  );
}