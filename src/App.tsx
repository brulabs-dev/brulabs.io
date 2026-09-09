import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, List, X } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const sitePath = (path = "") => `${import.meta.env.BASE_URL}${path}`;
const asset = sitePath;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

function Reveal({ children, className = "" }: RevealProps) {
  return <div className={className}>{children}</div>;
}

function ArrowMark({ external = false }: { external?: boolean }) {
  return (
    <span className="arrow-mark" aria-hidden="true">
      {external ? <ArrowUpRight size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Trabalho", "#trabalho"],
    ["Serviços", "#servicos"],
    ["Processo", "#processo"],
    ["Treinamentos", "#treinamentos"],
    ["Sobre", "#sobre"],
  ];

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="site-header section-shell">
      <a href="#topo" className="brand" aria-label="BruLabs, início">
        <img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" />
      </a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="button button-small desktop-cta" href={tallyUrl({ page: "home", cta: "header" })}>
        Conversar sobre o projeto <ArrowMark />
      </a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={23} weight="light" /> : <List size={23} weight="light" />}
      </button>
      {open && (
        <nav className="mobile-nav" id="mobile-nav" aria-label="Navegação móvel">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="button" href={tallyUrl({ page: "home", cta: "header-mobile" })}>
            Conversar sobre o projeto <ArrowMark />
          </a>
        </nav>
      )}
    </header>
  );
}

