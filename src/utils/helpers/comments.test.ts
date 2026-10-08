import { describe, expect, it } from "vitest";
import { createComment, getCommentDate, getCommentText } from "./comments";

describe("comments helpers", () => {
  it("reads text from legacy string comments and has no date for them", () => {
    expect(getCommentText("old comment")).toBe("old comment");
    expect(getCommentDate("old comment")).toBeNull();
  });

  it("reads text and a formatted date from dated comments", () => {
    const comment = { text: "typo in answer 2", createdAt: "2026-10-08T14:30:00.000Z" };
    expect(getCommentText(comment)).toBe("typo in answer 2");
    expect(getCommentDate(comment)).toBe("08 oct. 2026");
  });

  it("returns no date when createdAt is invalid", () => {
    expect(getCommentDate({ text: "x", createdAt: "not a date" })).toBeNull();
  });

  it("createComment stamps the current time", () => {
    const comment = createComment("hello");
    expect(getCommentText(comment)).toBe("hello");
    expect(getCommentDate(comment)).not.toBeNull();
  });
});
