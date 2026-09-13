import { describe, expect, it } from "vitest";
import {
  CsvQuestionRow,
  getAnswerExplanations,
  getAnswerOptions,
  parseCorrectAnswer,
  parseCsvRow,
} from "./csvImport";

describe("parseCorrectAnswer", () => {
  describe("TF", () => {
    it.each(["true", "TRUE", "vrai", "1"])(
      "parses %s as true",
      (raw) => {
        expect(parseCorrectAnswer("TF", raw, 0)).toEqual({ value: true });
      }
    );

    it.each(["false", "FALSE", "faux", "0"])(
      "parses %s as false",
      (raw) => {
        expect(parseCorrectAnswer("TF", raw, 0)).toEqual({ value: false });
      }
    );

    it("errors on an unrecognized value", () => {
      expect(parseCorrectAnswer("TF", "maybe", 0)).toEqual({
        error: 'correctAnswer invalide pour TF : "maybe"',
      });
    });
  });

  describe("S", () => {
    it("converts a 1-based index to a 0-based index", () => {
      expect(parseCorrectAnswer("S", "2", 4)).toEqual({ value: 1 });
    });

    it("errors when the index is below 1", () => {
      expect(parseCorrectAnswer("S", "0", 4)).toEqual({
        error: 'correctAnswer hors limites : "0"',
      });
    });

    it("errors when the index exceeds the answer count", () => {
      expect(parseCorrectAnswer("S", "5", 4)).toEqual({
        error: 'correctAnswer hors limites : "5"',
      });
    });

    it("errors on a non-numeric value", () => {
      expect(parseCorrectAnswer("S", "abc", 4)).toEqual({
        error: 'correctAnswer hors limites : "abc"',
      });
    });
  });

  describe("M", () => {
    it("converts a comma-separated list of 1-based indexes", () => {
      expect(parseCorrectAnswer("M", "1,3", 4)).toEqual({ value: [0, 2] });
    });

    it("trims whitespace around each index", () => {
      expect(parseCorrectAnswer("M", " 1 , 3 ", 4)).toEqual({
        value: [0, 2],
      });
    });

    it("errors when any index is out of range", () => {
      expect(parseCorrectAnswer("M", "1,5", 4)).toEqual({
        error: 'correctAnswer invalide pour M : "1,5"',
      });
    });

    it("errors on an empty value", () => {
      expect(parseCorrectAnswer("M", "", 4)).toEqual({
        error: 'correctAnswer invalide pour M : ""',
      });
    });
  });

  it("errors on an unknown answerType", () => {
    expect(parseCorrectAnswer("X", "1", 4)).toEqual({
      error: 'answerType inconnu : "X"',
    });
  });
});

describe("getAnswerOptions", () => {
  it("orders answer columns numerically, not lexically", () => {
    const row: CsvQuestionRow = {
      answer10: "dixième",
      answer2: "deuxième",
      answer1: "première",
    };
    expect(getAnswerOptions(row)).toEqual([
      "première",
      "deuxième",
      "dixième",
    ]);
  });

  it("filters out empty answer cells", () => {
    const row: CsvQuestionRow = {
      answer1: "A",
      answer2: "",
      answer3: "  ",
      answer4: "B",
    };
    expect(getAnswerOptions(row)).toEqual(["A", "B"]);
  });

  it("ignores columns that only look like answer columns", () => {
    const row: CsvQuestionRow = {
      answerType: "S",
      correctAnswer: "1",
      answer1: "A",
    };
    expect(getAnswerOptions(row)).toEqual(["A"]);
  });
});

describe("getAnswerExplanations", () => {
  it("returns undefined when no explanation column is present", () => {
    const row: CsvQuestionRow = { answer1: "A", answer2: "B" };
    expect(getAnswerExplanations(row)).toBeUndefined();
  });

  it("returns undefined when every explanation cell is empty", () => {
    const row: CsvQuestionRow = {
      answer1: "A",
      answer2: "B",
      explanation1: "",
      explanation2: "  ",
    };
    expect(getAnswerExplanations(row)).toBeUndefined();
  });

  it("stays index-aligned with getAnswerOptions, skipping empty answer slots", () => {
    const row: CsvQuestionRow = {
      answer1: "A",
      answer2: "",
      answer3: "B",
      explanation1: "pourquoi A",
      explanation2: "jamais lue (answer2 est vide)",
      explanation3: "pourquoi B",
    };
    expect(getAnswerOptions(row)).toEqual(["A", "B"]);
    expect(getAnswerExplanations(row)).toEqual(["pourquoi A", "pourquoi B"]);
  });

  it("fills missing individual explanations with an empty string", () => {
    const row: CsvQuestionRow = {
      answer1: "A",
      answer2: "B",
      explanation1: "pourquoi A",
      // explanation2 absent
    };
    expect(getAnswerExplanations(row)).toEqual(["pourquoi A", ""]);
  });
});

