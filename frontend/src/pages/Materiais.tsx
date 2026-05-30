import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.service';
import '../styles/Materiais.css';

interface MaterialFile {
  nome: string;
  tipo: 'pdf' | 'notebook' | 'csv' | 'outro';
  tamanho: string;
  modulo: string;
  categoria: 'slides' | 'exercicios';
}

const CATEGORIA_LABEL: Record<string, string> = {
  slides: '📑 Slides',
  exercicios: '💻 Exercícios & Notebooks',
};

const IconPDF = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconNotebook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconCSV = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2bf1c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18" />
  </svg>
);

const IconFile = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

function renderIcon(tipo: MaterialFile['tipo']) {
  switch (tipo) {
    case 'pdf':      return <IconPDF />;
    case 'notebook': return <IconNotebook />;
    case 'csv':      return <IconCSV />;
    default:         return <IconFile />;
  }
}

export default function Materiais() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [arquivos, setArquivos] = useState<MaterialFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchArquivos = async () => {
      setLoading(true);
      setErro('');
      try {
        // Resolve UUID → número do módulo (os arquivos usam "Modulo 1", "Modulo 2"...)
        let numeroModulo: string | undefined;
        if (moduloId) {
          const { data: todosModulos } = await api.get('/modules');
          const idx = todosModulos.findIndex((m: { id: string }) => m.id === moduloId);
          if (idx !== -1) {
            numeroModulo = String(idx + 1);
          }
        }

        const params = numeroModulo ? `?modulo=${numeroModulo}` : '';
        const { data } = await api.get(`/files/list${params}`);
        setArquivos(data);
      } catch (err) {
        setErro('Não foi possível carregar os materiais. Verifique se o servidor está rodando.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArquivos();
  }, [moduloId]);

  const handleDownload = async (arquivo: MaterialFile) => {
    setDownloading(arquivo.nome);
    try {
      const response = await api.get('/files/download', {
        params: { name: arquivo.nome, categoria: arquivo.categoria },
        responseType: 'blob',
      });

      // Cria link temporário para forçar o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', arquivo.nome);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao baixar o arquivo. Tente novamente.');
    } finally {
      setDownloading(null);
    }
  };

  // Agrupa por categoria
  const porCategoria = arquivos.reduce<Record<string, MaterialFile[]>>((acc, f) => {
    if (!acc[f.categoria]) acc[f.categoria] = [];
    acc[f.categoria].push(f);
    return acc;
  }, {});

  const totalArquivos = arquivos.length;

  return (
    <div className="materials-page-container">

      {/* Botão Voltar */}
      <button type="button" className="btn-back-dashboard" onClick={() => navigate(`/modulo/${moduloId}/aulas`)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Voltar</span>
      </button>

      {/* Header */}
      <header className="materials-header">
        <h1>Materiais de Apoio</h1>
        <p className="materials-subtitle">
          {moduloId ? `Módulo ${moduloId}` : 'Todos os módulos'} •{' '}
          {loading ? 'carregando...' : `${totalArquivos} arquivo${totalArquivos !== 1 ? 's' : ''}`}
        </p>
      </header>

      {/* Estados */}
      {loading && (
        <div className="materiais-loading">
          <div className="materiais-spinner" />
          <p>Buscando materiais...</p>
        </div>
      )}

      {!loading && erro && (
        <div className="materiais-erro">
          <span>⚠️</span>
          <p>{erro}</p>
        </div>
      )}

      {!loading && !erro && totalArquivos === 0 && (
        <div className="materiais-vazio">
          <span>📂</span>
          <p>Nenhum material disponível para este módulo ainda.</p>
        </div>
      )}

      {/* Lista por categoria */}
      {!loading && !erro && Object.entries(porCategoria).map(([cat, files]) => (
        <section key={cat} className="materiais-section">
          <h2 className="materiais-section-title">
            {CATEGORIA_LABEL[cat] || cat}
            <span className="materiais-count">{files.length}</span>
          </h2>

          <div className="materials-list-wrapper">
            {files.map((arquivo) => {
              const isDownloading = downloading === arquivo.nome;
              return (
                <div key={arquivo.nome} className="material-item-card">
                  <div className="material-card-left">
                    <div className="file-icon-badge">
                      {renderIcon(arquivo.tipo)}
                    </div>
                    <div className="material-info-text">
                      <h3>{arquivo.nome}</h3>
                      <span className="file-meta-tag">
                        {arquivo.tipo.toUpperCase()} • {arquivo.tamanho}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`btn-download-material ${isDownloading ? 'btn-downloading' : ''}`}
                    onClick={() => handleDownload(arquivo)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <div className="btn-spinner" />
                        <span>Baixando...</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}