function MpnProductScene() {
  return (
    <div className="product-scene" role="img" aria-label="Representação do produto Manda Pra Nutri no WhatsApp e no painel de acompanhamento">
      <img className="product-statue" src={asset("assets/art/case/mpn-statue.webp")} alt="" aria-hidden="true" />

      <div className="dashboard-shell" aria-hidden="true">
        <div className="dashboard-window">
          <div className="window-bar">
            <span /><span /><span />
            <b>app.mandapranutri.com.br</b>
          </div>
          <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
              <strong>manda pra nutri</strong>
              <span className="is-active">Visão geral</span>
              <span>Diário alimentar</span>
              <span>Evolução</span>
              <i>MPN</i>
            </aside>
            <div className="dashboard-main">
              <div className="dashboard-heading">
                <div><small>Seu acompanhamento</small><strong>Olá, Ana</strong></div>
                <span>Esta semana</span>
              </div>
              <div className="dashboard-grid">
                <section className="dashboard-card dashboard-chart">
                  <small>Evolução semanal</small>
                  <div className="chart-layout">
                    <div className="chart-ring"><span>7 dias</span></div>
                    <div className="chart-bars">
                      {[48, 72, 58, 84, 66, 91, 76].map((height, index) => (
                        <i key={height} style={{ "--bar": `${height}%` } as React.CSSProperties}><b /><span>{"DSTQQSS"[index]}</span></i>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="dashboard-card dashboard-summary">
                  <small>Hoje</small>
                  <strong>Registros do dia</strong>
                  <div><span>Café da manhã</span><b>registrado</b></div>
                  <div><span>Almoço</span><b>registrado</b></div>
                  <div><span>Lanche</span><b>adicionar</b></div>
                </section>
                <section className="dashboard-card dashboard-diary">
                  <div><small>Diário alimentar</small><strong>Últimas refeições</strong></div>
                  <span>Ver diário completo</span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="phone-shell" aria-hidden="true">
        <div className="phone-screen">
          <div className="phone-status"><span>9:41</span><span>● ● ●</span></div>
          <div className="chat-header"><b>mpn</b><div><strong>Manda pra Nutri</strong><small>online</small></div></div>
          <div className="chat-body">
            <div className="chat-message chat-message-user">
              <img src={asset("assets/case/mpn/meal-capture.webp")} alt="" />
              <span>Meu almoço de hoje</span>
            </div>
            <div className="chat-message chat-message-bot">
              <p>Refeição recebida. Já organizei a análise e o registro no seu diário.</p>
              <span>Ver detalhes</span>
            </div>
          </div>
          <div className="chat-input"><span>Mensagem</span><b>↑</b></div>
        </div>
      </div>

      <div className="product-note note-input">foto · áudio · texto</div>
      <div className="product-note note-output">conversa → histórico</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="topo">
      <section className="hero-scene" aria-labelledby="hero-title">
          <div className="hero-rings" aria-hidden="true" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-scene-copy">
            <h1 id="hero-title">
              A operação precisa funcionar. <em>A ferramenta vem depois.</em>
            </h1>
            <p>
              Produtos digitais, sistemas internos e automações. A BruLabs começa pelo contexto e só então decide se o caminho é usar, integrar ou construir.
            </p>
            <div className="hero-actions">
              <a className="button button-light" href={tallyUrl({ page: "home", cta: "hero" })}>Conversar sobre o projeto <ArrowMark /></a>
              <a className="hero-text-link" href="#trabalho">Ver um projeto <ArrowRight size={17} weight="bold" /></a>
            </div>
          </div>

          <div className="hero-scene-art" aria-hidden="true">
            <img className="hero-statue" src={asset("assets/art/hero/statue-modern.webp")} alt="" />
          </div>

          <span className="hero-corner hero-corner-a" aria-hidden="true" />
          <span className="hero-corner hero-corner-b" aria-hidden="true" />
      </section>
    </section>
  );
}

function SelectedWork() {
  return (
    <section className="selected-work" id="trabalho" aria-labelledby="mpn-title">
      <div className="section-shell selected-work-inner">
        <h2>Um projeto em operação</h2>
        <article className="selected-project">
          <div className="selected-project-visual"><MpnProductScene /></div>
          <div className="selected-project-copy">
            <div><span>Produto digital · saúde</span><h3 id="mpn-title">Manda Pra Nutri</h3></div>
            <div>
              <p>Acompanhamento nutricional pelo WhatsApp, com o histórico organizado num painel para a nutricionista.</p>
              <p>Saiu de um experimento no ChatGPT, passou pelo Telegram e chegou ao WhatsApp. A BruLabs levou produto, experiência e implementação até o uso.</p>
              <a href="https://mandapranutri.com.br/" target="_blank" rel="noreferrer">Ver o produto <ArrowMark external /></a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

const capabilities = [
  {
    number: "01",
    title: "Produtos digitais",
    description: "Plataformas web, produtos com IA e primeiras versões que um cliente, parceiro ou mercado já consegue usar.",
    examples: "estratégia · protótipo · desenvolvimento · lançamento",
    image: "assets/solutions/digital-product-cinema-v2.webp",
    path: "product" as const,
  },
  {
    number: "02",
    title: "Sistemas internos",
    description: "Painéis, backoffices e portais para quando planilha e ferramenta genérica já não dão conta do processo.",
    examples: "operação · dados · permissões · acompanhamento",
    image: "assets/solutions/custom-system-v2.webp",
    path: "process" as const,
  },
  {
    number: "03",
    title: "Integrações e automações",
    description: "Ligar formulários, planilhas, e-mail, CRM e Microsoft 365 para parar de copiar dado de um lado para o outro.",
    examples: "integrações · automação · IA aplicada · suporte",
    image: "assets/solutions/automation-v2.webp",
    path: "process" as const,
  },
];

function ServicePanel({
  capability,
  index,
  onOpen,
}: {
  capability: (typeof capabilities)[number];
  index: number;
  onOpen: () => void;
}) {
  return (
    <article className={`service-panel service-panel-${index + 1}`} data-openness="0">
      <button
        type="button"
        aria-expanded={false}
        aria-controls={`service-panel-${index}`}
        onClick={onOpen}
      >
        <h3>{capability.title}</h3>
        <span>{capability.number}</span>
      </button>
      <div className="service-panel-collapse" aria-hidden="true">
        <div className="service-panel-clip" id={`service-panel-${index}`}>
          <div className="service-panel-body">
            <div>
              <p>{capability.description}</p>
              <small>{capability.examples}</small>
              <a
                href={tallyUrl({ path: capability.path, solution: capability.title, page: "home", cta: "servico" })}
                tabIndex={-1}
              >
                Ver se faz sentido <ArrowMark />
              </a>
            </div>
            <figure><img src={asset(capability.image)} alt="" loading="lazy" /></figure>
          </div>
        </div>
      </div>
    </article>
  );
}

function Capabilities() {
  const stageRef = useRef<HTMLDivElement>(null);
  const openServiceRef = useRef<(index: number) => void>(() => undefined);

  useEffect(() => {
    const automaticMotion = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const stage = stageRef.current;
    if (!stage) return;

    const panels = Array.from(stage.querySelectorAll<HTMLElement>(".service-panel"));

    const applyOpenness = (values: number[]) => {
      panels.forEach((panel, index) => {
        const openness = values[index] ?? 0;
        const isOpen = openness > 0.01;
        const collapse = panel.querySelector<HTMLElement>(".service-panel-collapse");
        const body = panel.querySelector<HTMLElement>(".service-panel-body");
        const button = panel.querySelector<HTMLButtonElement>("button");
        const link = panel.querySelector<HTMLAnchorElement>(".service-panel-body a");
        if (!collapse || !body || !button) return;

        panel.dataset.openness = String(openness);
        panel.classList.toggle("is-open", isOpen);
        collapse.style.gridTemplateRows = `${openness}fr`;
        body.style.opacity = String(openness);
        button.setAttribute("aria-expanded", String(isOpen));
        collapse.setAttribute("aria-hidden", String(!isOpen));
        if (link) link.tabIndex = openness > 0.9 ? 0 : -1;
      });
    };

    const updateFromScroll = () => {
      frame = 0;
      if (!automaticMotion.matches) return;

      const activationLine = window.innerHeight * .67;
      const revealDistance = Math.max(130, window.innerHeight * .18);
      const next = panels.map((panel) => {
        const distance = activationLine - panel.getBoundingClientRect().top;
        return Math.min(1, Math.max(0, distance / revealDistance));
      });
      applyOpenness(next);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };

    const configureMotion = () => {
      stage.classList.toggle("is-scroll-driven", automaticMotion.matches);
      if (automaticMotion.matches) updateFromScroll();
      else applyOpenness([1, 0, 0]);
    };

    openServiceRef.current = (index) => {
      if (automaticMotion.matches) {
        applyOpenness(capabilities.map((_, itemIndex) => itemIndex <= index ? 1 : 0));
      } else {
        applyOpenness(capabilities.map((_, itemIndex) => itemIndex === index ? 1 : 0));
      }
    };

    configureMotion();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    automaticMotion.addEventListener("change", configureMotion);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      automaticMotion.removeEventListener("change", configureMotion);
    };
  }, []);

  return (
    <section className="services-section section-shell" id="servicos" aria-labelledby="services-title">
      <div className="cuberto-heading">
        <span>O que fazemos</span>
        <div><h2 id="services-title">Primeiro o problema. Depois a ferramenta.</h2><p>Antes de propor stack, a gente mapeia a operação, o que já foi tentado e quem usa o processo.</p></div>
      </div>
      <div className="service-panels-stage" ref={stageRef}>
        <div className="service-panels">
          {capabilities.map((capability, index) => (
            <ServicePanel
              key={capability.number}
              capability={capability}
              index={index}
              onOpen={() => openServiceRef.current(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  {
    number: "01",
    title: "Entender",
    subtitle: "O que existe e o que falta",
    description: "Levantamos a necessidade, o processo atual, quem participa e o que já foi tentado.",
    image: "assets/art/method/diagnosis.webp",
  },
  {
    number: "02",
    title: "Escolher",
    subtitle: "Usar, integrar ou construir",
    description: "Comparamos ferramenta pronta, integração e desenvolvimento sob medida antes de fechar o caminho.",
    image: "assets/art/method/direction.webp",
  },
  {
    number: "03",
    title: "Colocar em uso",
    subtitle: "Testar e colocar na rotina",
    description: "Desenvolvemos, testamos e acompanhamos a entrada da solução no dia a dia da equipe.",
    image: "assets/art/method/construction.webp",
  },
];

function Process() {
  return (
    <section className="workflow-section" id="processo" aria-labelledby="process-title">
      <div className="section-shell workflow-inner">
        <div className="workflow-heading"><h2 id="process-title">Como trabalhamos</h2><p>Três etapas, nesta ordem: entender o contexto, escolher o caminho e colocar em uso.</p></div>
        <div className="workflow-grid">
          {processSteps.map((step) => (
            <article className="workflow-card" key={step.number}>
              <figure><img src={asset(step.image)} alt="" loading="lazy" /></figure>
              <div><span>{step.number} · {step.subtitle}</span><h3>{step.title}</h3><p>{step.description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section className="about-section section-shell" id="sobre" aria-labelledby="founder-title">
      <div className="cuberto-heading about-heading"><span>Sobre</span><div><h2 id="founder-title">Quem faz o diagnóstico também implementa.</h2><p>Não tem fila de atendimento no meio. O Bruno acompanha da primeira conversa até o que entra em uso.</p></div></div>
      <div className="about-grid">
        <figure className="about-photo"><img src={asset("assets/brand/bruno-founder-paper-composite-v6.webp")} alt="Bruno, fundador da BruLabs" loading="lazy" /></figure>
        <article className="about-card about-card-main"><span>Fundador</span><h3>Trabalho direto com quem conhece o processo.</h3></article>
        <article className="about-card"><span>Formação</span><strong>Engenharia · UFRGS<br />Especialização em IA<br />MBA · USP/Esalq</strong></article>
        <article className="about-card about-card-wide"><span>Como atua</span><strong>Investigar, priorizar, implementar e acompanhar.</strong></article>
      </div>
    </section>
  );
}

function Training() {
  return (
    <section className="training-feature section-shell" id="treinamentos" aria-labelledby="training-title">
      <a className="training-strip" href={sitePath("treinamentos/")}>
        <figure><img src={asset("assets/art/training/teacher.webp")} alt="" loading="lazy" /></figure>
        <div className="training-strip-title">
          <span>Também fazemos</span>
          <h2 id="training-title">Treinamentos de IA e automação</h2>
        </div>
        <p>Workshop prático, nas ferramentas e situações que a equipe já usa.</p>
        <span className="training-strip-cta">Ver treinamentos <ArrowMark /></span>
      </a>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <Reveal className="section-shell final-cta-inner">
        <span>Contato</span>
        <h2>Se algo na operação está travado, começa por aí.</h2>
        <a className="button button-dark" href={tallyUrl({ page: "home", cta: "final" })}>
          Conversar sobre o projeto <ArrowMark />
        </a>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <a href="#topo"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
      <div><a href="#trabalho">Trabalho</a><a href="#servicos">Serviços</a><a href={sitePath("privacidade/")}>Privacidade</a></div>
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
        <Capabilities />
        <SelectedWork />
        <Process />
        <Founder />
        <Training />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
