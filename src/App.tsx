import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const EMAIL = "bruno@brulabs.io";

const navLinks = [
  ["Onde a IA entra", "#onde"],
  ["Como eu faço", "#metodo"],
  ["Prova", "#prova"],
  ["Treinamentos", "#treinamentos"],
  ["Sobre", "#sobre"],
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
      <a className="button button-small" href="#contato">Falar com o Bruno</a>
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
            Trago IA pra dentro da sua empresa. <em>E deixo funcionando.</em>
          </h1>
          <p>
            Sou o Bruno, engenheiro. Sento com a sua equipe, acho onde a IA tira trabalho das costas de vocês, monto e ensino a usar.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#contato">Falar com o Bruno <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
            <a className="hero-link" href="#onde">Onde a IA entra <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <img className="hero-statue" src={asset("assets/art/hero/statue-modern.webp")} alt="" width={1024} height={1536} fetchPriority="high" />
      </div>
    </section>
  );
}

const places = [
  {
    title: "No atendimento",
    before: "Alguém responde as mesmas perguntas o dia inteiro.",
    after: "As repetidas se respondem sozinhas, e o que é delicado chega numa pessoa.",
    image: "phone",
  },
  {
    title: "Na papelada",
    before: "Contrato, nota e proposta lidos linha por linha.",
    after: "O documento chega lido, com o que importa já separado.",
    image: "archive",
  },
  {
    title: "Entre os sistemas",
    before: "Dado copiado de uma planilha pra outra, na mão.",
    after: "O dado sai de um lugar e chega no outro sozinho.",
    image: "process",
  },
  {
    title: "Na mão da equipe",
    before: "Cada um testa o ChatGPT do seu jeito, no chute.",
    after: "A equipe usa com método, nas tarefas de verdade.",
    image: "typewriter",
  },
];

function Places() {
  const [withAi, setWithAi] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);

  // Flip from "today" to "with AI" once, the first time the cards are on screen.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !("IntersectionObserver" in window)) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(() => setWithAi(true), 1100);
    }, { threshold: 0.6 });
    observer.observe(grid);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, []);

  return (
    <section className="places section-shell" id="onde" aria-labelledby="places-title">
      <div className="places-top">
        <div className="section-heading">
          <span>Onde a IA entra</span>
          <h2 id="places-title">Ela quase nunca entra onde o hype diz.</h2>
          <p>Entra no trabalho chato que a sua equipe repete toda semana. Quatro lugares onde costuma caber:</p>
        </div>
        <div className="switch" role="group" aria-label="Comparar o trabalho hoje e com IA">
          <button type="button" aria-pressed={!withAi} onClick={() => setWithAi(false)}>Hoje</button>
          <button type="button" aria-pressed={withAi} onClick={() => setWithAi(true)}>Com IA</button>
        </div>
      </div>
      <ul className={`places-grid${withAi ? " is-ai" : ""}`} ref={gridRef}>
        {places.map((place) => (
          <li key={place.title}>
            <figure aria-hidden="true">
              <img className="place-old" src={asset(`assets/art/hero/${place.image}-old.webp`)} alt="" loading="lazy" />
              <img className="place-new" src={asset(`assets/art/hero/${place.image}-modern.webp`)} alt="" loading="lazy" />
            </figure>
            <h3>{place.title}</h3>
            <p aria-live="polite"><b>{withAi ? "Com IA" : "Hoje"}</b>{withAi ? place.after : place.before}</p>
          </li>
        ))}
      </ul>
      <p className="places-note">E se não couber em lugar nenhum, eu digo.</p>
    </section>
  );
}

const steps = [
  {
    title: "Diagnóstico",
    description: "Converso com quem faz o trabalho e mapeio a rotina: quem faz o quê, onde trava e o que já foi tentado.",
    output: "O processo desenhado como ele é hoje.",
    image: "assets/art/method/diagnosis.webp",
  },
  {
    title: "Pesquisa",
    description: "Antes de construir qualquer coisa, levanto o que já existe pronto para o seu caso.",
    output: "As opções na mesa, com o limite de cada uma.",
    image: "assets/art/method/research.webp",
  },
  {
    title: "Direção",
    description: "Digo onde a IA resolve, onde uma ferramenta pronta já basta e onde é melhor não mexer.",
    output: "Uma recomendação clara, inclusive quando ela é “não faça”.",
    image: "assets/art/method/direction.webp",
  },
  {
    title: "Proposta",
    description: "Escopo, prazo e preço combinados antes de começar.",
    output: "Uma proposta que diz exatamente o que você vai receber.",
    image: "assets/art/method/proposal.webp",
  },
  {
    title: "Construção",
    description: "Monto, testo com quem vai usar e treino a equipe. Só saio quando está na rotina.",
    output: "A solução em uso e a equipe sabendo operar.",
    image: "assets/art/method/construction.webp",
  },
];

