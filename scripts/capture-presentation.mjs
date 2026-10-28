import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const output = new URL("../docs/presentation/assets/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  reducedMotion: "reduce",
});
await page.goto("http://127.0.0.1:5180/");
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.evaluate(() => document.fonts.ready);
const capture = (name) =>
  page
    .locator(".phone")
    .screenshot({ path: new URL(`${name}.png`, output).pathname });
const tab = (name) =>
  page
    .getByRole("navigation")
    .getByRole("button", { name, exact: true })
    .click();
await capture("login");
await page.getByRole("button", { name: "Daftar sekarang" }).click();
await capture("register");
await page.getByLabel("Nama lengkap").fill("Andi Fauzan");
await page.getByLabel("Email atau username").fill("demo@otakqu.test");
await page.getByLabel("Sandi contoh").fill("demo");
await page.getByRole("button", { name: "Buat akun & masuk" }).click();
await capture("dashboard");
await page.getByRole("button", { name: "Simulasi tambah 100 scroll" }).click();
await page
  .getByRole("dialog", { name: "Jeda sebelum lanjut scroll" })
  .waitFor();
await capture("intervention");
await page.keyboard.press("Escape");
await page.evaluate(() => {
  const session = localStorage.getItem("otakqu-demo-session");
  const accounts = localStorage.getItem("otakqu-demo-accounts");
  localStorage.clear();
  localStorage.setItem("otakqu-demo-session", session);
  localStorage.setItem("otakqu-demo-accounts", accounts);
});
await page.reload();
await tab("Focus");
await capture("focus");
await tab("Missions");
await capture("missions");
await tab("Profile");
await capture("profile");
await tab("Rewards");
await capture("rewards");
await page.getByRole("button", { name: "Tukar diskon Rp25.000" }).click();
await capture("confirmation");
await page.getByRole("button", { name: "Konfirmasi penukaran" }).click();
await capture("voucher");
await page.getByRole("button", { name: "Kembali ke voucher saya" }).click();
await capture("wallet");
await page.getByRole("button", { name: "Demo partner" }).click();
await capture("partner");
await browser.close();
console.log("Captured 12 application screens for the HTML presentation.");
