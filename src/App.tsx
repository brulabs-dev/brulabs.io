import { useEffect, useRef, useState } from "react";
import { ArrowClockwise, ArrowRight, Check, HandPalm, InstagramLogo, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const EMAIL = "bruno@brulabs.io";
const INSTAGRAM_URL = "https://www.instagram.com/bru.labs/";

// TODO: placeholders. Replace both with the real values before publishing.
const WHATSAPP_NUMBER = "5548900000000";
const LINKEDIN_URL = "https://www.linkedin.com/in/SEU-PERFIL";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Oi, Bruno! Vim pelo site da BruLabs.")}`;

const navLinks = [
  ["O que é um agente", "#agentes"],
  ["Como trabalhamos", "#metodo"],
  ["Quem faz", "#sobre"],
];

function Header() {
  return (
    <header className="site-header section-shell">
      <a href="#topo" className="brand" aria-label="BruLabs, início">
        <img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" />
      </a>
      <nav className="site-nav" aria-label="Navegação principal">
        {navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="button button-small" href="#contato">Falar com a BruLabs</a>
    </header>
  );
}

// Small seeded generator so the mosaic has the same shape on every load.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type PixelFieldProps = { palette: string[]; glow: string; leftPeak: number; rightPeak: number; narrowScale?: number };

// Mosaic that rises from the bottom corners: squares on the left, dots on the right.
// Cells flicker between palette shades and light up near the pointer.
function PixelField({ palette, glow, leftPeak, rightPeak, narrowScale = 1 }: PixelFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = seeded(23);
    let cells: { x: number; y: number; shade: number; round: boolean }[] = [];
    let size = 24;
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let lastFlicker = 0;
    let onScreen = true;

    const build = () => {
      const box = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      size = width < 700 ? 15 : 24;
      const scale = width < 700 ? narrowScale : 1;
      const columns = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      const shape = seeded(11);
      let drift = 0;
      cells = [];
      for (let column = 0; column < columns; column += 1) {
        const t = columns > 1 ? column / (columns - 1) : 0;
        const left = leftPeak * scale * Math.pow(Math.max(0, 1 - t / 0.44), 1.35);
        const right = rightPeak * scale * Math.pow(Math.max(0, (t - 0.5) / 0.5), 1.25);
        drift = (drift + (shape() - 0.5) * 0.11) * 0.84;
        const level = (Math.max(left, right) + drift) * rows;
        if (Math.max(left, right) <= 0.004) continue;
        for (let depth = 0; depth < rows; depth += 1) {
          const edge = depth - level;
          if (edge > 3) break;
          if (edge > -1 && shape() > 0.5 - edge * 0.13) continue;
          cells.push({ x: column * size, y: height - (depth + 1) * size, shade: Math.floor(shape() * palette.length), round: t > 0.5 });
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const reach = size * 3.2;
      for (const cell of cells) {
        const near = pointer && Math.hypot(cell.x + size / 2 - pointer.x, cell.y + size / 2 - pointer.y) < reach;
        context.fillStyle = near ? glow : palette[cell.shade];
        if (cell.round) {
          context.beginPath();
          context.arc(cell.x + size / 2, cell.y + size / 2, size * 0.45, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(cell.x, cell.y, size, size);
        }
      }
    };

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!onScreen || time - lastFlicker < 110) return;
      lastFlicker = time;
      const changes = Math.max(4, Math.round(cells.length * 0.02));
      for (let index = 0; index < changes; index += 1) {
        const cell = cells[Math.floor(random() * cells.length)];
        if (cell) cell.shade = Math.floor(random() * palette.length);
      }
      draw();
    };

    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
      if (reduced) draw();
    };
    const onLeave = () => { pointer = null; if (reduced) draw(); };
    const onResize = () => { build(); draw(); };

    build();
    draw();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);
    const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; });
    visibility.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    if (!reduced) frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [palette, glow, leftPeak, rightPeak, narrowScale]);

  return <canvas className="pixel-field" ref={canvasRef} aria-hidden="true" />;
}