function Method() {
  return (
    <section className="method" id="metodo" aria-labelledby="method-title">
      <div className="section-shell">
        <div className="method-heading">
          <h2 id="method-title">Como eu faço</h2>
          <p>Cinco etapas, nessa ordem. Cada uma termina com algo na sua mão.</p>
        </div>
        <ol className="method-stack">
          {steps.map((step, index) => (
            <li key={step.title} style={{ "--i": index } as React.CSSProperties}>
              <div className="method-copy">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <dl><dt>Você sai com</dt><dd>{step.output}</dd></dl>
              </div>
              <figure><img src={asset(step.image)} alt="" loading="lazy" /></figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="proof" id="prova" aria-labelledby="proof-title">
      <div className="section-shell proof-inner">
        <div className="proof-copy">
          <span>Prova</span>
          <h2 id="proof-title">Não é teoria. Tenho um produto de IA no ar.</h2>
          <h3>Manda Pra Nutri</h3>
          <p>
            O paciente manda foto, áudio ou texto da refeição pelo WhatsApp. A IA analisa e registra, e a nutricionista acompanha o histórico num painel.
          </p>
          <p>
            Começou como um experimento no ChatGPT, passou pelo Telegram e hoje roda no WhatsApp.
          </p>
          <a className="text-link" href="https://mandapranutri.com.br/" target="_blank" rel="noreferrer">
            mandapranutri.com.br <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
        <div className="proof-art" aria-hidden="true">
          <img className="proof-photo" src={asset("assets/case/mpn/meal-capture.webp")} alt="" width={819} height={1229} loading="lazy" />
          <div className="proof-bubble">Refeição recebida. Já organizei a análise e o registro no seu diário.</div>
          <div className="proof-tag">foto · áudio · texto</div>
        </div>
      </div>
    </section>
  );
}

const trainingThemes = ["IA no dia a dia", "Automação na prática", "Workshop sob medida"];

function Training() {
  return (
    <section className="training section-shell" id="treinamentos" aria-labelledby="training-title">
      <img src={asset("assets/art/training/teacher.webp")} alt="" width={1024} height={1536} loading="lazy" />
      <div className="training-copy">
        <span>Também faço</span>
        <h2 id="training-title">Treinamento de IA pra equipes</h2>
        <p>
          Encontro prático e remoto, montado em cima das tarefas e das ferramentas que a equipe já usa. Ninguém sai com mais uma palestra sobre o futuro.
        </p>
        <ul>
          {trainingThemes.map((theme) => <li key={theme}>{theme}</li>)}
        </ul>
        <a className="text-link" href={tallyUrl({ path: "training", page: "home", cta: "treinamentos" })}>
          Pedir um treinamento <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </a>
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
          <span>Quem está do outro lado</span>
          <h2 id="about-title">Oi, eu sou o Bruno.</h2>
          <p>
            Sou engenheiro e moro em Florianópolis. A BruLabs é pequena de propósito: quem conversa com você no começo é quem faz o trabalho depois.
          </p>
          <p>
            Gosto de entender como as coisas funcionam antes de mexer nelas, e é assim que trabalho com IA também.
          </p>
          <small>Engenharia pela UFRGS · Especialização em IA · MBA pela USP/Esalq</small>
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
        <h2 id="contact-title">Me conta onde está travando.</h2>
        <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <p>
          Ou <a href={tallyUrl({ page: "home", cta: "contato" })}>preencha o formulário</a>, se preferir.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <a href="#topo"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
      <div><span>Florianópolis, SC</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={asset("privacidade/")}>Privacidade</a></div>
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
        <Method />
        <Proof />
        <Training />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
