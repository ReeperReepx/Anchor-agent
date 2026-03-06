import { describe, it, expect } from "vitest";
import { getWeekStart, daysUntilRotation } from "../week";

describe("getWeekStart", () => {
  it("returns Monday for a Wednesday", () => {
    // 2024-01-17 is a Wednesday
    expect(getWeekStart(new Date("2024-01-17"))).toBe("2024-01-15");
  });

  it("returns same day for a Monday", () => {
    // 2024-01-15 is a Monday
    expect(getWeekStart(new Date("2024-01-15"))).toBe("2024-01-15");
  });

  it("returns previous Monday for a Sunday", () => {
    // 2024-01-21 is a Sunday
    expect(getWeekStart(new Date("2024-01-21"))).toBe("2024-01-15");
  });

  it("returns previous Monday for a Saturday", () => {
    // 2024-01-20 is a Saturday
    expect(getWeekStart(new Date("2024-01-20"))).toBe("2024-01-15");
  });

  it("handles month boundaries", () => {
    // 2024-02-01 is a Thursday, Monday is Jan 29
    expect(getWeekStart(new Date("2024-02-01"))).toBe("2024-01-29");
  });

  it("handles year boundaries", () => {
    // 2024-01-01 is a Monday
    expect(getWeekStart(new Date("2024-01-01"))).toBe("2024-01-01");
  });
});

describe("daysUntilRotation", () => {
  it("returns 7 on Monday (full week ahead)", () => {
    expect(daysUntilRotation(new Date("2024-01-15"))).toBe(7);
  });

  it("returns 6 on Tuesday", () => {
    expect(daysUntilRotation(new Date("2024-01-16"))).toBe(6);
  });

  it("returns 2 on Saturday", () => {
    expect(daysUntilRotation(new Date("2024-01-20"))).toBe(2);
  });

  it("returns 1 on Sunday", () => {
    expect(daysUntilRotation(new Date("2024-01-21"))).toBe(1);
  });

  it("returns 3 on Friday", () => {
    expect(daysUntilRotation(new Date("2024-01-19"))).toBe(3);
  });
});
