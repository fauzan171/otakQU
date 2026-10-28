import { expect, test } from "vitest";
import {
  demoRewardOffers,
  redeemReward,
  setRewardStock,
} from "../src/rewards.js";

const state = () => ({
  points: 320,
  rewardOffers: demoRewardOffers.map((offer) => ({ ...offer })),
  vouchers: [],
});
const transaction = { id: "example-1", now: Date.UTC(2026, 9, 28) };

test("redemption updates balance, stock and voucher together without mutating the previous state", () => {
  const before = state();
  const result = redeemReward(before, "soluusi-25", transaction);
  expect(result.error).toBeNull();
  expect(result.data.points).toBe(120);
  expect(result.data.rewardOffers[0].stock).toBe(9);
  expect(result.data.vouchers).toHaveLength(1);
  expect(result.voucher.code).toMatch(/^DEMO-SOLUUSI-/);
  expect(result.voucher.expiresAt - transaction.now).toBe(30 * 86400000);
  expect(before).toEqual(state());
});

test("insufficient balance, sold out stock and unknown offers cannot spend coins", () => {
  for (const offerId of ["soluusi-50", "soluusi-75", "missing"]) {
    const before = state();
    const result = redeemReward(before, offerId, transaction);
    expect(result.error).toBeTruthy();
    expect(result.data).toBe(before);
  }
});

test("the last voucher cannot be oversold and the same transaction cannot be replayed", () => {
  const before = setRewardStock(
    { ...state(), points: 1000 },
    "soluusi-25",
    1,
  ).data;
  const first = redeemReward(before, "soluusi-25", transaction);
  const second = redeemReward(first.data, "soluusi-25", {
    ...transaction,
    id: "example-2",
  });
  expect(second.error).toContain("Stok reward habis");
  expect(second.data.points).toBe(800);
  const restocked = setRewardStock(first.data, "soluusi-25", 5).data;
  const replay = redeemReward(restocked, "soluusi-25", transaction);
  expect(replay.error).toContain("sudah diproses");
  expect(replay.data).toBe(restocked);
});

test("partner stock accepts zero and rejects fractional, negative or invalid quantities", () => {
  for (const stock of [-1, 1.5, NaN, Infinity, "5", 10001]) {
    const before = state();
    expect(setRewardStock(before, "soluusi-25", stock)).toEqual({
      data: before,
      error: expect.any(String),
    });
  }
  const updated = setRewardStock(state(), "soluusi-25", 0);
  expect(updated.error).toBeNull();
  expect(updated.data.rewardOffers[0].stock).toBe(0);
  expect(updated.data.points).toBe(320);
});
