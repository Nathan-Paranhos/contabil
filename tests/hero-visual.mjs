import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";

const appUrl = process.env.APP_URL ?? "http://127.0.0.1:4174";
const outputDir = path.resolve("test-results", "hero-visual");

await fs.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
await page.goto(appUrl, { waitUntil: "networkidle2" });
await page.waitForSelector(".hero-image-frame");
await page.waitForFunction(() => {
  const image = document.querySelector("[data-hero-image] img");
  const liveCard = document.querySelector("[data-hero-live]");

  if (!image || !liveCard) {
    return false;
  }

  const imageOpacity = Number.parseFloat(getComputedStyle(image).opacity);
  const liveOpacity = Number.parseFloat(getComputedStyle(liveCard).opacity);

  return imageOpacity > 0.9 && liveOpacity > 0.85;
});

await page.waitForFunction(() => {
  const pieceOpacities = [...document.querySelectorAll("[data-hero-piece]")].map((piece) =>
    Number.parseFloat(getComputedStyle(piece).opacity),
  );

  return pieceOpacities.length > 0 && Math.max(...pieceOpacities) < 0.18;
}, { timeout: 7000 });

function overlapArea(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

async function capture(label, scrollY) {
  await page.evaluate((nextScrollY) => {
    window.scrollTo({ top: nextScrollY, behavior: "instant" });
  }, scrollY);
  await page.waitForFunction(
    (nextScrollY) => Math.abs(window.scrollY - nextScrollY) < 2,
    {},
    scrollY,
  );
  await new Promise((resolve) => setTimeout(resolve, 450));

  const state = await page.evaluate(() => {
    const rectOf = (selector) => {
      const element = document.querySelector(selector);

      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        opacity: Number.parseFloat(style.opacity),
        transform: style.transform,
      };
    };

    return {
      copy: rectOf("[data-hero-copy]"),
      image: rectOf(".hero-image-frame"),
      panel: rectOf(".hero-live-card"),
      ticker: rectOf(".ticker-wrap"),
      pieces: [...document.querySelectorAll("[data-hero-piece]")].map((piece) => {
        const style = getComputedStyle(piece);
        const rect = piece.getBoundingClientRect();

        return {
          opacity: Number.parseFloat(style.opacity),
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        };
      }),
    };
  });

  await page.screenshot({
    path: path.join(outputDir, `${label}.png`),
  });

  return state;
}

const top = await capture("top", 0);
const mid = await capture("mid-hero", 650);
const end = await capture("end-hero", 1100);
const returnTop = await capture("return-top", 0);

await browser.close();

assert.ok(top.image, "Hero image frame nao foi encontrada.");
assert.ok(top.panel, "Painel ao vivo nao foi encontrado.");
assert.ok(top.ticker, "Ticker do hero nao foi encontrado.");
assert.ok(top.copy, "Bloco de copy do hero nao foi encontrado.");

const topOverlap = overlapArea(top.image, top.panel);
const topMaxPieceOpacity = Math.max(...top.pieces.map((piece) => piece.opacity));
const midMaxPieceOpacity = Math.max(...mid.pieces.map((piece) => piece.opacity));

assert.ok(top.image.opacity > 0.94, `Imagem do hero ficou opaca demais no topo: ${top.image.opacity}`);
assert.ok(top.panel.opacity > 0.88, `Painel do hero nao ficou visivel o bastante no topo: ${top.panel.opacity}`);
assert.ok(topOverlap < 24, `Painel ainda esta sobreposto na imagem: area=${topOverlap}`);
assert.ok(topMaxPieceOpacity < 0.18, `Pecas do quebra-cabeca nao sumiram apos a montagem: ${topMaxPieceOpacity}`);
assert.ok(midMaxPieceOpacity > 0.28, `Pecas nao reapareceram no scroll do hero: ${midMaxPieceOpacity}`);
assert.ok(end.panel.opacity < 0.62, `Painel deveria estar saindo no fim do hero: ${end.panel.opacity}`);
assert.ok(end.ticker.opacity < 0.72, `Ticker deveria estar saindo no fim do hero: ${end.ticker.opacity}`);
assert.ok(returnTop.copy.opacity > 0.95, `Copy do hero nao voltou ao normal no topo: ${returnTop.copy.opacity}`);
assert.ok(returnTop.image.opacity > 0.94, `Imagem do hero nao voltou ao normal no topo: ${returnTop.image.opacity}`);
assert.ok(returnTop.panel.opacity > 0.88, `Painel do hero nao voltou ao normal no topo: ${returnTop.panel.opacity}`);
assert.ok(returnTop.ticker.opacity > 0.92, `Ticker do hero nao voltou ao normal no topo: ${returnTop.ticker.opacity}`);
assert.ok(
  Math.max(...returnTop.pieces.map((piece) => piece.opacity)) < 0.18,
  "Pecas do hero continuaram visiveis ao voltar para o topo.",
);

console.log("Hero visual OK");
console.log(`Screenshots salvas em ${outputDir}`);
