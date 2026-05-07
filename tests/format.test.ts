import { describe, expect, test } from "vitest";
import { parseIncomeInput } from "@/lib/format";

describe("parseIncomeInput", () => {
  test("plain digits", () => {
    expect(parseIncomeInput("75000")).toBe(75_000);
  });

  test("commas", () => {
    expect(parseIncomeInput("1,500,000")).toBe(1_500_000);
  });

  test("dollar sign and whitespace tolerated", () => {
    expect(parseIncomeInput("$ 200,000 ")).toBe(200_000);
  });

  test("k suffix expands to thousands", () => {
    expect(parseIncomeInput("200k")).toBe(200_000);
  });

  test("uppercase K suffix", () => {
    expect(parseIncomeInput("75K")).toBe(75_000);
  });

  test("m suffix expands to millions", () => {
    expect(parseIncomeInput("1.5m")).toBe(1_500_000);
  });

  test("uppercase M suffix", () => {
    expect(parseIncomeInput("2M")).toBe(2_000_000);
  });

  test("decimal preserved without suffix", () => {
    expect(parseIncomeInput("1234.56")).toBe(1234.56);
  });

  test("empty / garbage falls back to 0", () => {
    expect(parseIncomeInput("")).toBe(0);
    expect(parseIncomeInput("abc")).toBe(0);
    expect(parseIncomeInput("$")).toBe(0);
  });

  test("negative input rejected", () => {
    expect(parseIncomeInput("-1000")).toBe(0);
  });
});
