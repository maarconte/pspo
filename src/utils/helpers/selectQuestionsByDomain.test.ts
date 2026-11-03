import { describe, expect, it } from "vitest";
import type { Question } from "../types";
import { selectQuestionsByDomain } from "./selectQuestionsByDomain";

const make = (prefix: string, n: number, domain?: string): Question[] =>
	Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i}`, domain }) as unknown as Question);

const countBy = (qs: Question[], domain?: string) => qs.filter((q) => q.domain === domain).length;

describe("selectQuestionsByDomain", () => {
	const pool = [...make("a", 50, "A"), ...make("b", 50, "B"), ...make("n", 50)];

	it("draws a plain random sample without percentages", () => {
		const result = selectQuestionsByDomain(pool, 20);
		expect(result).toHaveLength(20);
		expect(new Set(result.map((q) => q.id)).size).toBe(20);
	});

	it("respects the per-domain shares, the rest going to questions without domain", () => {
		const result = selectQuestionsByDomain(pool, 40, { A: 50, B: 25 });
		expect(result).toHaveLength(40);
		expect(countBy(result, "A")).toBe(20);
		expect(countBy(result, "B")).toBe(10);
		expect(countBy(result, undefined)).toBe(10);
	});

	it("always returns exactly `count` questions when rounding is uneven", () => {
		const result = selectQuestionsByDomain(pool, 10, { A: 34, B: 33 });
		expect(result).toHaveLength(10);
	});

	it("fills the shortfall from other questions when a domain is too small", () => {
		const small = [...make("a", 2, "A"), ...make("n", 50)];
		const result = selectQuestionsByDomain(small, 10, { A: 50 });
		expect(result).toHaveLength(10);
		expect(countBy(result, "A")).toBe(2);
	});

	it("never returns duplicates", () => {
		const result = selectQuestionsByDomain(pool, 60, { A: 30, B: 30 });
		expect(new Set(result.map((q) => q.id)).size).toBe(result.length);
	});
});
