import React, { useRef, useState } from "react";
import { Coins, Ticket, Store, Check } from "lucide-react";
import Modal from "./Modal.jsx";
import {
  rewardPartner,
  rupiah,
  redemptionError,
  redeemReward,
  setRewardStock,
} from "./rewards.js";
import "./rewards.css";

const dateLabel = (value) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function RewardShop({ data, setData, onMissions }) {
  const [view, setView] = useState("catalog");
  const [selection, setSelection] = useState(null);
  const [error, setError] = useState("");
  const transaction = useRef(null);
  const selectedOffer = data.rewardOffers.find(
    (offer) => offer.id === selection?.offerId,
  );
  const selectedVoucher = data.vouchers.find(
    (voucher) => voucher.id === selection?.voucherId,
  );
  function confirmRedemption() {
    if (!transaction.current) return;
    const details = transaction.current;
    transaction.current = null;
    const result = redeemReward(data, selectedOffer.id, details);
    if (result.error) {
      setError(result.error);
      return;
    }
    setData((current) => redeemReward(current, selectedOffer.id, details).data);
    setSelection({ voucherId: result.voucher.id });
    setView("wallet");
  }
  function close() {
    setSelection(null);
    setError("");
    transaction.current = null;
  }
  return (
    <section className="reward-shop" aria-label="Reward Soluusi">
      <div className="reward-wallet">
        <div>
          <span>
            <Coins size={16} /> Saldo koin
          </span>
          <strong>
            {data.points}
            <small> koin</small>
          </strong>
        </div>
        <button onClick={onMissions}>Tambah lewat misi</button>
      </div>
      <p className="reward-demo-note">
        Demo kerja sama Soluusi. Nominal, stok, dan kode voucher adalah contoh;
        belum berlaku di soluusi.com.
      </p>
      <div className="reward-views" role="group" aria-label="Tampilan reward">
        {[
          ["catalog", "Tukar reward"],
          ["wallet", "Voucher saya"],
          ["partner", "Demo partner"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={view === id}
            onClick={() => setView(id)}
          >
            {label}
            {id === "wallet" && data.vouchers.length > 0
              ? ` (${data.vouchers.length})`
              : ""}
          </button>
        ))}
      </div>
      {view === "catalog" && (
        <>
          <div className="reward-partner">
            <Store size={22} />
            <div>
              <h2>Potongan konsultasi Soluusi</h2>
              <p>Jeda dari scroll, ruang untuk cerita.</p>
            </div>
          </div>
          <div className="reward-offers">
            {data.rewardOffers.map((offer) => {
              const unavailable = redemptionError(data, offer.id);
              return (
                <article
                  className="reward-offer"
                  key={offer.id}
                  aria-label={`Diskon ${rupiah(offer.discount)}`}
                >
                  <div className="reward-offer-heading">
                    <span>Potongan biaya konsultasi</span>
                    <span className={offer.stock ? "mint" : "muted"}>
                      {offer.stock
                        ? `Sisa ${offer.stock} voucher`
                        : "Stok habis"}
                    </span>
                  </div>
                  <h3>{rupiah(offer.discount)}</h3>
                  <p>
                    Min. transaksi {rupiah(offer.minimumSpend)} · berlaku{" "}
                    {offer.validDays} hari setelah ditukar.
                  </p>
                  <div className="reward-offer-action">
                    <strong>
                      <Coins size={15} /> {offer.cost} koin
                    </strong>
                    <button
                      className="primary"
                      disabled={Boolean(unavailable)}
                      aria-label={`Tukar diskon ${rupiah(offer.discount)}`}
                      onClick={() => {
                        transaction.current = {
                          id: crypto.randomUUID(),
                          now: Date.now(),
                        };
                        setError("");
                        setSelection({ offerId: offer.id });
                      }}
                    >
                      Tukar koin
                    </button>
                  </div>
                  {unavailable && (
                    <p className="reward-availability">{unavailable}</p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
      {view === "wallet" && (
        <>
          <h2 className="reward-section-title">Voucher saya</h2>
          {data.vouchers.length === 0 ? (
            <div className="reward-empty">
              <Ticket size={28} />
              <h3>Belum ada voucher</h3>
              <p>
                Tukar koin dari misi dan sesi fokus untuk menyimpan voucher di
                sini.
              </p>
              <button
                className="reward-secondary"
                onClick={() => setView("catalog")}
              >
                Pilih reward
              </button>
            </div>
          ) : (
            data.vouchers.map((voucher) => (
              <article className="saved-voucher" key={voucher.id}>
                <div>
                  <span>Soluusi · voucher demo</span>
                  <h3>Diskon {rupiah(voucher.discount)}</h3>
                  <p>
                    {Date.now() >= voucher.expiresAt
                      ? "Kedaluwarsa"
                      : `Berlaku sampai ${dateLabel(voucher.expiresAt)}`}
                  </p>
                  <p>
                    Ditukar {dateLabel(voucher.redeemedAt)} · {voucher.cost}{" "}
                    koin
                  </p>
                </div>
                <button
                  className="reward-secondary"
                  onClick={() => setSelection({ voucherId: voucher.id })}
                >
                  Lihat voucher
                </button>
              </article>
            ))
          )}
        </>
      )}
      {view === "partner" && (
        <>
          <h2 className="reward-section-title">Stok reward Soluusi</h2>
          <p className="reward-panel-note">
            Simulasi peran partner dalam browser ini. Perubahan stok langsung
            tampil di katalog demo.
          </p>
          <div className="partner-summary">
            <span>Penukaran tercatat</span>
            <strong>{data.vouchers.length} voucher</strong>
          </div>
          {data.rewardOffers.map((offer) => (
            <StockEditor
              key={offer.id}
              offer={offer}
              onSave={(stock) =>
                setData(
                  (current) => setRewardStock(current, offer.id, stock).data,
                )
              }
            />
          ))}
        </>
      )}
      {selection && (
        <Modal
          label={
            selectedOffer ? "Konfirmasi penukaran reward" : "Voucher Soluusi"
          }
          onClose={close}
        >
          {selectedOffer ? (
            <>
              <span className="modal-icon">
                <Ticket size={28} />
              </span>
              <h2>Tukar {selectedOffer.cost} koin?</h2>
              <p>
                Potongan konsultasi Soluusi {rupiah(selectedOffer.discount)}.
                Minimum transaksi {rupiah(selectedOffer.minimumSpend)}, berlaku{" "}
                {selectedOffer.validDays} hari setelah penukaran.
              </p>
              <dl className="redemption-summary">
                <div>
                  <dt>Saldo sekarang</dt>
                  <dd>{data.points} koin</dd>
                </div>
                <div>
                  <dt>Saldo setelah ditukar</dt>
                  <dd>{data.points - selectedOffer.cost} koin</dd>
                </div>
                <div>
                  <dt>Stok tersedia</dt>
                  <dd>{selectedOffer.stock} voucher</dd>
                </div>
              </dl>
              <p className="reward-demo-note">
                Voucher demo tidak dapat digunakan untuk pembayaran di Soluusi.
              </p>
              {error && <p role="alert">{error}</p>}
              <button
                className="primary"
                disabled={
                  Boolean(redemptionError(data, selectedOffer.id)) ||
                  Boolean(error)
                }
                onClick={confirmRedemption}
              >
                Konfirmasi penukaran
              </button>
              <button className="text-button" onClick={close}>
                Batal
              </button>
            </>
          ) : (
            selectedVoucher && (
              <VoucherDetails voucher={selectedVoucher} onClose={close} />
            )
          )}
        </Modal>
      )}
    </section>
  );
}

function VoucherDetails({ voucher, onClose }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setCopyError("");
    } catch {
      setCopyError(
        "Kode belum tersalin. Pilih teks kode lalu salin secara manual.",
      );
    }
  }
  return (
    <>
      <span className="modal-icon">
        <Check size={28} />
      </span>
      <h2>Voucher tersimpan</h2>
      <p>
        Potongan konsultasi {rewardPartner.name} {rupiah(voucher.discount)}.
      </p>
      <label className="voucher-code-label" htmlFor="voucher-code">
        Kode voucher demo
      </label>
      <input
        id="voucher-code"
        className="voucher-code"
        readOnly
        value={voucher.code}
        onFocus={(event) => event.target.select()}
      />
      <button className="reward-secondary" onClick={copy}>
        {copied ? "Kode tersalin" : "Salin kode demo"}
      </button>
      <p role="status">
        {copyError ||
          (copied
            ? "Kode demo berhasil disalin."
            : "Kode ini hanya untuk simulasi.")}
      </p>
      <dl className="redemption-summary">
        <div>
          <dt>Min. transaksi</dt>
          <dd>{rupiah(voucher.minimumSpend)}</dd>
        </div>
        <div>
          <dt>Berlaku sampai</dt>
          <dd>{dateLabel(voucher.expiresAt)}</dd>
        </div>
      </dl>
      <p className="reward-demo-note">
        Belum berlaku untuk checkout. Kode dan syarat resmi menunggu kesepakatan
        Soluusi.
      </p>
      <a
        className="reward-external-link"
        href={rewardPartner.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Kunjungi soluusi.com (tab baru)
      </a>
      <button className="primary" onClick={onClose}>
        Kembali ke voucher saya
      </button>
    </>
  );
}

function StockEditor({ offer, onSave }) {
  const [value, setValue] = useState(String(offer.stock));
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  function save(event) {
    event.preventDefault();
    const stock = value.trim() === "" ? NaN : Number(value);
    const result = setRewardStock({ rewardOffers: [offer] }, offer.id, stock);
    setInvalid(Boolean(result.error));
    if (result.error) {
      setMessage(result.error);
      return;
    }
    onSave(stock);
    setMessage(
      `Stok diskon ${rupiah(offer.discount)} disimpan: ${stock} voucher.`,
    );
  }
  return (
    <form className="stock-editor" noValidate onSubmit={save}>
      <h3>Diskon {rupiah(offer.discount)}</h3>
      <p>
        Stok saat ini: {offer.stock} voucher · {offer.cost} koin per penukaran
      </p>
      <label htmlFor={`stock-${offer.id}`}>Jumlah stok voucher</label>
      <div className="stock-controls">
        <input
          id={`stock-${offer.id}`}
          type="number"
          min="0"
          max="10000"
          step="1"
          value={value}
          aria-invalid={invalid}
          aria-describedby={message ? `stock-message-${offer.id}` : undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setMessage("");
            setInvalid(false);
          }}
        />
        <button
          className="reward-secondary"
          type="submit"
          aria-label={`Simpan stok diskon ${rupiah(offer.discount)}`}
        >
          Simpan stok
        </button>
      </div>
      {message && (
        <p id={`stock-message-${offer.id}`} role={invalid ? "alert" : "status"}>
          {message}
        </p>
      )}
    </form>
  );
}
