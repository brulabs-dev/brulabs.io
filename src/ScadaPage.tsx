import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

// Sibling URLs follow the existing training page and work with Pages subpaths.
const sitePath = (path = "") => `../${path}`;
const contact = (cta: string, solution?: string) => tallyUrl({
  page: "scada-automacao", cta, ...(solution ? { solution } : {}),
});

const services = [
  {
    id: "scada", number: "01", title: "Telas e configuração SCADA",
    description: "Apoio à equipe de engenharia na criação e manutenção de telas, no cadastro de pontos e nas adequações do supervisório durante ampliações e migrações.",
    tasks: ["Desenvolvimento e manutenção de telas no PSE, GED e PED.", "Configuração de pontos no DE400.", "Configuração de PCUs conforme o escopo do projeto.", "Serviços em aplicações Elipse e Network Manager, seguindo os padrões do contratante."],
    label: "Elipse Power · NM3 / WS500 · NM10 / PSE",
    cta: "Conversar sobre SCADA",
  },
  {
    id: "equipamentos", number: "02", title: "Comunicação de religadores e relés",
    description: "Parametrização de comunicação de equipamentos para integração ao sistema de supervisão, a partir dos requisitos e do mapa de pontos do projeto.",
    tasks: ["Configuração dos parâmetros de comunicação.", "Adequação do mapeamento de pontos ao supervisório.", "Revisão das configurações existentes e apoio ao diagnóstico de comunicação."],
    label: "NOJA · Tavrida · Cooper F6 · Chardon · Schneider · SEL-751",
    cta: "Conversar sobre equipamentos",
  },
];

export function ScadaPage() {
  return (
    <div className="scada-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="scada-header section-shell">
        <a className="brand" href={sitePath()} aria-label="BruLabs, início"><img src={sitePath("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
        <nav aria-label="Navegação da página"><a href="#servicos">Serviços</a><a href="#experiencia">Experiência</a><a href="#contato">Contato</a></nav>
        <a className="scada-back" href={sitePath()}><ArrowLeft aria-hidden="true" /> Voltar ao site</a>
      </header>
      <main id="conteudo">
        <section className="scada-hero section-shell" aria-labelledby="scada-title">
          <div className="scada-hero-panel">
            <span className="scada-eyebrow">SCADA e automação elétrica</span>
            <h1 id="scada-title">Telas, pontos e equipamentos.<br /><em>Engenharia para o seu projeto.</em></h1>
            <p>Desenvolvimento de telas e configuração SCADA. Parametrização de comunicação de religadores e relés. Apoio técnico para integradoras e empresas de engenharia, com escopo definido para cada entrega.</p>
            <a className="button button-light" href={contact("hero")}>Conversar sobre o projeto <ArrowRight aria-hidden="true" /></a>
            <div className="scada-hero-index"><span>01 / Supervisão e controle</span><span>02 / Comunicação de equipamentos</span></div>
          </div>
        </section>
        <section className="scada-section section-shell" id="servicos" aria-labelledby="services-title">
          <div className="scada-section-heading"><span className="scada-eyebrow">Serviços</span><h2 id="services-title">Uma entrega definida dentro do seu projeto.</h2></div>
          <div className="scada-services">
            {services.map(service => (
              <article className="scada-service" key={service.id}>
                <span className="scada-number">{service.number}</span>
                <h3>{service.title}</h3><p>{service.description}</p>
                <ul>{service.tasks.map(task => <li key={task}>{task}</li>)}</ul>
                <p className="scada-platforms">{service.label}</p>
                <a className="scada-service-link" href={contact("servico", service.id)}>{service.cta} <ArrowRight aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </section>
        <section className="scada-audience">
          <div className="section-shell scada-audience-inner"><h2>Para equipes que precisam de apoio na execução.</h2><div><p>Integradoras de automação e SCADA que precisam desenvolver telas, configurar pontos ou avançar uma etapa da migração.</p><p>Empresas de engenharia e proteção que precisam de apoio na comunicação dos equipamentos e na integração com a supervisão.</p><p>A atuação pode abranger uma demanda pontual ou um conjunto de entregas, conforme os padrões e a divisão de responsabilidades do projeto.</p></div></div>
        </section>
        <section className="scada-section section-shell scada-experience" id="experiencia" aria-labelledby="experience-title">
          <div><span className="scada-eyebrow">Experiência técnica</span><h2 id="experience-title">Vivência na manutenção e evolução de sistemas de supervisão.</h2><p>Bruno, engenheiro eletricista formado pela UFRGS, atua com automação de subestações e manutenção de sistemas Elipse e Network Manager NM3/WS500, e participa de um projeto de migração para NM10/PSE.</p><p>A experiência inclui manutenção de telas no GED e PED, configuração de pontos no DE400, configuração de PCUs e parametrização de comunicação de religadores e relés.</p><a className="scada-service-link" href={contact("experiencia")}>Detalhar uma demanda <ArrowRight aria-hidden="true" /></a></div>
          <figure><img src={sitePath("assets/brand/bruno-founder-paper-composite-v6.webp")} alt="Bruno, engenheiro eletricista e fundador da BruLabs" loading="lazy" /></figure>
        </section>
        <section className="scada-section scada-process section-shell" aria-labelledby="process-title"><span className="scada-eyebrow">Como começamos</span><h2 id="process-title">Do levantamento à revisão da entrega.</h2><ol><li><h3>Entender a demanda</h3><p>Plataforma, equipamentos, documentação disponível e o que precisa ser configurado ou alterado.</p></li><li><h3>Definir o escopo</h3><p>Alinhar padrões, acessos, prazos e critérios de revisão com a equipe responsável pelo projeto.</p></li><li><h3>Executar e revisar</h3><p>Desenvolver as configurações e telas previstas, apresentar a entrega e tratar os ajustes acordados.</p></li></ol></section>
        <section className="scada-contact" id="contato"><div className="section-shell"><span className="scada-eyebrow">Contato</span><h2>Qual etapa do projeto precisa de apoio?</h2><p>Conte qual sistema ou equipamento está envolvido, o escopo previsto e o prazo. A partir disso, avaliamos a forma de atuação.</p><a className="button button-dark" href={contact("final")}>Enviar uma demanda <ArrowRight aria-hidden="true" /></a></div></section>
      </main>
      <footer className="footer section-shell"><a href={sitePath()}><img src={sitePath("assets/brand/logo-principal.png")} alt="BruLabs" /></a><div><a href={sitePath()}>Soluções digitais</a><a href={sitePath("privacidade/")}>Privacidade</a></div><span>© 2026 BruLabs</span></footer>
    </div>
  );
}
