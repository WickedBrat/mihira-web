import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const outDir = path.join(root, "assets/playstore/screenshots");
fs.mkdirSync(outDir, { recursive: true });

const logoSvg = fs.readFileSync(path.join(root, "assets/logo.svg"), "utf8");
const logoData = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

const W = 1080;
const H = 1920;

const screens = [
  {
    id: "01-daily-alignment",
    title: "Begin with daily clarity",
    subtitle: "Personalized Vedic alignment for where to place your energy today.",
    eyebrow: "Daily Alignment",
    phoneTitle: "Today",
    feature: "Moon in steady focus",
    metric: "Focus: grounded action",
    cards: ["Protect your attention", "Choose calm conversations", "Move important work before sunset"],
    accent: "#f6c85f",
  },
  {
    id: "02-scripture-guidance",
    title: "Ask deeper questions",
    subtitle: "Receive thoughtful guidance grounded in sacred wisdom and practical reflection.",
    eyebrow: "Guidance",
    phoneTitle: "Ask Mihira",
    feature: "What should I do next?",
    metric: "Wisdom mode: reflective",
    cards: ["Scripture-grounded answer", "Clear interpretation", "Helpful follow-up prompts"],
    accent: "#87c7b6",
  },
  {
    id: "03-sacred-timing",
    title: "Find the right moment",
    subtitle: "Explore auspicious windows for decisions, travel, rituals, and milestones.",
    eyebrow: "Sacred Timing",
    phoneTitle: "Muhurat",
    feature: "Best window",
    metric: "Tomorrow, 9:24 AM - 11:08 AM",
    cards: ["Supportive lunar quality", "Avoid rushed starts", "Good for commitments"],
    accent: "#e0a348",
  },
  {
    id: "04-sacred-days",
    title: "Stay close to tradition",
    subtitle: "Discover sacred days, festivals, meaning, and simple rituals.",
    eyebrow: "Sacred Days",
    phoneTitle: "Upcoming",
    feature: "Ekadashi",
    metric: "Meaning, practice, and reflection",
    cards: ["Festival context", "Suggested rituals", "Cultural rhythm"],
    accent: "#d98570",
  },
  {
    id: "05-profile-plus",
    title: "Your spiritual profile",
    subtitle: "Keep birth details, identity, and Plus access in one calm private space.",
    eyebrow: "Profile",
    phoneTitle: "Profile",
    feature: "Birth Alignment",
    metric: "Personalized to your details",
    cards: ["Moon profile", "Region and language", "Free and Plus options"],
    accent: "#bda0ff",
  },
];

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function wrapText(value, maxChars = 54) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function subtitleLines(value) {
  return wrapText(value, 40)
    .map(
      (line, i) =>
        `<text x="82" y="${454 + i * 50}" fill="#d9cbb0" font-size="38" font-weight="500">${esc(line)}</text>`,
    )
    .join("");
}

function cardRows(items, accent) {
  return items
    .map((item, i) => {
      const y = 570 + i * 120;
      return `
        <g transform="translate(0 ${y})">
          <rect width="648" height="92" rx="28" fill="rgba(255,255,255,0.075)" stroke="rgba(255,255,255,0.12)"/>
          <circle cx="48" cy="46" r="18" fill="${accent}"/>
          <path d="M40 46 l6 7 l16 -18" fill="none" stroke="#251b10" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="88" y="56" fill="#f7edda" font-size="29" font-weight="500">${esc(item)}</text>
        </g>
      `;
    })
    .join("");
}

