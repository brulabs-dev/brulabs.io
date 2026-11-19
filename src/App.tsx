import { useEffect, useRef, useState } from "react";
import { ArrowClockwise, ArrowRight, ArrowUpRight, CalendarBlank, Check, Checks, InstagramLogo, LinkedinLogo, Package, Pause, Play, Plus, WhatsappLogo, X } from "@phosphor-icons/react";
import { tallyUrl } from "./tally";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

// Optional media, picked up by file name when present:
//   src/assets/footer/{mesa,caneca,cadeira}.{png,webp} the office pieces in the footer landscape
const footerFiles = import.meta.glob<string>("./assets/footer/*.{png,webp}", { eager: true, query: "?url", import: "default" });
const findMedia = (files: Record<string, string>, name: string) => {
  const key = Object.keys(files).find((path) => path.split("/").pop()?.split(".")[0] === name);
  return key ? files[key] : undefined;
};
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

// Small seeded generator so the board has the same shape on every load.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One colour per agent cursor: earthy tones chosen to sit next to the brand orange, cream and ink.
const AGENT_COLORS = ["#e9652e", "#9c3b3b", "#d9a441", "#6b7b4b", "#1d211f", "#3d6670"];
const POINTER_SHAPE = "M0 0 L0 17 L4.6 13 L7.6 20 L10.4 18.8 L7.5 12 L13.5 12 Z";

type BoardCell = { x: number; y: number; state: 0 | 1 | 2; since: number; taken: boolean };
type BoardAgent = { x: number; y: number; target: BoardCell | null; clickAt: number; pressedAt: number; enterAt: number; leftSide: boolean };

