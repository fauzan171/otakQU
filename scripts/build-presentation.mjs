import { readFile, writeFile } from "node:fs/promises";

const folder = new URL("../docs/presentation/", import.meta.url);
let html = await readFile(new URL("source.html", folder), "utf8");
for (const name of [
  "login",
  "register",
  "dashboard",
  "profile",
  "intervention",
  "focus",
  "missions",
  "rewards",
  "confirmation",
  "voucher",
  "partner",
  "wallet",
]) {
  const bytes = await readFile(new URL(`assets/${name}.png`, folder));
  html = html.replaceAll(
    `{{asset:${name}}}`,
    `data:image/png;base64,${bytes.toString("base64")}`,
  );
}
for (const name of ["activity", "use-case"]) {
  const bytes = await readFile(new URL(`../diagrams/${name}.svg`, folder));
  html = html.replaceAll(
    `{{diagram:${name}}}`,
    `data:image/svg+xml;base64,${bytes.toString("base64")}`,
  );
}
if (html.includes("{{asset:") || html.includes("{{diagram:"))
  throw new Error("Unresolved presentation asset");
await writeFile(new URL("index.html", folder), html);
console.log(
  `Built standalone HTML presentation (${Math.round(Buffer.byteLength(html) / 1024)} KB).`,
);
