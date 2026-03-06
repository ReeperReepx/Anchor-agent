import { describe, it, expect } from "vitest";
import { calculateStreakUpdate } from "../streaks";
import type { Streak } from "@/lib/types/database";

function makeStreak(overrides: Partial<Streak> = {}): Streak {
  return {
    id: "test-id",
    user_id: "user-1",
    current_streak: 0,
    longest_streak: 0,
    last_standup_date: null,
    ...overrides,
  };
}

describe("calculateStreakUpdate", () => {
  it("starts a new streak from zero", () => {
    const streak = makeStreak();
    const result = calculateStreakUpdate(streak, "2024-01-15");

    expect(result.current_streak).toBe(1);
    expect(result.longest_streak).toBe(1);
    expect(result.last_standup_date).toBe("2024-01-15");
  });

  it("increments streak on consecutive day", () => {
    const streak = makeStreak({
      current_streak: 3,
      longest_streak: 5,
      last_standup_date: "2024-01-14",
    });
    const result = calculateStreakUpdate(streak, "2024-01-15");

    expect(result.current_streak).toBe(4);
    expect(result.longest_streak).toBe(5);
    expect(result.last_standup_date).toBe("2024-01-15");
  });

  it("updates longest streak when current exceeds it", () => {
    const streak = makeStreak({
      current_streak: 5,
      longest_streak: 5,
      last_standup_date: "2024-01-14",
    });
    const result = calculateStreakUpdate(streak, "2024-01-15");

    expect(result.current_streak).toBe(6);
    expect(result.longest_streak).toBe(6);
  });

  it("resets streak after a missed day", () => {
    const streak = makeStreak({
      current_streak: 5,
      longest_streak: 10,
      last_standup_date: "2024-01-13",
    });
    const result = calculateStreakUpdate(streak, "2024-01-15");

    expect(result.current_streak).toBe(1);
    expect(result.longest_streak).toBe(10);
  });

  it("does not change streak on same day", () => {
    const streak = makeStreak({
      current_streak: 3,
      longest_streak: 5,
      last_standup_date: "2024-01-15",
    });
    const result = calculateStreakUpdate(streak, "2024-01-15");

    expect(result.current_streak).toBe(3);
    expect(result.longest_streak).toBe(5);
    expect(result.last_standup_date).toBe("2024-01-15");
  });

  it("handles month boundary correctly", () => {
    const streak = makeStreak({
      current_streak: 2,
      longest_streak: 2,
      last_standup_date: "2024-01-31",
    });
    const result = calculateStreakUpdate(streak, "2024-02-01");

    expect(result.current_streak).toBe(3);
    expect(result.longest_streak).toBe(3);
  });

  it("handles year boundary correctly", () => {
    const streak = makeStreak({
      current_streak: 10,
      longest_streak: 10,
      last_standup_date: "2023-12-31",
    });
    const result = calculateStreakUpdate(streak, "2024-01-01");

    expect(result.current_streak).toBe(11);
    expect(result.longest_streak).toBe(11);
  });
});
