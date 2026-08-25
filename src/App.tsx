import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lightbulb,
  List,
  MouseSimple,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { tallyUrl } from "./tally";

const sitePath = (path = "") => `${import.meta.env.BASE_URL}${path}`;
const asset = sitePath;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reveal}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Case", "#case"],
    ["Soluções", "#solucoes"],
    ["Como trabalhamos", "#metodo"],
    ["Treinamentos", sitePath("treinamentos/")],
    ["Sobre", "#sobre"],
  ];

  return (
    <header className="site-header">
      <a href="#topo" className="brand" aria-label="BruLabs, início">
        <img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" />
      </a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <a className="button button-small desktop-cta" href={tallyUrl({ page: "home", cta: "header-desktop" })}>Conte seu desafio</a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>
        {open ? <X size={24} /> : <List size={24} />}
      </button>
      {open && (
        <div className="mobile-nav">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="button" href={tallyUrl({ page: "home", cta: "header-mobile" })}>Conte seu desafio</a>
        </div>
      )}
    </header>
  );
}

type TrailPoint = { x: number; y: number; born: number; size: number };

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const pointsRef = useRef<TrailPoint[]>([]);
  const frameRef = useRef<number>(0);
  const hoverTimerRef = useRef<number | null>(null);
  const waveStartedRef = useRef(0);
  const waveOriginRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [modern, setModern] = useState(false);
  const [wave, setWave] = useState<"reveal" | "hide" | null>(null);
  const [shockOrigin, setShockOrigin] = useState({ x: 80, y: 60 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const sources = {
      statueOld: asset("assets/art/hero/statue-old.webp"),
      statueModern: asset("assets/art/hero/statue-modern.webp"),
      processOld: asset("assets/art/hero/process-old.webp"),
      processModern: asset("assets/art/hero/process-modern.webp"),
      typewriterOld: asset("assets/art/hero/typewriter-old.webp"),
      typewriterModern: asset("assets/art/hero/typewriter-modern.webp"),
      phoneOld: asset("assets/art/hero/phone-old.webp"),
      phoneModern: asset("assets/art/hero/phone-modern.webp"),
      archiveOld: asset("assets/art/hero/archive-old.webp"),
      archiveModern: asset("assets/art/hero/archive-modern.webp"),
    };
    Object.entries(sources).forEach(([key, src]) => {
      const image = new Image();
      image.src = src;
      image.onload = () => { imagesRef.current[key] = image; };
    });
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const drawAsset = (image: HTMLImageElement | undefined, x: number, y: number, targetHeight: number, rotation = 0, opacity = 1) => {
        if (!image) return;
        const dh = h * targetHeight;
        const dw = dh * (image.width / image.height);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(w * x + dw / 2, h * y + dh / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      };
      const drawComposition = (isModern: boolean, includeStatue = true) => {
        const images = imagesRef.current;
        const process = images[isModern ? "processModern" : "processOld"];
        const statue = images[isModern ? "statueModern" : "statueOld"];
        const typewriter = images[isModern ? "typewriterModern" : "typewriterOld"];
        const phone = images[isModern ? "phoneModern" : "phoneOld"];
        const archive = images[isModern ? "archiveModern" : "archiveOld"];
        if (isModern) {
          ctx.save();
          ctx.filter = "sepia(.35) saturate(1.22) brightness(1.1) contrast(.96)";
        }
        ctx.save();
        ctx.strokeStyle = isModern ? "rgba(234,98,38,.92)" : "rgba(70,72,69,.62)";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = Math.max(2.2, w * .003);
        ctx.setLineDash([12, 10]);
        const route = (startX: number, startY: number, cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, endX: number, endY: number) => {
          ctx.beginPath();
          ctx.moveTo(w * startX, h * startY);
          ctx.bezierCurveTo(w * cp1X, h * cp1Y, w * cp2X, h * cp2Y, w * endX, h * endY);
          ctx.stroke();
          ctx.setLineDash([]);
          const angle = Math.atan2(h * (endY - cp2Y), w * (endX - cp2X));
          ctx.beginPath();
          ctx.moveTo(w * endX, h * endY);
          ctx.lineTo(w * endX - 14 * Math.cos(angle - Math.PI / 6), h * endY - 14 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(w * endX - 14 * Math.cos(angle + Math.PI / 6), h * endY - 14 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
          ctx.setLineDash([12, 10]);
        };
        route(.2, .2, .34, .12, .48, .2, .58, .36);
        route(.83, .2, .7, .28, .76, .48, .66, .56);
        route(.13, .72, .28, .62, .4, .72, .52, .62);
        route(.59, .68, .69, .7, .77, .72, .82, .74);
        ctx.restore();

        drawAsset(process, 0.69, 0.02, 0.36, 5, .98);
        drawAsset(archive, 0.015, 0.08, 0.25, -10, .92);
        drawAsset(typewriter, 0.01, 0.67, 0.30, -7, .98);
        drawAsset(phone, 0.75, 0.65, 0.27, 7, .98);
        if (includeStatue) drawAsset(statue, 0.15, 0.015, 0.98, isModern ? 1 : -1);
        if (isModern) ctx.restore();
      };
      const drawWave = () => {
        const elapsed = performance.now() - waveStartedRef.current;
        const duration = wave === "reveal" ? 1050 : 920;
        const raw = Math.min(1, elapsed / duration);
        const eased = wave === "reveal" ? 1 - Math.pow(1 - raw, 3) : raw * raw * raw;
        const originX = waveOriginRef.current.x || w * .5;
        const originY = waveOriginRef.current.y || h * .5;
        const maxRadius = Math.hypot(Math.max(originX, w - originX), Math.max(originY, h - originY)) * 1.08;
        const radius = wave === "reveal" ? maxRadius * eased : maxRadius * (1 - eased);

        drawComposition(false);
        ctx.save();
        ctx.beginPath();
        ctx.arc(originX, originY, Math.max(0, radius), 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(0, 0, w, h);
        drawComposition(true);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(originX, originY, Math.max(0, radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(234,98,38,${.75 * (1 - raw)})`;
        ctx.shadowColor = "rgba(255,174,92,.82)";
        ctx.shadowBlur = 34;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      };

      if (wave) {
        drawWave();
      } else if (modern) {
        drawComposition(true);
      } else {
        drawComposition(false);
        if (!reduce) {
          const now = performance.now();
          pointsRef.current = pointsRef.current.filter((point) => now - point.born < 4200);
          if (pointsRef.current.length) {
            ctx.save();
            ctx.beginPath();
            for (const point of pointsRef.current) {
              const age = now - point.born;
              const life = Math.max(0, 1 - age / 4200);
              const radius = point.size * (.4 + life * .72);
              ctx.moveTo(point.x + radius, point.y);
              ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            }
            ctx.clip();
            ctx.clearRect(0, 0, w, h);
            drawComposition(true);
            ctx.restore();

            for (let index = 0; index < pointsRef.current.length; index += 3) {
              const point = pointsRef.current[index];
              const life = Math.max(0, 1 - (now - point.born) / 4200);
              const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size * 1.12);
              halo.addColorStop(0, `rgba(255,205,145,${.09 * life})`);
              halo.addColorStop(.7, `rgba(234,98,38,${.045 * life})`);
              halo.addColorStop(1, "rgba(234,98,38,0)");
              ctx.save();
              ctx.globalCompositeOperation = "screen";
              ctx.fillStyle = halo;
              ctx.fillRect(point.x - point.size * 1.2, point.y - point.size * 1.2, point.size * 2.4, point.size * 2.4);
              ctx.restore();
            }
          }
        }
      }
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [modern, reduce, wave]);

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "touch" || modern || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    lastPointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, clientX: event.clientX, clientY: event.clientY };
    pointsRef.current.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      born: performance.now(),
      size: 64 + Math.min(36, Math.abs(event.movementX) + Math.abs(event.movementY)),
    });
    if (pointsRef.current.length > 42) pointsRef.current.splice(0, pointsRef.current.length - 42);
  };

  const triggerTransformation = () => {
    if (modern || wave) return;
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    const point = lastPointerRef.current;
    waveOriginRef.current = { x: point.x, y: point.y };
    setShockOrigin({ x: point.clientX, y: point.clientY });
    waveStartedRef.current = performance.now();
    setWave("reveal");
    hoverTimerRef.current = window.setTimeout(() => {
      setModern(true);
      setWave(null);
    }, 1050);
  };

  const startDiscovery = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    lastPointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, clientX: event.clientX, clientY: event.clientY };
    if (event.pointerType === "touch") {
      triggerTransformation();
      return;
    }
    if (!modern && !wave && !reduce) hoverTimerRef.current = window.setTimeout(triggerTransformation, 4000);
  };

  const stopDiscovery = () => {
    if (hoverTimerRef.current && !wave) window.clearTimeout(hoverTimerRef.current);
  };

  const solutionState = modern || wave === "reveal";

  return (
    <div className={`hero-art ${modern ? "is-modern" : ""} ${wave ? `wave-${wave}` : ""}`}>
      <canvas
        ref={canvasRef}
        onPointerMove={onPointerMove}
        onPointerEnter={startDiscovery}
        onPointerLeave={stopDiscovery}
        onPointerDown={startDiscovery}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerTransformation();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Alternar a colagem entre processos antigos e soluções atuais"
      />
      <div className="hero-paper-note note-process">{solutionState ? <>processos<br />automatizados</> : <>processos<br />manuais</>}</div>
      <div className="hero-paper-note note-systems">{solutionState ? <>sistemas<br />integrados</> : <>sistemas que<br />não conversam</>}</div>
      <div className="hero-paper-note note-archive">{solutionState ? <>informação<br />organizada</> : <>dados<br />espalhados</>}</div>
      <div className="hero-paper-note note-phone">{solutionState ? <>fluxos<br />conectados</> : <>comunicação<br />travada</>}</div>
      <div className="hero-art-hint" aria-hidden="true"><MouseSimple size={25} weight="light" /><span /></div>
      {wave && <div className="page-shockwave" style={{ "--shock-x": `${shockOrigin.x}px`, "--shock-y": `${shockOrigin.y}px` } as React.CSSProperties} />}
    </div>
  );
}

function Hero() {
  const [showInteractiveArt, setShowInteractiveArt] = useState(() => (
    typeof window === "undefined" || window.matchMedia("(min-width: 721px)").matches
  ));

  useEffect(() => {
    const query = window.matchMedia("(min-width: 721px)");
    const updateArt = () => setShowInteractiveArt(query.matches);
    updateArt();
    query.addEventListener("change", updateArt);
    return () => query.removeEventListener("change", updateArt);
  }, []);

  return (
    <section id="topo" className="hero section-shell">
      <div className="hero-copy">
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
          Você conhece o problema por dentro. <strong>Nós encontramos o caminho.</strong>
        </motion.h1>
        <motion.p className="hero-summary-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.18 }}>
          Retrabalho, planilhas manuais, sistemas que não conversam. Você entende a operação — nós investigamos, escolhemos o caminho certo e colocamos para funcionar.
        </motion.p>
        <motion.p className="hero-summary-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.18 }}>
          Retrabalho, planilhas manuais, sistemas que não conversam. Nós encontramos o caminho e colocamos para funcionar.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.28 }}>
          <a className="button" href={tallyUrl({ page: "home", cta: "hero" })}>Conte seu desafio</a>
          <a className="text-link" href="#metodo">Veja como trabalhamos <ArrowDown size={18} /></a>
        </motion.div>
      </div>
      {showInteractiveArt ? <HeroCanvas /> : (
        <div className="hero-mobile-art" aria-hidden="true">
          <img className="hero-mobile-old" src={asset("assets/art/hero/archive-old.webp")} alt="" />
          <img className="hero-mobile-modern" src={asset("assets/art/hero/archive-modern.webp")} alt="" />
          <img className="hero-mobile-statue" src={asset("assets/art/hero/statue-old.webp")} alt="" />
          <span className="hero-mobile-route" />
          <span className="hero-mobile-tag hero-mobile-tag-old">como funciona hoje</span>
          <span className="hero-mobile-tag hero-mobile-tag-modern">o que pode funcionar</span>
        </div>
      )}
    </section>
  );
}

const paths = [
  { title: "Quero criar uma solução para minha área", text: "Conheço uma necessidade da minha área e quero transformá-la em uma solução digital.", action: "Estruturar a solução", className: "path-idea", icon: <Lightbulb />, href: tallyUrl({ path: "product", page: "home", cta: "entrada-solucao-digital" }) },
  { title: "Tenho um processo travando", text: "Quero reduzir trabalho manual, integrar ferramentas ou organizar uma operação.", action: "Melhorar processo", className: "path-process", icon: <Sparkle />, href: tallyUrl({ path: "process", page: "home", cta: "entrada-processo" }) },
  { title: "Quero capacitar minha equipe", text: "Quero ensinar meu time a usar IA e automação de forma prática.", action: "Conhecer treinamentos", className: "path-training", icon: <Check />, href: sitePath("treinamentos/") },
];

function EntryPaths() {
  return (
    <section id="portas-de-entrada" className="section-shell entry-section">
      <Reveal><h2>Por onde começamos?</h2></Reveal>
      <div className="entry-grid">
        {paths.map((path) => (
          <motion.a
            key={path.title}
            href={path.href}
            className={`entry-path ${path.className}`}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="path-icon">{path.icon}</span>
            <div><h3>{path.title}</h3><p>{path.text}</p></div>
            <span className="path-action">{path.action} <ArrowRight /></span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Method() {
  const chapters = [
    {
      title: "Entender",
      stages: "Diagnóstico + pesquisa",
      text: "Você mostra o contexto, o que já conhece sobre a necessidade, as pessoas envolvidas e o resultado que precisa alcançar. Investigamos o que já existe e quais caminhos realmente fazem sentido.",
      detail: "O primeiro retorno acontece em até 5 dias corridos.",
      images: [asset("assets/art/method/diagnosis.webp"), asset("assets/art/method/research.webp")],
    },
    {
      title: "Escolher",
      stages: "Direção + proposta",
      text: "Comparamos usar uma solução pronta, integrar ferramentas ou construir algo sob medida. A direção escolhida vira uma proposta concreta, com escopo, etapas e responsabilidades.",
      detail: "A decisão nasce do contexto, não da ferramenta que queremos vender.",
      images: [asset("assets/art/method/direction.webp"), asset("assets/art/method/proposal.webp")],
    },
    {
      title: "Construir",
      stages: "Implementação + acompanhamento",
      text: "Desenvolvemos, integramos, testamos e colocamos para funcionar. Depois de colocar em uso, acompanhamos o que foi construído e combinamos o suporte necessário para a operação.",
      detail: "O trabalho termina com algo funcionando, não apenas com um documento.",
      images: [asset("assets/art/method/construction.webp")],
    },
  ];

  return (
    <section id="metodo" className="method-section">
      <div className="section-shell method-intro">
        <Reveal>
          <span className="method-kicker">Como trabalhamos</span>
          <h2>Clareza antes da tecnologia.</h2>
          <p className="method-lead">Você não precisa chegar com uma solução pronta. O processo começa entendendo o que está acontecendo e termina com algo funcionando.</p>
        </Reveal>
      </div>
      <div className="method-chapters section-shell" aria-label="Três capítulos de um projeto">
        {chapters.map((chapter, index) => (
          <article className={`method-chapter method-chapter-${index + 1}`} key={chapter.title}>
            <div className="method-chapter-visual" aria-hidden="true">
              {chapter.images.map((image, imageIndex) => (
                <img key={image} className={`method-chapter-image method-chapter-image-${imageIndex + 1}`} src={image} alt="" loading="lazy" />
              ))}
            </div>
            <div className="method-chapter-copy">
              <span>{String(index + 1).padStart(2, "0")} · {chapter.stages}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
              <small>{chapter.detail}</small>
            </div>
          </article>
        ))}
      </div>
      <div className="method-outcome-band">
        <div className="section-shell">
          <span>Da investigação à entrega</span>
          <p>Um caminho escolhido para o problema, não para a ferramenta que queremos vender.</p>
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <section id="case" className="case-section">
      <div className="section-shell case-inner">
        <Reveal className="case-copy">
          <span className="case-label">Projeto · Manda Pra Nutri</span>
          <h2>Acompanhamento nutricional pelo WhatsApp.</h2>
          <p>O MPN começou como um teste no ChatGPT. O protótipo respondia bem, mas perdia o contexto e não guardava o progresso. Redesenhamos o fluxo, testamos no Telegram e levamos a experiência para o WhatsApp.</p>
          <a className="case-project-link" href="https://mandapranutri.com.br/" target="_blank" rel="noopener noreferrer">mandapranutri.com.br <ArrowRight /></a>
          <div className="case-fact">
            <strong>+ de 2.500</strong>
            <span>refeições processadas</span>
          </div>
        </Reveal>
        <Reveal className="case-reel">
          <div className="case-reel-frame">
            <iframe
              src="https://www.instagram.com/reel/DbBGyY1jfKt/embed"
              title="Bruno apresenta o projeto Manda Pra Nutri"
              loading="lazy"
              referrerPolicy="strict-origin"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <a className="case-reel-link" href="https://www.instagram.com/reel/DbBGyY1jfKt/" target="_blank" rel="noreferrer">Abrir no Instagram <ArrowRight /></a>
        </Reveal>
      </div>
    </section>
  );
}

type SolutionFamily = {
  id: "digital-product" | "internal-system" | "automation";
  title: string;
  description: string;
  deliverable: string;
  visual: string;
  visualAlt: string;
  tallyContext: {
    path: "product" | "process";
    solution: string;
  };
};

const solutionFamilies: SolutionFamily[] = [
  {
    id: "digital-product",
    title: "Soluções digitais para clientes e mercados",
    description: "Criamos plataformas web, produtos com IA e sistemas digitais para clientes, parceiros ou para a própria operação.",
    deliverable: "Uma primeira versão funcional, publicada e pronta para uso no contexto definido no projeto.",
    visual: asset("assets/solutions/digital-product-cinema-v2.webp"),
    visualAlt: "Pessoas vistas de lado em um cinema antigo usando óculos 3D laranja",
    tallyContext: { path: "product", solution: "digital-product" },
  },
  {
    id: "internal-system",
    title: "Sistemas internos e portais",
    description: "Desenvolvemos painéis, backoffices, ferramentas administrativas e portais para organizar a rotina da equipe.",
    deliverable: "Um sistema sob medida para a rotina da operação.",
    visual: asset("assets/solutions/custom-system-v2.webp"),
    visualAlt: "Wireframes de papel dando forma a uma interface web",
    tallyContext: { path: "process", solution: "internal-system" },
  },
  {
    id: "automation",
    title: "Integrações e automações",
    description: "Integramos formulários, planilhas, e-mail, CRM e Microsoft 365 para reduzir tarefas repetitivas e eliminar o copiar e colar.",
    deliverable: "Um fluxo automatizado, integrado às ferramentas da operação e pronto para acompanhamento.",
    visual: asset("assets/solutions/automation-v2.webp"),
    visualAlt: "Documentos e aprovações conectados em um fluxo organizado",
    tallyContext: { path: "process", solution: "automation" },
  },
];

function Solutions() {
  const [selectedId, setSelectedId] = useState<SolutionFamily["id"]>(solutionFamilies[0].id);
  const selectedSolution = solutionFamilies.find((solution) => solution.id === selectedId) ?? solutionFamilies[0];

  return (
    <section id="solucoes" className="solutions-section section-shell" aria-labelledby="solutions-title">
      <Reveal className="solutions-intro">
        <h2 id="solutions-title">O que podemos colocar para funcionar</h2>
        <p>Exemplos de entregas — sem precisar escolher a solução antes de conversar com a BruLabs.</p>
      </Reveal>
      <div className="solution-catalog">
        <div className="solution-selector" aria-label="Selecione uma solução">
          {solutionFamilies.map((solution) => (
            <button
              className="solution-option"
              id={`solution-option-${solution.id}`}
              key={solution.id}
              type="button"
              aria-controls="selected-solution-panel"
              aria-pressed={selectedId === solution.id}
              onClick={() => setSelectedId(solution.id)}
            >
              {solution.title}
            </button>
          ))}
        </div>
        <article
          className="solution-panel"
          id="selected-solution-panel"
          aria-labelledby={`solution-option-${selectedSolution.id}`}
          aria-live="polite"
        >
          <div className="solution-panel-content" key={selectedSolution.id}>
            <figure className="solution-visual">
              <img
                src={selectedSolution.visual}
                alt={selectedSolution.visualAlt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="solution-copy">
              <h3>{selectedSolution.title}</h3>
              <p>{selectedSolution.description}</p>
              <div className="solution-deliverable">
                <span>Entrega esperada</span>
                <p>{selectedSolution.deliverable}</p>
              </div>
              <a
                className="solution-cta"
                href={tallyUrl({ ...selectedSolution.tallyContext, page: "home", cta: "solucao" })}
              >
                Conversar sobre esta solução
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function TrainingTeaser() {
  return (
    <section className="training-teaser" id="capacitacao">
      <div className="training-teaser-inner section-shell">
        <Reveal className="training-teaser-copy">
          <span className="training-eyebrow">Treinamentos para equipes</span>
          <h2>Menos palestra sobre IA. Mais gente saindo do encontro sabendo usar.</h2>
          <p>Workshops práticos, adaptados às ferramentas, dúvidas e situações que já fazem parte da rotina da sua empresa.</p>
          <a className="button button-light" href={sitePath("treinamentos/")}>Conhecer os treinamentos <ArrowRight /></a>
        </Reveal>
        <div className="training-teaser-visual" aria-hidden="true">
          <img src={asset("assets/art/training/teacher.webp")} alt="" loading="lazy" />
          <span>IA no dia a dia</span>
          <span>Automações úteis</span>
          <span>Conteúdo sob medida</span>
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section id="sobre" className="founder-section section-shell">
      <Reveal className="founder-signature">
        <span className="founder-kicker">Quem conduz os projetos</span>
        <div className="founder-portrait">
          <img
            className="founder-paper-portrait"
            src={asset("assets/brand/bruno-founder-paper-composite-v6.webp")}
            alt="Retrato de Bruno, fundador da BruLabs"
            width="1254"
            height="1254"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="founder-name" aria-label="Bruno, fundador da BruLabs">
          <strong>Bruno</strong>
          <span>fundador da<br />BruLabs</span>
        </div>
      </Reveal>
      <Reveal className="founder-copy">
        <h2>Você traz o conhecimento da área. Eu conduzo o caminho técnico.</h2>
        <p>Sou engenheiro e criei a BruLabs para investigar o contexto, definir prioridades e implementar soluções com profissionais e empresas que conhecem o problema por dentro.</p>
        <p className="founder-principle">Engenharia para entender. Negócios para priorizar. Tecnologia para transformar.</p>
        <div className="credentials"><span>Engenharia · UFRGS</span><span>Especialização em IA</span><span>MBA · USP/Esalq</span><span>Lean Six Sigma</span></div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta section-shell">
      <div className="final-columns" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <img key={index} src={asset("assets/art/decor/greek-column.webp")} alt="" loading="lazy" />
        ))}
      </div>
      <Reveal className="final-copy"><h2>Tem um conhecimento ou serviço para transformar em solução — ou um processo que precisa funcionar melhor?</h2><p>Você não precisa saber qual tecnologia usar. Comece contando o que está acontecendo.</p><a className="button" href={tallyUrl({ page: "home", cta: "final" })}>Conte seu desafio</a><small>Analisamos cada solicitação e retornamos em até 5 dias corridos.</small></Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /><div><a href={sitePath("privacidade/")}>Privacidade</a></div><span>© 2026 BruLabs</span></footer>
  );
}

export function App() {
  return (
    <div className="site-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <EntryPaths />
        <CaseStudy />
        <Solutions />
        <Founder />
        <Method />
        <TrainingTeaser />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
