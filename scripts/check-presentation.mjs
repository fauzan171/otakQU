import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const output = "/private/tmp/otakqu-presentation-review";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://127.0.0.1:5180/docs/presentation/index.html");
const slideCount = 26;
await expect(page.locator(".slide")).toHaveCount(slideCount);
const issues = [];
for (let i = 0; i < slideCount; i++) {
  await page.locator("#slide-picker").selectOption(String(i));
  const slide = page.locator(".slide.active");
  const result = await slide.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const problems = [];
    if (element.scrollHeight > element.clientHeight + 2)
      problems.push("vertical overflow");
    if (element.scrollWidth > element.clientWidth + 2)
      problems.push("horizontal overflow");
    for (const img of element.querySelectorAll("img")) {
      if (!img.complete || !img.naturalWidth)
        problems.push(`missing image: ${img.alt}`);
    }
    for (const node of element.querySelectorAll(
      "h1,h2,h3,p,li,td,th,figure,footer",
    )) {
      if (!node.getClientRects().length) continue;
      const box = node.getBoundingClientRect();
      if (box.bottom > bounds.bottom + 1 || box.right > bounds.right + 1)
        problems.push(`outside slide: ${node.textContent.slice(0, 60)}`);
    }
    return problems;
  });
  if (result.length) issues.push({ slide: i + 1, problems: result });
  await slide.screenshot({
    path: `${output}/slide-${String(i + 1).padStart(2, "0")}.png`,
  });
}
await page.locator("#slide-picker").selectOption("12");
await page
  .getByRole("button", { name: "Buka activity diagram lengkap dan perbesar" })
  .click();
await expect(page.getByRole("dialog")).toBeVisible();
await page.keyboard.press("Escape");
await expect(page.getByRole("dialog")).not.toBeVisible();
await page.getByRole("button", { name: "Catatan", exact: true }).click();
await expect(page.locator("#notes")).toBeVisible();
await page.keyboard.press("Home");
await expect(page.locator(".slide.active")).toHaveAttribute(
  "data-title",
  "otakQU",
);
await page.keyboard.press("ArrowRight");
await expect(page.locator("#slide-picker")).toHaveValue("1");
await page.keyboard.press("End");
await expect(page.locator("#slide-picker")).toHaveValue(String(slideCount - 1));
await page.pdf({
  path: `${output}/review.pdf`,
  preferCSSPageSize: true,
  printBackground: true,
});

await page.setViewportSize({ width: 390, height: 844 });
await page.reload();
await expect(page.locator("body")).toHaveClass("reading");
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
if (mobileOverflow) issues.push({ mobile: "document horizontal overflow" });
await page.screenshot({ path: `${output}/mobile.png` });

const standalone = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  offline: true,
});
await standalone.goto(
  new URL("../docs/presentation/index.html", import.meta.url).href,
);
const assetsLoaded = await standalone
  .locator(".slide img")
  .evaluateAll((images) =>
    images.every((image) => image.complete && image.naturalWidth > 0),
  );
if (!assetsLoaded) issues.push({ offline: "missing screenshot" });

for (let sheet = 0; sheet < Math.ceil(slideCount / 6); sheet++) {
  let html =
    '<body style="margin:0;background:#ddd;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px">';
  for (let i = sheet * 6 + 1; i <= Math.min(slideCount, sheet * 6 + 6); i++) {
    const png = await readFile(
      `${output}/slide-${String(i).padStart(2, "0")}.png`,
    );
    html += `<img style="width:100%" src="data:image/png;base64,${png.toString("base64")}" alt="Slide ${i}">`;
  }
  await standalone.setViewportSize({ width: 1400, height: 1200 });
  await standalone.setContent(html + "</body>");
  await standalone.screenshot({
    path: `${output}/sheet-${sheet + 1}.png`,
    fullPage: true,
  });
}
await browser.close();
await writeFile(
  `${output}/results.json`,
  JSON.stringify(
    {
      slides: slideCount,
      errors,
      issues,
      offlineScreenshotsLoaded: assetsLoaded,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    slides: slideCount,
    errors,
    issues,
    offlineScreenshotsLoaded: assetsLoaded,
  }),
);
if (errors.length || issues.length) process.exitCode = 1;
