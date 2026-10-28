import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Award,
  Bell,
  Brain,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Focus,
  Headphones,
  House,
  Instagram,
  Leaf,
  LockKeyhole,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShieldHalf,
  Signal,
  Smartphone,
  Target,
  Trash2,
  Trophy,
  UserRound,
  Wifi,
  Youtube,
} from "lucide-react";
import "./styles.css";
import Modal from "./Modal.jsx";
import RewardShop from "./RewardShop.jsx";
import { demoRewardOffers } from "./rewards.js";
import AuthScreen from "./AuthScreen.jsx";
import {
  readDemoSession,
  enterDemoAccount,
  clearDemoSession,
} from "./demo-auth.js";

const initial = {
  scrolls: 420,
  limit: 500,
  // B-05: kuota mematikan grayscale manual per hari.
  overrideCount: 0,
  // B-03 "Lanjut 5 menit": kelonggaran scroll sekali pakai.
  grace: 0,
  // D-03: misi "di bawah limit" baru boleh diklaim setelah hari ditutup.
  dayClosed: false,
  budget: 240,
  screenMinutes: 225,
  points: 320,
  rewardOffers: demoRewardOffers,
  vouchers: [],
  gray: false,
  monochromeMaster: false,
  apps: [
    { name: "TikTok", enabled: true },
    { name: "Instagram", enabled: true },
    { name: "YouTube Shorts", enabled: false },
  ],
  claims: [],
  offline: true,
  logs: [
    { text: "TikTok: pemantauan scroll dimulai", time: "09:00", type: "safe" },
    { text: "Sesi fokus 25 menit selesai", time: "08:45", type: "focus" },
  ],
  focusCompleted: 0,
};
function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem("otakqu-v1"));
    return saved &&
      typeof saved.scrolls === "number" &&
      Array.isArray(saved.apps)
      ? { ...initial, ...saved }
      : initial;
  } catch {
    return initial;
  }
}
const navItems = [
  ["dashboard", House, "Dashboard"],
  ["focus", Focus, "Focus"],
  ["missions", Target, "Missions"],
  ["rewards", Trophy, "Rewards"],
  ["profile", UserRound, "Profile"],
];
const formatMinutes = (n) =>
  `${Math.floor(n / 60)}h ${n % 60 ? `${n % 60}m` : ""}`.trim();
