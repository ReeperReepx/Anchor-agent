import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders with text", () => {
    render(<Badge>daily</Badge>);
    expect(screen.getByText("daily")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Badge>test</Badge>);
    expect(screen.getByText("test").className).toContain("bg-[#F0F0F0]");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">done</Badge>);
    expect(screen.getByText("done").className).toContain("text-[#2D8A56]");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">warn</Badge>);
    expect(screen.getByText("warn").className).toContain("text-[#C4900A]");
  });

  it("applies info variant", () => {
    render(<Badge variant="info">info</Badge>);
    expect(screen.getByText("info").className).toContain("text-[#3B6FC4]");
  });

  it("accepts custom className", () => {
    render(<Badge className="extra-class">tag</Badge>);
    expect(screen.getByText("tag").className).toContain("extra-class");
  });
});
