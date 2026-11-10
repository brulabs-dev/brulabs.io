import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const EMAIL = "bruno@brulabs.io";

const navLinks = [
  ["O que faço", "#o-que-faco"],
  ["Trabalho", "#trabalho"],
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
      <a className="button button-small" href="#contato">Contato</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="topo" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Trago IA para dentro da sua empresa.</h1>
        <p>
          Sou o Bruno, engenheiro em Florianópolis. Pela BruLabs, descubro onde a IA ajuda na sua operação, coloco em uso e treino a equipe.
        </p>
        <div className="hero-actions">
          <a className="button" href="#contato">Falar comigo <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
          <a className="text-link" href="#trabalho">Ver um trabalho</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <img src={asset("assets/art/hero/statue-modern.webp")} alt="" width={1024} height={1536} fetchPriority="high" />
      </div>
    </section>
  );
}

const services = [
  {
    title: "Diagnóstico",
    description: "Olho como a operação funciona hoje e aponto onde a IA economiza tempo e onde ela não compensa.",
  },
  {
    title: "Implementação",
    description: "Monto o que foi decidido: assistentes, automações e integrações com as ferramentas que a empresa já usa, ou um sistema sob medida quando é o caso.",
  },
  {
    title: "Treinamento",
    description: "Ensino a equipe a usar no dia a dia, com exemplos tirados do trabalho dela.",
  },
];

function Services() {
  return (
    <section className="block section-shell" id="o-que-faco" aria-labelledby="services-title">
      <h2 className="block-label" id="services-title">O que faço</h2>
      <ol className="service-list">
        {services.map((service, index) => (
          <li key={service.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Work() {
  return (
    <section className="block section-shell" id="trabalho" aria-labelledby="work-title">
      <h2 className="block-label" id="work-title">Trabalho</h2>
      <article className="work-card">
        <div className="work-copy">
          <span>Produto próprio · IA aplicada à saúde</span>
          <h3>Manda Pra Nutri</h3>
          <p>
            Acompanhamento nutricional pelo WhatsApp. O paciente manda foto, áudio ou texto da refeição, a IA analisa e registra, e a nutricionista acompanha o histórico num painel.
          </p>
          <p>
            Começou como um experimento no ChatGPT, passou pelo Telegram e hoje roda no WhatsApp. Fiz do conceito ao código.
          </p>
          <a className="text-link text-link-light" href="https://mandapranutri.com.br/" target="_blank" rel="noreferrer">
            mandapranutri.com.br <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
        <figure className="work-art" aria-hidden="true">
          <img src={asset("assets/art/case/mpn-statue.webp")} alt="" width={1024} height={1536} loading="lazy" />
        </figure>
      </article>
    </section>
  );
}

const trainingThemes = ["IA no dia a dia", "Automação na prática", "Workshop sob medida"];

function Training() {
  return (
    <section className="block section-shell" id="treinamentos" aria-labelledby="training-title">
      <h2 className="block-label" id="training-title">Treinamentos</h2>
      <div className="training">
        <div className="training-copy">
          <h3>Treinamentos de IA para equipes</h3>
          <p>
            Encontros práticos e remotos, montados a partir das tarefas e das ferramentas que a equipe já usa, como ChatGPT, Claude, Gemini e Copilot.
          </p>
          <ul>
            {trainingThemes.map((theme) => <li key={theme}>{theme}</li>)}
          </ul>
          <a className="text-link" href={tallyUrl({ path: "training", page: "home", cta: "treinamentos" })}>
            Pedir um treinamento <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </div>
        <figure className="training-art" aria-hidden="true">
          <img src={asset("assets/art/training/teacher.webp")} alt="" width={1024} height={1536} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="block section-shell" id="sobre" aria-labelledby="about-title">
      <h2 className="block-label" id="about-title">Sobre</h2>
      <div className="about">
        <img src={asset("assets/brand/bruno-founder-paper-composite-v6.webp")} alt="Bruno, fundador da BruLabs" width={1254} height={1254} loading="lazy" />
        <div>
          <p className="about-lead">
            A BruLabs é o meu estúdio, em Florianópolis. Quem conversa com você no começo é quem faz o trabalho.
          </p>
          <dl>
            <div><dt>Graduação</dt><dd>Engenharia, UFRGS</dd></div>
            <div><dt>Especialização</dt><dd>Inteligência Artificial</dd></div>
            <div><dt>MBA</dt><dd>USP/Esalq</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contact-title">
      <div className="section-shell contact-inner">
        <h2 id="contact-title">Me conta o que você quer resolver.</h2>
        <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <p>
          Se preferir, <a href={tallyUrl({ page: "home", cta: "contato" })}>preencha o formulário</a>.
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
        <Services />
        <Work />
        <Training />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
