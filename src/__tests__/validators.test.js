import { describe, it, expect } from "vitest";
import { required, email, minLength, vehiclePlate, numberBetween, futureDate, validate, passwordStrength } from "../utils/validators.js";

describe("validators", () => {
  it("required rejects blanks", () => {
    expect(required()("  ")).not.toBe("");
    expect(required()("x")).toBe("");
  });
  it("email accepts and rejects", () => {
    expect(email()("a@b.co")).toBe("");
    expect(email()("a@b")).not.toBe("");
  });
  it("validate returns the first failing rule", () => {
    const run = validate([required("req"), minLength(6, "short")]);
    expect(run("", {})).toBe("req");
    expect(run("abc", {})).toBe("short");
    expect(run("abcdef", {})).toBe("");
  });
  it("vehiclePlate", () => {
    expect(vehiclePlate()("hr26ab1234")).toBe("");
    expect(vehiclePlate()("1234")).not.toBe("");
  });
  it("numberBetween", () => {
    expect(numberBetween(10, 200)("40")).toBe("");
    expect(numberBetween(10, 200)("0")).not.toBe("");
  });
  it("futureDate blocks the past", () => {
    expect(futureDate(7)("2000-01-01")).toMatch(/past/);
  });
  it("passwordStrength grows with complexity", () => {
    expect(passwordStrength("abc")).toBe("Too short");
    expect(passwordStrength("Abcdef1234!")).toBe("Strong");
  });
});