const HERO_PIXELS = ["#e9652e", "#e9652e", "#f07740", "#c94e1c", "#a92f1a", "#f49a6c", "#f6efdf"];
const CONTACT_PIXELS = ["#c94e1c", "#c94e1c", "#a92f1a", "#f07740", "#f49a6c", "#1d211f", "#f6efdf"];

function Hero() {
  return (
    <section className="hero section-shell" id="topo" aria-labelledby="hero-title">
      <div className="hero-scene">
        <div className="hero-copy">
          <h1 id="hero-title">
            Agentes de IA para empresas. <em>Feitos sob medida.</em>
          </h1>
          <p>
            A BruLabs é uma startup de software de Florianópolis. Construímos agentes que assumem tarefas repetitivas da operação, ligados às ferramentas que a empresa já usa.
          </p>
          <div className="hero-actions">
            <a className="button" href="#contato">Falar com a BruLabs <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
            <a className="hero-link" href="#agentes">Ver um agente trabalhando <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <img className="hero-statue" src={asset("assets/art/hero/statue-modern.webp")} alt="" width={1024} height={1536} fetchPriority="high" />
        <PixelField palette={HERO_PIXELS} glow="#fff6e4" leftPeak={0.25} rightPeak={0.5} />
      </div>
    </section>
  );
}

type RunStep = { time: string; text: string; human?: boolean };

// Illustrative runs, not client cases.
const runs: { label: string; steps: RunStep[] }[] = [
  {
    label: "Pedido por e-mail",
    steps: [
      { time: "08:12", text: "Chega um pedido por e-mail, em PDF." },
      { time: "08:12", text: "O agente lê o pedido e confere o estoque no sistema." },
      { time: "08:13", text: "Lança o pedido e manda um resumo no WhatsApp do gerente." },
      { time: "08:13", text: "Um item está com preço fora da tabela. O agente não lança e pede aprovação.", human: true },
    ],
  },
  {
    label: "Atendimento no WhatsApp",
    steps: [
      { time: "14:03", text: "Um cliente pergunta no WhatsApp se o pedido já saiu." },
      { time: "14:03", text: "O agente busca o pedido no sistema e acha o código de rastreio." },
      { time: "14:04", text: "Responde ao cliente com o prazo e o link." },
      { time: "14:20", text: "O cliente reclama de um item quebrado. O agente passa a conversa pra uma pessoa.", human: true },
    ],
  },
  {
    label: "Relatório da semana",
    steps: [
      { time: "07:00", text: "Segunda cedo, o agente abre as planilhas de vendas e o financeiro." },
      { time: "07:01", text: "Junta os números da semana e compara com a anterior." },
      { time: "07:02", text: "Envia o relatório por e-mail pra diretoria." },
      { time: "07:02", text: "Uma filial não lançou os dados. O agente avisa o responsável em vez de chutar.", human: true },
    ],
  },
];

const STEP_MS = 1300;
const NEXT_RUN_MS = 4200;

