import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/main.jsx";

const rewards = () =>
  within(screen.getByRole("navigation")).getByRole("button", {
    name: "Rewards",
    exact: true,
  });
const offer = (discount) =>
  screen.getByRole("article", { name: `Diskon Rp${discount}` });

test("cancel leaves balance intact; confirmation persists the voucher, coins and stock on reload", async () => {
  const user = userEvent.setup();
  const app = render(<App />);
  await user.click(rewards());
  await user.click(
    screen.getByRole("button", { name: "Voucher saya", exact: true }),
  );
  expect(screen.getByText("Belum ada voucher")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Pilih reward" }));
  await user.click(within(offer("25.000")).getByRole("button"));
  await user.click(screen.getByRole("button", { name: "Batal", exact: true }));
  expect(screen.getByTestId("points")).toHaveTextContent("320");
  await user.click(within(offer("25.000")).getByRole("button"));
  await user.click(
    screen.getByRole("button", { name: "Konfirmasi penukaran" }),
  );
  const dialog = screen.getByRole("dialog", { name: "Voucher Soluusi" });
  const code = within(dialog).getByLabelText("Kode voucher demo").value;
  expect(code).toMatch(/^DEMO-SOLUUSI-/);
  expect(within(dialog).getByRole("link")).toHaveAttribute(
    "href",
    "https://soluusi.com/",
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Salin kode demo" }),
  );
  expect(await navigator.clipboard.readText()).toBe(code);
  await user.click(
    screen.getByRole("button", { name: "Kembali ke voucher saya" }),
  );
  expect(screen.getByTestId("points")).toHaveTextContent("120");
  app.unmount();
  render(<App />);
  await user.click(rewards());
  expect(within(offer("25.000")).getByText("Sisa 9 voucher")).toBeVisible();
  expect(within(offer("25.000")).getByRole("button")).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Voucher saya (1)" }));
  await user.click(screen.getByRole("button", { name: "Lihat voucher" }));
  expect(screen.getByLabelText("Kode voucher demo")).toHaveValue(code);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("partner stock validates, updates catalog immediately and persists without changing coins", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(rewards());
  expect(within(offer("50.000")).getByRole("button")).toBeDisabled();
  expect(within(offer("75.000")).getByText("Stok habis")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Demo partner" }));
  const input = screen.getAllByRole("spinbutton")[0];
  fireEvent.change(input, { target: { value: "-1" } });
  await user.click(
    screen.getByRole("button", { name: "Simpan stok diskon Rp25.000" }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("bilangan bulat");
  await user.clear(input);
  await user.type(input, "0");
  await user.click(
    screen.getByRole("button", { name: "Simpan stok diskon Rp25.000" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Tukar reward", exact: true }),
  );
  expect(within(offer("25.000")).getByText("Stok habis")).toBeVisible();
  expect(within(offer("25.000")).getByRole("button")).toBeDisabled();
  expect(screen.getByTestId("points")).toHaveTextContent("320");
  expect(
    JSON.parse(localStorage.getItem("otakqu-v1")).rewardOffers[0].stock,
  ).toBe(0);
});

test("existing saved progress gains reward fields and reset clears redemptions", async () => {
  localStorage.setItem(
    "otakqu-v1",
    JSON.stringify({ scrolls: 42, points: 800, apps: [] }),
  );
  const user = userEvent.setup();
  render(<App />);
  await user.click(rewards());
  expect(screen.getByTestId("points")).toHaveTextContent("800");
  await user.click(within(offer("25.000")).getByRole("button"));
  await user.click(
    screen.getByRole("button", { name: "Konfirmasi penukaran" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Kembali ke voucher saya" }),
  );
  await user.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "Profile",
      exact: true,
    }),
  );
  await user.click(screen.getByRole("button", { name: "Reset data simulasi" }));
  await user.click(screen.getByRole("button", { name: "Reset sekarang" }));
  await user.click(rewards());
  expect(screen.getByTestId("points")).toHaveTextContent("320");
  expect(within(offer("25.000")).getByText("Sisa 10 voucher")).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Voucher saya", exact: true }),
  );
  expect(screen.getByText("Belum ada voucher")).toBeVisible();
});

test("confirmation traps focus, Escape cancels, and denied clipboard explains manual copying", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(rewards());
  const trigger = within(offer("25.000")).getByRole("button");
  await user.click(trigger);
  await user.tab({ shift: true });
  expect(
    screen.getByRole("button", { name: "Batal", exact: true }),
  ).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Tutup dialog" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  await user.click(
    screen.getByRole("button", { name: "Konfirmasi penukaran" }),
  );
  const write = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockRejectedValueOnce(new Error("Denied"));
  await user.click(screen.getByRole("button", { name: "Salin kode demo" }));
  expect(await screen.findByText(/Kode belum tersalin/)).toBeVisible();
  write.mockRestore();
});