describe("parseCsvRow", () => {
  it("parses a valid single-choice row", () => {
    const row: CsvQuestionRow = {
      title: "Qui est responsable du Product Backlog ?",
      feedback: "Le Product Owner.",
      answerType: "S",
      type: "pspo-I",
      answer1: "Le Scrum Master",
      answer2: "Le Product Owner",
      correctAnswer: "2",
    };

    expect(parseCsvRow(row, 2)).toEqual({
      question: {
        title: "Qui est responsable du Product Backlog ?",
        feedback: "Le Product Owner.",
        answerType: "S",
        type: "pspo-I",
        answers: ["Le Scrum Master", "Le Product Owner"],
        answer: 1,
      },
    });
  });

  it("parses a valid multiple-choice row", () => {
    const row: CsvQuestionRow = {
      title: "Quels événements font partie de Scrum ?",
      answerType: "M",
      answer1: "Sprint Planning",
      answer2: "Daily Scrum",
      answer3: "Comité de pilotage",
      correctAnswer: "1,2",
    };

    const result = parseCsvRow(row, 3);
    expect("question" in result && result.question.answer).toEqual([0, 1]);
  });

  it("parses a valid true/false row with no answer columns", () => {
    const row: CsvQuestionRow = {
      title: "Le Sprint Backlog est modifiable en cours de Sprint.",
      answerType: "TF",
      correctAnswer: "true",
    };

    expect(parseCsvRow(row, 4)).toEqual({
      question: {
        title: "Le Sprint Backlog est modifiable en cours de Sprint.",
        feedback: "",
        answerType: "TF",
        type: "pspo-I",
        answers: [],
        answer: true,
      },
    });
  });

  it("includes optional answerExplanations and domain when provided", () => {
    const row: CsvQuestionRow = {
      title: "Qui est responsable du Product Backlog ?",
      answerType: "S",
      answer1: "Le Scrum Master",
      answer2: "Le Product Owner",
      explanation1: "Incorrect : facilite mais ne décide pas.",
      explanation2: "Correct : seul responsable du backlog.",
      correctAnswer: "2",
      domain: "Roles and Responsibilities",
    };

    const result = parseCsvRow(row, 6);
    expect("question" in result && result.question.answerExplanations).toEqual([
      "Incorrect : facilite mais ne décide pas.",
      "Correct : seul responsable du backlog.",
    ]);
    expect("question" in result && result.question.domain).toBe(
      "Roles and Responsibilities"
    );
  });

  it("omits answerExplanations and domain entirely when absent", () => {
    const row: CsvQuestionRow = {
      title: "Qui est responsable du Product Backlog ?",
      answerType: "S",
      answer1: "Le Scrum Master",
      answer2: "Le Product Owner",
      correctAnswer: "2",
    };

    const result = parseCsvRow(row, 7);
    expect(
      "question" in result && "answerExplanations" in result.question
    ).toBe(false);
    expect("question" in result && "domain" in result.question).toBe(false);
  });

  it("reads explanation1/explanation2 for TF as [True, False], independent of answers", () => {
    const row: CsvQuestionRow = {
      title: "Le Sprint Backlog est modifiable en cours de Sprint.",
      answerType: "TF",
      explanation1: "Vrai : l'équipe ajuste le Sprint Backlog en continu.",
      explanation2: "Faux : ce serait l'inverse de la réalité.",
      correctAnswer: "true",
    };

    const result = parseCsvRow(row, 8);
    expect("question" in result && result.question.answers).toEqual([]);
    expect("question" in result && result.question.answerExplanations).toEqual([
      "Vrai : l'équipe ajuste le Sprint Backlog en continu.",
      "Faux : ce serait l'inverse de la réalité.",
    ]);
  });

  it("omits answerExplanations for TF when no explanation column is provided", () => {
    const row: CsvQuestionRow = {
      title: "Le Sprint Backlog est modifiable en cours de Sprint.",
      answerType: "TF",
      correctAnswer: "true",
    };

    const result = parseCsvRow(row, 9);
    expect(
      "question" in result && "answerExplanations" in result.question
    ).toBe(false);
  });

  it("defaults type to pspo-I when missing", () => {
    const row: CsvQuestionRow = {
      title: "Question sans formation",
      answerType: "TF",
      correctAnswer: "false",
    };

    const result = parseCsvRow(row, 5);
    expect("question" in result && result.question.type).toBe("pspo-I");
  });

  it("errors when the title is missing", () => {
    const row: CsvQuestionRow = { answerType: "TF", correctAnswer: "true" };
    expect(parseCsvRow(row, 6)).toEqual({
      error: "Ligne 6 : titre manquant",
    });
  });

  it("errors when answerType is invalid", () => {
    const row: CsvQuestionRow = {
      title: "Titre",
      answerType: "X",
      correctAnswer: "true",
    };
    expect(parseCsvRow(row, 7)).toEqual({
      error: 'Ligne 7 : answerType invalide "X"',
    });
  });

  it("propagates the correctAnswer error with the line number", () => {
    const row: CsvQuestionRow = {
      title: "Titre",
      answerType: "S",
      answer1: "A",
      correctAnswer: "5",
    };
    expect(parseCsvRow(row, 8)).toEqual({
      error: 'Ligne 8 : correctAnswer hors limites : "5"',
    });
  });
});
