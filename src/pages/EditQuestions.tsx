import React from "react";
import TableQuestions from "../components/TableQuestions";

export default function EditQuestions() {
  return (
    <div className="EditQuestions">
      <div className="container">
        <h1 className="text-center">Edit Questions</h1>
        {/*
			  Stats :
			  - Total questions
			  - Total questions flagged
			  - Total questions missing feedback
			  */}
        <TableQuestions />
      </div>
    </div>
  );
}
