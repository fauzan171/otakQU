# Verification record

## Soluusi revision, 28 October 2026

- PASS: `npm run build` compiles the production application.
- PASS: `npm run test:dom` runs 13 scenarios across the original application, reward rules, and redemption UI.
- PASS: `npm test` runs all 6 Playwright scenarios with Vite on port 5180, covering original flows, reward cancellation/confirmation, persistence, stock updates and layouts at 320, 768, 1024 and 1440 pixels.
- PASS: the new browser flow records no page errors or horizontal overflow in the reward views at these widths.
- PASS: old saved progress gains reward fields without discarding the balance. Reset clears vouchers and restores demo stock.
- PASS: reward rules reject sold-out offers, insufficient coins, invalid stock quantities and repeated transaction IDs. Clipboard success and manual-copy fallback have interaction coverage.
- PASS: activity and use-case sources render to SVG and PNG. Dashed relationships identify planned functionality and external checkout.

Screenshots in `artifacts/soluusi-*.png` were visually inspected. New controls have 44px targets, dialogs trap focus and allow scrolling. Computed contrast ratios: muted text on surface 6.75:1, dark text on mint 15.77:1, dialog secondary text 8.00:1. These checks do not certify all pre-existing styles for WCAG conformance.

Reward values, codes and inventory are demo fixtures. Redemption updates coins, stock and vouchers together in local state and persists them in localStorage. This is not shared multi-user inventory or a server transaction. The partner view is a labelled local role simulation without authentication. Demo codes are not accepted by Soluusi. Real checkout needs agreed terms, server transactions, partner authentication and voucher validation by Soluusi.

## Original verification record (superseded for browser availability)

- PASS: `npm run build` compiles React, Tailwind and Lucide to production assets.
- PASS: `npm run test:dom` runs 5 interaction scenarios in jsdom, covering all five tabs, grayscale threshold and manual switch, storage reload, timer pause/resume/reset/completion, one-time point award, mission claim/unlock, chart selection, badge dialogs, app validation/add/remove/whitelist, budget updates, limit changes, reset confirmation, and interceptor empty state.
- PASS: HTTP request to `http://localhost:5173` returns 200.

## Antislop delivery audit

- Purpose gate PASS by source review: color roles, hierarchy, typography, icons, radius, shadows, and animation purposes are recorded in DESIGN.md and follow the user's brief.
- Liveliness source review PASS: ENERGY 2 / RHYTHM 2 / MOTION 2; screen-time overview, breathing timer, mission summary and weekly graph provide distinct focal points for their screens. Rendered visual confirmation remains pending.
- Functional controls PASS in DOM coverage for the primary flows; no link navigates to a missing page. Dialogs support Escape and focus trapping. Focus indicators and reduced-motion handling are defined in CSS.
- Hard gate and full craftsmanship approval PENDING: actual rendered contrast, mobile overflow, screenshots, browser console and full browser click-through cannot be certified here.

## Historical browser verification blocker (resolved in this revision)

The UI connector reports no available browsers. Playwright Chromium fails before page creation because the macOS sandbox rejects MachPortRendezvous bootstrap_check_in (error 141, SIGTRAP). This is an environment launch failure, not a passed browser test. No screenshots were produced, and no visual or accessibility-conformance claim is made.

A Playwright suite is provided in tests/prototype.spec.js. Run with the dev server active using `npm test` in an environment that permits Chromium launch. DOM tests do not substitute for this visual verification.

## Prototype boundaries

Monitoring, app blocking, streaks, screen-time metrics and trend history are demo data or simulated actions. CSS grayscale applies to the phone preview. Native cross-app monitoring requires a separate mobile implementation. Settings and reward state persist locally; a running timer resets on page reload.
