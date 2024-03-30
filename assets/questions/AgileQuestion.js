function AgileQuestion() {
	this.answerType = "TF";
	this.answer = undefined;
	this.answers = ["True", "False"];
	this.title = "";
	this.feedback = "";
}

AgileQuestion.prototype.setTitle = function(title) {
	out = false;
	if (typeof title == "string" && title.length > 0) {
		this.title = title;
		out = true;
	}

	return out;
};

AgileQuestion.prototype.getTitle = function() {
	return this.title;
}

AgileQuestion.prototype.setFeedback = function(feedback) {
	out = false;
	if (typeof feedback == "string" && feedback.length > 0) {
		this.feedback = feedback;
		out = true;
	}

	return out;
};

AgileQuestion.prototype.getFeedback = function() {
	return this.feedback;
}
AgileQuestion.prototype.setAnswerType = function(answerType) {
	out = false;
	if (answerType === "TF" || answerType === "S" || answerType === "M") {
		this.answerType = answerType;
		this.answers = ["True", "False"];
		out = true;
	}
	return out;
};
AgileQuestion.prototype.getAnswerType = function() {
	return this.answerType;
};

AgileQuestion.prototype.setAnswer = function(answer) {
	out = false;
	if (this.answerType == "TF") {
		if (answer == true || answer == false) {
			this.answer = answer;
			out = true;
		}
	} else if (this.answerType == "S") {
		this.answer = [answer];
		out = true;
	} else if (this.answerType == "M") {
		if (answer instanceof Array && answer.length >= 1) {
			this.answer = answer;
			out = true;
		}
	}

	return out;
};

AgileQuestion.prototype.getAnswer = function() {
	return this.answer;
};

AgileQuestion.prototype.checkAnswer = function(answer) {
	out = false;
	if (this.answerType == "TF" && this.answer == answer) {
		out = true;
	}

	return out;
};

AgileQuestion.prototype.setAnswers = function(answers) {
	out =false;
	if(this.answerType == "TF") {
		this.answers = ["True", "False"];
		out = true;
	} else {
		if (answers instanceof Array && answers.length > 1) {
			this.answers = answers;
			out = true;
		}
	}

	return out;
};

AgileQuestion.prototype.getAnswers = function() {
	return this.answers;
}