import { describe, it, expect } from "vitest";
import { shuffleQuestionAnswers } from "./shuffleAnswers";
import type { Question } from "../types";

const base: Question = {
	id: "q1",
	title: "Q",
	feedback: "",
	answerType: "S",
	answers: ["A", "B", "C", "D", "E"],
	answer: 2,
	answerExplanations: ["eA", "eB", "eC", "eD", "eE"],
};

describe("shuffleQuestionAnswers", () => {
	it("keeps the same set of answers", () => {
		const shuffled = shuffleQuestionAnswers(base);
		expect([...shuffled.answers].sort()).toEqual([...base.answers].sort());
	});

	it("does not mutate the original question", () => {
		const copy = structuredClone(base);
		shuffleQuestionAnswers(base);
		expect(base).toEqual(copy);
	});

	it("keeps the correct answer (single) pointing to the same text", () => {
		for (let i = 0; i < 50; i++) {
			const s = shuffleQuestionAnswers(base);
			expect(s.answers[s.answer as number]).toBe("C");
		}
	});

	it("keeps the correct answers (multiple) pointing to the same texts", () => {
		const multi: Question = { ...base, answerType: "M", answer: [0, 3] };
		for (let i = 0; i < 50; i++) {
			const s = shuffleQuestionAnswers(multi);
			expect((s.answer as number[]).map((idx) => s.answers[idx]).sort()).toEqual(["A", "D"]);
		}
	});

	it("keeps explanations aligned with their answers", () => {
		for (let i = 0; i < 50; i++) {
			const s = shuffleQuestionAnswers(base);
			s.answers.forEach((text, idx) => expect(s.answerExplanations![idx]).toBe(`e${text}`));
		}
	});

	it("produces different orders across sessions for the same question", () => {
		const orders = new Set<string>();
		for (let i = 0; i < 30; i++) orders.add(shuffleQuestionAnswers(base).answers.join(""));
		expect(orders.size).toBeGreaterThan(1);
	});

	it("is uniform enough: every answer can land in first position", () => {
		const firsts = new Set<string>();
		for (let i = 0; i < 300; i++) firsts.add(shuffleQuestionAnswers(base).answers[0]);
		expect(firsts.size).toBe(base.answers.length);
	});

	it("leaves True/False questions untouched", () => {
		const tf: Question = { ...base, answerType: "TF", answers: [], answer: true };
		expect(shuffleQuestionAnswers(tf)).toBe(tf);
	});
});
