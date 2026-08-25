import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  FlowArrow,
  List,
  PresentationChart,
  Sparkle,
  WindowsLogo,
  X,
} from "@phosphor-icons/react";
import {
  SiClaude,
  SiGooglegemini,
  SiMake,
  SiNotion,
  SiZapier,
} from "react-icons/si";
import { tallyUrl } from "./tally";

const sitePath = (path = "") => `../${path}`;
const asset = sitePath;
const trainingTallyUrl = (cta: string, solution?: string) => tallyUrl({
  path: "training",
  page: "training",
  cta,
  ...(solution ? { solution } : {}),
});

const tools = [
  { name: "ChatGPT", icon: <img src={asset("assets/tools/chatgpt-official.svg")} alt="" /> },
  { name: "Claude", icon: <SiClaude /> },
  { name: "Gemini", icon: <SiGooglegemini /> },
  { name: "Microsoft Copilot", icon: <WindowsLogo weight="fill" /> },
  { name: "Power Automate", icon: <img src={asset("assets/tools/power-automate-official.svg")} alt="" /> },
  { name: "Notion", icon: <SiNotion /> },
  { name: "Zapier", icon: <SiZapier /> },
  { name: "Make", icon: <SiMake /> },
];

const workshops = [
  {
    label: "Uso prático",
    title: "IA no dia a dia",
    description: "Para equipes que querem usar melhor ferramentas como ChatGPT, Claude, Gemini ou Copilot sem ficar presas a prompts genéricos.",
    topics: ["Pesquisa e síntese", "Escrita e revisão", "Análise e organização", "Boas práticas e limites"],
    icon: <Sparkle />,
    tallySolution: "training-ai",
  },
  {
    label: "Processos",
    title: "Automação na prática",
    description: "Para enxergar tarefas repetitivas, desenhar fluxos mais simples e dar os primeiros passos com integrações e automações.",
    topics: ["Mapeamento do processo", "Gatilhos e regras", "Power Automate, Make ou Zapier", "Próximos fluxos para testar"],
    icon: <FlowArrow />,
    tallySolution: "training-automation",
  },
  {
    label: "Contexto real",
    title: "Workshop sob medida",
    description: "Para trabalhar uma necessidade específica da empresa com exemplos, exercícios e ferramentas escolhidos para aquele contexto.",
    topics: ["Diagnóstico prévio", "Casos da própria equipe", "Exercícios contextualizados", "Material para continuar"],
    icon: <PresentationChart />,
    tallySolution: "training-custom",
  },
];

const steps = [
  ["01", "Alinhamos o contexto", "Entendemos o perfil da equipe, as ferramentas usadas e o que o encontro precisa destravar."],
  ["02", "Desenhamos o conteúdo", "Selecionamos exemplos, exercícios e nível de profundidade de acordo com a realidade da empresa."],
  ["03", "Praticamos juntos", "O encontro combina explicação direta, demonstração e tempo para aplicar em situações reais."],
  ["04", "Organizamos os próximos passos", "A equipe sai com material de apoio e caminhos claros para continuar usando e evoluindo."],
];

const faqs = [
  ["O treinamento é remoto ou presencial?", "Hoje, os treinamentos acontecem de forma remota. A BruLabs está preparando formatos presenciais, ainda sem data definida. Se houver interesse, conte isso no contato."],
  ["Quanto tempo dura?", "A duração é definida pelo objetivo e pelo conteúdo. Podemos desenhar desde um encontro concentrado até uma sequência de sessões para aprofundar e acompanhar a aplicação."],
  ["A equipe precisa saber usar IA ou automação?", "Não. O nível parte do repertório real do grupo. Também é possível trabalhar com equipes que já usam essas ferramentas e precisam avançar para aplicações mais consistentes."],
  ["Existe um número ideal de participantes?", "O formato se adapta ao grupo. Turmas menores favorecem prática e acompanhamento próximo; grupos maiores pedem uma dinâmica mais demonstrativa. Isso é alinhado antes da proposta."],
  ["O conteúdo pode usar casos da nossa empresa?", "Sim. Esse é justamente um dos pontos centrais: aproximar o treinamento das tarefas, documentos e decisões que já fazem parte da rotina, respeitando os cuidados necessários com informações internas."],
  ["Vocês indicam quais ferramentas usar?", "Sim. A recomendação considera o que a empresa já possui, as restrições do ambiente e o que precisa ser resolvido — sem forçar a adoção de uma ferramenta específica."],
];

