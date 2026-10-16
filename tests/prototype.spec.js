import { test, expect } from "@playwright/test";
const nav = (p, name) =>
  p.getByRole("navigation").getByRole("button", { name, exact: true });
test("dashboard threshold, grayscale override and persistence", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hai, Andi!" })).toBeVisible();
  await page.screenshot({ path: "artifacts/dashboard.png", fullPage: true });
  await page
    .getByRole("button", { name: "Simulasi tambah 100 scroll" })
    .click();
  await expect(page.getByTestId("phone")).toHaveClass(/grayscale-mode/);
  await expect(
    page.getByRole("switch", { name: "Brain Rot Guard Grayscale Mode" }),
  ).toBeChecked();
  await page.screenshot({ path: "artifacts/grayscale.png", fullPage: true });
  await page.reload();
  await expect(page.getByTestId("phone")).toHaveClass(/grayscale-mode/);
  await page
    .getByRole("switch", { name: "Brain Rot Guard Grayscale Mode" })
    .click();
  await expect(page.getByTestId("phone")).not.toHaveClass(/grayscale-mode/);
  await page.getByRole("button", { name: "Notifikasi", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("focus timer, pause, reset, custom duration, monitor and logs", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start Focus Session" }).click();
  await expect(page.getByRole("button", { name: "Pause Focus" })).toBeVisible();
  await expect(page.getByTestId("timer")).not.toHaveText("25:00", {
    timeout: 5000,
  });
  await page.getByRole("button", { name: "Pause Focus" }).click();
  const paused = await page.getByTestId("timer").textContent();
  await page.waitForTimeout(1100);
  await expect(page.getByTestId("timer")).toHaveText(paused);
  await page.getByRole("button", { name: "Reset timer" }).click();
  await expect(page.getByTestId("timer")).toHaveText("25:00");
  await page.getByRole("button", { name: "15 min", exact: true }).click();
  await expect(page.getByTestId("timer")).toHaveText("15:00");
  await page.getByRole("button", { name: "45 min", exact: true }).click();
  await expect(page.getByTestId("timer")).toHaveText("45:00");
  await page.getByRole("spinbutton").fill("1");
  await expect(page.getByTestId("timer")).toHaveText("01:00");
  await page
    .getByRole("switch", { name: "Pantau TikTok", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Pantau TikTok", exact: true }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Hapus", exact: true }).click();
  await expect(
    page.getByText("Belum ada aktivitas. Guard siap memantau."),
  ).toBeVisible();
  await page.screenshot({ path: "artifacts/focus.png", fullPage: true });
  // Browser clock verifies completion without waiting a full Pomodoro.
  await page.clock.install();
  await page.getByRole("button", { name: "Start Focus", exact: true }).click();
  await page.clock.fastForward(61000);
  await expect(page.getByTestId("timer")).toHaveText("00:00");
  await nav(page, "Rewards").click();
  await expect(page.getByTestId("points")).toContainText("345");
});
test("missions claims are one-time, unlock rewards and badge dialogs", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Missions").click();
  await page.getByRole("checkbox").uncheck();
  await expect(
    page.getByRole("button", { name: "Target belum tercapai" }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Klaim reward" }).first().click();
  await page.getByRole("button", { name: "Klaim reward" }).first().click();
  await expect(
    page.getByRole("button", { name: "Reward diklaim" }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "Klaim reward" }).click();
  await expect(
    page.getByRole("button", { name: "Reward diklaim" }),
  ).toHaveCount(3);
  await nav(page, "Rewards").click();
  await expect(page.getByTestId("points")).toContainText("545");
  await page.getByRole("button", { name: "Sen 980 scrolls" }).click();
  await expect(
    page.getByRole("button", { name: "Sen 980 scrolls" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Zen Mode 7d Locked" }).click();
  await expect(page.getByRole("dialog")).toContainText("Capai streak 7 hari");
  await page.getByRole("button", { name: "Mengerti" }).click();
  await page.screenshot({ path: "artifacts/rewards.png", fullPage: true });
  await page.reload();
  await nav(page, "Rewards").click();
  await expect(page.getByTestId("points")).toContainText("545");
});
test("settings, app validation, whitelist, limit trigger and reset", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Profile").click();
  const slider = page.getByRole("slider");
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("100");
  await expect(page.getByTestId("phone")).toHaveClass(/grayscale-mode/);
  await page.getByRole("button", { name: "Tambah budget 15 menit" }).click();
  await expect(page.getByText("4h 15m", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Kurangi budget 15 menit" }).click();
  await page
    .getByRole("button", { name: "Tambah aplikasi", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Isi nama");
  await page
    .getByRole("textbox", { name: "Nama aplikasi baru" })
    .fill("TikTok");
  await page
    .getByRole("button", { name: "Tambah aplikasi", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("sudah ada");
  await page
    .getByRole("textbox", { name: "Nama aplikasi baru" })
    .fill("Reddit");
  await page
    .getByRole("button", { name: "Tambah aplikasi", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Perlindungan Reddit" }),
  ).toBeChecked();
  await page.getByRole("switch", { name: "Perlindungan Reddit" }).click();
  await expect(
    page.getByRole("switch", { name: "Perlindungan Reddit" }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Hapus Reddit" }).click();
  await expect(page.getByRole("button", { name: "Hapus Reddit" })).toHaveCount(
    0,
  );
  await page.screenshot({ path: "artifacts/profile.png", fullPage: true });
  await page.getByRole("button", { name: "Reset data simulasi" }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(slider).toHaveValue("100");
  await page.getByRole("button", { name: "Reset data simulasi" }).click();
  await page.getByRole("button", { name: "Reset sekarang" }).click();
  await expect(slider).toHaveValue("500");
  await expect(page.getByTestId("phone")).not.toHaveClass(/grayscale-mode/);
});
test("small mobile viewport has persistent navigation and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  for (const label of [
    "Dashboard",
    "Focus",
    "Missions",
    "Rewards",
    "Profile",
  ]) {
    await nav(page, label).click();
    await expect(nav(page, label)).toBeInViewport();
    const dims = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      content: document.querySelector("main").scrollWidth,
      width: document.querySelector("main").clientWidth,
    }));
    expect(dims.document).toBeLessThanOrEqual(dims.viewport);
    expect(dims.content).toBeLessThanOrEqual(dims.width);
  }
  await nav(page, "Dashboard").click();
  await page.screenshot({ path: "artifacts/mobile-320.png", fullPage: true });
});
