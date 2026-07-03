/**
 * generate-about.js — builds the "FAITH PWA — About" PDF.
 *
 * Parses ./about.md with `marked`: an intro (title + "What It Is" / "Who
 * It's For"), a "Core Modules" section (one H2 per module — a short
 * tagline paragraph + a longer body paragraph, no bullet lists), and a
 * closing "Platform & Technology" section. Module icons are drawn from the
 * real MaterialCommunityIcons font/glyphmap already installed in the parent
 * app, and colors are FAITH's real brand palette — same approach as
 * generate-faith.js, adapted for prose content instead of "Includes" lists.
 *
 * Run:  node generate-about.js   (from this folder)
 * Out:  Faith-PWA-About.pdf
 */

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const PDFDocument = require("pdfkit");

const ROOT = path.join(__dirname, "..");
const MD_PATH = path.join(__dirname, "about.md");
const ABOUT_TS_PATH = path.join(ROOT, "constants", "about.ts");
const MDI_FONT_PATH = path.join(
  ROOT,
  "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf",
);
const MDI_GLYPHS_PATH = path.join(
  ROOT,
  "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json",
);

/* ---- FAITH brand palette (constants/theme.ts, light scheme) ---- */
const C = {
  primary: "#7C3AEC",
  primaryDark: "#5B21B6",
  primaryLight: "#F1EBFE",
  secondary: "#E1466F",
  tertiary: "#5FA38C",
  ink: "#1A1A1A",
  muted: "#5C5871",
  surface: "#FFFFFF",
  border: "#ECE7F8",
  background: "#F7F5FC",
};

const ACCENTS = [C.primary, C.secondary, C.tertiary];

/* ---- Icon per module — real in-app icons where one exists ---- */
const MODULE_ICONS = {
  "Authentication & Session": "shield-lock-outline",
  "Home Dashboard": "home-variant",
  Attendance: "calendar-check",
  "Leave Management": "calendar-remove",
  Newsflash: "bullhorn-outline",
  "Room Booking": "door-sliding",
  "Staff Profile & Settings": "account-edit-outline",
  "Shared Experience": "palette-swatch-outline",
  "App Layout — Desktop & Installable PWA": "monitor-cellphone",
};

/* ============================ Parse source ============================ */

function readAppVersion() {
  const src = fs.readFileSync(ABOUT_TS_PATH, "utf8");
  const match = src.match(/APP_VERSION\s*=\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// Collects paragraph texts starting at tokens[i] until the next heading/hr.
function collectParagraphs(tokens, i) {
  const paras = [];
  while (i < tokens.length && tokens[i].type !== "heading" && tokens[i].type !== "hr") {
    if (tokens[i].type === "paragraph") paras.push(tokens[i].text);
    i++;
  }
  return { paras, next: i };
}

function parseAboutDoc() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const tokens = marked.lexer(md);

  let title = "FAITH PWA";
  const intro = [];
  const modules = [];
  let closing = null;

  let i = 0;
  if (tokens[i]?.type === "heading" && tokens[i].depth === 1) {
    title = tokens[i].text;
    i++;
  }

  // Intro: H2 sections before the "Core Modules" H1.
  while (i < tokens.length && !(tokens[i].type === "heading" && tokens[i].depth === 1)) {
    if (tokens[i].type === "heading" && tokens[i].depth === 2) {
      const sectionTitle = tokens[i].text;
      i++;
      const { paras, next } = collectParagraphs(tokens, i);
      intro.push({ title: sectionTitle, paras });
      i = next;
      continue;
    }
    i++;
  }

  // "Core Modules" H1 marker.
  if (tokens[i]?.type === "heading" && tokens[i].depth === 1) i++;

  // Modules: H2 sections until the next (closing) H1.
  while (i < tokens.length && !(tokens[i].type === "heading" && tokens[i].depth === 1)) {
    if (tokens[i].type === "heading" && tokens[i].depth === 2) {
      const moduleTitle = tokens[i].text;
      i++;
      const { paras, next } = collectParagraphs(tokens, i);
      modules.push({ title: moduleTitle, tagline: paras[0] || "", body: paras.slice(1).join(" ") });
      i = next;
      continue;
    }
    i++;
  }

  // Closing H1 ("Platform & Technology") + its paragraphs.
  if (tokens[i]?.type === "heading" && tokens[i].depth === 1) {
    const closingTitle = tokens[i].text;
    i++;
    const { paras } = collectParagraphs(tokens, i);
    closing = { title: closingTitle, body: paras.join(" ") };
  }

  return { title, intro, modules, closing };
}

/* ============================ Icon support ============================ */

const glyphMap = JSON.parse(fs.readFileSync(MDI_GLYPHS_PATH, "utf8"));

function iconChar(name) {
  const code = glyphMap[name];
  return code ? String.fromCodePoint(code) : "";
}

/* ============================ Document setup ============================ */

const OUT = path.join(__dirname, "Faith-PWA-About.pdf");

const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  margins: { top: 70, bottom: 78, left: 64, right: 64 },
  info: {
    Title: "FAITH PWA — About",
    Author: "FAITH Workspace Platform",
    Subject: "Application overview and feature explanation",
  },
});
doc.registerFont("mdi", MDI_FONT_PATH);
doc.pipe(fs.createWriteStream(OUT));

