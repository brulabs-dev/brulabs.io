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

function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  // The statue and the rings drift a few pixels with the pointer, for depth.
  useEffect(() => {
    const scene = sceneRef.current;
    const canMove = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");
    if (!scene || !canMove.matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const box = scene.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        scene.style.setProperty("--px", x.toFixed(3));
        scene.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onLeave = () => { scene.style.setProperty("--px", "0"); scene.style.setProperty("--py", "0"); };
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="hero section-shell" id="topo" aria-labelledby="hero-title">
      <div className="hero-scene" ref={sceneRef}>
        <div className="rings" aria-hidden="true" />
        <div className="hero-copy">
          <h1 id="hero-title">
            Agentes de IA para empresas. <em>Feitos sob medida.</em>
          </h1>
          <p>
            A BruLabs é uma startup de software de Florianópolis. Construímos agentes que assumem tarefas repetitivas da operação, ligados às ferramentas que a empresa já usa.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#contato">Falar com a BruLabs <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
            <a className="hero-link" href="#agentes">Ver um agente trabalhando <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <img className="hero-statue" src={asset("assets/art/hero/statue-modern.webp")} alt="" width={1024} height={1536} fetchPriority="high" />
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
        <div className="rings" aria-hidden="true" />
        <h2 id="contact-title">Que tarefa você passaria para um agente?</h2>
        <div className="contact-actions">
          <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">
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