// A board of small pending tasks. It sits still until the visitor moves over it;
// then agent cursors come in from the edges and clear tasks alongside the visitor.
function TaskBoard({ counterRef }: { counterRef: React.RefObject<HTMLParagraphElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const random = seeded(41);
    const pointerShape = new Path2D(POINTER_SHAPE);

    let cells: BoardCell[] = [];
    let agents: BoardAgent[] = [];
    let tile = 40;
    let pitch = 44;
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let active = false;
    let refilling = false;
    let lastRefill = 0;
    let lastTime = 0;
    let frame = 0;
    let onScreen = true;
    let byAgents = 0;
    let byVisitor = 0;

    const report = () => {
      const counter = counterRef.current;
      if (!counter) return;
      const total = byAgents + byVisitor;
      counter.textContent = total === 0
        ? (canHover ? "Passe o mouse no quadro" : "Toque numa tarefa")
        : `${byAgents} tarefas feitas por agentes · ${byVisitor} por você`;
    };

    const build = () => {
      const box = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const narrow = width < 700;
      tile = narrow ? 30 : 40;
      pitch = tile + 4;
      const columns = Math.floor((width + 4) / pitch);
      const rows = Math.floor((height + 4) / pitch);
      const offsetX = (width - (columns * pitch - 4)) / 2;
      const copy = host.querySelector<HTMLElement>(".hero-copy");
      const copyBottom = copy ? copy.getBoundingClientRect().bottom - box.top : height * 0.5;
      const shape = seeded(17);
      let drift = 0;
      cells = [];
      for (let column = 0; column < columns; column += 1) {
        const t = columns > 1 ? column / (columns - 1) : 0;
        drift = (drift + (shape() - 0.5) * 0.14) * 0.82;
        let level: number;
        if (narrow) {
          level = Math.floor((height - copyBottom - 22) / pitch) - Math.floor(shape() * 2.4);
        } else {
          const left = 0.17 * Math.pow(Math.max(0, 1 - t / 0.5), 1.1);
          const right = 0.96 * Math.pow(Math.max(0, (t - 0.44) / 0.56), 0.9);
          level = Math.min(rows - 2, Math.round((Math.max(left, right) + drift) * rows));
        }
        for (let depth = 0; depth < level && depth < rows; depth += 1) {
          if (level - depth <= 2 && shape() > 0.62) continue;
          const state = shape() > 0.1 ? 1 : 0;
          cells.push({ x: offsetX + column * pitch, y: height - (depth + 1) * pitch, state, since: -9999, taken: false });
        }
      }
      const count = narrow ? 3 : AGENT_COLORS.length;
      const entries = [
        { x: -40, y: height * 0.55 }, { x: width + 40, y: height * 0.3 }, { x: -40, y: height * 0.86 },
        { x: width + 40, y: height * 0.75 }, { x: width * 0.22, y: height + 40 }, { x: width * 0.85, y: -40 },
      ];
      if (canHover) entries[0] = { x: width * 0.74, y: height * 0.6 };
      // On wide screens two agents keep to the left half, so the strip under the text is not left alone.
      agents = entries.slice(0, count).map((entry, index) => ({ ...entry, target: null, clickAt: 0, pressedAt: -9999, enterAt: index * 1100, leftSide: !narrow && (index === 2 || index === 4) }));
    };

    const complete = (cell: BoardCell, time: number, visitor: boolean) => {
      cell.state = 2;
      cell.since = time;
      cell.taken = false;
      if (visitor) byVisitor += 1; else byAgents += 1;
      report();
    };

    const cellAt = (x: number, y: number) => cells.find((cell) => x >= cell.x && x <= cell.x + tile && y >= cell.y && y <= cell.y + tile);

    const pickTarget = (agent: BoardAgent) => {
      const free = cells.filter((cell) => cell.state === 1 && !cell.taken);
      const half = width * 0.5;
      const own = free.filter((cell) => (cell.x < half) === agent.leftSide);
      const open = own.length > 0 ? own : free;
      if (open.length === 0) return null;
      open.sort((first, second) => Math.hypot(first.x - agent.x, first.y - agent.y) - Math.hypot(second.x - agent.x, second.y - agent.y));
      const choice = open[Math.floor(random() * Math.min(7, open.length))];
      choice.taken = true;
      return choice;
    };

    let startedAt = 0;
    const update = (time: number, delta: number) => {
      for (const cell of cells) {
        if (cell.state === 2 && time - cell.since > 2400) { cell.state = 0; cell.since = time; }
      }
      if (!active) return;
      const pending = cells.reduce((sum, cell) => sum + (cell.state === 1 ? 1 : 0), 0);
      if (pending < cells.length * 0.3) refilling = true;
      if (pending > cells.length * 0.86) refilling = false;
      if (refilling && time - lastRefill > 60) {
        lastRefill = time;
        const empty = cells.filter((cell) => cell.state === 0);
        const next = empty[Math.floor(random() * empty.length)];
        if (next) { next.state = 1; next.since = time; }
      }
      for (const agent of agents) {
        if (time - startedAt < agent.enterAt) continue;
        if (!agent.target || agent.target.state !== 1) {
          if (agent.target) agent.target.taken = false;
          agent.target = pickTarget(agent);
          agent.clickAt = 0;
        }
        if (!agent.target) continue;
        const goalX = agent.target.x + tile * 0.42;
        const goalY = agent.target.y + tile * 0.4;
        const distance = Math.hypot(goalX - agent.x, goalY - agent.y);
        if (distance > 2.5) {
          const step = Math.min(distance, Math.min(760, 140 + distance * 5.5) * delta);
          agent.x += ((goalX - agent.x) / distance) * step;
          agent.y += ((goalY - agent.y) / distance) * step;
        } else if (agent.clickAt === 0) {
          agent.clickAt = time + 130 + random() * 300;
        } else if (time >= agent.clickAt) {
          agent.pressedAt = time;
          complete(agent.target, time, false);
          agent.target = null;
        }
      }
    };

    const roundedTile = (x: number, y: number, size: number) => {
      context.beginPath();
      context.roundRect(x, y, size, size, size * 0.16);
      context.fill();
    };

    const drawPointer = (x: number, y: number, color: string, pressed: number) => {
      const scale = (tile / 40) * (1.25 - 0.18 * pressed);
      if (pressed > 0) {
        context.strokeStyle = color;
        context.globalAlpha = pressed * 0.7;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, 6 + (1 - pressed) * 22, 0, Math.PI * 2);
        context.stroke();
        context.globalAlpha = 1;
      }
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.shadowColor = "rgb(29 33 31 / 30%)";
      context.shadowBlur = 8;
      context.shadowOffsetY = 3;
      context.fillStyle = color;
      context.fill(pointerShape);
      context.shadowColor = "transparent";
      context.lineJoin = "round";
      context.lineWidth = 1.5;
      context.strokeStyle = "#fffaf0";
      context.stroke(pointerShape);
      context.restore();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const hovered = pointer ? cellAt(pointer.x, pointer.y) : undefined;
      for (const cell of cells) {
        const age = time - cell.since;
        if (cell.state === 0) {
          context.fillStyle = "rgb(29 33 31 / 9%)";
          roundedTile(cell.x + tile * 0.4, cell.y + tile * 0.4, tile * 0.2);
          continue;
        }
        const grow = reduced ? 1 : Math.min(1, age / 220);
        const size = tile * (0.55 + 0.45 * (1 - Math.pow(1 - grow, 3)));
        const inset = (tile - size) / 2;
        if (cell.state === 1) {
          context.fillStyle = cell === hovered ? "#474e49" : "#1d211f";
          roundedTile(cell.x + inset, cell.y + inset, size);
          continue;
        }
        context.globalAlpha = Math.max(0, Math.min(1, (2400 - age) / 400));
        context.fillStyle = "#e9652e";
        roundedTile(cell.x + inset, cell.y + inset, size);
        context.strokeStyle = "#fffaf0";
        context.lineWidth = tile * 0.085;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        context.moveTo(cell.x + tile * 0.3, cell.y + tile * 0.52);
        context.lineTo(cell.x + tile * 0.44, cell.y + tile * 0.66);
        context.lineTo(cell.x + tile * 0.71, cell.y + tile * 0.36);
        context.stroke();
        context.globalAlpha = 1;
      }
      if (!active && canHover) {
        // Before the visitor arrives, one agent waits on the board without doing anything.
        drawPointer(width * 0.74, height * 0.6, AGENT_COLORS[0], 0);
      }
      agents.forEach((agent, index) => {
        if (!active || time - startedAt < agent.enterAt) return;
        const pressed = Math.max(0, 1 - (time - agent.pressedAt) / 260);
        drawPointer(agent.x, agent.y, AGENT_COLORS[index], pressed);
      });
    };

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!onScreen) { lastTime = time; return; }
      const delta = Math.min(0.05, (time - (lastTime || time)) / 1000);
      lastTime = time;
      update(time, delta);
      draw(time);
    };

    const activate = () => {
      if (active || reduced) return;
      active = true;
      startedAt = performance.now();
    };

    const position = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const onMove = (event: PointerEvent) => {
      pointer = position(event);
      if (event.pointerType === "mouse") activate();
      if (reduced) draw(performance.now());
    };
    const onLeave = () => { pointer = null; if (reduced) draw(performance.now()); };
    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) return;
      const spot = position(event);
      const cell = cellAt(spot.x, spot.y);
      activate();
      if (cell && cell.state === 1) complete(cell, performance.now(), true);
      if (reduced) draw(performance.now());
    };
    const onResize = () => { build(); draw(performance.now()); };

    build();
    report();
    draw(0);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      // Touch screens have no hover, so the agents start once the board is in view.
      if (!canHover && entry.intersectionRatio > 0.5) activate();
    }, { threshold: [0, 0.5] });
    visibility.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    if (!reduced) frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [counterRef]);

  return <canvas className="task-board" ref={canvasRef} aria-hidden="true" />;
}

