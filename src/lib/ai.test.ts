import { describe, it, expect } from "vitest";
import { scoreProductivity } from "./ai";
import type { StandupSummaries } from "./ai";

describe("scoreProductivity", () => {
  const baseSummaries: StandupSummaries = {
    done_summary: null,
    planned_summary: null,
    blockers_summary: null,
  };

  it("returns 0% for empty summaries", () => {
    const result = scoreProductivity(baseSummaries, 300, null);
    expect(result.score).toBe(0);
  });

  it("returns low score for minimal done summary", () => {
    const result = scoreProductivity(
      { ...baseSummaries, done_summary: "Fixed a bug" },
      300,
      null,
    );
    expect(result.score).toBeGreaterThanOrEqual(1);
    expect(result.score).toBeLessThanOrEqual(50);
  });

  it("returns higher score for multiple completed tasks", () => {
    const result = scoreProductivity(
      {
        done_summary: "Shipped onboarding flow, fixed two auth bugs, and updated the pricing page",
        planned_summary: "Stripe integration and dashboard redesign",
        blockers_summary: "Waiting on API keys from the provider",
      },
      300,
      null,
    );
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("gives bonus for follow-through on previous plan", () => {
    const withoutFollowThrough = scoreProductivity(
      {
        done_summary: "Finished the Stripe integration",
        planned_summary: "Work on dashboard",
        blockers_summary: null,
      },
      300,
      null,
    );

    const withFollowThrough = scoreProductivity(
      {
        done_summary: "Finished the Stripe integration",
        planned_summary: "Work on dashboard",
        blockers_summary: null,
      },
      300,
      "Stripe integration and payment flow",
    );

    expect(withFollowThrough.score).toBeGreaterThanOrEqual(withoutFollowThrough.score);
  });

  it("penalizes very short sessions", () => {
    const normalSession = scoreProductivity(
      { ...baseSummaries, done_summary: "Made some progress on the project" },
      300,
      null,
    );

    const shortSession = scoreProductivity(
      { ...baseSummaries, done_summary: "Made some progress on the project" },
      30,
      null,
    );

    expect(shortSession.score).toBeLessThanOrEqual(normalSession.score);
  });

  it("returns score between 0 and 100", () => {
    // Test with maximum inputs
    const maxResult = scoreProductivity(
      {
        done_summary: "Shipped feature A, fixed bug B, and deployed C",
        planned_summary: "Feature D and feature E",
        blockers_summary: "Waiting on review",
      },
      600,
      "Feature A and bug B",
    );
    expect(maxResult.score).toBeGreaterThanOrEqual(0);
    expect(maxResult.score).toBeLessThanOrEqual(100);

    // Test with minimum inputs
    const minResult = scoreProductivity(baseSummaries, null, null);
    expect(minResult.score).toBeGreaterThanOrEqual(0);
    expect(minResult.score).toBeLessThanOrEqual(100);
  });

  it("includes reasoning string", () => {
    const result = scoreProductivity(
      {
        done_summary: "Built the new landing page",
        planned_summary: "Deploy to production",
        blockers_summary: null,
      },
      300,
      null,
    );
    expect(typeof result.reasoning).toBe("string");
    expect(result.reasoning.length).toBeGreaterThan(0);
  });

  it("recognizes blocker awareness as positive signal", () => {
    const withoutBlocker = scoreProductivity(
      {
        done_summary: "Shipped onboarding, fixed auth",
        planned_summary: "Work on payments",
        blockers_summary: null,
      },
      300,
      null,
    );

    const withBlocker = scoreProductivity(
      {
        done_summary: "Shipped onboarding, fixed auth",
        planned_summary: "Work on payments",
        blockers_summary: "Need API credentials from provider",
      },
      300,
      null,
    );

    expect(withBlocker.score).toBeGreaterThanOrEqual(withoutBlocker.score);
    expect(withBlocker.reasoning).toContain("blocker");
  });

  it("does not count 'no blockers' as a real blocker", () => {
    const result = scoreProductivity(
      {
        done_summary: "Made progress",
        planned_summary: null,
        blockers_summary: "No blockers",
      },
      300,
      null,
    );
    expect(result.reasoning).not.toContain("blocker");
  });
});