function makeSvg(screen) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06070a"/>
      <stop offset="0.48" stop-color="#111318"/>
      <stop offset="1" stop-color="#241907"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="20%" r="68%">
      <stop offset="0" stop-color="${screen.accent}" stop-opacity="0.42"/>
      <stop offset="0.35" stop-color="${screen.accent}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${screen.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="phone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#171a20"/>
      <stop offset="1" stop-color="#08090d"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="34" stdDeviation="30" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <circle cx="542" cy="642" r="430" fill="none" stroke="rgba(246,200,95,0.11)" stroke-width="2"/>
  <circle cx="542" cy="642" r="306" fill="none" stroke="rgba(246,200,95,0.12)" stroke-width="2"/>
  <path d="M150 696 C334 534 748 534 930 696" fill="none" stroke="rgba(255,232,154,0.16)" stroke-width="3"/>
  <path d="M212 768 C392 652 690 652 868 768" fill="none" stroke="rgba(255,232,154,0.12)" stroke-width="2"/>

  <g transform="translate(82 104)">
    <image href="${logoData}" x="0" y="0" width="74" height="74"/>
    <text x="94" y="50" fill="#fff4d9" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, Arial, sans-serif" font-size="44" font-weight="700">Mihira</text>
  </g>

  <g font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, Arial, sans-serif">
    <text x="82" y="276" fill="${screen.accent}" font-size="32" font-weight="700" letter-spacing="3">${esc(screen.eyebrow.toUpperCase())}</text>
    <text x="82" y="382" fill="#fff7e8" font-size="72" font-weight="800">${esc(screen.title)}</text>
    ${subtitleLines(screen.subtitle)}
  </g>

  <g transform="translate(140 642)" filter="url(#shadow)">
    <rect width="800" height="1040" rx="92" fill="#030405"/>
    <rect x="28" y="28" width="744" height="984" rx="70" fill="url(#phone)" stroke="rgba(255,255,255,0.1)"/>
    <rect x="330" y="46" width="140" height="18" rx="9" fill="rgba(255,255,255,0.16)"/>

    <g transform="translate(76 96)" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, Arial, sans-serif">
      <text x="0" y="0" fill="#94866d" font-size="26" font-weight="600">MIHIRA</text>
      <text x="0" y="62" fill="#fff7e8" font-size="58" font-weight="800">${esc(screen.phoneTitle)}</text>

      <rect x="0" y="112" width="648" height="292" rx="38" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>
      <circle cx="548" cy="206" r="54" fill="${screen.accent}" opacity="0.92"/>
      <circle cx="548" cy="206" r="86" fill="none" stroke="${screen.accent}" stroke-opacity="0.28" stroke-width="2"/>
      <text x="36" y="184" fill="${screen.accent}" font-size="28" font-weight="700">${esc(screen.eyebrow)}</text>
      <text x="36" y="246" fill="#fff7e8" font-size="48" font-weight="800">${esc(screen.feature)}</text>
      <text x="36" y="306" fill="#d6c5a7" font-size="30" font-weight="500">${esc(screen.metric)}</text>

      <rect x="0" y="440" width="648" height="88" rx="30" fill="rgba(255,255,255,0.055)"/>
      <rect x="28" y="472" width="404" height="18" rx="9" fill="rgba(255,244,217,0.25)"/>
      <rect x="28" y="500" width="280" height="14" rx="7" fill="rgba(255,244,217,0.14)"/>
      <circle cx="594" cy="484" r="22" fill="${screen.accent}"/>

      ${cardRows(screen.cards, screen.accent)}
    </g>
  </g>

  <g transform="translate(82 1740)" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, Arial, sans-serif">
    <rect width="916" height="82" rx="41" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>
    <text x="458" y="53" text-anchor="middle" fill="#fff0cc" font-size="30" font-weight="700">Vedic guidance for daily clarity</text>
  </g>
</svg>`;
}

for (const screen of screens) {
  const svgPath = path.join(outDir, `${screen.id}.svg`);
  const pngPath = path.join(outDir, `${screen.id}.png`);
  fs.writeFileSync(svgPath, makeSvg(screen));

  try {
    execFileSync("sips", ["-s", "format", "png", svgPath, "--out", pngPath], { stdio: "pipe" });
  } catch {
    const quicklookDir = path.join(outDir, ".quicklook");
    fs.mkdirSync(quicklookDir, { recursive: true });
    execFileSync("qlmanage", ["-t", "-s", "1080", "-o", quicklookDir, svgPath], { stdio: "pipe" });
    const generated = path.join(quicklookDir, `${path.basename(svgPath)}.png`);
    fs.copyFileSync(generated, pngPath);
  }
}

console.log(`Generated ${screens.length} screenshots in ${outDir}`);
