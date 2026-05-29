import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Materiais.css';

const materiaisPorModulo: Record<
  string, 
  {
    moduloTitulo: string;
    arquivos: { id: number; nome: string; tipo: 'pdf' | 'notebook' | 'csv'; tamanho: string; descricao: string; url: string }[];
  }
> = {
  "1": {
    moduloTitulo: "Fundamentos e Percepção Visual",
    arquivos: [
      { id: 1, nome: "Slides_Aulas_01_a_03.pdf", tipo: "pdf", tamanho: "4.2 MB", descricao: "Slides completos sobre Atributos Pré-atentivos e o Quarteto de Anscombe.", url: "#" },
      { id: 2, nome: "Guia_De_Destaques_Visuais.pdf", tipo: "pdf", tamanho: "1.8 MB", descricao: "Pocket-book com regras de contraste e hierarquia visual.", url: "#" }
    ]
  },
  "2": {
    moduloTitulo: "Visualização com Matplotlib",
    arquivos: [
      { id: 1, nome: "Notebook_Intro_Matplotlib.ipynb", tipo: "notebook", tamanho: "850 KB", descricao: "Jupyter Notebook com exemplos práticos da abordagem explícita (fig, ax).", url: "#" },
      { id: 2, nome: "Gabarito_Grades_Assimetricas.ipynb", tipo: "notebook", tamanho: "1.2 MB", descricao: "Códigos de apoio para criação de layouts com GridSpec.", url: "#" }
    ]
  },
  "3": {
    moduloTitulo: "Os 5 Gráficos Essenciais",
    arquivos: [
      { id: 1, nome: "Dataset_Faturamento_Unifor.csv", tipo: "csv", tamanho: "2.4 MB", descricao: "Dados fictícios de faturamento para plotagem de Histogramas e Boxplots.", url: "#" },
      { id: 2, nome: "Notebook_Seaborn_Essenciais.ipynb", tipo: "notebook", tamanho: "1.4 MB", descricao: "Scripts prontos usando sns.barplot e sns.boxplot.", url: "#" },
      { id: 3, nome: "Slides_Os_5_Graficos.pdf", tipo: "pdf", tamanho: "3.1 MB", descricao: "Teoria sobre quando evitar gráficos de pizza e preferir barras.", url: "#" }
    ]
  },
  "4": {
    moduloTitulo: "Visualizações Avançadas com Matplotlib e Seaborn",
    arquivos: [
      { id: 1, nome: "Dataset_Altas_Densidades.csv", tipo: "csv", tamanho: "14.8 MB", descricao: "Grande volume de dados para testes de overplotting com Hexbin.", url: "#" },
      { id: 2, nome: "Notebook_Series_Temporais_Avancado.ipynb", tipo: "notebook", tamanho: "3.2 MB", descricao: "Tratamento de datas com Pandas e plotagem de FacetGrid.", url: "#" }
    ]
  },
  "5": {
    moduloTitulo: "Boas Práticas e Storytelling Visual",
    arquivos: [
      { id: 1, nome: "Slides_Storytelling_Executivo.pdf", tipo: "pdf", tamanho: "5.7 MB", descricao: "Apresentação sobre remoção de chartjunk e adaptação para reuniões.", url: "#" }
    ]
  }
};

export default function Materiais() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const idChave = moduloId && materiaisPorModulo[moduloId] ? moduloId : "1";
  const dadosMateriais = materiaisPorModulo[idChave];

  // Função auxiliar para renderizar o ícone correto baseado no tipo de arquivo
  const renderIcon = (tipo: 'pdf' | 'notebook' | 'csv') => {
    switch (tipo) {
      case 'pdf':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        );
      case 'notebook':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        );
      case 'csv':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2bf1c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18H3z"></path>
            <path d="M21 9H3"></path>
            <path d="M21 15H3"></path>
            <path d="M12 3v18"></path>
          </svg>
        );
    }
  };

  return (
    <div className="materials-page-container">
      {/* Botão padrão do chat integrado */}
      <button type="button" className="btn-back-dashboard" onClick={() => navigate('/dashboard')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Voltar</span>
      </button>

      <header className="materials-header">
        <h1>Materiais de Apoio</h1>
        <p className="materials-subtitle">Módulo {idChave} • {dadosMateriais.moduloTitulo}</p>
      </header>

      <main className="materials-list-wrapper">
        {dadosMateriais.arquivos.map((arquivo) => (
          <div key={arquivo.id} className="material-item-card">
            <div className="material-card-left">
              <div className="file-icon-badge">
                {renderIcon(arquivo.tipo)}
              </div>
              <div className="material-info-text">
                <h3>{arquivo.nome}</h3>
                <p>{arquivo.descricao}</p>
                <span className="file-meta-tag">{arquivo.tipo.toUpperCase()} • {arquivo.tamanho}</span>
              </div>
            </div>
            
            <a href={arquivo.url} className="btn-download-material">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download</span>
            </a>
          </div>
        ))}
      </main>
    </div>
  );
}