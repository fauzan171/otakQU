import { test, expect } from "./fixtures.js";

test.use({ reducedMotion: "reduce" });

test("Soluusi redemption, stock and wallet work across mobile and desktop widths", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Rewards", exact: true })
    .click();
  await page.screenshot({
    path: "artifacts/soluusi-rewards.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tukar diskon Rp25.000" }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.getByTestId("points")).toContainText("320");
  await page.getByRole("button", { name: "Tukar diskon Rp25.000" }).click();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Batal", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Tutup dialog" }),
  ).toBeFocused();
  await page.screenshot({
    path: "artifacts/soluusi-confirmation.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Konfirmasi penukaran" }).click();
  await expect(page.getByLabel("Kode voucher demo")).toHaveValue(
    /^DEMO-SOLUUSI-/,
  );
  await page.screenshot({
    path: "artifacts/soluusi-voucher.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Kembali ke voucher saya" }).click();
  await expect(page.getByTestId("points")).toContainText("120");
  await page.reload();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Rewards", exact: true })
    .click();
  await expect(page.getByText("Sisa 9 voucher", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Demo partner" }).click();
  await page.getByRole("spinbutton").first().fill("0");
  await page
    .getByRole("button", { name: "Simpan stok diskon Rp25.000" })
    .click();
  await expect(page.getByRole("status")).toContainText("disimpan");
  await page.screenshot({
    path: "artifacts/soluusi-partner.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tukar reward", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tukar diskon Rp25.000" }),
  ).toBeDisabled();
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of ["Tukar reward", "Voucher saya (1)", "Demo partner"]) {
      await page.getByRole("button", { name: view, exact: true }).click();
      const overflow = await page
        .locator(".reward-shop")
        .evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(overflow, `${view} at ${width}px`).toBe(false);
    }
    if (width === 320)
      await page.screenshot({
        path: "artifacts/soluusi-mobile-320.png",
        fullPage: true,
      });
  }
  expect(errors).toEqual([]);
});