function Hero() {
  const counterRef = useRef<HTMLParagraphElement>(null);

  return (
    <section className="hero section-shell" id="topo" aria-labelledby="hero-title">
      <div className="hero-scene">
        <TaskBoard counterRef={counterRef} />
        <div className="hero-copy">
          <h1 id="hero-title">
            Agentes de IA para empresas. <em>Feitos sob medida.</em>
          </h1>
          <p>
            A BruLabs é uma startup de software de Florianópolis. Construímos agentes que assumem tarefas repetitivas da operação, ligados às ferramentas que a empresa já usa.
          </p>
          <div className="hero-actions">
            <a className="button" href="#contato">Falar com a BruLabs <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
            <a className="hero-link" href="#agentes">Ver um agente trabalhando <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <p className="hero-count" ref={counterRef} aria-hidden="true" />
      </div>
    </section>
  );
}

// The agent scene is drawn on a fixed stage and played as a function of time, in seconds:
// a voice message becomes two tasks, the agent books one in the old system and a person confirms the other.
const SCENE = { width: 1200, height: 600, first: 0.45, ask: 7.95, press: 11, close: 11.18, still: 14, end: 15.8 };
const TILE = 38;
const BARS = 11;
const barHeights = (() => {
  const random = seeded(7);
  return Array.from({ length: BARS * 2 }, () => 0.28 + random() * 0.72);
})();

type Box = { x: number; y: number; w: number; h: number };

// Eased interpolation through timed keyframes [time, ...values]; holds the first and last values outside their range.
function track(time: number, keys: number[][]) {
  let index = 0;
  while (index < keys.length - 2 && time >= keys[index + 1][0]) index += 1;
  const from = keys[index];
  const to = keys[index + 1];
  const progress = span(time, from[0], to[0]);
  return from.slice(1).map((value, at) => mix(value, to[at + 1], progress));
}

function OldTitle({ label }: { label: string }) {
  return (
    <div className="old-title">
      {label}
      <span>
        <i><svg viewBox="0 0 9 9"><path d="M0 7h6v2H0z" /></svg></i>
        <i><svg viewBox="0 0 9 9"><path fillRule="evenodd" d="M0 0h9v9H0zM1 2v6h7V2z" /></svg></i>
        <i><svg viewBox="0 0 9 9"><path d="M0 0h2l2.5 3L7 0h2L5.5 4.5 9 9H7L4.5 6 2 9H0l3.5-4.5z" /></svg></i>
      </span>
    </div>
  );
}

// A product of our own, shown as a silent recording next to the illustrative scene.
function RealCase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heldRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  // The recording plays only while it is on screen, so the file is not fetched before the visitor gets there.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visibility = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (!heldRef.current) video.play().catch(() => undefined);
    }, { threshold: 0.4 });
    visibility.observe(video);
    return () => visibility.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    heldRef.current = !video.paused;
    if (video.paused) video.play().catch(() => undefined); else video.pause();
  };

  return (
    <article className="real-case">
      <figure>
        <video
          ref={videoRef}
          src={asset("assets/case/mpn/whatsapp.mp4")}
          poster={asset("assets/case/mpn/whatsapp.webp")}
          width={720}
          height={1280}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label="Gravação: uma pessoa fotografa o prato, envia no WhatsApp e recebe a análise da refeição."
        />
        <button type="button" onClick={toggle} aria-label={playing ? "Pausar o vídeo" : "Reproduzir o vídeo"}>
          {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
        </button>
      </figure>
      <div>
        <span>Caso real</span>
        <h3>Manda Pra Nutri</h3>
        <p>A pessoa fotografa o prato e manda no WhatsApp. O agente identifica os alimentos, estima calorias e macros e guarda tudo no histórico que a nutricionista acompanha.</p>
        <a className="text-link" href="https://mandapranutri.com.br/" target="_blank" rel="noreferrer">Ver o produto <ArrowUpRight size={16} weight="bold" aria-hidden="true" /></a>
        <small>Gravação real, com a espera pela resposta cortada.</small>
      </div>
    </article>
  );
}

