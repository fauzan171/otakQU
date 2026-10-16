import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, within, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/main.jsx";
const nav = (name) =>
  within(screen.getByRole("navigation")).getByRole("button", {
    name,
    exact: true,
  });
test("threshold triggers grayscale, manual override and reload preserves data", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  expect(screen.getByTestId("phone")).not.toHaveClass("grayscale-mode");
  await user.click(
    screen.getByRole("button", { name: "Simulasi tambah 100 scroll" }),
  );
  expect(screen.getByTestId("phone")).toHaveClass("grayscale-mode");
  expect(
    screen.getByRole("switch", { name: "Brain Rot Guard Grayscale Mode" }),
  ).toBeChecked();
  view.unmount();
  render(<App />);
  expect(screen.getByTestId("phone")).toHaveClass("grayscale-mode");
  await user.click(
    screen.getByRole("switch", { name: "Brain Rot Guard Grayscale Mode" }),
  );
  expect(screen.getByTestId("phone")).not.toHaveClass("grayscale-mode");
  await user.click(
    screen.getByRole("button", { name: "Notifikasi", exact: true }),
  );
  expect(screen.getByRole("dialog")).toBeVisible();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
test("timer counts down, pauses, resumes, resets and awards completion once", () => {
  vi.useFakeTimers();
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Start Focus Session" }));
  expect(screen.getByTestId("timer")).toHaveTextContent("25:00");
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByTestId("timer")).toHaveTextContent("24:58");
  fireEvent.click(screen.getByRole("button", { name: "Pause Focus" }));
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByTestId("timer")).toHaveTextContent("24:58");
  fireEvent.click(screen.getByRole("button", { name: "Lanjutkan Fokus" }));
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByTestId("timer")).toHaveTextContent("24:57");
  fireEvent.click(screen.getByRole("button", { name: "Reset timer" }));
  expect(screen.getByTestId("timer")).toHaveTextContent("25:00");
  fireEvent.click(screen.getByRole("button", { name: "15 min" }));
  expect(screen.getByTestId("timer")).toHaveTextContent("15:00");
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "1" } });
  fireEvent.click(
    screen.getByRole("button", { name: "Start Focus", exact: true }),
  );
  fireEvent.click(nav("Dashboard"));
  act(() => vi.advanceTimersByTime(61000));
  fireEvent.click(nav("Rewards"));
  expect(screen.getByTestId("points")).toHaveTextContent("345");
  act(() => vi.advanceTimersByTime(60000));
  expect(screen.getByTestId("points")).toHaveTextContent("345");
});
test("missions validate offline, claim once, unlock third mission and sync points", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(nav("Missions"));
  await user.click(screen.getByRole("checkbox"));
  expect(
    screen.getByRole("button", { name: "Target belum tercapai" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getAllByRole("button", { name: "Klaim reward" })[0]);
  await user.click(screen.getAllByRole("button", { name: "Klaim reward" })[0]);
  expect(
    screen.getAllByRole("button", { name: "Reward diklaim" }),
  ).toHaveLength(2);
  await user.click(screen.getByRole("button", { name: "Klaim reward" }));
  expect(
    screen.getAllByRole("button", { name: "Reward diklaim" }),
  ).toHaveLength(3);
  await user.click(nav("Rewards"));
  expect(screen.getByTestId("points")).toHaveTextContent("545");
  await user.click(screen.getByRole("button", { name: "Sen 980 scrolls" }));
  expect(
    screen.getByRole("button", { name: "Sen 980 scrolls" }),
  ).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "Zen Mode 7d Locked" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("Capai streak 7 hari");
  await user.click(screen.getByRole("button", { name: "Mengerti" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
test("settings validates app addition, whitelist, remove and reset confirmation", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(nav("Profile"));
  await user.click(
    screen.getByRole("button", { name: "Tambah budget 15 menit" }),
  );
  expect(screen.getByText("4h 15m")).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Kurangi budget 15 menit" }),
  );
  expect(screen.getByText("4h")).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Tambah aplikasi", exact: true }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Isi nama");
  await user.type(
    screen.getByRole("textbox", { name: "Nama aplikasi baru" }),
    "TikTok",
  );
  await user.click(
    screen.getByRole("button", { name: "Tambah aplikasi", exact: true }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("sudah ada");
  await user.clear(screen.getByRole("textbox"));
  await user.type(screen.getByRole("textbox"), "Reddit");
  await user.click(
    screen.getByRole("button", { name: "Tambah aplikasi", exact: true }),
  );
  expect(
    screen.getByRole("switch", { name: "Perlindungan Reddit" }),
  ).toBeChecked();
  await user.click(screen.getByRole("switch", { name: "Perlindungan Reddit" }));
  expect(
    screen.getByRole("switch", { name: "Perlindungan Reddit" }),
  ).not.toBeChecked();
  await user.click(screen.getByRole("button", { name: "Hapus Reddit" }));
  expect(
    screen.queryByRole("switch", { name: "Perlindungan Reddit" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider"), { target: { value: "100" } });
  expect(screen.getByTestId("phone")).toHaveClass("grayscale-mode");
  await user.click(screen.getByRole("button", { name: "Reset data simulasi" }));
  await user.click(screen.getByRole("button", { name: "Batal", exact: true }));
  expect(screen.getByRole("slider")).toHaveValue("100");
  await user.click(screen.getByRole("button", { name: "Reset data simulasi" }));
  await user.click(screen.getByRole("button", { name: "Reset sekarang" }));
  expect(screen.getByRole("slider")).toHaveValue("500");
  expect(screen.getByTestId("phone")).not.toHaveClass("grayscale-mode");
});
test("whitelisted TikTok does not intercept scroll and log clear has empty state", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(nav("Focus"));
  await user.click(
    screen.getByRole("switch", { name: "Pantau TikTok", exact: true }),
  );
  await user.click(nav("Dashboard"));
  await user.click(
    screen.getByRole("button", { name: "Simulasi tambah 100 scroll" }),
  );
  expect(screen.getByTestId("phone")).not.toHaveClass("grayscale-mode");
  await user.click(nav("Focus"));
  await user.click(screen.getByRole("button", { name: "Hapus", exact: true }));
  expect(
    screen.getByText("Belum ada aktivitas. Guard siap memantau."),
  ).toBeVisible();
});