const PAGE_W = doc.page.width;
const PAGE_H = doc.page.height;
const ML = doc.page.margins.left;
const MR = doc.page.margins.right;
const CONTENT_W = PAGE_W - ML - MR;
const bottomLimit = () => PAGE_H - doc.page.margins.bottom;

const FOOTER_TITLE = "FAITH PWA — About";

function addFooters() {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    if (i === 0) continue; // skip the cover
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;
    const y = PAGE_H - 52;
    doc.save().moveTo(ML, y).lineTo(PAGE_W - MR, y).lineWidth(0.75).strokeColor(C.border).stroke().restore();
    doc.font("Helvetica").fontSize(8).fillColor(C.muted).text(FOOTER_TITLE, ML, y + 8, { lineBreak: false });
    doc.text(`Page ${i}`, ML, y + 8, { width: CONTENT_W, align: "right", lineBreak: false });
  }
}

/* ---- Layout helpers ---- */
function ensure(space) {
  if (doc.y + space > bottomLimit()) doc.addPage();
}

function gap(h) {
  doc.y += h;
}

function sectionTitle(text) {
  ensure(64);
  gap(6);
  doc.font("Helvetica-Bold").fontSize(17).fillColor(C.ink).text(text, ML, doc.y, { width: CONTENT_W });
  const y = doc.y + 5;
  doc.save().moveTo(ML, y).lineTo(ML + 48, y).lineWidth(3).strokeColor(C.primary).stroke().restore();
  gap(16);
}

function subTitle(text) {
  ensure(40);
  gap(4);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(C.primaryDark).text(text, ML, doc.y, { width: CONTENT_W });
  gap(5);
}

function para(text, opts = {}) {
  ensure(30);
  doc.font("Helvetica").fontSize(10.5).fillColor(opts.color || C.ink).text(text, ML, doc.y, {
    width: CONTENT_W,
    align: "left",
    lineGap: 2.5,
  });
  gap(opts.tight ? 4 : 9);
}

function lead(text) {
  ensure(40);
  doc.font("Helvetica").fontSize(11.5).fillColor(C.muted).text(text, ML, doc.y, { width: CONTENT_W, lineGap: 3 });
  gap(12);
}

// pdfkit's fillColor doesn't accept CSS-style 8-digit RGBA hex — use a real
// fillOpacity instead, scoped with save/restore so it doesn't leak into
// later solid-color fills.
function tintedRoundedRect(x, y, w, h, radius, color, opacity) {
  doc.save();
  doc.fillOpacity(opacity);
  doc.roundedRect(x, y, w, h, radius).fillColor(color).fill();
  doc.restore();
}

