import React, { useState } from "react";
import { Brain, Eye, EyeOff } from "lucide-react";
import "./auth.css";

export default function AuthScreen({ onEnter }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const register = mode === "register";
  function switchMode() {
    setMode(register ? "login" : "register");
    setPassword("");
    setError("");
    setVisible(false);
  }
  function submit(event) {
    event.preventDefault();
    if ((register && !name.trim()) || !identifier.trim() || !password.trim()) {
      setError(
        register
          ? "Isi nama, email atau username, dan sandi contoh untuk melanjutkan."
          : "Isi email atau username dan sandi contoh untuk masuk.",
      );
      return;
    }
    onEnter(identifier, register ? name : undefined);
    setPassword("");
  }
  return (
    <div className="stage">
      <div className="desktop-brand">
        <Brain size={20} />
        <span>
          otak<span className="mint">QU</span>
        </span>
      </div>
      <div className="stage-caption">RUANG UNTUK KEMBALI FOKUS</div>
      <div className="phone" data-testid="phone">
        <div className="phone-screen">
          <div className="status-bar">
            <span>9:41</span>
            <div className="island" />
            <span className="auth-demo-status">DEMO</span>
          </div>
          <main className="auth-content">
            <div className="auth-brand">
              <Brain size={28} />
              <span>
                otak<span>QU</span>
              </span>
            </div>
            <header>
              <p className="auth-eyebrow">AKUN DEMO</p>
              <h1>{register ? "Daftar otakQU" : "Masuk ke otakQU"}</h1>
              <p>
                {register
                  ? "Buat akun contoh untuk mencoba alur fokus dan reward."
                  : "Lanjutkan sesi fokus dan lihat progresmu."}
              </p>
            </header>
            <form
              noValidate
              onSubmit={submit}
              aria-label={register ? "Registrasi demo" : "Login demo"}
            >
              {register && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Nama lengkap</label>
                  <input
                    id="auth-name"
                    value={name}
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Nama untuk profilmu"
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="auth-identifier">Email atau username</label>
                <input
                  id="auth-identifier"
                  value={identifier}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={120}
                  placeholder="Email atau username contoh"
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Sandi contoh</label>
                <div className="auth-password">
                  <input
                    id="auth-password"
                    type={visible ? "text" : "password"}
                    value={password}
                    autoComplete={
                      register ? "new-password" : "current-password"
                    }
                    maxLength={128}
                    placeholder="Bebas untuk simulasi"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={
                      visible ? "Sembunyikan sandi" : "Tampilkan sandi"
                    }
                    aria-pressed={visible}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary auth-submit" type="submit">
                {register ? "Buat akun & masuk" : "Masuk"}
              </button>
            </form>
            <p className="auth-switch">
              {register ? "Sudah punya akun?" : "Belum punya akun?"}
              <button onClick={switchMode}>
                {register ? "Masuk ke akun" : "Daftar sekarang"}
              </button>
            </p>
            <aside className="auth-note">
              <strong>Semua akun bisa dicoba</strong>
              <p>
                Gunakan identitas dan sandi contoh. Akun baru otomatis dibuat
                saat masuk. Sandi tidak disimpan.
              </p>
              <p>
                Ini simulasi login. Semua akun memakai data demo pada browser
                yang sama.
              </p>
            </aside>
          </main>
          <div className="home-indicator">
            <span />
          </div>
        </div>
      </div>
      <p className="stage-footer">PROTOTYPE DIGITAL WELLNESS</p>
    </div>
  );
}
