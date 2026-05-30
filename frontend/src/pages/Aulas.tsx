import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.service";
import { LoadingOverlay } from "../components/ui";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Option {
  id: string;
  option: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  statement: string;
  classroomId: string;
  options: Option[];
}

interface Aula {
  id: string;
  title: string;
  description: string;
  url: string;
  img: string;
  moduleId: string;
}

interface Modulo {
  id: string;
  title: string;
  description: string;
  img: string;
}

interface Progress {
  classroomId: string;
  completed: boolean;
}

type RespostaState = {
  optionId: string;
  isCorrect: boolean;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg-main: #060913;
    --bg-card: #0b1120;
    --bg-card-hover: #121a2e;
    --color-primary: #00f0ff;
    --color-primary-glow: rgba(0, 240, 255, 0.15);
    --color-text-main: #ffffff;
    --color-text-muted: #4b5563;
    --color-text-body: #9ca3af;
    --border-color: rgba(255, 255, 255, 0.04);
    --border-subtle: rgba(255, 255, 255, 0.07);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .aulas-root {
    background-color: var(--bg-main);
    background-image:
      radial-gradient(circle at 80% 5%, rgba(0, 240, 255, 0.04) 0%, transparent 45%),
      radial-gradient(circle at 5% 90%, rgba(0, 112, 243, 0.03) 0%, transparent 45%);
    min-height: 100vh;
    color: var(--color-text-main);
    font-family: 'DM Sans', sans-serif;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 60px;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(6, 9, 19, 0.85);
    backdrop-filter: blur(16px);
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--color-text-body);
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }

  .back-btn:hover {
    border-color: rgba(255,255,255,0.15);
    color: #fff;
  }

  .topbar-divider {
    width: 1px;
    height: 18px;
    background: var(--border-subtle);
  }

  .topbar-module-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-body);
    font-family: 'Sora', sans-serif;
    letter-spacing: -0.01em;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .progress-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 0.75rem;
    color: var(--color-text-body);
    font-family: 'Sora', sans-serif;
  }

  .progress-pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 6px rgba(0,240,255,0.6);
  }

  .body-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 0;
    min-height: calc(100vh - 60px);
    align-items: start;
  }

  .left-col {
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    border-right: 1px solid var(--border-color);
    min-height: calc(100vh - 60px);
  }

  .player-wrap {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    position: relative;
    box-shadow: 0 24px 48px -12px rgba(0,0,0,0.6);
    min-height: 320px;
  }

  .player-wrap iframe,
  .player-wrap video {
    width: 100%;
    height: 100%;
    display: block;
  }

  .player-empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 36px;
    background-image: linear-gradient(135deg, rgba(0,240,255,0.025) 0%, transparent 60%);
  }

  .player-empty-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,240,255,0.08);
    border: 1px solid rgba(0,240,255,0.15);
    color: var(--color-primary);
    font-size: 0.7rem;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 6px;
    margin-bottom: 16px;
  }

  .player-empty h2 {
    font-family: 'Sora', sans-serif;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .player-empty p {
    font-size: 0.875rem;
    color: var(--color-text-body);
    line-height: 1.6;
    max-width: 440px;
  }

  .player-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%);
    pointer-events: none;
  }

  .completed-banner {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 240, 180, 0.1);
    border: 1px solid rgba(0, 240, 180, 0.25);
    border-radius: 10px;
    padding: 9px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #00f0b4;
    white-space: nowrap;
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.01em;
    backdrop-filter: blur(12px);
  }

  .lesson-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lesson-info-label {
    font-size: 0.7rem;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-primary);
  }

  .lesson-info-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: #fff;
    line-height: 1.3;
  }

  .lesson-info-desc {
    font-size: 0.875rem;
    color: var(--color-text-body);
    line-height: 1.65;
    margin-top: 2px;
  }

  .quiz-wrap {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    overflow: hidden;
    background: var(--bg-card);
  }

  .quiz-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border-color);
    background: rgba(255,255,255,0.02);
  }

  .quiz-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .quiz-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(0,240,255,0.07);
    border: 1px solid rgba(0,240,255,0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .quiz-title {
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .quiz-subtitle {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    margin-top: 2px;
  }

  .quiz-locked-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    color: #f59e0b;
    background: rgba(245,158,11,0.08);
    border: 1px solid rgba(245,158,11,0.18);
    border-radius: 8px;
    padding: 6px 12px;
    letter-spacing: 0.02em;
  }

  .quiz-progress-bar {
    height: 3px;
    background: rgba(255,255,255,0.04);
  }

  .quiz-progress-fill {
    height: 3px;
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  .quiz-body {
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .quiz-summary {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
  }

  .quiz-summary-emoji {
    font-size: 1.6rem;
    line-height: 1;
  }

  .quiz-summary-label {
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    color: #fff;
  }

  .quiz-summary-score {
    font-size: 0.8rem;
    margin-top: 3px;
  }

  .question-block {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--border-color);
  }

  .question-block:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .question-statement {
    font-size: 1rem;
    font-weight: 500;
    color: #e2e8f0;
    line-height: 1.65;
  }

  .question-index {
    font-family: 'Sora', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
    display: block;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .option-btn {
    width: 100%;
    border-radius: 11px;
    padding: 15px 18px;
    font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.15s ease;
    line-height: 1.5;
    gap: 12px;
  }

  .option-btn:not(:disabled):hover {
    filter: brightness(1.18);
    transform: translateX(2px);
  }

  .option-btn-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .option-sua-resposta {
    font-size: 0.7rem;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .option-icon {
    font-size: 1rem;
    font-weight: 700;
    flex-shrink: 0;
    line-height: 1;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .option-loading {
    font-size: 0.75rem;
    opacity: 0.4;
    flex-shrink: 0;
  }

  .question-error {
    font-size: 0.78rem;
    color: #f87171;
    margin-top: 4px;
  }

  .quiz-empty {
    text-align: center;
    padding: 48px 32px;
    color: rgba(255,255,255,0.25);
  }

  .quiz-empty-icon {
    font-size: 2.2rem;
    margin-bottom: 14px;
    opacity: 0.5;
  }

  .quiz-empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(255,255,255,0.35);
    margin-bottom: 8px;
  }

  .quiz-empty-text {
    font-size: 0.85rem;
    line-height: 1.6;
  }

  .right-sidebar {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .right-sidebar::-webkit-scrollbar { width: 3px; }
  .right-sidebar::-webkit-scrollbar-track { background: transparent; }
  .right-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 99px; }

  .sidebar-section-header {
    padding: 20px 24px 14px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg-main);
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .modules-list {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
  }

  .module-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .module-row:hover {
    background: rgba(255,255,255,0.02);
  }

  .module-row.current {
    background: rgba(0,240,255,0.03);
  }

  .module-row-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .module-row-label {
    font-size: 0.65rem;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .module-row-title {
    font-size: 0.825rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .module-row-count {
    font-size: 0.7rem;
    color: var(--color-text-muted);
    margin-top: 1px;
  }

  .module-chevron {
    font-size: 0.55rem;
    color: var(--color-text-muted);
    margin-left: 8px;
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .module-chevron.open {
    transform: rotate(180deg);
  }

  .aulas-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 2px;
  }

  .aula-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px 12px 32px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0.15s;
    position: relative;
  }

  .aula-item:hover {
    background: rgba(255,255,255,0.02);
  }

  .aula-item.active {
    border-left-color: var(--color-primary);
    background: rgba(0,240,255,0.025);
  }

  .aula-item.locked {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .aula-item-num {
    font-size: 0.65rem;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.06em;
    flex-shrink: 0;
    width: 20px;
    text-align: right;
  }

  .aula-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .aula-item-title {
    font-size: 0.8rem;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s;
    line-height: 1.4;
  }

  .aula-item.active .aula-item-title {
    font-weight: 600;
    color: #fff;
  }

  .aula-item-lock-msg {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    margin-top: 2px;
  }

  .aula-item-status {
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  .aula-desc-expanded {
    padding: 0 24px 14px 68px;
    font-size: 0.75rem;
    color: var(--color-text-body);
    line-height: 1.6;
    border-left: 2px solid var(--color-primary);
    background: rgba(0,240,255,0.015);
  }

  .full-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg-main);
    font-family: 'DM Sans', sans-serif;
  }

  .loading-text {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.05em;
  }
`;

export default function Aulas() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [todasAulas, setTodasAulas] = useState<Aula[]>([]);
  const [aulaAtivaId, setAulaAtivaId] = useState<string | null>(null);
  const [videoIniciado, setVideoIniciado] = useState<boolean>(false);
  const [videoTerminou, setVideoTerminou] = useState<boolean>(false);
  const [moduloExpandido, setModuloExpandido] = useState<string | null>(moduloId ?? null);
  const [loading, setLoading] = useState(true);
  const [progresso, setProgresso] = useState<Progress[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, RespostaState>>({});
  const [enviando, setEnviando] = useState<string | null>(null);
  const [erroQuestao, setErroQuestao] = useState<string | null>(null);
  const [aulaCompleta, setAulaCompleta] = useState(false);

  const ytPlayerRef = useRef<any>(null);

  useEffect(() => {
    if (!window.YT && !document.getElementById("yt-api-script")) {
      const tag = document.createElement("script");
      tag.id = "yt-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const first = document.getElementsByTagName("script")[0];
      if (first && first.parentNode) first.parentNode.insertBefore(tag, first);
      else document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const [modulosRes, aulasRes] = await Promise.all([
          api.get("/modules"),
          api.get("/classrooms"),
        ]);
        setModulos(modulosRes.data);
        setTodasAulas(aulasRes.data);
      } catch (err) {
        console.error("Erro crítico ao buscar conteúdo do curso:", err);
      }

      try {
        const progressoRes = await api.get("/progress");
        setProgresso(progressoRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setProgresso([]);
        } else {
          console.error("Erro ao buscar progresso:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  useEffect(() => {
    setAulaAtivaId(null);
    setVideoIniciado(false);
    setVideoTerminou(false);
    setModuloExpandido(moduloId ?? null);
  }, [moduloId]);

  useEffect(() => {
    if (!aulaAtivaId) {
      setQuestions([]);
      setRespostas({});
      setVideoTerminou(false);
      setAulaCompleta(false);
      return;
    }

    const fetchQuestions = async () => {
      setLoadingQuiz(true);
      setAulaCompleta(false);

      const jaCompleta = progresso.some(
        (p) => p.classroomId === aulaAtivaId && p.completed
      );
      setVideoTerminou(jaCompleta);

      try {
        const res = await api.get(`/questions/classroom/${aulaAtivaId}`);
        const respostasSalvas: Record<string, RespostaState> = {};

        const questoesEmbaralhadas = res.data.map((q: any) => {
          if (q.quizAnswers && q.quizAnswers.length > 0) {
            const r = q.quizAnswers[0];
            respostasSalvas[q.id] = {
              optionId: r.optionId,
              isCorrect: r.isCorrect === true || r.isCorrect === "TRUE",
            };
          }
          return { ...q, options: [...q.options].sort(() => Math.random() - 0.5) };
        });

        setQuestions(questoesEmbaralhadas);
        setRespostas(respostasSalvas);
      } catch (err) {
        console.error("Erro ao buscar questões:", err);
        setQuestions([]);
        setRespostas({});
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuestions();
  }, [aulaAtivaId]);

  useEffect(() => {
    if (!aulaAtivaId || aulaCompleta) return;
    const totalQuestoes = questions.length;
    const totalRespondidas = Object.keys(respostas).length;
    const quizCompleto = totalQuestoes === 0 || totalRespondidas === totalQuestoes;
    if (videoTerminou && quizCompleto) {
      setAulaCompleta(true);
      marcarAulaCompleta(aulaAtivaId);
    }
  }, [videoTerminou, respostas, questions, aulaAtivaId]);

  const marcarAulaCompleta = async (classroomId: string) => {
    try {
      await api.post("/progress", { classroomId });
      setProgresso((prev) => {
        const existe = prev.find((p) => p.classroomId === classroomId);
        if (existe) return prev.map((p) => p.classroomId === classroomId ? { ...p, completed: true } : p);
        return [...prev, { classroomId, completed: true }];
      });
    } catch (err) {
      console.error("Erro ao marcar progresso:", err);
    }
  };

  const aulasDomModulo = (mId: string) => todasAulas.filter((a) => a.moduleId === mId);
  const moduloAtual = useMemo(() => modulos.find((m) => m.id === moduloId), [modulos, moduloId]);
  const aulasDoModuloAtual = useMemo(() => todasAulas.filter((a) => a.moduleId === moduloId), [todasAulas, moduloId]);
  const aulaAtual = useMemo(() => aulasDoModuloAtual.find((a) => a.id === aulaAtivaId), [aulasDoModuloAtual, aulaAtivaId]);

  const isAulaDesbloqueada = (aulasDoMod: Aula[], index: number): boolean => {
    if (index === 0) return true;
    return progresso.some((p) => p.classroomId === aulasDoMod[index - 1].id && p.completed);
  };

  const isAulaConcluida = (aulaId: string) => progresso.some((p) => p.classroomId === aulaId && p.completed);

  const manipularCliqueAula = (aula: Aula, index: number, aulasDoMod: Aula[]) => {
    if (!isAulaDesbloqueada(aulasDoMod, index)) return;
    if (aulaAtivaId === aula.id) {
      setAulaAtivaId(null);
      setVideoIniciado(false);
    } else {
      setAulaAtivaId(aula.id);
      setVideoIniciado(true);
    }
  };

  const getYoutubeId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = useMemo(() => (aulaAtual ? getYoutubeId(aulaAtual.url) : null), [aulaAtual]);
  const isVideo = aulaAtual?.url?.match(/\.(mp4|webm|ogg)$/i);

  useEffect(() => {
    if (videoIniciado && youtubeId) {
      const initPlayer = () => {
        if (!window.YT || !window.YT.Player) return;
        ytPlayerRef.current = new window.YT.Player("youtube-player", {
          events: {
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) setVideoTerminou(true);
            },
          },
        });
      };
      if (window.YT && window.YT.Player) initPlayer();
      else {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => { if (prev) prev(); initPlayer(); };
      }
      return () => { ytPlayerRef.current = null; };
    }
  }, [videoIniciado, youtubeId]);

  const responderQuestao = async (questionId: string, optionId: string) => {
    if (respostas[questionId] || enviando === questionId) return;
    setEnviando(questionId);
    setErroQuestao(null);
    try {
      const res = await api.post("/quiz-answers", { questionId, optionId });
      const isCorrect = res.data.isCorrect === true || res.data.isCorrect === "TRUE";
      setRespostas((prev) => ({ ...prev, [questionId]: { optionId, isCorrect } }));
    } catch (err: any) {
      console.error("Erro ao responder:", err?.response?.data ?? err);
      setErroQuestao(questionId);
    } finally {
      setEnviando(null);
    }
  };

  const total = questions.length;
  const respondidas = Object.keys(respostas).length;
  const acertos = Object.values(respostas).filter((r) => r.isCorrect).length;
  const quizCompleto = total === 0 || respondidas === total;
  const progressoPct = aulasDoModuloAtual.length > 0
    ? Math.round((aulasDoModuloAtual.filter((a) => isAulaConcluida(a.id)).length / aulasDoModuloAtual.length) * 100)
    : 0;

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <LoadingOverlay />
      </>
    );
  }

  if (!moduloAtual) {
    return (
      <>
        <style>{css}</style>
        <div className="full-center">
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#9ca3af", marginBottom: 16 }}>Módulo não encontrado</p>
            <button className="back-btn" onClick={() => navigate("/dashboard")}>← Voltar</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="aulas-root">

        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
            <div className="topbar-divider" />
            <span className="topbar-module-name">{moduloAtual.title}</span>
          </div>
          <div className="topbar-right">
            <div className="progress-pill">
              <div className="progress-pill-dot" />
              {progressoPct}% concluído
            </div>
          </div>
        </header>

        <div className="body-layout">

          <main className="left-col">

            <div className="player-wrap">
              {videoIniciado && aulaAtual ? (
                youtubeId ? (
                  <iframe
                    id="youtube-player"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`}
                    title={aulaAtual.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isVideo ? (
                  <video
                    key={aulaAtual.url}
                    controls
                    autoPlay
                    onEnded={() => setVideoTerminou(true)}
                  >
                    <source src={aulaAtual.url} />
                  </video>
                ) : (
                  <div className="player-empty" style={{ position: "relative" }}>
                    <div className="player-grid-bg" />
                    <div className="player-empty-badge">
                      <span>●</span> Conteúdo externo
                    </div>
                    <h2>{aulaAtual.title}</h2>
                    {aulaAtual.url && (
                      <a
                        href={aulaAtual.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          marginTop: 16,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          background: "rgba(0,240,255,0.08)",
                          border: "1px solid rgba(0,240,255,0.2)",
                          color: "#00f0ff",
                          borderRadius: 8,
                          padding: "10px 18px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          fontFamily: "Sora, sans-serif",
                          textDecoration: "none",
                          letterSpacing: "0.02em",
                        }}
                      >
                        Abrir conteúdo →
                      </a>
                    )}
                  </div>
                )
              ) : (
                <div className="player-empty" style={{ position: "relative" }}>
                  <div className="player-grid-bg" />
                  <div className="player-empty-badge">
                    <span>◈</span> {moduloAtual.title}
                  </div>
                  <h2>Pronto para<br />começar?</h2>
                  <p>Selecione uma aula na barra lateral para iniciar.</p>
                </div>
              )}

              {aulaCompleta && (
                <div className="completed-banner">
                  ✦ Aula concluída — próxima desbloqueada
                </div>
              )}
            </div>

            {aulaAtual && (
              <div className="lesson-info">
                <span className="lesson-info-label">
                  Aula {(aulasDoModuloAtual.findIndex(a => a.id === aulaAtual.id) + 1).toString().padStart(2, "0")}
                </span>
                <h2 className="lesson-info-title">{aulaAtual.title}</h2>
                {aulaAtual.description && (
                  <p className="lesson-info-desc">{aulaAtual.description}</p>
                )}
              </div>
            )}

            {aulaAtual && (
              <div className="quiz-wrap">
                <div className="quiz-header">
                  <div className="quiz-header-left">
                    <div className="quiz-icon">📝</div>
                    <div>
                      <div className="quiz-title">Questionário</div>
                      <div className="quiz-subtitle">
                        {loadingQuiz
                          ? "Carregando..."
                          : total > 0
                          ? `${respondidas} de ${total} respondidas`
                          : "Sem questões"}
                      </div>
                    </div>
                  </div>
                  {!videoTerminou && total > 0 && (
                    <div className="quiz-locked-tag">
                      ⚠ Assista o vídeo primeiro
                    </div>
                  )}
                </div>

                <div className="quiz-progress-bar">
                  <div
                    className="quiz-progress-fill"
                    style={{
                      width: total > 0 ? `${(respondidas / total) * 100}%` : "0%",
                      background: quizCompleto && respondidas > 0
                        ? "linear-gradient(90deg, #00f0b4, #00d4ff)"
                        : "linear-gradient(90deg, #00f0ff, #0070f3)",
                    }}
                  />
                </div>

                <div className="quiz-body">
                  {loadingQuiz ? (
                    <div className="quiz-empty">
                      <div className="quiz-empty-text" style={{ color: "#4b5563" }}>Carregando questões...</div>
                    </div>
                  ) : questions.length === 0 ? (
                    <div className="quiz-empty">
                      <div className="quiz-empty-icon">📋</div>
                      <div className="quiz-empty-title">Sem questões ainda</div>
                      <div className="quiz-empty-text">Esta aula ainda não possui questionário.</div>
                      {!videoTerminou && (
                        <div style={{ marginTop: 14, fontSize: "0.8rem", color: "#f59e0b" }}>
                          Assista o vídeo até o final para concluir esta aula.
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {respondidas > 0 && (
                        <div className="quiz-summary">
                          <span className="quiz-summary-emoji">
                            {respondidas === total ? "🎯" : "📊"}
                          </span>
                          <div>
                            <div className="quiz-summary-label">
                              {respondidas === total ? "Questionário concluído!" : `${respondidas} de ${total} respondidas`}
                            </div>
                            <div
                              className="quiz-summary-score"
                              style={{
                                color: acertos === total ? "#00f0b4"
                                  : acertos > total / 2 ? "#f59e0b"
                                  : "#f87171",
                              }}
                            >
                              {acertos} acerto{acertos !== 1 ? "s" : ""} · {total - acertos} erro{total - acertos !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      )}

                      {questions.map((q, qIndex) => {
                        const resposta = respostas[q.id];
                        const respondeu = !!resposta;

                        return (
                          <div key={q.id} className="question-block">
                            <div>
                              <span className="question-index">Questão {qIndex + 1}</span>
                              <p className="question-statement">{q.statement}</p>
                            </div>
                            <div className="options-list">
                              {q.options.map((opt) => {
                                const selecionadaPeloAluno = resposta?.optionId === opt.id;
                                const estaCorreta = opt.isCorrect;

                                let bg = "rgba(255,255,255,0.03)";
                                let border = "1px solid rgba(255,255,255,0.07)";
                                let color = "rgba(255,255,255,0.6)";
                                let icon: string | null = null;
                                let labelSuaResposta = false;

                                if (respondeu) {
                                  if (selecionadaPeloAluno && estaCorreta) {
                                    bg = "rgba(0,240,180,0.08)";
                                    border = "1px solid rgba(0,240,180,0.3)";
                                    color = "#00f0b4";
                                    icon = "✓";
                                    labelSuaResposta = true;
                                  } else if (selecionadaPeloAluno && !estaCorreta) {
                                    bg = "rgba(248,113,113,0.08)";
                                    border = "1px solid rgba(248,113,113,0.3)";
                                    color = "#f87171";
                                    icon = "✗";
                                    labelSuaResposta = true;
                                  } else if (!selecionadaPeloAluno && estaCorreta) {
                                    bg = "rgba(0,240,180,0.04)";
                                    border = "1px solid rgba(0,240,180,0.18)";
                                    color = "rgba(0,240,180,0.6)";
                                    icon = "✓";
                                  } else {
                                    color = "rgba(255,255,255,0.18)";
                                    border = "1px solid rgba(255,255,255,0.03)";
                                  }
                                }

                                return (
                                  <button
                                    key={opt.id}
                                    className="option-btn"
                                    onClick={() => responderQuestao(q.id, opt.id)}
                                    disabled={respondeu || enviando === q.id || !videoTerminou}
                                    style={{
                                      background: bg,
                                      border,
                                      color,
                                      cursor: respondeu || !videoTerminou ? "default" : "pointer",
                                      opacity: (!videoTerminou && !respondeu) ? 0.5 : 1,
                                    }}
                                  >
                                    <span className="option-btn-text">
                                      <span>{opt.option}</span>
                                      {respondeu && labelSuaResposta && (
                                        <span className="option-sua-resposta">Sua resposta</span>
                                      )}
                                    </span>
                                    {enviando === q.id
                                      ? <span className="option-loading">...</span>
                                      : icon
                                      ? <span className="option-icon">{icon}</span>
                                      : null
                                    }
                                  </button>
                                );
                              })}
                            </div>
                            {erroQuestao === q.id && (
                              <p className="question-error">⚠ Erro ao enviar. Tente novamente.</p>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
          </main>

          <aside className="right-sidebar">
            <div className="sidebar-section-header">
              <div className="sidebar-section-title">Conteúdo do curso</div>
            </div>

            <div className="modules-list">
              {modulos.map((modulo, mIndex) => {
                const aulasDoMod = aulasDomModulo(modulo.id);
                const expandido = moduloExpandido === modulo.id;
                const ehModuloAtual = modulo.id === moduloId;

                return (
                  <div key={modulo.id}>
                    <div
                      className={`module-row${ehModuloAtual ? " current" : ""}`}
                      onClick={() => {
                        setModuloExpandido(expandido ? null : modulo.id);
                        if (!ehModuloAtual) navigate(`/modulo/${modulo.id}/aulas`);
                      }}
                    >
                      <div className="module-row-left">
                        <span className="module-row-label" style={{ color: ehModuloAtual ? "#00f0ff" : "#4b5563" }}>
                          Módulo {mIndex + 1}
                        </span>
                        <span className="module-row-title" style={{ color: ehModuloAtual ? "#fff" : "rgba(255,255,255,0.5)" }}>
                          {modulo.title}
                        </span>
                        <span className="module-row-count">
                          {aulasDoMod.length} aula{aulasDoMod.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className={`module-chevron${expandido ? " open" : ""}`}>▼</span>
                    </div>

                    {expandido && (
                      <div className="aulas-list">
                        {aulasDoMod.length === 0 ? (
                          <div style={{ padding: "12px 24px 12px 32px", fontSize: "0.75rem", color: "#4b5563" }}>
                            Nenhuma aula disponível
                          </div>
                        ) : (
                          aulasDoMod.map((aula, aIndex) => {
                            const isAtiva = aula.id === aulaAtivaId && ehModuloAtual;
                            const concluida = isAulaConcluida(aula.id);
                            const desbloqueada = isAulaDesbloqueada(aulasDoMod, aIndex);

                            return (
                              <div key={aula.id}>
                                <div
                                  className={`aula-item${isAtiva ? " active" : ""}${!desbloqueada ? " locked" : ""}`}
                                  onClick={() => {
                                    if (!ehModuloAtual) { navigate(`/modulo/${modulo.id}/aulas`); return; }
                                    manipularCliqueAula(aula, aIndex, aulasDoMod);
                                  }}
                                >
                                  <span
                                    className="aula-item-num"
                                    style={{ color: isAtiva ? "#00f0ff" : concluida ? "#00f0b4" : "#4b5563" }}
                                  >
                                    {(aIndex + 1).toString().padStart(2, "0")}
                                  </span>
                                  <div className="aula-item-info">
                                    <span
                                      className="aula-item-title"
                                      style={{ color: isAtiva ? "#fff" : desbloqueada ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)" }}
                                    >
                                      {aula.title}
                                    </span>
                                    {!desbloqueada && (
                                      <span className="aula-item-lock-msg">Complete a anterior</span>
                                    )}
                                  </div>
                                  <span className="aula-item-status">
                                    {concluida ? "✅" : !desbloqueada ? "🔒" : ""}
                                  </span>
                                </div>

                                {isAtiva && aula.description && (
                                  <div className="aula-desc-expanded">
                                    {aula.description}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}