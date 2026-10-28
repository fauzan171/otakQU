import React from "react";
import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/main.jsx";

test("any demo username and password creates an account, restores session, and signs out", async () => {
  localStorage.removeItem("otakqu-demo-session");
  const user = userEvent.setup();
  const app = render(<App />);
  await user.click(screen.getByRole("button", { name: "Masuk", exact: true }));
  expect(screen.getByRole("alert")).toHaveTextContent("Isi email");
  await user.type(screen.getByLabelText("Email atau username"), "bebas.user");
  await user.type(screen.getByLabelText("Sandi contoh"), "anything-demo");
  await user.click(screen.getByRole("button", { name: "Tampilkan sandi" }));
  expect(screen.getByLabelText("Sandi contoh")).toHaveAttribute("type", "text");
  await user.click(screen.getByRole("button", { name: "Masuk", exact: true }));
  expect(screen.getByRole("heading", { name: /Hai, Bebas!/ })).toBeVisible();
  expect(localStorage.getItem("otakqu-demo-session")).not.toContain(
    "anything-demo",
  );
  expect(localStorage.getItem("otakqu-demo-accounts")).not.toContain(
    "anything-demo",
  );
  app.unmount();
  render(<App />);
  expect(screen.getByRole("heading", { name: /Hai, Bebas!/ })).toBeVisible();
  await user.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "Profile",
      exact: true,
    }),
  );
  expect(screen.getByText("bebas.user")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Keluar dari akun" }));
  expect(
    screen.getByRole("heading", { name: "Masuk ke otakQU" }),
  ).toBeVisible();
  expect(localStorage.getItem("otakqu-demo-session")).toBeNull();
});

test("registration enters immediately and existing accounts accept any subsequent demo password", async () => {
  localStorage.removeItem("otakqu-demo-session");
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Daftar sekarang" }));
  await user.click(screen.getByRole("button", { name: "Buat akun & masuk" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Isi nama");
  await user.type(screen.getByLabelText("Nama lengkap"), "Nadia Putri");
  await user.type(
    screen.getByLabelText("Email atau username"),
    "nadia@example.test",
  );
  await user.type(screen.getByLabelText("Sandi contoh"), "first-demo");
  await user.click(screen.getByRole("button", { name: "Buat akun & masuk" }));
  expect(screen.getByRole("heading", { name: /Hai, Nadia!/ })).toBeVisible();
  await user.click(
    within(screen.getByRole("navigation")).getByRole("button", {
      name: "Profile",
      exact: true,
    }),
  );
  expect(screen.getByRole("heading", { name: /Nadia Putri/ })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Keluar dari akun" }));
  await user.type(
    screen.getByLabelText("Email atau username"),
    "NADIA@example.test",
  );
  await user.type(screen.getByLabelText("Sandi contoh"), "different-demo");
  await user.click(screen.getByRole("button", { name: "Masuk", exact: true }));
  expect(screen.getByRole("heading", { name: /Hai, Nadia!/ })).toBeVisible();
  expect(JSON.stringify(localStorage)).not.toContain("first-demo");
  expect(JSON.stringify(localStorage)).not.toContain("different-demo");
});

test("malformed sessions fall back to login and arbitrary identifiers have a safe display name", async () => {
  localStorage.setItem("otakqu-demo-session", "{broken");
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText("Email atau username"), "@example");
  await user.type(screen.getByLabelText("Sandi contoh"), "demo");
  await user.click(screen.getByRole("button", { name: "Masuk", exact: true }));
  expect(screen.getByRole("heading", { name: /Hai, Pengguna!/ })).toBeVisible();
});