const number = (n) => n.toLocaleString("en-US");
function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      className={`toggle ${value ? "on" : ""}`}
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
    >
      <span />
    </button>
  );
}
function AppIcon({ name }) {
  return (
    <span
      className={`app-icon ${name === "TikTok" ? "tiktok" : name === "Instagram" ? "instagram" : "youtube"}`}
    >
      {name === "TikTok" ? (
        <span className="music-note">♪</span>
      ) : name === "Instagram" ? (
        <Instagram size={20} />
      ) : name === "YouTube Shorts" ? (
        <Youtube size={21} />
      ) : (
        <Smartphone size={20} />
      )}
    </span>
  );
}
function Progress({ value, color, warn }) {
  return (
    <div className={`progress ${warn ? "warn" : ""}`}>
      <span
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color,
        }}
      />
    </div>
  );
}
function SectionTitle({ title, action, onClick }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button onClick={onClick}>
          {action}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
export default function App() {
  const [account, setAccount] = useState(readDemoSession);
  if (!account)
    return (
      <AuthScreen
        onEnter={(identifier, name) =>
          setAccount(enterDemoAccount(identifier, name))
        }
      />
    );
  return (
    <WellnessApp
      key={account.identifier}
      account={account}
      onSignOut={() => {
        clearDemoSession();
        setAccount(null);
      }}
    />
  );
}

function WellnessApp({ account, onSignOut }) {
  const [data, setData] = useState(readSaved),
    [tab, setTab] = useState("dashboard"),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState(null),
    // B-02: overlay intervensi + hitung mundur jeda sebelum bisa memilih.
    [intervention, setIntervention] = useState(false),
    [cooldown, setCooldown] = useState(10),
    [duration, setDuration] = useState(25),
    [remaining, setRemaining] = useState(1500),
    [running, setRunning] = useState(false),
    [selectedDay, setSelectedDay] = useState(6),
    [newApp, setNewApp] = useState(""),
    [appError, setAppError] = useState("");
  const lastScrolls = useRef(data.scrolls),
    deadline = useRef(null),
    content = useRef(null),
    toastTimer = useRef(null);
  const update = (patch) =>
    setData((d) => ({
      ...d,
      ...(typeof patch === "function" ? patch(d) : patch),
    }));
  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }
  function log(text, type = "safe") {
    return {
      text,
      type,
      time: new Date()
        .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        .replace(".", ":"),
    };
  }
  useEffect(() => {
    try {
      localStorage.setItem("otakqu-v1", JSON.stringify(data));
    } catch {
      /* The session remains usable when browser storage is unavailable. */
    }
  }, [data]);
  // Only monitored TikTok activity can trigger its automatic scroll interceptor.
  useEffect(() => {
    if (
      data.scrolls >= data.limit + data.grace &&
      data.apps.some((a) => a.name === "TikTok" && a.enabled)
    ) {
      update((d) => ({
        ...d,
        gray: true,
        monochromeMaster: true,
        logs: [
          log(
            `TikTok: ${number(d.scrolls)} scrolls / batas ${number(d.limit)}. Grayscale aktif.`,
            "warning",
          ),
          ...d.logs,
        ].slice(0, 20),
      }));
      // B-02/B-03: jeda dulu, baru beri pilihan. Hanya saat batas BARU
      // terlewati - memuat ulang halaman tidak memaksa overlay lagi.
      if (data.grace === 0 && lastScrolls.current < data.limit + data.grace) {
        setIntervention(true);
        setCooldown(10);
      }
    }
    lastScrolls.current = data.scrolls;
  }, [data.scrolls, data.limit, data.apps, data.grace]);
  // B-02: hitung mundur jeda. Pilihan baru aktif setelah cooldown habis.
  useEffect(() => {
    if (!intervention) return;
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [intervention]);
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (deadline.current === null) return;
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left === 0) {
        deadline.current = null;
        setRunning(false);
        update((d) => ({
          ...d,
          points: d.points + 25,
          focusCompleted: d.focusCompleted + 1,
          logs: [
            log(`Sesi fokus ${duration} menit selesai. +25 poin.`, "focus"),
            ...d.logs,
          ].slice(0, 20),
        }));
        notify("Sesi selesai. Pikiran lebih lega! +25 koin");
      }
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [running, duration]);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
  }, [tab]);
  useEffect(() => {
    const handle = (e) => {
      if (e.key !== "Escape") return;
      setModal(null);
      // Escape menutup overlay tanpa memilih; guard tetap aktif.
      setIntervention(false);
    };
    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
      clearTimeout(toastTimer.current);
    };
  }, []);
  function startFocus() {
    deadline.current = Date.now() + remaining * 1000;
    setRunning(true);
    setTab("focus");
  }
  function pauseFocus() {
    setRemaining(
      Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
    );
    setRunning(false);
  }
  function resetFocus() {
    setRunning(false);
    setRemaining(duration * 60);
  }
  function changeDuration(value) {
    setRunning(false);
    setDuration(value);
    setRemaining(value * 60);
  }
  function claim(id, points) {
    if (data.claims.includes(id)) return;
    update((d) => ({
      ...d,
      points: d.points + points,
      claims: [...d.claims, id],
    }));
    notify(`Reward diklaim! +${points} koin`);
  }
  // B-03: tiga pilihan overlay. Semuanya menutup overlay tanpa memberi poin
  // (B-07: layar intervensi tidak menampilkan poin atau badge).
  function intervene(choice) {
    setIntervention(false);
    if (choice === "rest") {
      update((d) => ({
        ...d,
        logs: [
          log("Memilih istirahat. Layar dijeda.", "safe"),
          ...d.logs,
        ].slice(0, 20),
      }));
      notify("Istirahat dulu. Otakmu berterima kasih.");
    } else if (choice === "focus") {
      startFocus();
    } else {
      // "Lanjut 5 menit" = kelonggaran sekali pakai, bukan limit baru.
      update((d) => ({
        ...d,
        grace: d.grace + 100,
        logs: [
          log("Lanjut 5 menit dipilih. Kelonggaran dipakai.", "warning"),
          ...d.logs,
        ].slice(0, 20),
      }));
      notify("5 menit lagi. Setelah itu guard aktif kembali.");
    }
  }
  // B-05: mematikan grayscale manual dibatasi 2x per hari.
  const OVERRIDE_MAX = 2;
  function toggleGray(value) {
    if (!value && data.overrideCount >= OVERRIDE_MAX) {
      notify("Kuota mematikan grayscale hari ini habis.");
      return;
    }
    update((d) => ({
      ...d,
      gray: value,
      monochromeMaster: d.monochromeMaster || value,
      overrideCount: value ? d.overrideCount : d.overrideCount + 1,
      logs: [
        log(
          value
            ? "Grayscale diaktifkan manual."
            : `Grayscale dinonaktifkan manual (${d.overrideCount + 1}/${OVERRIDE_MAX}).`,
          "warning",
        ),
        ...d.logs,
      ].slice(0, 20),
    }));
    notify(
      value
        ? "Mode hitam-putih aktif."
        : `Warna kembali. Sisa kuota: ${OVERRIDE_MAX - data.overrideCount - 1}.`,
    );
  }
  function toggleApp(name) {
    update((d) => ({
      ...d,
      apps: d.apps.map((a) =>
        a.name === name ? { ...a, enabled: !a.enabled } : a,
      ),
    }));
  }
  function addApp(e) {
    e.preventDefault();
    const name = newApp.trim();
    if (!name) {
      setAppError("Isi nama aplikasi dulu, ya.");
      return;
    }
    if (data.apps.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      setAppError("Aplikasi ini sudah ada di daftar.");
      return;
    }
    update((d) => ({ ...d, apps: [...d.apps, { name, enabled: true }] }));
    setNewApp("");
    setAppError("");
    notify(`${name} ditambahkan ke perlindungan.`);
  }
  const scrollPercent = (data.scrolls / data.limit) * 100,
    gray = data.gray,
    monitored = data.apps.filter((a) => a.enabled).length;
  const missions = [
    {
      id: "scroll",
      title: `Di bawah ${number(data.limit)} scroll`,
      description: "Jaga jempol, jaga pikiran.",
      points: 75,
      icon: Smartphone,
      // D-03: baru bisa diklaim setelah hari ditutup, bukan begitu app dibuka.
      done: data.scrolls < data.limit && data.dayClosed,
      active: true,
      pending: data.scrolls < data.limit && !data.dayClosed,
    },
    {
      id: "offline",
      title: "1 jam offline sebelum tidur",
      description: "Tutup layar, istirahat lebih tenang.",
      points: 50,
      icon: Moon,
      done: data.offline,
    },
    {
      id: "noon",
      title: "Bebas sosmed sampai 12 PM",
      description: "Terbuka setelah 2 misi diklaim.",
      points: 100,
      icon: LockKeyhole,
      done: data.claims.length >= 2,
      locked: data.claims.length < 2,
    },
  ];
  // D-08: metrik dampak, bukan total poin. Baseline demo 1,420 scrolls/hari.
  const reclaimed = Math.max(
    0,
    Math.round(((1420 - data.scrolls) / 1420) * 225),
  );
  const streak = 4 + (data.claims.includes("scroll") ? 1 : 0);
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    weekly = [980, 840, 1050, 710, 620, 540, data.scrolls];
  return (
    <div className="stage">
      <div className="desktop-brand">
        <Brain size={20} />
        <span>
          otak<span className="mint">QU</span>
        </span>
      </div>
      <div className="stage-caption">LESS SCROLL. MORE SOUL.</div>
      <div
        className={`phone ${gray ? "grayscale-mode" : ""}`}
        data-testid="phone"
      >
        <div className="phone-screen">
          <div className="status-bar">
            <span>9:41</span>
            <div className="island" />
            <div className="status-icons">
              <Signal size={14} fill="currentColor" />
              <Wifi size={15} />
              <span className="battery">
                <i />
              </span>
            </div>
          </div>
          <div className="app-topbar">
            <button
              className="wordmark"
              aria-label="otakQU Dashboard"
              onClick={() => setTab("dashboard")}
            >
              <BrainCircuit size={24} />
              <span>
                otak<b>QU</b>
                <i />
              </span>
            </button>
            <div className="top-actions">
              <span className="demo-label">DEMO</span>
              <button
                className="icon-button notification"
                aria-label="Notifikasi"
                onClick={() => setModal("notifications")}
              >
                <Bell size={19} />
                <i />
              </button>
            </div>
          </div>
          <main ref={content} className="app-content">
            {tab === "dashboard" && (
              <div className="page dashboard">
                <div className="greeting-row">
                  <div>
                    <p className="eyebrow">SEDIKIT SCROLL, BANYAK KONTROL</p>
                    <h1>
                      Hai, {account.name.split(" ")[0]}!{" "}
                      <span className="wave">👋</span>
                    </h1>
                    <p>Kasih otakmu ruang bernapas.</p>
                  </div>
                  <button
                    className="avatar"
                    onClick={() => setTab("profile")}
                    aria-label={`Buka profil ${account.name}`}
                  >
                    {account.name[0].toUpperCase()}
                    <span />
                  </button>
                </div>
                <div className="daily-status">
                  <span className="streak">
                    <Flame size={15} fill="currentColor" />
                    {streak} Days Clean
                  </span>
                  <span className="safe-status">
                    <i />
                    {gray ? "Grayscale aktif" : "Guard siap menjaga"}
                  </span>
                </div>
                <section className="wellness-card">
                  <div className="flex items-center justify-between">
                    <span className="card-kicker">
                      <Clock3 size={15} /> SCREEN TIME HARI INI
                    </span>
                    <span className="small-tag">Daily overview</span>
                  </div>
                  <div className="screen-stat">
                    <strong>
                      {Math.floor(data.screenMinutes / 60)}
                      <span>h</span>{" "}
                      {String(data.screenMinutes % 60).padStart(2, "0")}
                      <span>m</span>
                    </strong>
                    <div className="brain-orbit">
                      <Brain size={47} strokeWidth={1.35} />
                      <span className="orbit-dot" />
                    </div>
                  </div>
                  <div className="budget-label">
                    <span>dari budget {formatMinutes(data.budget)}</span>
                    <span>
                      {Math.round((data.screenMinutes / data.budget) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(data.screenMinutes / data.budget) * 100}
                    warn={data.screenMinutes / data.budget > 0.85}
                  />
                  <div className="wellness-foot">
                    <span>
                      <ArrowDown size={13} />
                      18% dari kemarin
                    </span>
                    <span>
                      {data.budget > data.screenMinutes
                        ? `${data.budget - data.screenMinutes} menit lagi`
                        : "Budget tercapai"}
                    </span>
                  </div>
                </section>
                <section className="scroll-card">
                  <div className="flex items-center gap-3">
                    <AppIcon name="TikTok" />
                    <div>
                      <h2>TikTok scrolls</h2>
                      <span className="muted small">Jempolmu hari ini</span>
                    </div>
                    <span className="live">
                      <i />
                      Live demo
                    </span>
                  </div>
                  <div className="scroll-count">
                    <strong key={data.scrolls}>{number(data.scrolls)}</strong>
                    <span>/ {number(data.limit)} scrolls</span>
                    <span
                      className={`percent ${scrollPercent >= 100 ? "coral" : ""}`}
                    >
                      {Math.round(scrollPercent)}%
                    </span>
                  </div>
                  <Progress
                    value={scrollPercent}
                    color={
                      scrollPercent >= 100 ? "var(--coral)" : "var(--mint)"
                    }
                  />
                  <div className="scroll-bottom">
                    <span>
                      {data.scrolls < data.limit ? (
                        <>
                          <span className="mint">
                            {data.limit - data.scrolls} scrolls
                          </span>{" "}
                          sebelum batas harian
                        </>
                      ) : (
                        "Waktunya istirahat sejenak."
                      )}
                    </span>
                    <button
                      onClick={() => {
                        update((d) => ({ ...d, scrolls: d.scrolls + 100 }));
                        notify("+100 scroll disimulasikan");
                      }}
                      className="simulate"
                      aria-label="Simulasi tambah 100 scroll"
                    >
                      <Plus size={12} />
                      100
                    </button>
                  </div>
                </section>
                <section className={`guard-card ${gray ? "guard-on" : ""}`}>
                  <div className="guard-heading">
                    <span className="guard-symbol">
                      <ShieldHalf size={22} />
                    </span>
                    <div>
                      <h2>Brain Rot Guard</h2>
                      <span className="small muted">Grayscale Mode</span>
                    </div>
                    <Toggle
                      value={gray}
                      label="Brain Rot Guard Grayscale Mode"
                      onChange={toggleGray}
                    />
                  </div>
                  <p>Kurangi distraksi warna. Ambil kembali kontrolmu.</p>
                  {gray && (
                    <div className="warning" role="status">
                      {data.scrolls >= data.limit
                        ? "⚠️ Batas scroll tercapai! Mode hitam-putih aktif."
                        : "Mode hitam-putih aktif. Beri otakmu waktu bernapas."}
                    </div>
                  )}
                </section>
                <button
                  className="focus-cta"
                  aria-label={
                    running ? "Kembali ke sesi fokus" : "Start Focus Session"
                  }
                  onClick={startFocus}
                >
                  <span className="focus-cta-icon">
                    <Focus size={23} />
                  </span>
                  <span>
                    <strong>
                      {running
                        ? "Kembali ke sesi fokus"
                        : "Start Focus Session"}
                    </strong>
                    <small>Heningkan feed. Nyalakan fokus.</small>
                  </span>
                  <ArrowRight size={19} />
                </button>
                <section className="device-card">
                  <div className="device-head">
                    <span className="card-kicker">
                      <Signal size={15} /> SEMUA PERANGKAT
                    </span>
                    <span className="small-tag">DEMO</span>
                  </div>
                  <strong data-testid="all-devices">
                    {Math.floor((data.screenMinutes + 20) / 60)}
                    <span>h</span>{" "}
                    {String((data.screenMinutes + 20) % 60).padStart(2, "0")}
                    <span>m</span>
                  </strong>
                  <div className="device-rows">
                    {[
                      ["HP", 165],
                      ["Laptop", 52],
                      ["Tablet", 28],
                    ].map(([name, min]) => (
                      <div className="device-row" key={name}>
                        <span>
                          <Smartphone size={14} /> {name}
                        </span>
                        <span className="muted small">
                          {formatMinutes(min)}
                        </span>
                        <Progress
                          value={(min / 245) * 100}
                          color="var(--violet)"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="small muted">
                    Limit berlaku di ketiga perangkat, jadi pindah perangkat
                    tidak menambah jatah.
                  </p>
                </section>
                <section className="insight-card">
                  <span className="card-kicker">
                    <Clock3 size={15} /> JAM RAWAN
                  </span>
                  <h2>21.00 – 23.00</h2>
                  <p className="small muted">
                    Tiga dari tujuh malam terakhir, scroll naik di jam ini. Coba
                    aktifkan misi offline sebelum tidur.
                  </p>
                  <div className="insight-bars">
                    {[22, 34, 18, 41, 29, 62, 88].map((v, i) => (
                      <span key={i} style={{ height: `${v}%` }} />
                    ))}
                  </div>
                </section>
                <SectionTitle
                  title="Misi kecil, dampak besar"
                  action="Lihat semua"
                  onClick={() => setTab("missions")}
                />
                <button
                  className="mini-mission"
                  onClick={() => setTab("missions")}
                >
                  <span className="mission-moon">
                    <Moon size={20} />
                  </span>
                  <span>
                    <strong>Offline sebelum tidur</strong>
                    <small>Satu langkah untuk tidur lebih baik</small>
                  </span>
                  <span className="mint">
                    <Check size={18} />
                  </span>
                </button>
                <p className="bottom-note">
                  <Leaf size={12} /> Your mind deserves a little quiet.
                </p>
              </div>
            )}
            {tab === "focus" && (
              <div className="page">
                <PageHeading
                  eyebrow="MAKE ROOM FOR WHAT MATTERS"
                  title="Temukan fokusmu."
                  text="Dunia bisa menunggu sebentar."
                />
                <section
                  className={`timer-card ${running ? "is-running" : ""}`}
                >
                  <div className="timer-top">
                    <span>
                      <span className="status-dot" />
                      {running ? "DEEP FOCUS AKTIF" : "WAKTU UNTUK DIRIMU"}
                    </span>
                    <Headphones size={18} />
                  </div>
                  <div className="timer-orbit">
                    <div className="timer-center">
                      <Leaf size={25} />
                      <strong data-testid="timer">
                        {String(Math.floor(remaining / 60)).padStart(2, "0")}
                        <span>:</span>
                        {String(remaining % 60).padStart(2, "0")}
                      </strong>
                      <span>
                        {running
                          ? "Tarik napas. Lepaskan distraksi."
                          : remaining === 0
                            ? "Sesi selesai. Kamu berhasil!"
                            : "Satu hal. Sepenuh perhatian."}
                      </span>
                    </div>
                  </div>
                  <div className="duration-options">
                    {[15, 25, 45].map((m) => (
                      <button
                        key={m}
                        className={duration === m ? "selected" : ""}
                        onClick={() => changeDuration(m)}
                      >
                        {m} min
                      </button>
                    ))}
                  </div>
                  <label className="custom-duration">
                    Durasi custom{" "}
                    <input
                      aria-label="Durasi fokus custom dalam menit"
                      type="number"
                      min="1"
                      max="180"
                      value={duration}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 1 && v <= 180) changeDuration(v);
                      }}
                    />{" "}
                    min
                  </label>
                  <div className="timer-controls">
                    <button
                      className="primary"
                      onClick={
                        running
                          ? pauseFocus
                          : () => {
                              if (remaining === 0) {
                                setRemaining(duration * 60);
                                deadline.current =
                                  Date.now() + duration * 60000;
                                setRunning(true);
                              } else startFocus();
                            }
                      }
                    >
                      {running ? (
                        <Pause size={17} />
                      ) : (
                        <Play size={17} fill="currentColor" />
                      )}
                      {running
                        ? "Pause Focus"
                        : remaining === duration * 60
                          ? "Start Focus"
                          : "Lanjutkan Fokus"}
                    </button>
                    <button
                      className="reset-button"
                      aria-label="Reset timer"
                      onClick={resetFocus}
                    >
                      <RotateCcw size={19} />
                    </button>
                  </div>
                  {running && (
                    <div className="breathing-label">
                      <span />
                      Ikuti ritme lingkaran. Tarik dan hembuskan napas.
                    </div>
                  )}
                </section>
                <SectionTitle title="Target apps" />
                <p className="section-description">
                  {running
                    ? "Simulasi blokir aktif selama sesi fokus."
                    : `${monitored} aplikasi dalam pemantauan guard.`}
                </p>
                <section className="list-card">
                  {data.apps.map((a) => (
                    <div className="app-row" key={a.name}>
                      <AppIcon name={a.name} />
                      <div>
                        <strong>{a.name}</strong>
                        <small className={a.enabled ? "mint" : ""}>
                          {a.enabled
                            ? running
                              ? "Diblokir · sesi fokus"
                              : gray
                                ? "Grayscale aktif"
                                : "Dipantau"
                            : "Diizinkan"}
                        </small>
                      </div>
                      <Toggle
                        value={a.enabled}
                        label={`Pantau ${a.name}`}
                        onChange={() => toggleApp(a.name)}
                      />
                    </div>
                  ))}
                  {!data.apps.length && (
                    <p className="empty-state">
                      Belum ada aplikasi. Tambahkan melalui Profile.
                    </p>
                  )}
                </section>
                <SectionTitle
                  title="Interceptor log"
                  action="Hapus"
                  onClick={() => {
                    update({ logs: [] });
                    notify("Log dibersihkan.");
                  }}
                />
                <div className="log-list">
                  {data.logs.length ? (
                    data.logs.map((l, i) => (
                      <div className="log" key={`${l.time}-${i}`}>
                        <span className={`log-dot ${l.type}`} />
                        <div>
                          <p>{l.text}</p>
                          <time>{l.time} · hari ini</time>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <ShieldCheck size={25} />
                      <p>Belum ada aktivitas. Guard siap memantau.</p>
                    </div>
                  )}
                </div>
                <p className="bottom-note">
                  Pemantauan dan blokir adalah simulasi prototype.
                </p>
              </div>
            )}
            {tab === "missions" && (
              <div className="page">
                <PageHeading
                  eyebrow="SMALL STEPS, BETTER DAYS"
                  title="Misi buat pikiranmu."
                  text="Bukan harus sempurna. Cukup lebih sadar."
                />
                <div className="mission-summary">
                  <span className="mission-summary-icon">
                    <Target size={31} />
                  </span>
                  <div>
                    <span>MISI HARI INI</span>
                    <strong>
                      {data.claims.length}
                      <small> / 3 selesai</small>
                    </strong>
                  </div>
                  <span className="points-pill">
                    <Award size={15} />
                    {data.points} koin
                  </span>
                  <Progress
                    value={(data.claims.length / 3) * 100}
                    color="var(--mint)"
                  />
                </div>
                <SectionTitle title="Daily challenges" />
                <div className="mission-list">
                  {missions.map((m) => (
                    <section
                      className={`challenge ${m.locked ? "locked" : ""}`}
                      key={m.id}
                    >
                      <div className="challenge-top">
                        <span className={`challenge-icon ${m.id}`}>
                          <m.icon size={23} />
                        </span>
                        <span className={m.locked ? "muted" : "mint"}>
                          {data.claims.includes(m.id)
                            ? "Diklaim"
                            : m.locked
                              ? "Terkunci"
                              : m.done
                                ? "Siap diklaim"
                                : "Sedang berjalan"}
                        </span>
                        <strong>+{m.points} koin</strong>
                      </div>
                      <h2>{m.title}</h2>
                      <p>{m.description}</p>
                      {m.active && (
                        <>
                          <div className="challenge-progress">
                            <span>
                              {number(data.scrolls)} / {number(data.limit)}{" "}
                              scrolls
                            </span>
                            <span>{Math.round(scrollPercent)}%</span>
                          </div>
                          <Progress value={scrollPercent} color="var(--mint)" />
                          <small className="muted">
                            Snapshot demo hari ini. Klaim jika masih di bawah
                            batas.
                          </small>
                        </>
                      )}
                      {m.id === "offline" && (
                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={data.offline}
                            disabled={data.claims.includes(m.id)}
                            onChange={(e) =>
                              update({ offline: e.target.checked })
                            }
                          />
                          <span>Aku sudah 1 jam tanpa layar</span>
                        </label>
                      )}
                      {m.pending && (
                        <button
                          className="day-close"
                          onClick={() => {
                            update({ dayClosed: true });
                            notify("Hari ditutup. Misi bisa diklaim.");
                          }}
                        >
                          <Moon size={14} /> Tutup hari &amp; kunci hasil
                        </button>
                      )}
                      <button
                        className={`claim-button ${data.claims.includes(m.id) ? "claimed" : ""}`}
                        disabled={
                          m.locked || !m.done || data.claims.includes(m.id)
                        }
                        onClick={() => claim(m.id, m.points)}
                      >
                        {data.claims.includes(m.id) ? (
                          <>
                            <Check size={16} />
                            Reward diklaim
                          </>
                        ) : m.locked ? (
                          <>
                            <LockKeyhole size={15} />
                            Selesaikan 2 misi dulu
                          </>
                        ) : !m.done ? (
                          m.pending ? (
                            "Tutup hari dulu"
                          ) : (
                            "Target belum tercapai"
                          )
                        ) : (
                          <>
                            Klaim reward
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </section>
                  ))}
                </div>
                <p className="bottom-note">
                  <Leaf size={12} /> Sedikit demi sedikit, jadi kebiasaan baik.
                </p>
              </div>
            )}
            {tab === "rewards" && (
              <div className="page">
                <PageHeading
                  eyebrow="REWARD & PENCAPAIAN"
                  title="Jeda yang berarti."
                  text="Kumpulkan koin, tukar potongan konsultasi."
                />
                <RewardShop
                  data={data}
                  setData={setData}
                  onMissions={() => setTab("missions")}
                />
                <div className="reward-stats three">
                  <section>
                    <Flame size={27} className="coral" />
                    <strong>
                      {streak}
                      <small>hari</small>
                    </strong>
                    <span>Days Clean</span>
                  </section>
                  <section>
                    <Leaf size={27} className="mint" />
                    <strong data-testid="reclaimed">
                      {number(reclaimed)}
                      <small>mnt</small>
                    </strong>
                    <span>Direbut kembali</span>
                  </section>
                  <section>
                    <Award size={27} className="violet" />
                    <strong data-testid="points">
                      {data.points}
                      <small>koin</small>
                    </strong>
                    <span>Saldo koin</span>
                  </section>
                </div>
                <section className="weekly-card">
                  <div className="section-title">
                    <h2>Scroll makin terkontrol</h2>
                    <span className="small muted">7 hari</span>
                  </div>
                  <div className="trend-number">
                    <strong>
                      {number(weekly[selectedDay])}
                      <small> scrolls</small>
                    </strong>
                    <span className="mint">
                      <ArrowDown size={12} />
                      {Math.max(
                        0,
                        Math.round((1 - weekly[selectedDay] / 1420) * 100),
                      )}
                      %
                    </span>
                  </div>
                  <p className="small muted">
                    {days[selectedDay]} · dibanding baseline demo 1,420 scrolls
                  </p>
                  <div className="bar-chart">
                    {weekly.map((v, i) => (
                      <button
                        key={i}
                        aria-label={`${days[i]} ${v} scrolls`}
                        aria-pressed={selectedDay === i}
                        onClick={() => setSelectedDay(i)}
                        className={selectedDay === i ? "selected" : ""}
                      >
                        <div className="bar-track">
                          <span
                            style={{
                              height: `${Math.max(4, Math.min(100, (v / Math.max(...weekly, 1100)) * 100))}%`,
                            }}
                          />
                        </div>
                        <span>{days[i]}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <SectionTitle title="Pencapaianmu" />
                <div className="badge-grid">
                  {[
                    {
                      title: "Scroll Spartan",
                      icon: ShieldCheck,
                      on: true,
                      desc: "Mulai mengendalikan scroll",
                    },
                    {
                      title: "Monochrome Master",
                      icon: Brain,
                      on: data.monochromeMaster,
                      desc: "Aktifkan mode grayscale",
                    },
                    {
                      title: "Zen Mode 7d",
                      icon: Leaf,
                      on: false,
                      desc: "Capai streak 7 hari",
                    },
                    {
                      title: "Deep Diver",
                      icon: Headphones,
                      on: data.focusCompleted > 0,
                      desc: "Selesaikan 1 sesi fokus",
                    },
                  ].map((b, i) => (
                    <button
                      className={`badge-card ${b.on ? "unlocked" : ""}`}
                      aria-label={`${b.title} ${b.on ? "Unlocked" : "Locked"}`}
                      key={b.title}
                      onClick={() => setModal({ badge: b })}
                    >
                      <span className={`badge-medal medal-${i}`}>
                        <b.icon size={30} />
                        {!b.on && (
                          <LockKeyhole size={12} className="medal-lock" />
                        )}
                      </span>
                      <strong>{b.title}</strong>
                      <small>{b.on ? "Unlocked" : "Locked"}</small>
                    </button>
                  ))}
                </div>
                <div className="quote">
                  <Leaf size={19} />
                  <p>
                    “Yang kamu cari di feed,
                    <br />
                    mungkin ada di hidupmu sendiri.”
                  </p>
                </div>
              </div>
            )}
            {tab === "profile" && (
              <div className="page">
                <PageHeading
                  eyebrow="YOUR MIND, YOUR RULES"
                  title="Atur ritmemu."
                  text="Batas yang pas buat hidupmu."
                />
                <section className="profile-card">
                  <span className="avatar large">
                    {account.name[0].toUpperCase()}
                  </span>
                  <div>
                    <h2>
                      {account.name} <span>Lv. 4</span>
                    </h2>
                    <p>Mindful Explorer</p>
                  </div>
                  <span className="profile-leaf">
                    <Leaf size={22} />
                  </span>
                  <div className="profile-goal">
                    <Target size={16} />
                    <span>Mengurangi candu short-video</span>
                  </div>
                </section>
                <section
                  className="account-session"
                  aria-label="Sesi akun demo"
                >
                  <strong>Akun demo aktif</strong>
                  <p>{account.identifier}</p>
                  <p>Data simulasi tersimpan pada browser ini.</p>
                  <button className="reward-secondary" onClick={onSignOut}>
                    Keluar dari akun
                  </button>
                </section>
                <SectionTitle title="Batas harian" />
                <section className="settings-card">
                  <div className="setting-label">
                    <span>
                      <Smartphone size={17} />
                      TikTok scroll limit
                    </span>
                    <strong>
                      {number(data.limit)}
                      <small> scrolls</small>
                    </strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    aria-label="Daily TikTok Scroll Limit"
                    value={data.limit}
                    onChange={(e) => update({ limit: Number(e.target.value) })}
                  />
                  <div className="range-labels">
                    <span>100 scrolls</span>
                    <span>1,000 scrolls · batas sistem</span>
                  </div>
                  <p className="small muted">
                    Kamu boleh menurunkan, tidak boleh melewati batas sistem.
                  </p>
                  <div className="setting-divider" />
                  <div className="setting-label">
                    <span>
                      <Clock3 size={17} />
                      Screen time budget
                    </span>
                  </div>
                  <div className="budget-adjuster">
                    <button
                      aria-label="Kurangi budget 15 menit"
                      disabled={data.budget <= 30}
                      onClick={() =>
                        update({ budget: Math.max(30, data.budget - 15) })
                      }
                    >
                      <Minus size={18} />
                    </button>
                    <strong>{formatMinutes(data.budget)}</strong>
                    <button
                      aria-label="Tambah budget 15 menit"
                      disabled={data.budget >= 720}
                      onClick={() =>
                        update({ budget: Math.min(720, data.budget + 15) })
                      }
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="small muted">
                    Perubahan otomatis tersimpan di perangkat ini.
                  </p>
                </section>
                <SectionTitle title="Daftar perlindungan" />
                <p className="section-description">
                  Aktif = dipantau. Nonaktif = whitelist.
                </p>
                <section className="list-card protected-list">
                  {data.apps.map((a) => (
                    <div className="app-row" key={a.name}>
                      <AppIcon name={a.name} />
                      <div>
                        <strong>{a.name}</strong>
                        <small>
                          {a.enabled
                            ? "Dalam perlindungan"
                            : "Whitelist · diizinkan"}
                        </small>
                      </div>
                      <Toggle
                        value={a.enabled}
                        label={`Perlindungan ${a.name}`}
                        onChange={() => toggleApp(a.name)}
                      />
                      <button
                        className="delete-button"
                        aria-label={`Hapus ${a.name}`}
                        onClick={() => {
                          update((d) => ({
                            ...d,
                            apps: d.apps.filter((x) => x.name !== a.name),
                          }));
                          notify(`${a.name} dihapus.`);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {!data.apps.length && (
                    <p className="empty-state">
                      Daftar kosong. Tambahkan aplikasi pertama.
                    </p>
                  )}
                  <form onSubmit={addApp} className="add-app">
                    <input
                      aria-label="Nama aplikasi baru"
                      value={newApp}
                      placeholder="Nama aplikasi lain..."
                      onChange={(e) => {
                        setNewApp(e.target.value);
                        setAppError("");
                      }}
                      maxLength={28}
                    />
                    <button type="submit" aria-label="Tambah aplikasi">
                      <Plus size={19} />
                    </button>
                  </form>
                  {appError && (
                    <p className="form-error" role="alert">
                      {appError}
                    </p>
                  )}
                </section>
                <button
                  className="reset-demo"
                  onClick={() => setModal("reset")}
                >
                  <RotateCcw size={15} />
                  Reset data simulasi
                </button>
                <p className="bottom-note">
                  otakQU v1.0 · Interactive prototype
                  <br />
                  Data demo lokal. Tidak terhubung ke aplikasi lain.
                </p>
              </div>
            )}
          </main>
          <nav className="bottom-nav" aria-label="Navigasi utama">
            {navItems.map(([id, Icon, label]) => (
              <button
                key={id}
                aria-current={tab === id ? "page" : undefined}
                className={tab === id ? "active" : ""}
                onClick={() => setTab(id)}
              >
                <span>
                  <Icon size={21} strokeWidth={tab === id ? 2.3 : 1.7} />
                  {id === "focus" && running && <i />}
                </span>
                <small>{label}</small>
              </button>
            ))}
          </nav>
          <div className="home-indicator" />
          {toast && (
            <div className="toast" role="status">
              <Check size={17} />
              {toast}
            </div>
          )}
          {intervention && (
            <div className="intervention-backdrop">
              <section
                role="dialog"
                aria-modal="true"
                aria-label="Jeda sebelum lanjut scroll"
                className="intervention"
              >
                <span className="intervention-icon">
                  <ShieldHalf size={30} />
                </span>
                <h2>Batas scroll hari ini sudah lewat.</h2>
                <p>
                  Tidak ada yang dipaksa berhenti. Cuma sebuah jeda supaya
                  jempolmu tidak jalan sendiri.
                </p>
                <div className="cooldown-ring" role="status">
                  {cooldown > 0 ? (
                    <>
                      <strong>{cooldown}</strong>
                      <span>detik jeda</span>
                    </>
                  ) : (
                    <span>Pilihanmu sudah terbuka.</span>
                  )}
                </div>
                <div className="intervention-choices">
                  <button
                    disabled={cooldown > 0}
                    onClick={() => intervene("rest")}
                  >
                    <Moon size={17} /> Istirahat
                  </button>
                  <button
                    className="primary"
                    disabled={cooldown > 0}
                    onClick={() => intervene("focus")}
                  >
                    <Focus size={17} /> Mulai fokus
                  </button>
                  <button
                    disabled={cooldown > 0}
                    onClick={() => intervene("lanjut")}
                  >
                    <Clock3 size={17} /> Lanjut 5 menit
                  </button>
                </div>
                <p className="small muted">
                  Lanjut pun tidak apa-apa. Cukup sadar, bukan otomatis.
                </p>
              </section>
            </div>
          )}
          {modal && (
            <Modal onClose={() => setModal(null)}>
              {modal === "notifications" ? (
                <>
                  <span className="modal-icon">
                    <Bell size={28} />
                  </span>
                  <h2>Ruang tenangmu.</h2>
                  <p>
                    {gray
                      ? "Guard sudah mengaktifkan mode hitam-putih. Beri jeda untuk pikiranmu."
                      : "Kamu sudah 4 hari membangun kebiasaan lebih sadar. Lanjutkan satu langkah lagi hari ini."}
                  </p>
                  <div className="notification-item">
                    <ShieldCheck size={20} />
                    <span>{monitored} aplikasi dipantau dalam simulasi.</span>
                  </div>
                  <button
                    className="primary"
                    onClick={() => {
                      setTab("missions");
                      setModal(null);
                    }}
                  >
                    Lihat misi hari ini
                  </button>
                </>
              ) : modal === "reset" ? (
                <>
                  <span className="modal-icon">
                    <RotateCcw size={27} />
                  </span>
                  <h2>Mulai demo dari awal?</h2>
                  <p>
                    Scroll, koin, misi, voucher, stok reward, dan pengaturan
                    akan kembali ke data awal.
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setData({
                        ...initial,
                        logs: [...initial.logs],
                        apps: initial.apps.map((a) => ({ ...a })),
                      });
                      resetFocus();
                      setModal(null);
                      notify("Data demo direset. Siap mulai lagi!");
                    }}
                  >
                    Reset sekarang
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setModal(null)}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span className="modal-icon">
                    <modal.badge.icon size={34} />
                  </span>
                  <h2>{modal.badge.title}</h2>
                  <p>{modal.badge.desc}</p>
                  <span className="badge-status">
                    {modal.badge.on
                      ? "✓ Pencapaian terbuka"
                      : "🔒 Teruskan progresmu untuk membuka"}
                  </span>
                  <button className="primary" onClick={() => setModal(null)}>
                    Mengerti
                  </button>
                </>
              )}
            </Modal>
          )}
        </div>
      </div>
      <div className="stage-footer">
        <span className="status-dot" /> INTERACTIVE PROTOTYPE <span>·</span>{" "}
        BUILT FOR A CLEARER MIND
      </div>
    </div>
  );
}
function PageHeading({ eyebrow, title, text }) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