/* ---- Module card: icon chip + title + tagline + body paragraph ---- */
function moduleCard(mod, accent) {
  const iconName = MODULE_ICONS[mod.title];
  const padX = 20;
  const padY = 18;
  const innerW = CONTENT_W - padX * 2;
  const chipSize = 40;
  const textX0 = ML + padX + chipSize + 14;
  const textW = innerW - chipSize - 14;

  doc.font("Helvetica-Bold").fontSize(13);
  const titleH = doc.heightOfString(mod.title, { width: textW });
  doc.font("Helvetica-Oblique").fontSize(10.5);
  const taglineH = mod.tagline ? doc.heightOfString(mod.tagline, { width: textW, lineGap: 2 }) : 0;

  const headerH = Math.max(chipSize, titleH + 4 + taglineH);

  doc.font("Helvetica").fontSize(10.5);
  const bodyH = mod.body ? doc.heightOfString(mod.body, { width: innerW, lineGap: 2.5 }) : 0;

  const boxH = padY * 2 + headerH + (mod.body ? 10 + bodyH : 0);

  ensure(boxH + 16);
  const y0 = doc.y;

  doc.save().roundedRect(ML, y0, CONTENT_W, boxH, 12).fillColor(C.background).fill().restore();
  doc.save().roundedRect(ML, y0, 4, boxH, 2).fillColor(accent).fill().restore();

  // Icon chip
  const chipX = ML + padX;
  const chipY = y0 + padY;
  tintedRoundedRect(chipX, chipY, chipSize, chipSize, 10, accent, 0.14);
  if (iconName) {
    doc
      .font("mdi")
      .fontSize(22)
      .fillColor(accent)
      .text(iconChar(iconName), chipX, chipY + 9, { width: chipSize, align: "center", lineBreak: false });
  }

  // Title + tagline
  doc.font("Helvetica-Bold").fontSize(13).fillColor(C.ink).text(mod.title, textX0, chipY, { width: textW });
  if (mod.tagline) {
    gap(2);
    doc.font("Helvetica-Oblique").fontSize(10.5).fillColor(accent).text(mod.tagline, textX0, doc.y, {
      width: textW,
      lineGap: 2,
    });
  }

  // Body paragraph, full card width, below the header row
  if (mod.body) {
    doc.y = y0 + padY + headerH + 10;
    doc.x = ML;
    doc.font("Helvetica").fontSize(10.5).fillColor(C.ink).text(mod.body, ML + padX, doc.y, {
      width: innerW,
      lineGap: 2.5,
    });
  }

  doc.y = y0 + boxH;
  doc.x = ML;
  gap(16);
}

/* ============================ COVER PAGE ============================ */
function cover(data, version) {
  doc.save().rect(0, 0, PAGE_W, 220).fillColor(C.primaryLight).fill().restore();
  doc.save().rect(0, 0, PAGE_W, 10).fillColor(C.primary).fill().restore();

  const wy = 96;
  doc.font("Helvetica-Bold").fontSize(30).fillColor(C.primaryDark).text("FAITH", ML, wy, { width: CONTENT_W });
  const dy = wy + 44;
  ACCENTS.forEach((col, i) => {
    doc.save().circle(ML + 6 + i * 18, dy, 5).fillColor(col).fill().restore();
  });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(C.muted)
    .text("Workspace Platform · Progressive Web App", ML + 72, dy - 6, { width: CONTENT_W - 72 });

  doc.y = 300;
  doc.font("Helvetica-Bold").fontSize(34).fillColor(C.ink).text(data.title, ML, doc.y, { width: CONTENT_W });
  gap(6);
  doc.font("Helvetica").fontSize(13).fillColor(C.primaryDark).text("About the Application", ML, doc.y, {
    width: CONTENT_W,
  });

  const my = PAGE_H - 150;
  doc.save().moveTo(ML, my - 22).lineTo(ML + 70, my - 22).lineWidth(2).strokeColor(C.primary).stroke().restore();
  const metaRow = (label, value, y) => {
    doc.font("Helvetica").fontSize(9).fillColor(C.muted).text(label.toUpperCase(), ML, y, { characterSpacing: 1 });
    doc.font("Helvetica-Bold").fontSize(12).fillColor(C.ink).text(value, ML, y + 12);
  };
  metaRow("Version", version ? `v${version}` : "—", my);
  metaRow("Platform", "Progressive Web App (PWA)", my + 44);

  doc.save().rect(0, PAGE_H - 10, PAGE_W, 10).fillColor(C.primary).fill().restore();
}

/* ============================ Build ============================ */

const data = parseAboutDoc();
const version = readAppVersion();

cover(data, version);
doc.addPage();

sectionTitle("Overview");
data.intro.forEach((section, idx) => {
  if (idx > 0) subTitle(section.title);
  section.paras.forEach((p, pi) => (idx === 0 && pi === 0 ? lead(p) : para(p)));
});

sectionTitle("Core Modules");
data.modules.forEach((mod, idx) => {
  moduleCard(mod, ACCENTS[idx % ACCENTS.length]);
});

if (data.closing) {
  sectionTitle(data.closing.title);
  lead(data.closing.body);
}

addFooters();

doc.end();
console.log("PDF written to", OUT);
