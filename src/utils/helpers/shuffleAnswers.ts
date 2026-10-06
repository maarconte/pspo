import type { Question } from "../types";

/** Fisher-Yates shuffle returning a new array. */
const shuffleIndices = (length: number): number[] => {
	const order = Array.from({ length }, (_, i) => i);
	for (let i = length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	return order;
};

/**
 * Returns a copy of the question with its possible answers in random order.
 * `answer` (index or indices) and `answerExplanations` are remapped so they stay
 * aligned. True/False questions have no `answers` and are returned untouched.
 */
export const shuffleQuestionAnswers = (question: Question): Question => {
	if (question.answerType === "TF" || !question.answers || question.answers.length < 2) {
		return question;
	}

	// order[newIndex] = oldIndex
	const order = shuffleIndices(question.answers.length);
	const newIndexOf = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]));

	const answer = Array.isArray(question.answer)
		? question.answer.map((old) => newIndexOf.get(old) ?? old)
		: typeof question.answer === "number"
			? (newIndexOf.get(question.answer) ?? question.answer)
			: question.answer;

	return {
		...question,
		answers: order.map((oldIndex) => question.answers[oldIndex]),
		answer,
		answerExplanations: question.answerExplanations
			? order.map((oldIndex) => question.answerExplanations![oldIndex])
			: undefined,
	};
};
