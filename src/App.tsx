import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const EMAIL = "bruno@brulabs.io";

const navLinks = [
  ["Onde a IA entra", "#onde"],
  ["Como eu faço", "#como"],
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
    description: "Responder as perguntas que se repetem, no WhatsApp ou no e-mail, e passar pra uma pessoa quando precisa.",
  },
  {
    title: "Na papelada",
    description: "Ler contrato, nota, proposta e planilha, e devolver o que importa já resumido.",
  },
  {
    title: "Entre os sistemas",
    description: "Acabar com o copia-e-cola: o dado sai de um lugar e chega no outro sozinho.",
  },
  {
    title: "Na mão da equipe",
    description: "Gente usando ChatGPT, Claude ou Copilot com método, e não no chute.",
  },
];

function Places() {
  return (
    <section className="places section-shell" id="onde" aria-labelledby="places-title">
      <div className="section-heading">
        <span>Onde a IA entra</span>
        <h2 id="places-title">Ela quase nunca entra onde o hype diz.</h2>
        <p>Entra no trabalho chato que a sua equipe repete toda semana. Quatro lugares onde costuma caber:</p>
      </div>
      <ol className="places-list">
        {places.map((place, index) => (
          <li key={place.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{place.title}</h3>
            <p>{place.description}</p>
          </li>
        ))}
      </ol>
      <p className="places-note">E se não couber em lugar nenhum, eu digo.</p>
    </section>
  );
}

const steps = [
  {
    title: "Olho",
    subtitle: "Como o trabalho é feito hoje",
    description: "Antes de falar em ferramenta, entendo a rotina: quem faz o quê, onde trava e o que já foi tentado.",
    image: "assets/art/method/diagnosis.webp",
  },
  {
    title: "Escolho",
    subtitle: "Onde vale e onde não vale",
    description: "Digo onde a IA resolve, onde uma ferramenta pronta já basta e onde é melhor não mexer.",
    image: "assets/art/method/direction.webp",
  },
  {
    title: "Deixo rodando",
    subtitle: "Montar, testar, ensinar",
    description: "Monto, testo com quem vai usar e treino a equipe. Só saio quando está na rotina.",
    image: "assets/art/method/construction.webp",
  },
];

function Method() {
  return (
    <section className="method" id="como" aria-labelledby="method-title">
      <div className="section-shell">
        <div className="method-heading">
          <h2 id="method-title">Como eu faço</h2>
          <p>Uma pessoa só, do começo ao fim. Quem conversa com você é quem monta.</p>
        </div>
        <ol className="method-grid">
          {steps.map((step, index) => (
            <li key={step.title}>
              <figure><img src={asset(step.image)} alt="" loading="lazy" /></figure>
              <span>{String(index + 1).padStart(2, "0")} · {step.subtitle}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="proof section-shell" id="prova" aria-labelledby="proof-title">
      <div className="section-heading">
        <span>Prova</span>
        <h2 id="proof-title">Não é teoria. Tenho um produto de IA no ar.</h2>
      </div>
      <article className="proof-card">
        <div className="proof-copy">
          <span>Produto próprio · saúde</span>
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
        <img src={asset("assets/art/case/mpn-statue.webp")} alt="" width={1024} height={1536} loading="lazy" />
      </article>
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
      <img src={asset("assets/brand/bruno-founder-paper-composite-v6.webp")} alt="Bruno, fundador da BruLabs" width={1254} height={1254} loading="lazy" />
      <div>
        <span>Sobre</span>
        <h2 id="about-title">A BruLabs sou eu, o Bruno.</h2>
        <p>
          Engenheiro, em Florianópolis. Não tem equipe de vendas nem fila de atendimento: você fala direto com quem vai fazer o trabalho.
        </p>
        <dl>
          <div><dt>Graduação</dt><dd>Engenharia, UFRGS</dd></div>
          <div><dt>Especialização</dt><dd>Inteligência Artificial</dd></div>
          <div><dt>MBA</dt><dd>USP/Esalq</dd></div>
        </dl>
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
