/**
 * generate-migrate.js — builds the "Migration: From Vercel to Cloud-Native
 * Deployment" PDF.
 *
 * Parses ./migrate.md generically via `marked` (headings up to h3,
 * paragraphs, ordered/unordered lists, tables, fenced ASCII-diagram code
 * blocks, inline bold/code) — same approach as ../progress/generate-progress.js.
 * Source text is sanitized once up front: arrows/box-drawing characters
 * (used in the ASCII diagrams) are transliterated to ASCII, and decorative
 * emoji are stripped, since pdfkit's base-14 fonts can't render either.
 * Same FAITH brand palette and cover-page style as the other generators.
 *
 * Run:  node generate-migrate.js   (from this folder)
 * Out:  Faith-PWA-Migration.pdf
 */

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const PDFDocument = require("pdfkit");

const ROOT = path.join(__dirname, "..", "..");
const MD_PATH = path.join(__dirname, "migrate.md");
const ABOUT_TS_PATH = path.join(ROOT, "constants", "about.ts");

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

function readAppVersion() {
  const src = fs.readFileSync(ABOUT_TS_PATH, "utf8");
  const match = src.match(/APP_VERSION\s*=\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// pdfkit's base-14 Helvetica/Courier fonts only support WinAnsi-encoded
// characters. Arrows and box-drawing glyphs (used in this doc's ASCII flow
// diagram) fall outside that and render as garbage. Em/en dashes are in
// WinAnsi and render fine, so only these need transliterating.
const UNSAFE_CHARS = {
  "→": "->",
  "►": ">",
  "▼": "v",
  "▲": "^",
  "◄": "<",
  "│": "|",
  "├": "+",
  "└": "`",
  "┌": "+",
  "┐": "+",
  "┘": "+",
  "┴": "+",
  "┬": "+",
  "┼": "+",
  "─": "-",
};

// Decorative emoji (checklist ✅/⛔, headings with rocket/emoji icons, etc.)
// have no ASCII fallback worth drawing and pdfkit's base fonts can't render
// them anyway — strip them rather than transliterate.
const EMOJI_RANGE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;

// Applied once to the raw source, before marked ever tokenizes it, so every
// render path (headings, paragraphs, list items, table cells, code blocks)
// is automatically clean — no need to remember to sanitize each one
// individually. Character-for-character where possible (preserves column
// alignment in the ASCII diagrams); whitespace collapsing happens later in
// normalizeWs, on flattened inline text only, so code-block alignment here
// is left untouched.
function sanitizeSource(text) {
  return text.replace(/[→►▼▲◄│├└┌┐┘┴┬┼─]/g, (ch) => UNSAFE_CHARS[ch]).replace(EMOJI_RANGE, "");
}

/* ============================ Document setup ============================ */

const OUT = path.join(__dirname, "Faith-PWA-Migration.pdf");

const doc = new PDFDocument({
  size: "A4",
  bufferPages: true,
  margins: { top: 70, bottom: 78, left: 64, right: 64 },
  info: {
    Title: "Migration: From Vercel to Cloud-Native Deployment",
    Author: "FAITH Workspace Platform",
    Subject: "Deployment architecture migration",
  },
});
doc.pipe(fs.createWriteStream(OUT));

const PAGE_W = doc.page.width;
const PAGE_H = doc.page.height;
const ML = doc.page.margins.left;
const MR = doc.page.margins.right;
const CONTENT_W = PAGE_W - ML - MR;
const bottomLimit = () => PAGE_H - doc.page.margins.bottom;

const FOOTER_TITLE = "FAITH PWA — Vercel to Cloud-Native Migration";

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
  gap(10);
  doc.font("Helvetica-Bold").fontSize(17).fillColor(C.ink).text(text, ML, doc.y, { width: CONTENT_W });
  const y = doc.y + 5;
  doc.save().moveTo(ML, y).lineTo(ML + 48, y).lineWidth(3).strokeColor(C.primary).stroke().restore();
  gap(16);
}

function subTitle(text) {
  ensure(40);
  gap(8);
  doc.font("Helvetica-Bold").fontSize(12.5).fillColor(C.primaryDark).text(text, ML, doc.y, { width: CONTENT_W });
  gap(6);
}

function subSubTitle(text) {
  ensure(32);
  gap(4);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(C.ink).text(text, ML, doc.y, { width: CONTENT_W });
  gap(6);
}

/* ============================ Inline rendering ============================ */
function flattenInline(tokens, style = "normal") {
  const out = [];
  for (const tok of tokens || []) {
    switch (tok.type) {
      case "strong":
        out.push(...flattenInline(tok.tokens, "bold"));
        break;
      case "em":
        out.push(...flattenInline(tok.tokens, "italic"));
        break;
      case "codespan":
        out.push({ text: tok.text, style: "code" });
        break;
      case "link":
        out.push(...flattenInline(tok.tokens, "link"));
        break;
      case "br":
        out.push({ text: "\n", style });
        break;
      case "text":
        if (tok.tokens && tok.tokens.length) {
          out.push(...flattenInline(tok.tokens, style));
        } else {
          out.push({ text: normalizeWs(tok.text), style });
        }
        break;
      default:
        if (tok.text) out.push({ text: normalizeWs(tok.text), style });
    }
  }
  return out;
}

// Source markdown wraps long lines for readability; marked's block lexer
// preserves those embedded newlines verbatim instead of collapsing them (that
// only happens in marked's own HTML renderer, which this script bypasses).
// Left as-is they'd butt words together with no space. Collapsing to single
// spaces also mops up any double-spaces left behind by emoji removal
// (sanitizeSource runs before this, on plain text this is always safe since
// alignment only matters inside code blocks, which never pass through here).
function normalizeWs(s) {
  return s.replace(/\s+/g, " ");
}

function flattenToPlainText(tokens) {
  return flattenInline(tokens).map((c) => c.text).join("");
}

function chunkStyle(chunk, baseColor, baseSize) {
  switch (chunk.style) {
    case "bold":
      return { font: "Helvetica-Bold", color: baseColor, size: baseSize };
    case "italic":
      return { font: "Helvetica-Oblique", color: baseColor, size: baseSize };
    case "code":
      return { font: "Courier", color: C.primaryDark, size: baseSize - 0.5 };
    case "link":
      return { font: "Helvetica-Bold", color: C.primary, size: baseSize, underline: true };
    default:
      return { font: "Helvetica", color: baseColor, size: baseSize };
  }
}

function drawInline(tokens, x, y, width, opts = {}) {
  const size = opts.size || 10.5;
  const color = opts.color || C.ink;
  const flat = flattenInline(tokens);
  if (flat.length === 0) return;
  doc.x = x;
  doc.y = y;
  flat.forEach((chunk, idx) => {
    const s = chunkStyle(chunk, color, size);
    doc.font(s.font).fontSize(s.size).fillColor(s.color);
    const textOpts = { continued: idx < flat.length - 1, lineGap: opts.lineGap ?? 2.5 };
    if (idx === 0) textOpts.width = width;
    if (s.underline) textOpts.underline = true;
    doc.text(chunk.text, textOpts);
  });
}

/* ============================ Block renderers ============================ */

function paragraph(token, opts = {}) {
  ensure(30);
  drawInline(token.tokens, ML, doc.y, CONTENT_W, {
    size: opts.size || 10.5,
    color: opts.color || C.ink,
    lineGap: 2.5,
  });
  gap(opts.tight ? 4 : 9);
}

function renderList(listToken) {
  const indent = 18;
  listToken.items.forEach((item, idx) => {
    const plain = flattenToPlainText(item.tokens);
    doc.font("Helvetica").fontSize(10.5);
    const h = doc.heightOfString(plain, { width: CONTENT_W - indent, lineGap: 2 });
    ensure(h + 10);
    const startY = doc.y;
    const marker = listToken.ordered ? `${(listToken.start || 1) + idx}.` : "•";
    doc.font("Helvetica-Bold").fontSize(10).fillColor(C.primaryDark).text(marker, ML, startY, {
      width: indent - 4,
      lineBreak: false,
    });
    drawInline(item.tokens, ML + indent, startY, CONTENT_W - indent, { size: 10.5, color: C.ink, lineGap: 2 });
    gap(6);
  });
  gap(3);
}

function renderTable(tableToken) {
  const cols = tableToken.header.length;
  const colWidth = CONTENT_W / cols;
  const cellPad = 8;
  const fontSize = 9.5;

  const rowHeight = (cells) => {
    doc.font("Helvetica").fontSize(fontSize);
    const heights = cells.map((cell) =>
      doc.heightOfString(flattenToPlainText(cell.tokens) || " ", {
        width: colWidth - cellPad * 2,
        lineGap: 1.5,
      }),
    );
    return Math.max(...heights) + 16;
  };

  // Reserve space for the header plus at least the first body row, so the
  // header never gets orphaned alone at the bottom of a page.
  const firstRowH = tableToken.rows[0] ? rowHeight(tableToken.rows[0]) : 0;
  ensure(rowHeight(tableToken.header) + firstRowH + 20);

  const headerH = rowHeight(tableToken.header);
  const y0 = doc.y;
  doc.save().rect(ML, y0, CONTENT_W, headerH).fillColor(C.background).fill().restore();
  tableToken.header.forEach((cell, i) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(fontSize)
      .fillColor(C.ink)
      .text(flattenToPlainText(cell.tokens), ML + i * colWidth + cellPad, y0 + 8, {
        width: colWidth - cellPad * 2,
      });
  });
  doc.y = y0 + headerH;
  doc.save().moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(1).strokeColor(C.primary).stroke().restore();

  tableToken.rows.forEach((row, rowIdx) => {
    const h = rowHeight(row);
    ensure(h + 4);
    const ry = doc.y;
    if (rowIdx % 2 === 1) {
      doc.save().rect(ML, ry, CONTENT_W, h).fillColor(C.background).fillOpacity(0.5).fill().restore();
    }
    row.forEach((cell, i) => {
      drawInline(cell.tokens, ML + i * colWidth + cellPad, ry + 8, colWidth - cellPad * 2, {
        size: fontSize,
        color: C.ink,
        lineGap: 1.5,
      });
    });
    doc.y = ry + h;
    doc.save().moveTo(ML, doc.y).lineTo(ML + CONTENT_W, doc.y).lineWidth(0.5).strokeColor(C.border).stroke().restore();
  });

  doc.x = ML;
  gap(14);
}