function AgentDemo() {
  const [runIndex, setRunIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const run = runs[runIndex];

  // Start the first time the panel is on screen; show everything at once under reduced motion.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setShown(runs[0].steps.length);
      setAutoAdvance(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setPlaying(true);
    }, { threshold: 0.35 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (shown < run.steps.length) {
      const timer = window.setTimeout(() => setShown((count) => count + 1), shown === 0 ? 500 : STEP_MS);
      return () => window.clearTimeout(timer);
    }
    if (!autoAdvance) return;
    const timer = window.setTimeout(() => {
      setRunIndex((index) => (index + 1) % runs.length);
      setShown(0);
    }, NEXT_RUN_MS);
    return () => window.clearTimeout(timer);
  }, [playing, shown, run, autoAdvance]);

  const choose = (index: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoAdvance(false);
    setRunIndex(index);
    setShown(reduced ? runs[index].steps.length : 0);
    setPlaying(!reduced);
  };

  return (
    <section className="demo section-shell" id="agentes" aria-labelledby="demo-title">
      <div className="section-heading">
        <span>O que é um agente</span>
        <h2 id="demo-title">Um software que assume uma tarefa do começo ao fim.</h2>
        <p>Ele usa as ferramentas que a empresa já tem e chama uma pessoa quando não sabe o que fazer. Veja três tarefas acontecendo:</p>
      </div>
      <div className="demo-panel" ref={panelRef}>
        <div className="demo-tabs" role="group" aria-label="Escolher a tarefa de exemplo">
          {runs.map((item, index) => (
            <button type="button" key={item.label} aria-pressed={index === runIndex} onClick={() => choose(index)}>{item.label}</button>
          ))}
        </div>
        <ol className="demo-log" key={runIndex}>
          {run.steps.map((step, index) => (
            <li key={step.text} className={`${index < shown ? "is-shown" : ""}${step.human ? " is-human" : ""}`}>
              <time>{step.time}</time>
              <span className="demo-mark" aria-hidden="true">{step.human ? <HandPalm size={18} weight="fill" /> : <Check size={16} weight="bold" />}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="demo-foot">
          <span>Exemplo ilustrativo</span>
          <button type="button" onClick={() => choose(runIndex)}><ArrowClockwise size={16} weight="bold" aria-hidden="true" /> Repetir</button>
        </div>
      </div>
      <p className="demo-note">E quando um agente não é a resposta, a gente avisa.</p>
    </section>
  );
}

const steps = [
  {
    title: "Uma tarefa por vez",
    description: "Começamos por uma tarefa só, repetitiva e bem definida.",
  },
  {
    title: "Agente sob medida",
    description: "Construímos ligado às ferramentas que a empresa já usa.",
  },
  {
    title: "Teste com a equipe",
    description: "Com casos reais, antes de entrar na rotina.",
  },
  {
    title: "Ajuste em uso",
    description: "Acompanhamos e corrigimos conforme o agente trabalha.",
  },
];

function Method() {
  return (
    <section className="method" id="metodo" aria-labelledby="method-title">
      <div className="section-shell method-inner">
        <h2 id="method-title">Como trabalhamos</h2>
        <ol className="method-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-shell" id="sobre" aria-labelledby="about-title">
      <div className="about-note">
        <img src={asset("assets/brand/bruno-founder-paper-composite-v6.webp")} alt="Bruno, da BruLabs" width={1254} height={1254} loading="lazy" />
        <div>
          <span>Quem faz</span>
          <h2 id="about-title">Oi, eu sou o Bruno.</h2>
          <p>
            Sou engenheiro e fundei a BruLabs em Florianópolis. A empresa é pequena de propósito: quem conversa com você no começo é quem constrói o agente depois.
          </p>
          <ul className="about-facts">
            <li>Engenharia pela UFRGS</li>
            <li>Especialização em IA</li>
            <li>MBA pela USP/Esalq</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact section-shell" id="contato" aria-labelledby="contact-title">
      <div className="contact-scene">
        <PixelField palette={CONTACT_PIXELS} glow="#fff6e4" leftPeak={0.12} rightPeak={0.62} narrowScale={0.36} />
        <h2 id="contact-title">Que tarefa você passaria para um agente?</h2>
        <div className="contact-actions">
          <a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">
            <WhatsappLogo size={20} weight="fill" aria-hidden="true" /> Chamar no WhatsApp
          </a>
          <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <p>
          Estamos no <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a> e no <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>. Se preferir, <a href={tallyUrl({ page: "home", cta: "contato" })}>preencha o formulário</a>.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <a href="#topo"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
      <div><span>Florianópolis, SC</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram da BruLabs"><InstagramLogo size={18} weight="fill" aria-hidden="true" /></a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn do Bruno"><LinkedinLogo size={18} weight="fill" aria-hidden="true" /></a><a href={asset("privacidade/")}>Privacidade</a></div>
      <span>© 2026 BruLabs</span>
    </footer>
  );
}

export function App() {
  return (
    <div className="site-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <AgentDemo />
        <About />
        <Method />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
