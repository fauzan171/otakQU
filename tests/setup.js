import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
Element.prototype.scrollTo = () => {};
beforeEach(() =>
  localStorage.setItem(
    "otakqu-demo-session",
    JSON.stringify({ name: "Andi Fauzan", identifier: "demo@otakqu.test" }),
  ),
);
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});