function AgentDemo() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ time: SCENE.first, paused: false, visitor: false, declined: false, dirty: false });
  const [paused, setPaused] = useState(false);
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const state = stateRef.current;
    const find = (selector: string) => scene.querySelector<HTMLElement>(selector) as HTMLElement;
    const world = find(".scene-world");
    const audio = find(".chat-audio");
    const reply = find(".chat-reply");
    const desktop = find(".old-desktop");
    const agenda = find(".agenda");
    const stock = find(".stock");
    const dialog = find(".old-dialog");
    const yes = find("[data-answer='yes']");
    const no = find("[data-answer='no']");
    const quantity = find(".stock-quantity");
    const level = find(".stock-level b");
    const agent = find(".scene-cursor.is-agent");
    const human = find(".scene-cursor.is-human");
    const tiles = Array.from(scene.querySelectorAll<HTMLElement>(".scene-tile"), (tile) => ({
      tile,
      bars: Array.from(tile.querySelectorAll<HTMLElement>("i")),
      marks: Array.from(tile.querySelectorAll<SVGElement>("svg")),
    }));

    let view = { w: 1, h: 1 };
    let wave: Box = { x: 0, y: 0, w: 0, h: 0 };
    let targets: Box[] = [];
    let camera: number[][] = [];
    let agentPath: number[][] = [];
    let humanPath: number[][] = [];

    // Positions are measured on the untransformed stage, so the layout lives in the CSS alone.
    const build = () => {
      for (const element of [world, audio, reply, desktop]) element.style.transform = "";
      const origin = world.getBoundingClientRect();
      const box = (selector: string): Box => {
        const rect = find(selector).getBoundingClientRect();
        return { x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height };
      };
      view = { w: scene.clientWidth, h: scene.clientHeight };
      const aspect = view.w / view.h;
      const narrow = aspect < 1.3;
      // A shot is [centre x, centre y, width]: the stage area the camera frames.
      const shot = (target: Box, pad: number, min = 0) => [target.x + target.w / 2, target.y + target.h / 2, Math.max(min, target.w + pad * 2, (target.h + pad * 2) * aspect)];
      const tip = (target: Box, dx: number, dy: number) => [target.x + target.w / 2 + dx, target.y + target.h / 2 + dy];
      const monitor = box(".monitor");
      const answer = box("[data-answer='yes']");
      const ask = box(".old-dialog");
      wave = box(".chat-wave");
      targets = [box(".agenda-grid .is-target"), box(".stock-item")];

      const all = [SCENE.width / 2, SCENE.height / 2, Math.max(SCENE.width, SCENE.height * aspect)];
      const close = shot(box(".chat-audio"), 40, narrow ? 300 : 460);
      if (still) {
        const whole = narrow ? shot(monitor, 14) : all;
        camera = [[0, ...whole], [1, ...whole]];
      } else if (narrow) {
        const device = box(".phone");
        const answered = box(".chat-reply");
        const phone = shot(device, 20);
        const first = shot(box(".agenda"), 24);
        const second = shot(box(".stock"), 20);
        const last = [device.x + device.w / 2, answered.y + answered.h / 2, 300];
        camera = [[0.9, ...phone], [2.4, ...close], [4.1, ...close], [5.3, ...first], [6.6, ...first], [7.6, ...second], [12, ...second], [13, ...last]];
      } else {
        camera = [[0.9, ...all], [2.4, ...close], [4.1, ...close], [5.3, ...all]];
      }

      const enter = [monitor.x + monitor.w + 50, monitor.y + monitor.h * 0.6];
      const onCell = tip(targets[0], 6, 8);
      const onItem = tip(targets[1], 6, 8);
      const aside = [ask.x - 30, ask.y + 96];
      agentPath = [[5.2, ...enter], [6.2, ...onCell], [6.7, ...onCell], [7.7, ...onItem], [8.05, ...onItem], [8.6, ...aside], [11.35, ...aside], [12.2, ...enter]];
      const below = [answer.x + answer.w / 2 + 70, monitor.y + monitor.h + 90];
      const onYes = tip(answer, 16, 6);
      humanPath = [[9.8, ...below], [10.75, ...onYes], [11.3, ...onYes], [12.1, ...below]];
    };

    const pointer = (element: HTMLElement, time: number, path: number[][], presses: number[], shown: boolean) => {
      const [x, y] = track(time, path);
      const since = presses.map((press) => time - press).find((age) => age > -0.09 && age < 0.4);
      const down = since !== undefined && since < 0.16;
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${down ? 0.84 : 1})`;
      element.style.opacity = shown ? "1" : "0";
      const ring = element.firstElementChild as HTMLElement;
      const age = since !== undefined && since >= 0 ? since / 0.4 : 1;
      ring.style.transform = `scale(${(0.3 + age * 1.1).toFixed(3)})`;
      ring.style.opacity = ((1 - age) * 0.8).toFixed(3);
    };

    const render = (time: number) => {
      const { visitor, declined } = state;
      const [cx, cy, width] = track(time, camera);
      const scale = view.w / width;
      world.style.transform = `translate(${(view.w / 2 - cx * scale).toFixed(2)}px, ${(view.h / 2 - cy * scale).toFixed(2)}px) scale(${scale.toFixed(4)})`;
      world.style.opacity = Math.min(span(time, 0, 0.35), 1 - span(time, SCENE.end - 0.4, SCENE.end)).toFixed(3);

      // Phone: the voice message arrives and plays; the answer comes at the end.
      const arrived = span(time, 0.8, 1.1);
      audio.style.opacity = arrived.toFixed(3);
      audio.style.transform = `scale(${mix(0.86, 1, arrived).toFixed(3)})`;
      const answered = span(time, 12.9, 13.2);
      reply.style.opacity = answered.toFixed(3);
      reply.style.transform = `translateY(${mix(10, 0, answered).toFixed(1)}px)`;
      reply.classList.toggle("is-partial", declined);

      // Old system: the monitor switches on, the stock window comes forward, the dialog waits for an answer.
      const on = span(time, 4.2, 4.8);
      desktop.style.transform = `scaleY(${mix(0.006, 1, on).toFixed(4)})`;
      desktop.style.opacity = on > 0 ? "1" : "0";
      desktop.style.filter = on < 1 ? `brightness(${mix(2.6, 1, on).toFixed(2)})` : "";
      agenda.classList.toggle("is-active", time < 7.2);
      stock.classList.toggle("is-active", time >= 7.2);
      dialog.style.visibility = time >= SCENE.ask && time < SCENE.close ? "visible" : "hidden";
      yes.classList.toggle("is-pressed", time >= SCENE.press && !declined);
      no.classList.toggle("is-pressed", time >= SCENE.press && declined);
      const left = declined ? 48 : Math.round(mix(48, 38, span(time, SCENE.close + 0.05, SCENE.close + 0.7)));
      quantity.textContent = String(left);
      level.style.width = `${(left / 60) * 100}%`;

      // The voice message bars close up into two tiles, which fly to the day and to the stock item.
      const formed = span(time, 3, 4);
      tiles.forEach(({ tile, bars, marks: [icon, check] }, index) => {
        const target = targets[index];
        const flight = span(time, 4.4 + index * 0.25, 5.5 + index * 0.25);
        const half = wave.w / 2;
        const x = mix(mix(wave.x + index * half, wave.x + half + (index === 0 ? -TILE - 5 : 5), formed), target.x + (target.w - TILE) / 2, flight);
        const lift = Math.sin(flight * Math.PI);
        const y = mix(mix(wave.y, wave.y + (wave.h - TILE) / 2, formed), target.y + (target.h - TILE) / 2, flight) - lift * 70;
        const doneAt = index === 0 ? 6.35 : SCENE.close;
        const refused = index === 1 && declined;
        const done = time >= doneAt && !refused;
        const pop = done ? 1 + 0.22 * (1 - span(time, doneAt, doneAt + 0.3)) : 1;
        tile.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(pop * (1 + lift * 0.18)).toFixed(3)})`;
        tile.style.width = `${mix(half, TILE, formed).toFixed(1)}px`;
        tile.style.height = `${mix(wave.h, TILE, formed).toFixed(1)}px`;
        tile.style.borderRadius = `${(formed * 7).toFixed(1)}px`;
        const solid = (formed ** 3).toFixed(3);
        tile.style.background = done ? "#e9652e" : `rgb(29 33 31 / ${solid})`;
        tile.style.boxShadow = `0 0 0 2px rgb(255 250 240 / ${solid}), 0 ${(lift * 14).toFixed(1)}px ${(lift * 20).toFixed(1)}px rgb(0 0 0 / ${(lift * 0.35).toFixed(3)})`;
        tile.style.opacity = (arrived * (refused ? 1 - span(time, SCENE.close, SCENE.close + 0.4) : 1)).toFixed(3);
        icon.style.opacity = done ? "0" : span(time, 3.7, 4.05).toFixed(3);
        check.style.opacity = done ? "1" : "0";
        bars.forEach((bar, at) => {
          const order = index * BARS + at;
          const beat = time > 1.2 && time < 3 ? 1 + 0.16 * Math.sin(time * 11 + order * 1.9) : 1;
          bar.style.left = `${((at + mix(0.25, 0, formed)) / BARS) * 100}%`;
          bar.style.width = `${(mix(0.5, 1.05, formed) / BARS) * 100}%`;
          bar.style.height = `${mix(Math.min(1, barHeights[order] * beat), 1, formed) * 100}%`;
          bar.style.background = (time - 1.2) / 1.8 > order / (BARS * 2) ? "#1d211f" : "#b9b3a6";
          bar.style.opacity = (1 - span(time, 3.7, 4)).toFixed(3);
        });
      });

      pointer(agent, time, agentPath, [6.35, 7.85], time > 5.2 && time < 12.2);
      pointer(human, time, humanPath, [SCENE.press], !visitor && time > 9.8 && time < 12.1);
    };

    const onResize = () => { build(); render(state.time); };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(scene);
    if (still) {
      state.time = SCENE.still;
      onResize();
      return () => resizeObserver.disconnect();
    }

    let frame = 0;
    let last = 0;
    let onScreen = false;
    let started = false;
    onResize();
    // The scene starts the first time a good part of it is on screen, and waits while it is off screen.
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (entry.intersectionRatio >= 0.35) started = true;
    }, { threshold: [0, 0.35] });
    visibility.observe(scene);
    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const delta = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (!onScreen) return;
      if (started && !state.paused) {
        state.time += delta;
        if (state.time >= SCENE.end) Object.assign(state, { time: 0, visitor: false, declined: false });
      } else if (!state.dirty) return;
      state.dirty = false;
      render(state.time);
    };
    frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); resizeObserver.disconnect(); visibility.disconnect(); };
  }, [still]);

  // The visitor may answer the dialog; if nobody does, the "Humano" cursor answers yes.
  const answer = (accepted: boolean) => {
    const state = stateRef.current;
    if (state.time < SCENE.ask || state.time >= SCENE.press) return;
    Object.assign(state, { time: SCENE.press, visitor: true, declined: !accepted, dirty: true });
  };
  const replay = () => {
    Object.assign(stateRef.current, { time: 0, visitor: false, declined: false, paused: false, dirty: true });
    setPaused(false);
  };
  const togglePause = () => {
    stateRef.current.paused = !paused;
    setPaused(!paused);
  };

  return (
    <section className="demo section-shell" id="agentes" aria-labelledby="demo-title">
      <div className="section-heading">
        <span>O que é um agente</span>
        <h2 id="demo-title">Um software que assume uma tarefa do começo ao fim.</h2>
        <p>Ele trabalha nas ferramentas que a empresa já tem. Aqui, o áudio de um cliente vira horário na agenda e baixa no estoque de um sistema antigo. Nas ações importantes, quem decide é você.</p>
      </div>
      <div className="demo-panel">
        <div className="scene" ref={sceneRef} role="img" aria-label="Animação: o áudio de um cliente vira um horário na agenda e uma baixa no estoque de um sistema antigo. Uma pessoa confirma a baixa.">
          <div className="scene-world">
            <div className="phone">
              <div className="phone-screen">
                <div className="chat-head"><i /><b /></div>
                <div className="chat-body">
                  <div className="chat-bubble chat-old"><b /><b /></div>
                  <div className="chat-bubble chat-audio">
                    <span className="chat-play"><Play size={16} weight="fill" /></span>
                    <span className="chat-wave">{barHeights.map((height, index) => <i key={index} style={{ height: `${height * 100}%` }} />)}</span>
                  </div>
                  <div className="chat-bubble chat-reply">
                    <span><CalendarBlank size={24} weight="fill" /><Check size={18} weight="bold" /></span>
                    <span><Package size={24} weight="fill" /><Check size={18} weight="bold" /></span>
                    <Checks size={17} weight="bold" />
                  </div>
                </div>
                <div className="chat-input"><b /><i /></div>
              </div>
            </div>
            <div className="monitor">
              <div className="monitor-glass">
                <div className="old-desktop">
                  <div className="old-window agenda">
                    <OldTitle label="Agenda" />
                    <div className="agenda-days">{[..."STQQSSD"].map((day, index) => <span key={index}>{day}</span>)}</div>
                    <div className="agenda-grid">
                      {Array.from({ length: 28 }, (_, index) => <i key={index} className={index === 10 ? "is-target" : [2, 8, 15, 19, 23].includes(index) ? "is-busy" : undefined} />)}
                    </div>
                  </div>
                  <div className="old-window stock">
                    <OldTitle label="Estoque" />
                    <div className="stock-list">
                      {[48, 54, 9, 31].map((amount) => (
                        <div className="stock-row" key={amount}>
                          <i className="stock-item" />
                          <b className="stock-name" />
                          <span className="stock-level"><b style={{ width: `${(amount / 60) * 100}%` }} /></span>
                          <span className="stock-quantity">{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="old-window old-dialog is-active">
                    <OldTitle label="Estoque" />
                    <div className="old-dialog-body">
                      <svg viewBox="0 0 16 16"><path d="M8 1.2 15.3 14.6H.7z" fill="#ffd500" stroke="#000" strokeLinejoin="round" /><path d="M7.2 5.6h1.6v4.6H7.2zm0 5.6h1.6v1.6H7.2z" /></svg>
                      <Package size={32} weight="fill" />
                      −10
                    </div>
                    <div className="old-dialog-actions">
                      <div className="old-button is-default" data-answer="yes" onClick={() => answer(true)}>Sim</div>
                      <div className="old-button" data-answer="no" onClick={() => answer(false)}>Não</div>
                    </div>
                  </div>
                  <div className="old-taskbar">
                    <span className="old-button"><i />Iniciar</span>
                    <span>08:12</span>
                  </div>
                </div>
              </div>
            </div>
            {[CalendarBlank, Package].map((Icon, index) => (
              <div className="scene-tile" key={index}>
                {Array.from({ length: BARS }, (_, bar) => <i key={bar} />)}
                <Icon size={22} weight="fill" />
                <Check size={22} weight="bold" />
              </div>
            ))}
            <span className="scene-cursor is-agent">
              <i />
              <svg viewBox="-2 -2 18 24"><path d={POINTER_SHAPE} fill={AGENT_COLORS[0]} stroke="#fffaf0" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            </span>
            <span className="scene-cursor is-human">
              <i />
              <svg viewBox="-2 -2 18 24"><path d={POINTER_SHAPE} fill="#1d211f" stroke="#fffaf0" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <b>Humano</b>
            </span>
          </div>
        </div>
        <div className="demo-foot">
          <span>Exemplo ilustrativo</span>
          {!still && (
            <div>
              <button type="button" onClick={togglePause} aria-label={paused ? "Continuar a animação" : "Pausar a animação"}>
                {paused ? <Play size={16} weight="fill" aria-hidden="true" /> : <Pause size={16} weight="fill" aria-hidden="true" />}
              </button>
              <button type="button" onClick={replay}><ArrowClockwise size={16} weight="bold" aria-hidden="true" /> Repetir</button>
            </div>
          )}
        </div>
      </div>
      <RealCase />
      <p className="demo-note">E quando um agente não é a resposta, a gente avisa.</p>
    </section>
  );
}

const steps = [
  {
    title: "Escolha da tarefa",
    description: "Começamos por uma tarefa só, repetitiva e bem definida.",
    detail: "Uma boa primeira tarefa se repete toda semana, segue regras claras e hoje toma tempo de alguém.",
  },
  {
    title: "Agente sob medida",
    description: "Construímos ligado às ferramentas que a empresa já usa.",
    detail: "O agente trabalha dentro do que já existe: e-mail, WhatsApp, planilhas e o sistema de gestão. Ninguém troca de ferramenta.",
  },
  {
    title: "Teste com a equipe",
    description: "Com casos reais, antes de entrar na rotina.",
    detail: "Quem faz a tarefa hoje acompanha o agente em casos reais e aponta onde ele erra. Só depois ele entra na rotina.",
  },
  {
    title: "Ajuste em uso",
    description: "Acompanhamos e corrigimos conforme o agente trabalha.",
    detail: "Tarefas mudam. Seguimos acompanhando o agente em operação e ajustamos quando a regra muda.",
  },
];
// Text colour that reads on each agent colour, in the same order as AGENT_COLORS.
const AGENT_TEXT = ["#1d211f", "#f6efdf", "#1d211f", "#f6efdf", "#f6efdf", "#f6efdf"];

function Method() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="method section-shell" id="metodo" aria-labelledby="method-title">
      <div className="section-heading">
        <span>Como trabalhamos</span>
        <h2 id="method-title">Uma tarefa de cada vez.</h2>
        <p>Clique num cartão para ver mais.</p>
      </div>
      <ol className="method-steps">
        {steps.map((step, index) => {
          const isFlipped = flipped === index;
          return (
            <li key={step.title} className={isFlipped ? "is-flipped" : undefined}>
              <div className="card-inner">
                <div className="card-face card-front" inert={isFlipped} onClick={() => setFlipped(index)}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="method-agent" aria-hidden="true">
                    <svg viewBox="-2 -2 18 24"><path d={POINTER_SHAPE} fill={AGENT_COLORS[index]} stroke="#fffaf0" strokeWidth="1" strokeLinejoin="round" /></svg>
                  </div>
                  <button type="button" className="card-toggle" aria-label={`Ver mais sobre: ${step.title}`}><Plus size={20} weight="bold" aria-hidden="true" /></button>
                </div>
                <div
                  className="card-face card-back"
                  inert={!isFlipped}
                  style={{ background: AGENT_COLORS[index], color: AGENT_TEXT[index] }}
                  onClick={(event) => { if (!(event.target as HTMLElement).closest("a")) setFlipped(null); }}
                >
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                  <a className="text-link" href="#contato">Falar sobre uma tarefa <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>
                  <button type="button" className="card-toggle" aria-label="Voltar o cartão"><X size={20} weight="bold" aria-hidden="true" /></button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function About() {
  return (
    <section className="about section-shell" id="sobre" aria-labelledby="about-title">
      <div className="about-note">
        <img src={asset("assets/brand/bruno-founder.webp")} alt="Bruno, da BruLabs" width={1099} height={1431} loading="lazy" />
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

type Wave = [amplitude: number, cycles: number, phase: number];
type Hill = { color: string; seconds: number; base: number; waves: Wave[] };

// Height of a hill at x, in the 1440 x 360 space the landscape is drawn in.
const hillHeight = (hill: Hill, x: number) =>
  hill.waves.reduce((sum, [amplitude, cycles, phase]) => sum + amplitude * Math.sin((x / 1440) * Math.PI * 2 * cycles + phase), hill.base);

// One period of rolling hills, drawn twice so the layer can loop sideways without a seam.
function hillPath(hill: Hill) {
  const points: string[] = [];
  for (let x = 0; x <= 2880; x += 24) points.push(`${x},${hillHeight(hill, x).toFixed(1)}`);
  return `M0,360 L${points.join(" L")} L2880,360 Z`;
}

const hills: Hill[] = [
  { color: "#f7b48f", seconds: 150, base: 150, waves: [[34, 1, 0.4], [14, 3, 1.9]] },
  { color: "#f07740", seconds: 110, base: 196, waves: [[40, 2, 2.2], [12, 5, 0.3]] },
  { color: "#c94e1c", seconds: 80, base: 246, waves: [[30, 1, 3.4], [16, 4, 1.1]] },
  { color: "#a92f1a", seconds: 56, base: 296, waves: [[22, 3, 0.9], [9, 7, 2.6]] },
];

// The office scene is laid out in the units of the source drawing (1440 x 987).
const OFFICE = { width: 1440, height: 987 };
const MUG = { width: 103, height: 92, home: { x: 394, y: 326 }, floor: { x: 640, y: 890 } };
const CHAIR = { width: 658, left: 693, away: 90, tucked: -50, grab: { x: 250, y: 520 } };
const TIDY_SECONDS = 10.5;
// How much faster than the timeline below the scene actually plays.
const TIDY_SPEED = 1.7;
const ease = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const span = (time: number, from: number, to: number) => ease((time - from) / (to - from));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

// Drifting hills, and an office in the corner that one cursor tidies when the visitor arrives.
function Landscape() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pieces = { desk: findMedia(footerFiles, "mesa"), mug: findMedia(footerFiles, "caneca"), chair: findMedia(footerFiles, "cadeira") };
  const hasOffice = Boolean(pieces.desk && pieces.mug && pieces.chair);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const layers = Array.from(scene.querySelectorAll<SVGPathElement>(".hills path"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const office = scene.querySelector<HTMLElement>(".office");
    const mug = scene.querySelector<HTMLElement>(".office-mug");
    const chair = scene.querySelector<HTMLElement>(".office-chair");
    const hand = scene.querySelector<HTMLElement>(".office-hand");
    let frame = 0;
    let onScreen = true;
    let startedAt: number | null = null;

    // One cursor tidies up, once: mug from the floor to the desk, then the chair pushed in.
    // t is seconds since the visitor reached the footer; from TIDY_SECONDS on the office stays tidy and the cursor is gone.
    const tidy = (t: number) => {
      if (!office || !mug || !chair || !hand) return;
      const unit = office.clientWidth / OFFICE.width;
      const mugHome = { x: MUG.home.x + MUG.width / 2, y: MUG.home.y + MUG.height / 2 };
      const mugFloor = { x: MUG.floor.x + MUG.width / 2, y: MUG.floor.y + MUG.height / 2 };
      const carry = span(t, 2.3, 4.3);
      const chairShift = mix(CHAIR.away, CHAIR.tucked, span(t, 6.5, 8.5));
      const mugAt = { x: mix(mugFloor.x, mugHome.x, carry), y: mix(mugFloor.y, mugHome.y, carry) - Math.sin(carry * Math.PI) * 130 };
      const mugTurn = mix(-90, 0, span(t, 2.3, 3.6));
      mug.style.transform = `translate(${((mugAt.x - mugHome.x) * unit).toFixed(1)}px, ${((mugAt.y - mugHome.y) * unit).toFixed(1)}px) rotate(${mugTurn.toFixed(1)}deg)`;
      chair.style.transform = `translateX(${(chairShift * unit).toFixed(1)}px)`;

      // The cursor waits just past the left edge of the landscape and leaves past the right one.
      const margin = 60 / unit;
      const enter = { x: -office.offsetLeft / unit - margin, y: 560 };
      const leave = { x: ((office.offsetParent?.clientWidth ?? 0) - office.offsetLeft) / unit + margin, y: 240 };
      const chairGrab = { x: CHAIR.left + CHAIR.grab.x, y: CHAIR.grab.y };
      let at = enter;
      if (t < 2.3) { const go = span(t, 0.1, 2.1); at = { x: mix(enter.x, mugFloor.x, go), y: mix(enter.y, mugFloor.y, go) }; }
      else if (t < 4.6) at = mugAt;
      else if (t < 6.5) { const go = span(t, 4.6, 6.2); at = { x: mix(mugHome.x, chairGrab.x + CHAIR.away, go), y: mix(mugHome.y, chairGrab.y, go) }; }
      else if (t < 8.5) at = { x: chairGrab.x + chairShift, y: chairGrab.y };
      else { const go = span(t, 8.6, 10.4); at = { x: mix(chairGrab.x + CHAIR.tucked, leave.x, go), y: mix(chairGrab.y, leave.y, go) }; }
      const holding = (t > 2 && t < 4.5) || (t > 6.2 && t < 8.7);
      hand.style.transform = `translate(${(at.x * unit).toFixed(1)}px, ${(at.y * unit).toFixed(1)}px) scale(${holding ? 0.84 : 1})`;
      hand.style.visibility = "visible";
    };

    const drift = (seconds: number) => {
      layers.forEach((layer, index) => { layer.style.transform = `translateX(${-(((seconds / hills[index].seconds) * 1440) % 1440)}px)`; });
    };

    if (reduced) {
      drift(24);
      tidy(TIDY_SECONDS);
      const onResize = () => tidy(TIDY_SECONDS);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    tidy(0);
    const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; });
    visibility.observe(scene);
    // The tidy-up starts the first time most of the office is on screen, and never replays.
    const arrival = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      arrival.disconnect();
      startedAt = performance.now();
    }, { threshold: 0.6 });
    if (office) arrival.observe(office);
    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!onScreen) return;
      drift(time / 1000 + 24);
      tidy(startedAt === null ? 0 : Math.min(TIDY_SECONDS, ((time - startedAt) / 1000) * TIDY_SPEED));
    };
    frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); visibility.disconnect(); arrival.disconnect(); };
  }, []);

  return (
    <div className="landscape" ref={sceneRef} aria-hidden="true">
      <svg className="hills" viewBox="0 0 1440 360" preserveAspectRatio="none">
        <defs>
          <filter id="hill-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 .96  0 0 0 0 .88  0 0 0 .5 -.12" />
            <feComposite operator="in" in2="SourceGraphic" />
            <feBlend in2="SourceGraphic" mode="soft-light" />
          </filter>
        </defs>
        <g filter="url(#hill-grain)">
          {hills.map((hill) => <path key={hill.color} d={hillPath(hill)} fill={hill.color} />)}
        </g>
      </svg>
      {hasOffice && (
        <div className="office">
          <img className="office-desk" src={pieces.desk} alt="" />
          <img className="office-chair" src={pieces.chair} alt="" />
          <img className="office-mug" src={pieces.mug} alt="" />
          <span className="office-hand">
            <svg viewBox="-2 -2 18 24"><path d={POINTER_SHAPE} fill={AGENT_COLORS[0]} stroke="#fffaf0" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          </span>
        </div>
      )}
      <div className="ground" />
    </div>
  );
}

function Closing() {
  return (
    <footer className="closing" id="contato" aria-labelledby="contact-title">
      <div className="section-shell closing-inner">
        <h2 id="contact-title">Que tarefa você passaria para um agente?</h2>
        <div className="contact-actions">
          <a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">
            <WhatsappLogo size={20} weight="fill" aria-hidden="true" /> Chamar no WhatsApp
          </a>
          <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <div className="closing-meta">
          <a href="#topo"><img src={asset("assets/brand/logo-principal.png")} alt="BruLabs" /></a>
          <div>
            <span>Florianópolis, SC</span>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><InstagramLogo size={18} weight="fill" aria-hidden="true" /> Instagram</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><LinkedinLogo size={18} weight="fill" aria-hidden="true" /> LinkedIn</a>
            <a href={tallyUrl({ page: "home", cta: "contato" })}>Formulário</a>
            <a href={asset("privacidade/")}>Privacidade</a>
          </div>
          <span>© 2026 BruLabs</span>
        </div>
      </div>
      <Landscape />
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
      </main>
      <Closing />
    </div>
  );
}
