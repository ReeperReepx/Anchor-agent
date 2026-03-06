import { describe, it, expect } from "vitest";
import {
  formatDuration,
  formatRelativeDate,
  formatStandupType,
} from "../formatting";

describe("formatDuration", () => {
  it("formats seconds only", () => {
    expect(formatDuration(45)).toBe("45s");
  });

  it("formats minutes only", () => {
    expect(formatDuration(120)).toBe("2m");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(125)).toBe("2m 5s");
  });

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0s");
  });

  it("formats large durations", () => {
    expect(formatDuration(3600)).toBe("60m");
  });
});

describe("formatRelativeDate", () => {
  it("returns 'Today' for today's date", () => {
    const today = new Date().toISOString();
    expect(formatRelativeDate(today)).toBe("Today");
  });

  it("returns 'Yesterday' for yesterday", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    expect(formatRelativeDate(yesterday)).toBe("Yesterday");
  });

  it("returns 'X days ago' for recent dates", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(formatRelativeDate(threeDaysAgo)).toBe("3 days ago");
  });

  it("returns formatted date for old dates", () => {
    const result = formatRelativeDate("2020-06-15T12:00:00Z");
    expect(result).toMatch(/Jun 15/);
  });
});

describe("formatStandupType", () => {
  it("formats daily", () => {
    expect(formatStandupType("daily")).toBe("Daily Standup");
  });

  it("formats weekly", () => {
    expect(formatStandupType("weekly")).toBe("Weekly Planning");
  });
});
