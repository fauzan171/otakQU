export const rewardPartner = {
  name: "Soluusi",
  url: "https://soluusi.com/",
};

// Example terms for the prototype; these are not offers issued by Soluusi.
export const demoRewardOffers = [
  {
    id: "soluusi-25",
    discount: 25000,
    cost: 200,
    stock: 10,
    minimumSpend: 100000,
    validDays: 30,
  },
  {
    id: "soluusi-50",
    discount: 50000,
    cost: 400,
    stock: 5,
    minimumSpend: 200000,
    validDays: 30,
  },
  {
    id: "soluusi-75",
    discount: 75000,
    cost: 600,
    stock: 0,
    minimumSpend: 300000,
    validDays: 30,
  },
];

export const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value).replace(/\s/g, "");

export function redemptionError(data, offerId) {
  const offer = data.rewardOffers.find((item) => item.id === offerId);
  if (!offer) return "Reward tidak ditemukan. Pilih reward yang tersedia.";
  if (offer.stock <= 0)
    return "Stok reward habis. Pilih reward lain atau cek lagi nanti.";
  if (data.points < offer.cost)
    return `Koin kurang ${offer.cost - data.points}. Selesaikan misi atau sesi fokus dulu.`;
  return null;
}

export function redeemReward(data, offerId, { id, now }) {
  const error = redemptionError(data, offerId);
  if (error) return { data, error };
  if (data.vouchers.some((voucher) => voucher.id === id)) {
    return { data, error: "Penukaran ini sudah diproses. Cek Voucher saya." };
  }
  const offer = data.rewardOffers.find((item) => item.id === offerId);
  const voucher = {
    id,
    offerId,
    code: `DEMO-SOLUUSI-${id.replace(/-/g, "").slice(0, 10).toUpperCase()}`,
    discount: offer.discount,
    cost: offer.cost,
    minimumSpend: offer.minimumSpend,
    redeemedAt: now,
    expiresAt: now + offer.validDays * 24 * 60 * 60 * 1000,
  };
  return {
    error: null,
    voucher,
    data: {
      ...data,
      points: data.points - offer.cost,
      rewardOffers: data.rewardOffers.map((item) =>
        item.id === offerId ? { ...item, stock: item.stock - 1 } : item,
      ),
      vouchers: [voucher, ...data.vouchers],
    },
  };
}

export function setRewardStock(data, offerId, stock) {
  if (!Number.isSafeInteger(stock) || stock < 0 || stock > 10000) {
    return { data, error: "Isi stok dengan bilangan bulat 0–10.000." };
  }
  if (!data.rewardOffers.some((offer) => offer.id === offerId)) {
    return { data, error: "Reward tidak ditemukan." };
  }
  return {
    error: null,
    data: {
      ...data,
      rewardOffers: data.rewardOffers.map((offer) =>
        offer.id === offerId ? { ...offer, stock } : offer,
      ),
    },
  };
}
