function AgileForm() {
	this.formTitle = "ACME Form";
	this.duration = 60;
	this.numberOfQuestions = 80;
	this.examMode = false;
	this.questions = [];
	this.questionCurrentIndex = -1;
	this.currentQuestion = 0;
	this.answers = [];
}

AgileForm.prototype.setTitle = function(title) {
	this.formTitle = title;
};
AgileForm.prototype.getTitle = function() {
	return this.formTitle;
};

AgileForm.prototype.setDuration = function(duration) {
	out = true;
	if (typeof duration !== "number") {
		out = false;
	} else {
		this.duration = duration;
	}

	return out;
};
AgileForm.prototype.getDuration = function() {
	return this.duration;
};

AgileForm.prototype.setNumberOfQuestions = function(numberOfQuestions) {
	out = true;
	if (typeof numberOfQuestions !== "number") {
		out = false;
	} else {
		this.numberOfQuestions = numberOfQuestions;
	}

	return out;
};
AgileForm.prototype.getNumberOfQuestions = function() {
	return this.numberOfQuestions;
};

AgileForm.prototype.getExamMode = function() {
	return this.examMode;
};

AgileForm.prototype.setExamMode = function(examMode) {
	out = false;
	if (examMode === undefined || examMode == true) {
		examMode = true;
		out = true;
	} else if (examMode == false) {
		examMode = false;
		out = true;
	} else {
		examMode = this.examMode;
	}
	this.examMode = examMode;
	return out;
};

AgileForm.prototype.addQuestion = function(agileQuestion) {
	out = false;
	if (agileQuestion instanceof AgileQuestion) {
		this.questions.push(agileQuestion);
		out = true;
	}

	return out;
};

AgileForm.prototype.countQuestions = function() {
	return this.questions.length;
};

AgileForm.prototype.loadQuestions = function(questionsJSON) {
	out = false;
	if (questionsJSON instanceof Object) {
		for (var i = 0; i < questionsJSON.length; i++) {
			error = false;
			var q = new AgileQuestion();
			q.setTitle(questionsJSON[i].title);
			q.setAnswerType(questionsJSON[i].answerType);
			q.setAnswer(questionsJSON[i].answer);
			q.setAnswers(questionsJSON[i].answers);
			q.setFeedback(questionsJSON[i].feedback);

			if (!error) {
				this.addQuestion(q);
			}
		}
	}

	return out;
};

AgileForm.prototype.getQuestionIndex = function() {
	return this.questionCurrentIndex;
}

AgileForm.prototype.getNextQuestion = function() {
	out = false;
	if (this.questionCurrentIndex < this.questions.length -1) {
		this.questionCurrentIndex++;
		out = this.questions[this.questionCurrentIndex];
	}

	return out;
}

AgileForm.prototype.getQuestionsCount = function() {
	return this.questions.length;
}

AgileForm.prototype.setCurrentQuestion = function(questionId) {
	out = false;
	if (questionId >= 0 && questionId <= this.getNumberOfQuestions()) {
		this.currentQuestion = questionId;
		out = true;
	}

	return out;
}

AgileForm.prototype.getCurrentQuestion = function() {
	return this.currentQuestion;
}

AgileForm.prototype.removeAnswer = function(questionId, answer) {
	var question;
	if (this.answers[questionId] != undefined) {
		question = this.questions[questionId];
		if (question.getAnswerType() == "M") {
			var currentAnswer = this.answers[questionId].getAnswer();
			if (currentAnswer == undefined) {
				currentAnswer = [];
			}
			answer = parseInt(answer);
			if (currentAnswer.indexOf(answer) != -1) {
				currentAnswer.splice(currentAnswer.indexOf(answer), 1);
			}
			this.answers[questionId].setAnswer(currentAnswer);
		}
	}

}

AgileForm.prototype.addAnswer = function(questionId, answer) {
	if (this.answers[questionId] == undefined) {
		this.answers[questionId] = new AgileAnswer();
		this.answers[questionId].setQuestionId(questionId);
	}
	var question = this.questions[questionId];
	console.log(questionId)
	if (question.getAnswerType() == "TF") {
		if (answer == 1) answer = true;
		if (answer == 0) answer = false;
		if (answer == true || answer == false) {
			this.answers[questionId].setAnswer(answer);
		}
	} else if (question.getAnswerType() == "S") {
		answer = parseInt(answer);
		this.answers[questionId].setAnswer([answer]);
	} else if (question.getAnswerType() == "M") {
		var currentAnswer = this.answers[questionId].getAnswer();
		if (currentAnswer == undefined) {
			currentAnswer = [];
		}
		answer = parseInt(answer);
		if (currentAnswer.indexOf(answer) == -1) {
			currentAnswer.push(answer);
			currentAnswer.sort();
		}
		this.answers[questionId].setAnswer(currentAnswer);
	}
};

AgileForm.prototype.getScore = function() {
	score = 0;

	for (var i = 0; i < this.questions.length; i++) {
		if (this.answers[i] instanceof AgileAnswer) {
			score += this.answers[i].getScore(this.questions[i]);
		}
	}

	return score;
}

AgileForm.prototype.getAnswersCount = function() {
	out = 0;

	for (var i = 0; i < this.questions.length; i++) {
		if (this.answers[i] instanceof AgileAnswer) {
			out++;
		}
	}

	return out;
}
