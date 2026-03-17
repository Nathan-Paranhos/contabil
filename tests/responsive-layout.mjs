import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";

const appUrl = process.env.APP_URL ?? "http://127.0.0.1:4174";
const outputDir = path.resolve("test-results", "responsive-layout");

await fs.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
});

const page = await browser.newPage();

function countColumns(template) {
  return template.trim().split(/\s+/).filter(Boolean).length;
}

async function inspectViewport(label, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(appUrl, { waitUntil: "networkidle2" });
  await page.waitForSelector(".hero-grid");
  await new Promise((resolve) => setTimeout(resolve, 350));

  const state = await page.evaluate(() => {
    const gridColumns = (selector) => {
      const element = document.querySelector(selector);

      return element ? getComputedStyle(element).gridTemplateColumns : "";
    };

    const floating = document.querySelector(".floating-wa");
    const floatingRect = floating?.getBoundingClientRect();

    return {
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heroColumns: gridColumns(".hero-grid"),
      servicesColumns: gridColumns(".services-grid"),
      marketColumns: gridColumns(".market-grid"),
      contactColumns: gridColumns(".contact-grid"),
      floatingRect: floatingRect
        ? {
            left: floatingRect.left,
            right: floatingRect.right,
            width: floatingRect.width,
          }
        : null,
    };
  });

  await page.screenshot({
    path: path.join(outputDir, `${label}.png`),
    fullPage: true,
  });

  return state;
}

const desktop = await inspectViewport("desktop", 1440, 1200);
const tablet = await inspectViewport("tablet", 900, 1280);
const mobile = await inspectViewport("mobile", 390, 844);

await browser.close();

assert.equal(countColumns(desktop.heroColumns), 2, `Hero desktop deveria ter 2 colunas: ${desktop.heroColumns}`);
assert.ok(countColumns(desktop.servicesColumns) >= 2, `Servicos desktop deveria ter ao menos 2 colunas: ${desktop.servicesColumns}`);
assert.ok(countColumns(desktop.marketColumns) >= 2, `Mercado desktop deveria ter ao menos 2 colunas: ${desktop.marketColumns}`);
assert.equal(countColumns(desktop.contactColumns), 2, `Contato desktop deveria ter 2 colunas: ${desktop.contactColumns}`);

assert.equal(countColumns(tablet.heroColumns), 1, `Hero tablet deveria ter 1 coluna: ${tablet.heroColumns}`);
assert.equal(countColumns(tablet.servicesColumns), 2, `Servicos tablet deveria ter 2 colunas: ${tablet.servicesColumns}`);
assert.equal(countColumns(tablet.marketColumns), 2, `Mercado tablet deveria ter 2 colunas: ${tablet.marketColumns}`);
assert.equal(countColumns(tablet.contactColumns), 1, `Contato tablet deveria ter 1 coluna: ${tablet.contactColumns}`);

assert.equal(countColumns(mobile.heroColumns), 1, `Hero mobile deveria ter 1 coluna: ${mobile.heroColumns}`);
assert.equal(countColumns(mobile.servicesColumns), 1, `Servicos mobile deveria ter 1 coluna: ${mobile.servicesColumns}`);
assert.equal(countColumns(mobile.marketColumns), 1, `Mercado mobile deveria ter 1 coluna: ${mobile.marketColumns}`);
assert.equal(countColumns(mobile.contactColumns), 1, `Contato mobile deveria ter 1 coluna: ${mobile.contactColumns}`);
assert.ok(
  mobile.scrollWidth - mobile.viewportWidth <= 2,
  `Layout mobile ainda esta com overflow horizontal: scrollWidth=${mobile.scrollWidth}, viewport=${mobile.viewportWidth}`,
);
assert.ok(mobile.floatingRect, "Botao flutuante do WhatsApp nao foi encontrado.");
assert.ok(mobile.floatingRect.left >= 0, `Botao flutuante saiu da tela pela esquerda: ${mobile.floatingRect.left}`);
assert.ok(
  mobile.floatingRect.right <= mobile.viewportWidth,
  `Botao flutuante saiu da tela pela direita: ${mobile.floatingRect.right}`,
);

console.log("Responsive layout OK");
console.log(`Screenshots salvas em ${outputDir}`);