function renderCodeBlock(codeToken) {
  const text = codeToken.text;
  const fontSize = 9.5;
  const w = CONTENT_W - 32;
  doc.font("Courier").fontSize(fontSize);
  const h = doc.heightOfString(text, { width: w, lineGap: 3 }) + 24;
  ensure(h + 14);
  const y0 = doc.y;
  doc.save().roundedRect(ML, y0, CONTENT_W, h, 8).fillColor(C.background).fill().restore();
  doc.save().roundedRect(ML, y0, 4, h, 2).fillColor(C.tertiary).fill().restore();
  doc.font("Courier").fontSize(fontSize).fillColor(C.primaryDark).text(text, ML + 16, y0 + 12, {
    width: w,
    lineGap: 3,
  });
  doc.y = y0 + h;
  doc.x = ML;
  gap(14);
}

/* ============================ COVER PAGE ============================ */
function cover(title, tagline, version) {
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

  doc.y = 270;
  doc.font("Helvetica-Bold").fontSize(28).fillColor(C.ink).text(title, ML, doc.y, { width: CONTENT_W });
  gap(10);
  if (tagline) {
    doc.font("Helvetica").fontSize(12.5).fillColor(C.primaryDark).text(tagline, ML, doc.y, {
      width: CONTENT_W,
      lineGap: 3,
    });
  }

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

const md = sanitizeSource(fs.readFileSync(MD_PATH, "utf8"));
const tokens = marked.lexer(md);
const version = readAppVersion();

let title = "Vercel to Cloud-Native Migration";
let tagline = "";
let i = 0;
if (tokens[i]?.type === "heading" && tokens[i].depth === 1) {
  title = tokens[i].text;
  i++;
}
// First section under the title (e.g. "## Overview") — use its paragraphs
// as the cover tagline, then continue rendering from where we left off.
if (tokens[i]?.type === "heading" && tokens[i].depth === 2) {
  i++;
  if (tokens[i]?.type === "paragraph") {
    tagline = flattenToPlainText(tokens[i].tokens);
    i++;
  }
}

cover(title, tagline, version);
doc.addPage();

for (; i < tokens.length; i++) {
  const t = tokens[i];
  switch (t.type) {
    case "heading":
      if (t.depth === 1) sectionTitle(t.text);
      else if (t.depth === 2) subTitle(t.text);
      else subSubTitle(t.text);
      break;
    case "paragraph":
      paragraph(t);
      break;
    case "list":
      renderList(t);
      break;
    case "table":
      renderTable(t);
      break;
    case "code":
      renderCodeBlock(t);
      break;
    default:
      break; // hr, space — no dedicated rendering needed
  }
}

addFooters();

doc.end();
console.log("PDF written to", OUT);
