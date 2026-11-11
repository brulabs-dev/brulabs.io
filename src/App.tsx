import { useState } from "react";
import { ArrowRight, InstagramLogo, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react";
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
  return (
    <section className="hero section-shell" id="topo" aria-labelledby="hero-title">
      <div className="hero-scene">
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
            <a className="hero-link" href="#agentes">O que é um agente <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <img className="hero-statue" src={asset("assets/art/hero/statue-modern.webp")} alt="" width={1024} height={1536} fetchPriority="high" />
      </div>
    </section>
  );
}

const places = [
  {
    title: "Atendimento",
    before: "Alguém responde as mesmas perguntas o dia inteiro.",
    after: "O agente responde as perguntas repetidas e passa pra uma pessoa o que é delicado.",
    image: "phone",
  },
  {
    title: "Documentos",
    before: "Contrato, nota e proposta lidos linha por linha.",
    after: "O agente lê o documento, tira os dados e lança no sistema.",
    image: "archive",
  },
  {
    title: "Entre sistemas",
    before: "Dado copiado de uma planilha pra outra, na mão.",
    after: "O agente leva o dado de um sistema ao outro sem ninguém copiar.",
    image: "process",
  },
  {
    title: "Relatórios",
    before: "O mesmo relatório montado na mão toda semana.",
    after: "O agente junta os números e entrega o relatório pronto.",
    image: "typewriter",
  },
];

function Places() {
  const [withAi, setWithAi] = useState(false);

  return (
    <section className="places section-shell" id="agentes" aria-labelledby="places-title">
      <div className="places-top">
        <div className="section-heading">
          <span>O que é um agente</span>
          <h2 id="places-title">Um software que assume uma tarefa do começo ao fim.</h2>
          <p>Ele usa as ferramentas que a empresa já tem e chama uma pessoa quando não sabe o que fazer. Quatro tarefas onde costuma caber:</p>
        </div>
        <div className="switch" role="group" aria-label="Mostrar o trabalho hoje ou com um agente">
          <button type="button" aria-pressed={!withAi} onClick={() => setWithAi(false)}>Hoje</button>
          <button type="button" aria-pressed={withAi} onClick={() => setWithAi(true)}>Com agente</button>
        </div>
      </div>
      <ul className={`places-grid${withAi ? " is-ai" : ""}`}>
        {places.map((place) => (
          <li key={place.title}>
            <figure aria-hidden="true">
              <img className="place-old" src={asset(`assets/art/hero/${place.image}-old.webp`)} alt="" loading="lazy" />
              <img className="place-new" src={asset(`assets/art/hero/${place.image}-modern.webp`)} alt="" loading="lazy" />
            </figure>
            <h3>{place.title}</h3>
            <p className="place-before"><b>Hoje</b>{place.before}</p>
            <p className="place-after"><b>Com agente</b>{place.after}</p>
          </li>
        ))}
      </ul>
      <p className="places-note">E quando um agente não é a resposta, a gente avisa.</p>
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
        <Places />
        <About />
        <Method />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