function TrainingHeader() {
  const [open, setOpen] = useState(false);
  const links = [["Temas", "#temas"], ["Formato", "#formato"], ["Para quem", "#para-quem"], ["Dúvidas", "#duvidas"]];

  return (
    <header className="training-header section-shell">
      <a href={sitePath()} className="brand" aria-label="BruLabs, voltar para a página inicial">
        <img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" />
      </a>
      <nav className="training-nav" aria-label="Navegação da página">
        {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
      </nav>
      <a className="button button-small training-header-cta" href={trainingTallyUrl("header-desktop")}>Falar sobre o treinamento</a>
      <button className="training-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
        {open ? <X size={23} /> : <List size={23} />}
      </button>
      {open && (
        <div className="training-mobile-nav">
          {links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="button" href={trainingTallyUrl("header-mobile")}>Falar sobre o treinamento</a>
        </div>
      )}
    </header>
  );
}

function TrainingFooter() {
  return (
    <footer className="footer section-shell training-footer">
      <a href={sitePath()}><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
      <div><a href={sitePath()}>Página inicial</a><a href={sitePath("privacidade/")}>Privacidade</a></div>
      <span>© 2026 BruLabs</span>
    </footer>
  );
}

export function TrainingPage() {
  return (
    <div className="training-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <TrainingHeader />

      <main id="conteudo">
        <section className="training-hero">
          <div className="section-shell training-hero-inner">
            <div className="training-hero-copy">
              <a className="training-back-link" href={sitePath()}><ArrowLeft /> Voltar para a BruLabs</a>
              <span className="training-page-kicker">Treinamentos para equipes</span>
              <h1>Sua equipe não precisa de mais uma palestra sobre IA.</h1>
              <p>Precisa entender onde usar, praticar com situações próximas da rotina e sair do encontro com confiança para continuar.</p>
              <div className="training-hero-actions">
                <a className="button" href={trainingTallyUrl("hero")}>Quero treinar minha equipe <ArrowRight /></a>
                <span>Conte o contexto. Retornamos em até 5 dias corridos.</span>
              </div>
            </div>
            <div className="training-hero-visual" aria-hidden="true">
              <div className="training-orbit" />
              <img className="training-teacher" src={asset("assets/art/training/teacher.webp")} alt="" fetchPriority="high" />
              <div className="training-note training-note-1">casos da<br />sua rotina</div>
              <div className="training-note training-note-2">prática<br />guiada</div>
              <div className="training-note training-note-3">próximos<br />passos</div>
            </div>
          </div>
        </section>

        <section className="training-promises">
          <div className="section-shell">
            <div><CheckCircle /><span>Aplicação na rotina</span><p>O conteúdo parte de situações que a equipe reconhece.</p></div>
            <div><CheckCircle /><span>Escolha consciente</span><p>Ferramentas entram quando ajudam — não como fim em si mesmas.</p></div>
            <div><CheckCircle /><span>Continuidade</span><p>O encontro deixa referências e caminhos para seguir praticando.</p></div>
          </div>
        </section>

        <section id="temas" className="training-topics section-shell">
          <div className="training-section-heading">
            <span>Temas e formatos</span>
            <h2>O ponto de partida muda. A prática continua no centro.</h2>
            <p>Escolha uma direção inicial ou conte o que sua equipe precisa resolver. O formato final é definido depois do alinhamento.</p>
          </div>
          <div className="workshop-grid">
            {workshops.map((workshop, index) => (
              <article className={`workshop-card workshop-card-${index + 1}`} key={workshop.title}>
                <div className="workshop-card-head">
                  <span>{workshop.icon}</span>
                  <small>{workshop.label}</small>
                </div>
                <h3>{workshop.title}</h3>
                <p>{workshop.description}</p>
                <ul>
                  {workshop.topics.map((topic) => <li key={topic}><Check /> {topic}</li>)}
                </ul>
                <a href={trainingTallyUrl("tema", workshop.tallySolution)}>Quero conversar sobre este tema <ArrowRight /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="training-tools">
          <div className="section-shell">
            <span className="training-tools-title">Ferramentas entram de acordo com o contexto</span>
            <div className="training-tools-grid" aria-label="Ferramentas que podem fazer parte dos treinamentos">
              {tools.map((tool) => <div key={tool.name}>{tool.icon}<span>{tool.name}</span></div>)}
            </div>
          </div>
        </section>

        <section id="formato" className="training-process section-shell">
          <div className="training-section-heading training-section-heading-dark">
            <span>Como funciona</span>
            <h2>Um treinamento começa antes do encontro.</h2>
          </div>
          <ol className="training-process-grid">
            {steps.map(([number, title, description]) => (
              <li key={number}>
                <span aria-hidden="true">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="para-quem" className="training-fit">
          <div className="section-shell training-fit-inner">
            <div className="training-fit-copy">
              <span>Para quem faz sentido</span>
              <h2>Equipes que querem transformar curiosidade em uso consistente.</h2>
            </div>
            <div className="training-fit-lists">
              <article>
                <h3>Faz sentido se...</h3>
                <ul>
                  <li><Check /> a equipe já experimenta IA, mas usa sem método;</li>
                  <li><Check /> existem tarefas repetitivas que ninguém sabe como automatizar;</li>
                  <li><Check /> a empresa quer começar com critério e segurança;</li>
                  <li><Check /> o time precisa enxergar aplicações na própria rotina.</li>
                </ul>
              </article>
              <article>
                <h3>Talvez não seja o momento se...</h3>
                <ul>
                  <li><X /> a expectativa é uma palestra motivacional genérica;</li>
                  <li><X /> não há espaço para prática ou participação da equipe;</li>
                  <li><X /> a expectativa é receber uma receita pronta, sem adaptar o conteúdo à realidade da equipe.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="duvidas" className="training-faq section-shell">
          <div className="training-section-heading">
            <span>Dúvidas frequentes</span>
            <h2>O que costuma surgir antes de marcar.</h2>
          </div>
          <div className="training-faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="training-final-cta">
          <div className="section-shell">
            <span>O próximo encontro pode começar por uma conversa.</span>
            <h2>Conte o que sua equipe precisa conseguir fazer melhor.</h2>
            <p>Não precisa escolher o tema, a ferramenta ou o formato agora. A BruLabs ajuda a transformar o contexto em um treinamento que faça sentido.</p>
            <a className="button button-dark" href={trainingTallyUrl("final")}>Quero desenhar um treinamento <ArrowRight /></a>
          </div>
        </section>
      </main>

      <TrainingFooter />
    </div>
  );
}
