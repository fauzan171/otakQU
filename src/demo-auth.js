export const sessionKey = "otakqu-demo-session";
const accountsKey = "otakqu-demo-accounts";

export function readDemoSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(sessionKey));
    return saved &&
      typeof saved.name === "string" &&
      saved.name.trim() &&
      typeof saved.identifier === "string" &&
      saved.identifier.trim()
      ? { name: saved.name.trim(), identifier: saved.identifier.trim() }
      : null;
  } catch {
    return null;
  }
}

export function enterDemoAccount(identifier, name) {
  const normalized = identifier.trim().toLowerCase();
  let accounts = [];
  try {
    const saved = JSON.parse(localStorage.getItem(accountsKey));
    if (Array.isArray(saved))
      accounts = saved.filter(
        (account) =>
          account &&
          typeof account.identifier === "string" &&
          typeof account.name === "string" &&
          account.name.trim(),
      );
  } catch {
    /* A fresh demo account can still be created. */
  }
  const existing = accounts.find(
    (account) => account.identifier === normalized,
  );
  const username =
    normalized
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim() || "Pengguna";
  const account = {
    identifier: normalized,
    name:
      name?.trim() ||
      existing?.name ||
      username.replace(/^./, (letter) => letter.toUpperCase()),
  };
  try {
    localStorage.setItem(
      accountsKey,
      JSON.stringify([
        ...accounts.filter((item) => item.identifier !== normalized),
        account,
      ]),
    );
    localStorage.setItem(sessionKey, JSON.stringify(account));
  } catch {
    /* The current in-memory demo session remains usable. */
  }
  return account;
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(sessionKey);
  } catch {
    /* Signing out also clears the in-memory session. */
  }
}
