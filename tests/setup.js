import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
Element.prototype.scrollTo = () => {};
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});
