function AgileAnswer() {
	this.answer = undefined;
	this.questionId = undefined;
}

AgileAnswer.prototype.getQuestionId = function() {
	return this.questionId;
};

AgileAnswer.prototype.setQuestionId = function(questionId) {
	out = false;
	if (questionId > 0 && Number.isInteger(questionId)) {
		this.questionId = 0 + questionId;
		out = true;
	}
	return out;
};

AgileAnswer.prototype.getAnswer = function() {
	return this.answer;
};

AgileAnswer.prototype.setAnswer = function(answer) {
	out = false;
	if (answer === true || answer === false) {
		this.answer = answer;
	}
	if (answer instanceof Array && answer.length >= 1) {
		invalidArgument = false;
		answer.forEach(function(e) {
			if (!Number.isInteger(e)) {
				invalidArgument = true;
			}
		});
		if (!invalidArgument) {
			this.answer = answer;
			out = true;
		}
	}

	return out;
}

AgileAnswer.prototype.getScore = function(agileQuestion) {
	questionAnswers = agileQuestion.getAnswer();
	score = 0;
	if (agileQuestion.getAnswerType() == "TF") {
		if (this.answer == questionAnswers) {
			score = 1;
		}
	} else if (agileQuestion.getAnswerType() == "S") {
		if (this.answer.length == 1 && questionAnswers.length == 1 && this.answer[0] == questionAnswers[0]) {
			score = 1;
		}
	} else if (agileQuestion.answerType === "M") {
		const filteredAnswers = this.answer.filter(element => !Number.isNaN(element));
		if (filteredAnswers.length === questionAnswers.length) {
			different = false;
			for (var i = 0; i < filteredAnswers.length; i++) {
				if (filteredAnswers[i] != questionAnswers[i]) {
					different = true;
				}
			}
			if (!different) score = 1;
		}
	}

	return score;
}
