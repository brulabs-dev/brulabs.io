import { useState } from "react";
import { ArrowRight, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const EMAIL = "bruno@brulabs.io";

// TODO: placeholders. Replace both with the real values before publishing.
const WHATSAPP_NUMBER = "5548900000000";
const LINKEDIN_URL = "https://www.linkedin.com/in/SEU-PERFIL";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Oi, Bruno! Vim pelo site da BruLabs.")}`;

const navLinks = [
  ["Onde a IA entra", "#onde"],
  ["Sobre", "#sobre"],
  ["Como eu trabalho", "#metodo"],
  ["Treinamentos", "#treinamentos"],
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
    after: "A IA responde as perguntas repetidas e passa pra uma pessoa o que é delicado.",
    image: "phone",
  },
  {
    title: "Na papelada",
    before: "Contrato, nota e proposta lidos linha por linha.",
    after: "A IA lê o documento e entrega um resumo com o que importa.",
    image: "archive",
  },
  {
    title: "Entre os sistemas",
    before: "Dado copiado de uma planilha pra outra, na mão.",
    after: "O dado sai de um lugar e chega no outro sem ninguém copiar.",
    image: "process",
  },
  {
    title: "Na mão da equipe",
    before: "Cada um testa o ChatGPT do seu jeito, no chute.",
    after: "A equipe sabe em quais tarefas usar o ChatGPT e como pedir.",
    image: "typewriter",
  },
];

function Places() {
  const [withAi, setWithAi] = useState(false);

  return (
    <section className="places section-shell" id="onde" aria-labelledby="places-title">
      <div className="places-top">
        <div className="section-heading">
          <span>Onde a IA entra</span>
          <h2 id="places-title">No trabalho chato que a equipe repete toda semana.</h2>
          <p>Quatro lugares onde ela costuma caber. Troque a chave para ver a diferença.</p>
        </div>
        <div className="switch" role="group" aria-label="Mostrar o trabalho hoje ou com IA">
          <button type="button" aria-pressed={!withAi} onClick={() => setWithAi(false)}>Hoje</button>
          <button type="button" aria-pressed={withAi} onClick={() => setWithAi(true)}>Com IA</button>
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
            <p className="place-after"><b>Com IA</b>{place.after}</p>
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
    description: "Converso com quem faz o trabalho pra entender a rotina e onde ela trava.",
    image: "assets/art/method/diagnosis.webp",
  },
  {
    title: "Pesquisa",
    description: "Vejo o que já existe pronto antes de pensar em construir.",
    image: "assets/art/method/research.webp",
  },
  {
    title: "Direção",
    description: "Digo onde a IA ajuda e onde é melhor não mexer.",
    image: "assets/art/method/direction.webp",
  },
  {
    title: "Proposta",
    description: "Combinamos escopo, prazo e preço antes de começar.",
    image: "assets/art/method/proposal.webp",
  },
  {
    title: "Construção",
    description: "Monto, testo com quem vai usar e treino a equipe.",
    image: "assets/art/method/construction.webp",
  },
];

function Method() {
  return (
    <section className="method" id="metodo" aria-labelledby="method-title">
      <div className="section-shell">
        <div className="method-heading">
          <h2 id="method-title">Como eu trabalho</h2>
          <p>Cinco etapas, nessa ordem.</p>
        </div>
        <ol className="method-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <figure><img src={asset(step.image)} alt="" loading="lazy" /></figure>
              <div>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="method-cta">
          <p>Quer saber por onde começar na sua empresa?</p>
          <a className="button" href="#contato">Falar com o Bruno <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
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
        <span>Treinamentos</span>
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
        <h2 id="contact-title">Me conta onde está travando.</h2>
        <div className="contact-actions">
          <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">
            <WhatsappLogo size={20} weight="fill" aria-hidden="true" /> Chamar no WhatsApp
          </a>
          <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <p>
          Também estou no <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>. Se preferir, <a href={tallyUrl({ page: "home", cta: "contato" })}>preencha o formulário</a>.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <a href="#topo"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
      <div><span>Florianópolis, SC</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn do Bruno"><LinkedinLogo size={18} weight="fill" aria-hidden="true" /></a><a href={asset("privacidade/")}>Privacidade</a></div>
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
        <Training />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
