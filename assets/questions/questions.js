var questionsTitle = "Professional Scrum Product Owner";
var questionsDefaultDuration = 60;
var questionsDefaultNumberQuestions = 80;
var questionsJSON = [
/*
	{
		title: 		"",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"",
		answerType: "S",
		answers: 	[
						""
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"",
		answerType: "M",
		answers: 	[
						""
					],
		answer: 	[0],
		feedback: 	""
	},
*/
	{
		title: 		"Who should know the most about the progress toward a business objective or a release, and be able to explain the alternatives most clearly?",
		answerType: "S",
		answers: 	[
						"The Development Team",
						"The Scrum Master",
						"The Project Manager",
						"The Product Owner"
					],
		answer: 	3,
		feedback: 	"The Product Owner is the sole person responsible for managing the Product Backlog, which includes that the Product Backlog is visible, transparent, and clear to all, and shows what the Scrum Team will work on next."
	},
	{
		title: 		"What is the main reason for the Scrum Master to be at the Daily Scrum?",
		answerType: "S",
		answers: 	[
						"He or she does not have to be there; he or she only has to ensure the Development Team has a Daily Scrum.",
						"To make sure every team member answers the three questions.",
						"To gather status and progress information to report to management.",
						"To write down any changes to the Sprint Backlog, including adding new items, and tracking  progress on the burn-down."
					],
		answer: 	0,
		feedback: 	"The Scrum Master enforces the rule that only Development Team members participate in the Daily Scrum."
	},
	{
		title: 		"What does it mean to say that an event has a time-box?",
		answerType: "S",
		answers: 	[
						"The event must happen by a given time",
						"The event can take no more than a maximum amount of time.",
						"The event must take at least a minimum amount of time.",
						"The event must happen at a set time"
					],
		answer: 	1,
		feedback: 	"Time-boxed events are events that have a maximum duration."
	},
	{
		title: 		"Which statement best describes the Sprint Review?",
		answerType: "S",
		answers: 	[
						"It is a mechanism to control the Development Team's activities during a Sprint.",
						"It is a demo at the end of the Sprint for everyone in the organization to check on the work done.",
						"It is when the Scrum Team and stakeholders inspect the outcome of a Sprint and figure out what to do next."
					],
		answer: 	2,
		feedback: 	"Every event in Scrum, besides the Sprint which is a container for the other events, is an opportunity to Inspect AND Adapt."
	},
	{
		title: 		"Who creates the definition of Done?",
		answerType: "S",
		answers: 	[
						"The development organization (or Development Team if none is available from the development organization)",
						"The Product Owner as he/she is responsible for the product's success",
						"The Scrum Team, in a collaborative effort where the result is the common denominator of all members' definitions",
						"The Scrum Master as he/she is responsible for the Development Team's productivity"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"When might a Sprint be abnormally cancelled?",
		answerType: "S",
		answers: 	[
						"When it becomes clear that not everything will be finished by the end of the Sprint.",
						"When the Sprint Goal becomes obsolete.",
						"When the Development Team feels that the work is too hard",
						"When the sales department has an important new opportunity."
					],
		answer: 	1,
		feedback: 	"A Sprint can be cancelled before the Sprint time-box is over. A Sprint would be cancelled if the Sprint Goal becomes obsolete. This might occur if the company changes direction or if market or technology conditions change."
	},
	{
		title: 		"The Scrum Team should choose at least one high priority process improvement, identified during the Sprint Retrospective, and place it in the Product Backlog.",
		answerType: "TF",
		answer: 	false,
		feedback: 	"False, to ensure continuous improvement, the Sprint Backlog rather than the Product Backlog includes at least one high priority process improvement identified in the previous Sprint Retrospective meeting."
	},
	{
		title: 		"Who is required to attend the Daily Scrum?",
		answerType: "S",
		answers: 	[
						"The Scrum team.",
						"The Development Team.",
						"The Development Team and Scrum Master.",
						"The Development Team and Product Owner.",
						"The Scrum Master and Product Owner."
					],
		answer: 	1,
		feedback: 	"Only the people doing the work described on the Sprint Backlog need to inspect and adapt at the Daily Scrum. If the Scrum Master or Product Owner is also on the Development Team, they will need to be at the Daily Scrum. Otherwise, the Scrum Master simply has to make sure the Development Team knows how to conduct a Daily Scrum and does so."
	},
	{
		title: 		"When does the next Sprint begin?",
		answerType: "S",
		answers: 	[
						"Next Monday.",
						"Immediately after the conclusion of the previous Sprint.",
						"Immediately following the next Sprint Planning.",
						"When the Product Owner is ready."
					],
		answer: 	1,
		feedback: 	"A new Sprint starts immediately after the conclusion of the previous Sprint"
	},
	{
		title: 		"You are the Scrum Master of a new, to be developed product. Development is going to require 45 people. What is a good first question for you to suggest the group thinks about when forming into teams ?",
		answerType: "S",
		answers: 	[
						"What is the right mixture of senior and junior people on each team?",
						"Who are the subject matter experts on each team?",
						"Who are going to be the team leads?",
						"How will we make sure all teams have the right amount of expertise?"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"One of the Scrum events is the Daily Scrum. What are two intended outcomes of the Daily Scrum ?",
		answerType: "M",
		answers: 	[
						"An update of completed tasks and of the remaining work so the Scrum Master can plan the next day.",
						"A status report for the upper management indicating what each individual has done, will be doing, and what is impeding him/her",
						"A shared understanding of the most important work to be undertaken next to achieve the best possible progress toward the Sprint Goal.",
						"An updated Scrum board to make Sprint progress transparent for the stakeholders.",
						"New impediments for the Scrum Master to take care of"
					],
		answer: 	[2, 4],
		feedback: 	"À vérifier"
	},
	{
		title: 		"A Scrum Master is introducing Scrum to a new Development Team. The Development Team has decided that a Sprint Retrospective is unnecessary. What action should the Scrum Master take ?",
		answerType: "S",
		answers: 	[
						"Consult with the Product Owner to see how he/she feels about the situation.",
						"Begin facilitation productive and useful Sprint Retrospectives.",
						"Comply with the decision of the self-organizing team.",
						"Call a meeting between the Development Team and senior management."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Which two ways of creating Development Teams are consistent with Scrum's values ?",
		answerType: "M",
		answers: 	[
						"Managers collaborate to assign individuals to specific teams.",
						"Bring all developers together and let them self-organize into Development Teams.",
						"Managers personally re-assign current subordinates to new teams.",
						"The Chief Product Owner determines the new team structures and assignments.",
						"Existing teams propose how they would like to go about organizing into new structure."
					],
		answer: 	[1, 4],
		feedback: 	""
	},
	{
		title: 		"For which is the Scrum Master responsible?",
		answerType: "S",
		answers: 	[
						"The meetings and the objectives that a Scrum Team sets for itself.",
						"The Scrum framework being adopted and used properly.",
						"Managing the performance of the Scrum Team.",
						"Keeping track of resource allocation."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Cross-functional teams are optimized to work on one technical layer of a system only (e.g. GUI, database, middle tier, interfaces).",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Who must attend the Daily Scrum ?",
		answerType: "S",
		answers: 	[
						"The Scrum Master and Product Owner.",
						"The Scrum Team.",
						"The Development Team.",
						"The Development Team and the Scrum Master.",
						"The Development Team and Product Owner."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Who determines how work is performed during the Sprint ?",
		answerType: "S",
		answers: 	[
						"Subject matter experts.",
						"The Scrum Master.",
						"Development Team managers.",
						"Architects.",
						"The Development Team."
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title: 		"As the Sprint Planning meeting progresses, the Development Team sees that the workload is greater than they can handle. Which two are valid actions ?",
		answerType: "M",
		answers: 	[
						"Remove or change selected Product Backlog items.",
						"The Development Team ensures that the Product Owner is aware, starts the Sprint, and monitors progress.",
						"Cancel the Sprint.",
						"The Development Team works overtime during this Sprint.",
						"Recruit additional Development Team members before the work can begin."
					],
		answer: 	[0, 1],
		feedback: 	"Le Sprint ne peut pas être annulé durant le Sprint Planning, vu que c'est là qu'on fixe le Sprint Goal. Scrum privilégie un travail soutenable, pas d'heures supplémentaires. Le recrutement d'un nouveau développeur baisse à court terme la vélocité de l'équipe."
	},
	{
		title: 		"An organization has decided to adopt Scrum, but management wants to change the terminology to fit with terminology already used. What will likely happen if this is done?",
		answerType: "S",
		answers: 	[
						"Without a new vocabulary as a reminder of the change, very little change may actually happen.",
						"The organization may not understand what has changed with Scrum and the benefits of Scrum may be lost.",
						"Management may feel less anxious.",
						"All answers apply."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"Which Scrum Value is affected by a lack of trust in the Scrum Team ?",
		answerType: "S",
		answers: 	[
						"Focus.",
						"Respect.",
						"Openness.",
						"Courage.",
						"Commitment.",
						"All of the above."
					],
		answer: 	5,
		feedback: 	"À vérifier"
	},
	{
		title: 		"The length of a Sprint should be :",
		answerType: "S",
		answers: 	[
						"Short enough to keep the business risks acceptable to the Product Owner.",
						"Short enough to be able to synchronize the development work with other business events.",
						"No more than one calendar month.",
						"All of these answers are correct."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"A Product Owner wants advice from the Scrum Master about estimating work in Scrum. Which of these is the guideline that a Scrum Master should give ?",
		answerType: "S",
		answers: 	[
						"Product Backlog items must be estimated in story points.",
						"Estimates are made by the Development Team.",
						"Scrum forbids estimating.",
						"Estimates are made by the Product Owner, but are best checked with the Development Team.",
						"Estimates must be in relative units."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Which three questions might be answered by Development Team members at the Daily Scrum ?",
		answerType: "M",
		answers: 	[
						"How is the Sprint proceeding?",
						"How many hours did I spend on the project yesterday?",
						"What will I do today to help the Development Team meet the Sprint Goal?",
						"Do I see any impediment that prevents me or the Development Team from meeting the Sprint Goal?",
						"What did I do yesterday that helped the Development Team meet the Sprint Goal?",
						"What will I be working on tomorrow?",
						"Why were you late?"
					],
		answer: 	[2, 3, 4],
		feedback: 	""
	},
	{
		title: 		"A Development Team asks their Product Owner to re-order the Product Backlog. The team is waiting for an external supplier to deliver a specific software component. Without that component there won't be enough work in the next Sprint to occupy the full team. The Product Owner asks the Scrum Master for help. What would be good advice to give the Product Owner ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"Tell the Product Owner that his primary concern is the flow of value reflected in the ordering of the Product Backlog.",
						"Tell the Product Owner to re-order the Product Backlog so the work involving the external component can be planned in a separate sprint.",
						"Tell the Product Owner that the Product Backlog should be ordered to maximize utilisation of the Development Team."
					],
		answer: 	1,
		feedback: 	"à vérifier"
	},
	{
		title: 		"During a Sprint, when is new work or further decomposition of work added to the Sprint Backlog ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"When the Scrum Master has time to enter them.",
						"During the Daily Scrum after the Development Team approves them.",
						"As soon as possible after they are identified.",
						"When the Product Owner identifies new work."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"How do you know a Development Team is cross-functional ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"Every member of the Development Team is able to perform every task.",
						"There are no conflicts within the Development Team.",
						"Development Team has all the skills to create a potentially releasable increment by the end of every Sprint.",
						"A few of the Development Team members pair program and do Test Driven Development."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which three of the following are true about Scrum ?",
		answerType: "M",
		answers: 	[
						"Scrum is based on empirical process control theory.",
						"Each component of Scrum serves a specific purpose and is essential to Scrum's success and your usage of Scrum to develop complex products.",
						"Scrum is like traditional processes but with self-organization to replace Project Managers.",
						"Scrum is a methodology where you can pick and choose which parts of Scrum you think will work for your environment.",
						"Scrum is a framework for developing and sustaining complex products."
					],
		answer: 	[0, 1, 4],
		feedback: 	""
	},
	{
		title: 		"The Development Team should have all the skills needed to:",
		answerType: "S",
		answers: 	[
						"Do all of the development work, except for specialized testing that requires additional tools and environments.",
						"Complete the project within the date and cost as calculated by the Product Owner.",
						"Turn Product Backlog items into an Increment of potentially releasable product functionality."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"The time-box for a Daily Scrum is ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"4 hours.",
						"The same time of day every day.",
						"15 minutes for a 4 week sprint. For shorter Sprints it is usually shorter.",
						"15 minutes.",
						"Two minutes per person."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"What is the time-box for the Sprint Planning meeting ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"Whenever it is done.",
						"8 Hours for a monthly Sprint.",
						"4 Hours for a monthly Sprint.",
						"Monthly"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"What two factors are best considered when establishing the Sprint length ?",
		answerType: "M",
		answers: 	[
						"The organization has mandated similar length sprints.",
						"The risk of being disconnected from the stakeholders.",
						"The level of uncertainty over the technology to be used.",
						"The frequency at which team formation can changed."
					],
		answer: 	[1, 2],
		feedback: 	""
	},
	{
		title: 		"Which statement best describes a Product Owner's responsibility ?",
		answerType: "S",
		answers: 	[
						"Keeping stakeholders as bay.",
						"Directing the Development Team.",
						"Optimizing the value of the work the Development Team does.",
						"Managing the project and ensuring that the work meets the commitments to the stakeholders."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"How is management external to the Scrum Team involved in the Daily Scrum ? (choose the best answer)",
		answerType: "S",
		answers: 	[
						"The Product Owner represents their opinions.",
						"Management gives an update at the start of each Daily Scrum.",
						"The Development Team self-manages and is the only management required at the Daily Scrum.",
						"The Scrum Master speaks on their behalf"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which statement best describes the Sprint Review ?",
		answerType: "S",
		answers: 	[
						"It is used to congratulate the Development Team if it did what it forecast, or to punish the Development Team if it failed to meet its forecast.",
						"It is a mechanism to control the Development Team's activities during a Sprint.",
						"It is when the Scrum Team and stakeholders inspect the outcome of a Sprint and figure out what to do next.",
						"It is a demo at the end of the Sprint for everyone in the organization to check on the work done."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"A Scrum Team has been working on a product for nine Sprints. A new Product Owner comes in, understanding he is accountable for the Product Backlog. However, he is unsure about his responsabilities. Which two activities are part of the Product Owner role according to Scrum ? (choose the best two answers)",
		answerType: "M",
		answers: 	[
						"Interacting with stakeholders.",
						"Ensuring that the most valuable functionality is produced first, at all times.",
						"Creating detailed functional test cases.",
						"Providing the Development Team with detailed specifications.",
						"Describing features as Use Cases."
					],
		answer: 	[0, 1],
		feedback: 	""
	},
	{
		title: 		"Which Scrum Values are exhibited by not building Product Backlog items that have low business value ?",
		answerType: "M",
		answers: 	[
						"Focus.",
						"Courage.",
						"Respect.",
						"Economic Value Added.",
						"Earned Value."
					],
		answer: 	[0, 1, 2],
		feedback: 	""
	},
	{
		title: 		"Which of the following best describes an increment of working software?",
		answerType: "S",
		answers: 	[
						"A decomposition of all Product Backlog items into tasks for future Sprint Backlog lists.",
						"An automated test suite to verify functionality delivered in previous iterations.",
						"A new user interface design for functionality delivered in previous iterations.",
						"UML diagrams that describe how to deliver functionality in future iterations.",
						"Additional features in a usable state that complement those delivered in previous iterations"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title: 		"Who must do all the work to make sure Product Backlog items conform to the Definition of \"Done?\"",
		answerType: "S",
		answers: 	[
						"The Scrum Team",
						"The Development Team",
						"The Product Owner",
						"QA Specialists",
						"The Scrum Master"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Who is responsible for clearly expressing Product Backlog Items?",
		answerType: "S",
		answers: 	[
						"The business analyst who represents the Product Owner in the Development Team.",
						"The Scrum Master, or the Scrum Master may have the Development Team do it.",
						"The Scrum Master.",
						"The Product Owner."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"When does a Development Team member become the sole owner of a Sprint Backlog item?",
		answerType: "S",
		answers: 	[
						"At the Sprint planning meeting.",
						"Never. All Sprint Backlog Items are \"owned\" by the entire Development Team, even though each one may be implemented by an individual development team member.",
						"Whenever a team member can accommodate more work.",
						"During the Daily Scrum."
					],
		answer: 	1,
		feedback: 	"Sprint Backlog and all of its items are collectively owned by the Development Team. No individual team member can claim ownership over an item as this would block communication and collaboration."
	},
	{
		title: 		"The maximum length of the Sprint Review (its time-box) is:",
		answerType: "S",
		answers: 	[
						"2 hours.",
						"4 hours for a monthly Sprint. For shorter Sprints it is usually shorter.",
						"As long as needed.",
						"1 day.",
						"4 hours and longer as needed."
					],
		answer: 	1,
		feedback: 	"Sprint Review is a four-hour time-boxed meeting for one-month Sprints. For shorter Sprints, the event is usually shorter."
	},
	{
		title: 		"During a Sprint, a Development Team determines that it will not be able to finish the complete forecast. Who should be present to review and adjust the Sprint work selected?",
		answerType: "S",
		answers: 	[
						"The Scrum Master, the project manager and the Development Team.",
						"The Product Owner and the Development Team.",
						"The Product Owner and all stakeholders.",
						"The Development Team."
					],
		answer: 	1,
		feedback: 	"During the Sprint, scope may be clarified and re-negotiated between the Product Owner and Development Team as more is learned."
	},
	{
		title: 		"The CEO asks the Development Team to add a \"very important\" item to a Sprint that is in progress. What should the Development Team do?",
		answerType: "S",
		answers: 	[
						"Add the item to the current Sprint without any adjustments.",
						"Add the item to the current Sprint and drop an item of equal size.",
						"Add the item to the next Sprint.",
						"Inform the Product Owner so he/she can work with the CEO."
					],
		answer: 	3,
		feedback: 	"The items selected for a Sprint have been selected as most valuable with the Product Owner. The items serve the Sprint's goal. No changes should be made that endanger the Sprint Goal. No one external to the Scrum Team can force changes on the Development Team (Sprint Backlog) and the Product Owner (Product Backlog)."
	},
	{
		title: 		"Which two things does the Development Team do during the first Sprint?",
		answerType: "M",
		answers: 	[
						"Deliver an increment of potentially releasable software.",
						"Determine the complete architecture and infrastructure for the product.",
						"Develop and deliver at least one piece of functionality.",
						"Develop a plan for the rest of the release.",
						"Create the complete Product Backlog to be developed in subsequent Sprints."
					],
		answer: 	[0, 2],
		feedback: 	"The heart of Scrum is a Sprint, a time-box of one month or less during which a \"Done\", useable, and potentially releasable product Increment is created. This applies to every Sprint"
	},
	{
		title: 		"Which statement best describes a Product Owner's responsibility?",
		answerType: "S",
		answers: 	[
						"Optimizing the value of the work the Development Team does.",
						"Directing the Development Team.",
						"Managing the project and ensuring that the work meets the commitments to the stakeholders.",
						"Keeping stakeholders at bay."
					],
		answer: 	0,
		feedback: 	"The Product Owner is responsible for maximizing the value of the product and the work of the Development Team."
	},
	{
		title: 		"The purpose of a Sprint is to produce a done increment of working product.",
		answerType: "TF",
		answer: 	true,
		feedback: 	"The heart of Scrum is a Sprint, a time-box of one month or less during which a \"Done\", usable, and potentially releasable product Increment is created."
	},
	{
		title: 		"What is the role of Management in Scrum?",
		answerType: "S",
		answers: 	[
						"Continually monitor staffing levels of the Development Team.",
						"Monitor the Development Team's productivity.",
						"Support the Product Owner with insights and information into high value product and system capabilities. Support the Scrum Master to cause organizational change that fosters empiricism, self-organization, bottom-up intelligence, and intelligent release of software.",
						"Identify and remove people that aren't working hard enough."
					],
		answer: 	2,
		feedback: 	"Management has no active role in the actual product development through Scrum. However, management external to the Scrum team is incredibly important in setting the vision and strategy to guide the overall direction of the organization."
	},
	{
		title: 		"The time-box for the Sprint Planning meeting is?",
		answerType: "S",
		answers: 	[
						"4 hours.",
						"8 hours for a monthly Sprint. For shorter Sprints it is usually shorter.",
						"Whenever it is done.",
						"Monthly."
					],
		answer: 	1,
		feedback: 	"Sprint Planning is time-boxed to a maximum of eight hours for a one-month Sprint. For shorter Sprints, the event is usually shorter."
	},
	{
		title: 		"Upon what type of process control is Scrum based?",
		answerType: "S",
		answers: 	[
						"Empirical",
						"Hybrid",
						"Defined",
						"Complex"
					],
		answer: 	0,
		feedback: 	"Scrum is founded on empirical process control theory, or empiricism. Empiricism asserts that knowledge comes from experience and making decisions based on what is known."
	},
	{
		title: 		"Who has the final say on the order of the Product Backlog?",
		answerType: "S",
		answers: 	[
						"The Stakeholders",
						"The Development Team",
						"The Scrum Master",
						"The Product Owner",
						"The CEO"
					],
		answer: 	3,
		feedback: 	"The Product Owner is the sole person responsible for managing the Product Backlog."
	},
	{
		title: 		"Who is on the Scrum Team?",
		answerType: "M",
		answers: 	[
						"The Scrum Master",
						"The Product Owner",
						"The Development Team",
						"Project Manager",
						"None of the above"
					],
		answer: 	[0, 1, 2],
		feedback: 	"The Scrum Team consists of the Scrum Master (manages the process), the Product Owner (decides what to do) and the Development Team (does the work)."
	},
	{
		title: 		"The Product Backlog is ordered by:",
		answerType: "S",
		answers: 	[
						"Size, where small items are at the top and large items are at the bottom.",
						"Risk, where safer items are at the top, and riskier items are at the bottom.",
						"Items are randomly arranged.",
						"Whatever is deemed most appropriate by the Product Owner."
					],
		answer: 	3,
		feedback: 	"The Product Owner decides what makes the most sense to optimize the value of the work being done by the Development Team."
	},
	{
		title: 		"Which of the following services are appropriate for a Scrum Master in regard to the Daily Scrum?",
		answerType: "S",
		answers: 	[
						"Lead the discussions of the Development Team.",
						"Ensure that all 3 questions have been answered.",
						"Facilitate in a way that ensures each team member has a chance to speak.",
						"Teach the Development Team to keep the Daily Scrum within the 15 minute time-box.",
						"All answers apply."
					],
		answer: 	3,
		feedback: 	"The Scrum Master ensures that the Development Team has the meeting, but the Development Team is responsible for conducting the Daily Scrum. The Scrum Master teaches the Development Team to keep the Daily Scrum within the 15-minute time-box. The Scrum Master enforces the rule that only Development Team members participate in the Daily Scrum."
	},
	{
		title: 		"What is the recommended size for a Development Team (within the Scrum Team)?",
		answerType: "S",
		answers: 	[
						"Minimal 7",
						"3 to 9",
						"7 plus or minus 2",
						"9"
					],
		answer: 	1,
		feedback: 	"Optimal Development Team size is small enough to remain nimble and large enough to complete significant work. Fewer than three Development Team members decreases interaction and results in smaller productivity gains. More than nine members simply requires too much coordination."
	},
	{
		title:		"When does the next Sprint begin ?",
		answerType: "S",
		answers: 	[
						"Next Monday",
						"Immediately following the next Sprint Planning",
						"When the Product Owner is ready",
						"Immediately after the conclusion of the previous Sprint"
					],
		answer: 	3,
		feedback: 	"A new Sprint starts immediately after the conclusion of the previous Sprint."
	},
	{
		title: 		"The Product Backlog is ordered by:",
		answerType: "S",
		answers: 	[
						"Size, where small items are at the top and large items are at the bottom.",
						"Risk, where safer items are at the top, and riskier items are at the bottom.",
						"Items are randomly arranged.",
						"The Product Owner with the most valuable items placed at the top."
					],
		answer: 	3,
		feedback: 	"The Product Owner decides what makes the most sense to optimize the value of the work being done by the Development Team."
	},
	{
		title: 		"Scrum does not have a role called \"project manager.\"",
		answerType: "TF",
		answer: 	true,
		feedback: 	"A Scrum Team has a Scrum Master, a Product Owner and a Development Team. As a whole they have all controls needed."
	},
	{
		title: 		"The three pillars of empirical process control are:",
		answerType: "S",
		answers: 	[
						"Respect For People, Kaizen, Eliminating Waste",
						"Inspection, Transparency, Adaptation",
						"Planning, Demonstration, Retrospective",
						"Planning, Inspection, Adaptation",
						"Transparency, Eliminating Waste, Kaizen"
					],
		answer: 	1,
		feedback: 	"Scrum is founded on empirical process control theory, or empiricism. Empiricism asserts that knowledge comes from experience and making decisions based on what is known. Three pillars uphold every implementation of empirical process control: transparency, inspection, and adaptation."
	},
	{
		title: 		"Which of the below are roles on a Scrum Team?",
		answerType: "M",
		answers: 	[
						"Development Team",
						"Users",
						"Customers",
						"Product Owner",
						"Scrum Master"
					],
		answer: 	[0, 3, 4],
		feedback: 	"The Scrum Team consists of a Product Owner, the Development Team, and a Scrum Master."
	},
	{
		title: 		"What are the two primary ways a Scrum Master keeps a Development Team working at its highest level of productivity?",
		answerType: "M",
		answers: 	[
						"By starting and ending the meetings at the proper time",
						"By facilitating Development Team decisions",
						"By removing impediments that hinder the Development Team",
						"By keeping high value features high in the Product Backlog"
					],
		answer: 	[1, 2],
		feedback: 	"A Scrum Master is a servant-leader for the Development Team. Facilitation and removing impediments serves a team in achieving the best productivity possible."
	},
	{
		title: 		"The Development Team should not be interrupted during the Sprint. The Sprint Goal should remain intact. These are conditions that foster creativity, quality and productivity. Based on this, which of the following is FALSE?",
		answerType: "S",
		answers: 	[
						"The Product Owner can help clarify or optimize the Sprint when asked by the Development Team.",
						"As a decomposition of the selected Product Backlog Items, the Sprint Backlog changes and may grow as the work emerges.",
						"The Development Team may work with the Product Owner to remove or add work if it finds it has more or less capacity than it expected.",
						"The Sprint Backlog is fully formulated in the Sprint Planning meeting and does not change during the Sprint."
					],
		answer: 	3,
		feedback: 	"The Sprint Backlog makes visible all of the work that the Development Team identifies as necessary to meet the Sprint Goal. The Development Team modifies the Sprint Backlog throughout the Sprint, and the Sprint Backlog emerges during the Sprint."
	},
	{
		title: 		"When multiple teams work together on the same product, each team should maintain a separate Product Backlog.",
		answerType: "TF",
		answer: 	false,
		feedback: 	"Products have one Product Backlog, regardless of how many teams are used. Any other setup makes it difficult for the Development Team to determine what it should work on."
	},
	{
		title: 		"Development Team membership should change:",
		answerType: "S",
		answers: 	[
						"Every Sprint to promote shared learning.",
						"Never, because it reduces productivity.",
						"As needed, while taking into account a short term reduction in productivity.",
						"As needed, with no special allowance for changes in productivity."
					],
		answer: 	2,
		feedback: 	"Teams typically go through some steps before achieving a state of increased performance. Changing membership typically reduces cohesion, affecting performance and productivity in the short term."
	},
	{
		title: 		"Which statement best describes Scrum?",
		answerType: "S",
		answers: 	[
						"A complete methodology that defines how to develop software.",
						"A cookbook that defines best practices for software development.",
						"A framework within which complex products in complex environments are developed.",
						"A defined and predictive process that conforms to the principles of Scientific Management."
					],
		answer: 	2,
		feedback: 	"Scrum is not a process or a technique for building products; rather, it is a framework within which you can employ various processes and techniques."
	},
	{
		title: 		"When many Development Teams are working on a single product, what best describes the definition of 'Done?'",
		answerType: "S",
		answers: 	[
						"Each Development Team defines and uses its own. The differences are discussed and reconciled during a hardening Sprint.",
						"Each Development Team uses its own but must make their definition clear to all other Teams so the differences are known.",
						"All Development Teams must have a definition of 'Done' that makes their combined work potentially releasable.",
						"It depends."
					],
		answer: 	2,
		feedback: 	"Scrum requires an Increment to be releasable. This is an Increment of product. Many teams working on a single product are expected to deliver such an Increment."
	},
	{
		title: 		"Why is the Daily Scrum held at the same time and same place?",
		answerType: "S",
		answers: 	[
						"The place can be named.",
						"The consistency reduces complexity.",
						"The Product Owner demands it.",
						"Rooms are hard to book and this lets it be booked in advance."
					],
		answer: 	1,
		feedback: 	"The Daily Scrum is held at the same time and place each day to reduce complexity."
	},
	{
		title: 		"It is mandatory that the product increment be released to production at the end of each Sprint.",
		answerType: "TF",
		answer: 	false,
		feedback: 	"The product increment should be usable and releasable at the end of every Sprint, but it does not have to be released."
	},
	{
		title: 		"How much work must a Development Team do to a Product Backlog item it selects for a Sprint?",
		answerType: "S",
		answers: 	[
						"As much as it has told the Product Owner will be done for every Product Backlog item it selects in conformance with the definition of \"Done\".",
						"As much as it can fit into the Sprint.",
						"All development work and at least some testing.",
						"Analysis, design, programming, testing and documentation."
					],
		answer: 	0,
		feedback: 	"The purpose of each Sprint is to deliver Increments of potentially releasable functionality that adhere to the Scrum Team's current definition of \"Done\"."
	},
	{
		title:		"Who is responsible for managing the progress of work during a Sprint ?",
		answerType: "S",
		answers: 	[
						"The Development Team",
						"The Scrum Master",			
						"The Product Owner",
						"The most junior member of the team"
					],
		answer: 	0,
		feedback: 	"The Development Team uses the Daily Scrum to inspect progress toward the Sprint Goal and to inspect how progress is trending toward completing the work in the Sprint Backlog."
	},
	{
		title:		"When is a Sprint over?",
		answerType: "S",
		answers: 	[
						"When all Product Backlog items meet their definition of done.",
						"When the Product Owner says it is done.",			
						"When all the tasks are completed.",
						"When the time-box expires."
					],
		answer: 	3,
		feedback: 	"The duration of a Sprint is fixed and cannot be shortened or lengthened."
	},
	{
		title: 		"Which role are part of a Scrumteam",
		answerType: "M",
		answers: 	[
						"Product Owner",
						"Scrummaster",
						"Project Manager",
						"CEO",
						"Development Team",
						"All of the above"
					],
		answer: 	[0, 1, 4],
		feedback: 	"The Scrum Team consists of the Scrum Master (manages the process), the Product Owner (decides what to do) and the Development Team (does the work)."
	},
	{
		title: 		"A new developer is having continuing conflicts with existing Development Team members and creating a hostile environment. If necessary, who is responsible for removing the team member?",
		answerType: "S",
		answers: 	[
						"The Product Owner is responsible, because he/she controls the return on investment (ROI).",
						"The Scrum Master is responsible, because he/she removes impediments.",
						"The hiring manager is responsible, because he/she hired the developer.",
						"The Development Team is responsible, and may need help from the Scrum Master."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"A Product Owner is essentially the same thing as a traditional Project Manager?",
		answerType: "TF",
		answer: 	false,
		feedback: 	"During the Sprint scope may be clarified and re-negotiated between the Product Owner and Development Team as more is learned."
	},
	{
		title: 		"The time-box for a Daily Scrum is?",
		answerType: "S",
		answers: 	[
						"The same time of day every day.",
						"Two minutes per person.",
						"4 hours.",
						"15 minutes.",
						"15 minutes for a 4 week sprint. For shorter Sprints it is usually shorter."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"Which two metrics will help a Product Owner establish that value is being delivered?",
		answerType: "M",
		answers: 	[
						"Time to market",
						"Customer satisfaction",
						"Velocity",
						"Productivity",
						"Scope implemented"
					],
		answer: 	[0, 1]
	},
	{
		title: 		"What might indicate to a Product Owner that she needs to work more with the Scrum Team?",
		answerType: "S",
		answers: 	[
						"She isn't working full time with the Scrum Team.",
						"The increment presented at the Sprint Review does not reflect what she thought she had asked for.",
						"Developers leave the Team",
						"The acceptance tests don't appear to be complete."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"How important is it for a Product Owner to order Product Backlog items by value points?",
		answerType: "S",
		answers: 	[
						"Using value points is the ultimate way for a Product Owner to predict the value that the product will provide.",
						"It is a good practice, keeping in mind that market reception is the best measure of value.",
						"Calculating value points is an upfront approach that conflicts with the empiricism of Scrum, and is therefore not acceptable."
					],
		answer: 	1,
		feedback: 	"Indications of value on Product Backlog are useful but are only a prediction until validated against users and market."
	},
	{
		title: 		"The Product Owner manages the Product Backlog. Who is accountable for estimating the effort to complete the Product Backlog items?",
		answerType: "S",
		answers: 	[
						"The Development Team. As a collective, they have a complete view of the work needed to transform Product Backlog items into Increments of product.",
						"The PMO. They have all the history on projects delivered, and this enables the IT department to make delivery commitments.",
						"The Product Owner. The Product Owner is required to commit on delivery to the users and the stakeholders."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"Which two statements explain why the definition of \"Done\" is important to the Product Owner?",
		answerType: "M",
		answers: 	[
						"It assures the Increment reviewed at the Sprint review is usable so the Product Owner may choose to release it.",
						"It helps the Product Owner track the open work during a Sprint.",
						"It creates transparency regarding progress within the Scrum Team.",
						"It identifies undone work that can be addressed in a separate Sprint."
					],
		answer: 	[0, 2]
	},
	{
		title: 		"Which answer best describes the topics covered in Sprint Planning?",
		answerType: "S",
		answers: 	[
						"What can be done and how to do it.",
						"Who is on the team and what team member roles will be.",
						"What to do and who will do it.",
						"How conditions have changed and how the Product Backlog should evolve.",
						"What went wrong in the last Sprint and what to do differently this Sprint."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"What three things might a Scrum Product Owner focus on to ensure hist product delivers value?",
		answerType: "M",
		answers: 	[
						"How readily his product can be absorbed and userd by his customers",
						"The size of his product in 'lines of code'",
						"How much of the functionality of his product is being utilized",
						"Direct customer feedback",
						"Minimizing changes to project scope"
					],
		answer: 	[0,2,3],
		feedback: 	""
	},
	{
		title: 		"During the Sprint, the Scrum Master's role is to do which two of the following:",
		answerType: "M",
		answers: 	[
						"Assign tasks with the Scrum team.",
						"Monitor the progress of the Development Team.",
						"Ensure the Product Owner attends all Scrum events.",
						"Facilitate inspection and adaptation opportunities as requested or needed.",
						"Remove impediments.",
						"Escalate team conflicts to functional line managers."
					],
		answer: 	[3,4],
		feedback: 	""
	},
	{
		title: 		"Which of the following are true about the length of the Sprint?",
		answerType: "M",
		answers: 	[
						"All Sprints must be 1 month or less.",
						"It is best to have Sprints of consistent length throughout a development effort.",
						"Sprint length is determined during Sprint Planning, and should be long enough to make sure the Development Team can deliver what is to be accomplished in the upcoming Sprint.",
						"Sprint length is determined during Sprint Planning, and should hold the time it will take to code the planned features in the upcoming Sprint, but does not include time for any testing.",
						"The length of the Sprint should be proportional to the work that is done between Sprints."
					],
		answer: 	[0,1],
		feedback: 	""
	},
	{
		title: 		"You are a product manager with a proven track record in your company. Your management has asked you to take the lead in the development of a new product. Six teams new to Scrum will build this product. What would you strive for? Select two.",
		answerType: "M",
		answers: 	[
						"The product has one Product Backlog.",
						"There should be six Product Owners, one for each Scrum Team.",
						"Each Scrum Team should have a separate Product Backlog.",
						"There should be only one Product Owner.",
						"There should be six Product Owners, reporting to a chief Product Owner."
					],
		answer: 	[0,3],
		feedback: 	""
	},
	{
		title: 		"If burndown charts are used to visualize progress, what do they track?",
		answerType: "S",
		answers: 	[
						"Accumulated cost.",
						"Work remaining across time.",
						"Accumulated business value delivered to the customer.",
						"Individual worker productivity."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"The Product Owner makes sure the right stakeholders are invited to the Sprint Retrospective. They might have important instructions for team improvements.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Which of these may a Development Team deliver at the end of a Sprint?",
		answerType: "S",
		answers: 	[
						"An increment of working software that is 'done'.",
						"An increment of software with minor known bugs in it.",
						"A single document, if that is what the Scrum Master asked for.",
						'Failing unit tests, to identify acceptance tests for the next Sprint.'
					],
		answer: 	0,
		feedback: 	""
	},
 	{
		title: 		"Which activities would a Product Owner typically undertake in the phase between the end of the current Sprint and the start of the next Sprint?",
		answerType: "S",
		answers: 	[
						"Refine the Product Backlog.",
						"Update the project plan with stakeholders.",
						"There are no such activities. The next Sprint starts immediately after the current Sprint.",
						"Work with th QA departments on the Increment of the current Sprint."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"How small should a 'ready' Product Backlog item be?",
		answerType: "S",
		answers: 	[
						"Small enough to build in 1 Sprint.",
						"No longer than one day.",
						"Small enough for a single team member to complete in a Sprint.",
						"No bigger than 8 story points.",
						"It should fit on a small index card."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"How much time is required a Sprint to prepare for the next Sprint?",
		answerType: "S",
		answers: 	[
						"The break between Sprints is time-boxed to 1 week for 30 day Sprints, and usually less for shorter sprints.",
						"Enough time for the requirements for the next Sprint to be determined and documented.",
						"Enough time for the Development team to finish the testing from the last Sprint.",
						"None. A new Sprint starts immediately following the end of the previous Sprint.",
						"All of the above are allowed depending on the situation."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"In the middle of the Sprint, the customer decides that there are 2 new features she wants. The Product Owner could:",
		answerType: "M",
		answers: 	[
						"Ask the Development Team to consider whether they can add these features to the current Sprint.",
						"Have the Scrum Master add these features to the current Sprint.",
						"Add it to the Product Backlog.",
						"Introduce these features at the next Daily Scrum."
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title: 		"What are two ways that architecture and infrastructure are handled in Scrum?",
		answerType: "M",
		answers: 	[
						"They are discussed, determined, and documented before the actual feature development Sprints.",
						"They are added to the Product Backlog and adressed in early Sprints, while always requiring at least some business functionality, no matter how small.",
						"They are built by a separate team through the creation of an architectural runway.",
						"They are implemented along with functional development of the product."
					],
		answer: 	[1,3],
		feedback: 	""
	},
	{
		title: 		"A product's success is measured by: (choose 3 answers)",
		answerType: "M",
		answers: 	[
						"The impact on customer satisfaction.",
						"The delivery of upfront defined scope compared to the upfront planned time.",
						"The impact on revenue.",
						"The impact on cost.",
						"The impact on my performance rating.",
						"The impact on my boss's mood."
					],
		answer: 	[0,2,3],
		feedback: 	""
	},
	{
		title: 		"What is the role of the Product Owner in crafting the Sprint Goal ?",
		answerType: "S",
		answers: 	[
						"The Product Owner shouldn't come to the Sprint Planning without a clearly defined Sprint Goal.",
						"The Product Owner should come to the Sprint Planning with a business objective in mind and work with the Development Team to craft the Sprint Goal based upon the forecast.",
						"The Product Owner has no role in it. This is the Development Team's responsibility.",
						"The Product Owner defines the scope for a Sprint and therefore also the Sprint Goal.",
						"The Product Owner must work with the stakeholders to set each Sprint's Goal"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"When does the second Sprint start?",
		answerType: "S",
		answers: 	[
						"After the customer completes acceptance testing of the first Sprint.",
						"Immediately after the first Sprint.",
						"After the Product Backlog for the second Sprint has been selected.",
						"Once the architectural changes for the second Sprint have been approved by the senior architect."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Which phrase best describes a Product Owner?",
		answerType: "S",
		answers: 	[
						"Requirements engineer",
						"Value optimizer",
						"Team manager",
						"Go-between between development team and customers"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"During the Sprint Review it is up to the stakeholders to reorder the Product Backlog.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"The Scrum Master should NOT allow the Product Owner to go to the Sprint Planning meeting WITHOUT having already devised the Sprint Goal.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"What does it mean for a Development Team to be cross-functional?",
		answerType: "S",
		answers: 	[
						"Developers on the Development Team work closely with business analysts, architects, developers and testers who are not on the team.",
						"The Development Team is a virtual team drawing from separate teams of business analysts, architects, developers and testers.",
						"The Development Team includes not only developers but also business analysts, architects, developers and testers.",
						"The Development Team includes cross-skilled individuals who are able to contribute to do what is necessary to deliver an increment of software."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"What is typical work for a Product Owner in a Sprint? (Choose 2 answers)",
		answerType: "M",
		answers: 	[
						"Attend every Daily Scrum to answer functional questions on the discussed Sprint Backlog items.",
						"Update the work plan for the Development Team on a daily basis.",
						"Work with the Development Team on Product Backlog refinement.",
						"Create financial reporting upon the spent hours reported by the Development Team.",
						"Collaborate with stakeholders, user communities and product managers.",
						"Nothing."
					],
		answer: 	[2,4],
		feedback: 	""
	},
	{
		title: 		"In order to maximize the value of the product, a Product Owner needs awareness of the following:",
		answerType: "S",
		answers: 	[
						"Competitive research",
						"Customer feedback",
						"Product vision",
						"Forecasting & feasibility",
						"All of the above",
						"None of the above"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title: 		"When multiple teams are working together on the same product, each team should maintain a separate Product Backlog.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"A done Increment is valuable if:",
		answerType: "M",
		answers: 	[
						"It is likely to increase customer satisfaction.",
						"It meets the business analyst’s specifications.",
						"It is delivered when the Product Owner expected it.",
						"It reduces long-term operational costs.",
						"It has all the features that the Product Owner wanted in that Sprint."
					],
		answer: 	[0,3],
		feedback: 	"À Vérifier..."
	},
	{
		title: 		"The Product Owner must write all of the Product Backlog items (e.g. user stories, non-functional requirements, etc.) on the Product Backlog Before handing them over to the Development Team.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Scrum is a methodology that tells in detail how to build software incrementally.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"A Sprint Retrospective should be held:",
		answerType: "S",
		answers: 	[
						"At the end of each Sprint.",
						"At the beginning of each Sprint.",
						"Only when the Scrum Team determines it needs one.",
						"At the end of the last Sprint in a project or a release."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"The Development Team finds out during the Sprint that they aren't likely to build everything they forecasted. What would you expect a Product Owner to do?",
		answerType: "S",
		answers: 	[
						"Cancel the Sprint.",
						"Change the Sprint Goal.",
						"Re-work the selected Product Backlog items with the Development Team to meet the Sprint Goal.",
						"Skip Product Backlog refinement activities.",
						"Inform management that more resources are needed."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Development Team members step up to own a Sprint Backlog item:",
		answerType: "S",
		answers: 	[
						"At the Sprint planning meeting.",
						"Never. All Sprint Backlog Items are 'owned' by the entire Development Team, even though each one may be done by an individual Development Team member.",
						"Whenever a team member can accommodate more work.",
						"During the Daily Scrum."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"A Product Owner can measure success by an increase in the team's velocity.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"In the middle of the Sprint, the customer decides that there are 2 new features she wants. The Product Owner could:",
		answerType: "S",
		answers: 	[
						"Have the Development Team add these features to the current Sprint.",
						"Have the Scrum Master add these features to the current Sprint.",
						"Introduce these features at the next Sprint Planning meeting.",
						"Introduce these features at the next Daily Scrum."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which is NOT a valid consideration when ordering a Product Backlog?",
		answerType: "S",
		answers: 	[
						"Alignment with business strategy and goals",
						"Risk",
						"Importance to customers",
						"Development Team tools and techniques",
						"Dependencies on other Product Backlog Items"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"When should the Product Backlog be refined? Choose 2 answers.",
		answerType: "M",
		answers: 	[
						"The Product Owner and the Development Team do it in the 1-2 preceding Sprints.",
						"The Product Owner takes the time between the Sprints to do it.",
						"The Product Owner must do this as essential work in Sprint 0.",
						"The Product Owner and the Development Team do it in the actual Sprint if they haven't been able to do it in preceding Sprints.",
						"Business analysts in the organization should do this work for the Scrum Team 1-2 Sprints ahead of the development Sprints."
					],
		answer: 	[0,3],
		feedback: 	""
	},
	{
		title: 		"What is the ideal size for a Development Team (within the Scrum Team)?",
		answerType: "S",
		answers: 	[
						"At least 7",
						"3 to 9",
						"7 plus or minus 3",
						"9"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"All work to be done by the Development Team must ultimately originate from the Product Backlog?",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"The Product Owner makes sure the team selects enough from the Product Backlog for a Sprint to satisfy the stakeholders.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Which two things does the Development Team NOT do during the first Sprint? Choose 2 answers.",
		answerType: "M",
		answers: 	[
						"Deliver an Increment of potentially releasable functionality.",
						"Nail down the complete architecture and infrastructure.",
						"Develop and deliver at least one piece of functionality.",
						"Develop a plan for the rest of the project."
					],
		answer: 	[1,3],
		feedback: 	""
	},
	{
		title: 		"The only person who can abnormally terminate a Sprint is?",
		answerType: "S",
		answers: 	[
						"The Development Team or its members",
						"The Product Owner",
						"The Stakeholders",
						"The Scrum Master"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"What is the maximum length of a Sprint?",
		answerType: "S",
		answers: 	[
						"Not so long that the risk is unacceptable to the Product Owner.",
						"Not so long that other business events can't be readily synchronized with the development work.",
						"No more than one calendar month.",
						"All of these answers are correct."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"What percent of the time should a Product Owner dedicate to the Scrum Team? Choose two answers..",
		answerType: "M",
		answers: 	[
						"100%.",
						"40%, or more if the stakeholders agree.",
						"Just enough time to keep the developers from complaining.",
						"Enough time to avoid the waste that is created by delaying functional answers to the Development team.",
						"Enough to maximize the value being delivered in the Increment",
						"As much as the stakeholders want to budget. Business analysts take over the role the rest of the time."
					],
		answer: 	[3,4],
		feedback: 	""
	},
	{
		title: 		"Which of the following practices might help the Product Owner minimize waste in developing and sustaining the Product Backlog? Choose 2 answers.",
		answerType: "M",
		answers: 	[
						"Let others manage the Product Backlog.",
						"Only fully describe Product Backlog items when it seems sure that they are likely to be implemented.",
						"Write or cause Product Backlog items to be written clearly, and with as little ambiguity as possible.",
						"Always write the Product Backlog items as computer code that will later just be tested by developers."
					],
		answer: 	[1,2],
		feedback: 	""
	},
	{
		title: 		"A PO (Product Owner) is essentially the same thing as a traditional PM (Project Manager).",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Sprint Reviews are an opportune time to collect customer feedback.",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"What are criteria to order Product Backlog items?",
		answerType: "S",
		answers: 	[
						"Value of Product Backlog items.",
						"Dependencies between Product Backlog items.",
						"Dependencies to other products.",
						"All of the above."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"When should a Sprint Goal be created?",
		answerType: "S",
		answers: 	[
						"At any time during the Sprint.",
						"It must be established before Sprint Planning in order to begin planning.",
						"During Sprint Planning.",
						"A Sprint Goal is not mandatory in Scrum.",
						"It should have been created in the previous Sprint during Product Backlog refinement."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"The value delivered by a product can only be determined by revenue.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"During a Sprint Retrospective, for what is the Product Owner responsible?",
		answerType: "S",
		answers: 	[
						"He/She doesn't need to be there.",
						"Capturing requirements for the Product Backlog.",
						"Participating as a Scrum Team member.",
						"Summarizing and reporting the discussions to the stakeholders that he/she represents in the Scrum Team."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"There are multiple teams working on one product. Each team should have a separate Product Owner.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Who determines when it is appropriate to update the Sprint Backlog during a Sprint?",
		answerType: "S",
		answers: 	[
						"The Product Owner",
						"The Development Team",
						"The Scrum Team",
						"The Project Manager"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"Who should make sure everyone does his or her tasks for the Sprint?",
		answerType: "S",
		answers: 	[
						"The Project Manager",
						"The Product Owner",
						"The Scrum Master",
						"The Development Team",
						"All of the above"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"Which two of the following are true about the Scrum Master role? Choose two answers.",
		answerType: "M",
		answers: 	[
						"The Scrum Master assigns tasks to Development Team members when they need work.",
						"The Scrum Master helps those outside the team interact with the Scrum Team.",
						"The Scrum Master teaches the Development Team to keep the Scrum meetings to their time box.",
						"The Scrum Master is responsible for updating the Sprint Burndown.",
						"At the Sprint Review, the Scrum Master identifies what has been 'done' and what has not been 'done'."
					],
		answer: 	[1,2],
		feedback: 	""
	},
	{
		title: 		"What typically happens if Product Backlog is not sufficiently clear at Sprint Planning?",
		answerType: "S",
		answers: 	[
						"The Development Team has difficulties creating a forecast of work for the Sprint.",
						"Nothing in particular.",
						"It is compensated if the Product Owner gives the team a clear Sprint Goal instead.",
						"The meeting is cancelled so refinement can be done first.",
						"The Scrum Master shouldn't allow this to happen. Look for a new Scrum Master and re-start the Sprint."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"What is Product Owner work that a Product Owner might delegate?",
		answerType: "S",
		answers: 	[
						"Write User Stories",
						"Order the Product Backlog",
						"Represent stakeholders to the Scrum team",
						"Attend the Sprint Review"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"The 'cone of uncertainty' can be used to do what?",
		answerType: "S",
		answers: 	[
						"Determine the cost of a project before it is begun.",
						"Project what will be complete by a given Sprint.",
						"Determine whether to cut quality, similar to the 'Iron Triangle' of software development.",
						"Illustrate that, as a forecast lengthens, it is increasingly less certain."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"Who is responsible for releasing the most valuable product possible?",
		answerType: "S",
		answers: 	[
						"The Scrum Master",
						"The Development Team",
						"The Product Owner",
						"The CEO",
						"The entire Scrum Team"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which is NOT a Development Team responsibility?",
		answerType: "S",
		answers: 	[
						"Planning how to meet a Sprint Goal",
						"Optimizing the work required to meet the Sprint Goal at least daily",
						"Monitoring productivity",
						"Resolving internal team conflicts",
						"Selecting the Product Owner"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title: 		"The Product Owner is accountable for the functionality included in each Increment. Does he or she have the final say over the Definition of 'Done'?",
		answerType: "S",
		answers: 	[
						"Yes, the Product Owner is responsible for the definition of 'Done'. The Development Team may be consulted.",
						"No, the Development Team is responsible for the definition of 'Done'. The Product Owner may be consulted."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"When a Development Team determines that it has over-committed itself for a Sprint, who has to be present when reviewing and adjusting the Sprint work selected?",
		answerType: "S",
		answers: 	[
						"The Scrum Master, project manager and Development Team",
						"The Product Owner and the Development Team",
						"The Product Owner and all stakeholders",
						"The Development Team"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"What are three benefits of self-organization? Choose all that apply.",
		answerType: "M",
		answers: 	[
						"Increased commitment",
						"Increased self-accountability",
						"Increased creativity",
						"Increased rule compliance",
						"Increased predictability"
					],
		answer: 	[0,1,2],
		feedback: 	""
	},
	{
		title: 		"Which three of the following are true about Scrum? Choose three answers.",
		answerType: "M",
		answers: 	[
						"Scrum is a methodology, where you can pick and choose which parts of Scrum you think will work for your environment.",
						"Scrum is like traditional processes but with self-organization to replace Project Managers.",
						"Scrum is a framework for developing and maintaining complex products.",
						"Scrum is based on empirical process control theory.",
						"Each component of Scrum serves a specific purpose, and is essential to Scrum's success and your usage of Scrum to develop complex products."
					],
		answer: 	[2,3,4],
		feedback: 	""
	},
	{
		title: 		"The Product Owner should have a complete and exhaustive Product Backlog before the first Sprint can start?",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Every Scrum Team must have a Product Owner and Scrum Master.",
		answerType: "S",
		answers: 	[
						"False.",
						"True. Each must be 100% dedicated to the Scrum Team.",
						"True. Outcomes are affected by their participation and availability."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which statement best describes the Sprint Backlog as outcome of the Sprint Planning?",
		answerType: "S",
		answers: 	[
						"It is a complete list of all work to be done in a Sprint.",
						"Each task is estimated in hours.",
						"It is the Development Team's plan for the Sprint.",
						"Every item has a designated owner.",
						"It is ordered by the Product Owner."
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"How often should customer satisfaction be measured?",
		answerType: "S",
		answers: 	[
						"Annually",
						"Quarterly",
						"Daily",
						"Frequently"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"My job as a Product Owner focuses on the following: Choose 2 answers.",
		answerType: "M",
		answers: 	[
						"Writing clear, transparent User Stories.",
						"Working with customers and stakeholders to identify the most important product requirements.",
						"Being with the Scrum team all the time, just in case they need me to clarify a requirement.",
						"Clearly communicating project or release status and strategies to customers and stakeholders."
					],
		answer: 	[0,1],
		feedback: 	""
	},
	{
		title: 		"Which are NOT appropriate topics for discussion in a Sprint Retrospective? Choose 2 answers.",
		answerType: "M",
		answers: 	[
						"How the team does its work",
						"Team relations",
						"Definition of 'Done'",
						"Sprint Backlog for the next Sprint",
						"The value of work currently represented in the Product Backlog"
					],
		answer: 	[3,4],
		feedback: 	""
	},
	{
		title: 		"Software dependencies could influence how the Product Owner orders Product Backlog Items.",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"What are the benefits of including testing within the Sprint's development activities? Choose three answers.",
		answerType: "M",
		answers: 	[
						"The Increment is likely to be more complete.",
						"Transparency of the Increment is increased.",
						"The Increment is closer to being potentially releasable.",
						"The project manager can more effectively report progress."
					],
		answer: 	[0,1,2],
		feedback: 	""
	},
	{
		title: 		"A properly functioning Scrum Team will have at least one Release Sprint and may well have several.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"Product Owners must create clear and unambiguous acceptance criteria for each Product Backlog item before it may be selected in Sprint Planning.",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"If burndown charts are used to visualize progress, what does a trend line through a release burndown chart indicate?",
		answerType: "S",
		answers: 	[
						"The evolution of the cost spent on the project.",
						"When the work remaining will likely be completed if nothing changes on the Product Backlog or the Development Team.",
						"When the project will be over if the Product Owner removes work that is equal in effort to any new work that is added.",
						"When all work will be completed so the Scrum Team can be released for other work."
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title: 		"A Product Owner working with multiple teams working on one product should maintain separate Product Backlogs for each team.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title: 		"When is the Sprint Backlog created?",
		answerType: "S",
		answers: 	[
						"Prior to the Sprint Planning meeting",
						"During the Sprint",
						"During the Sprint Planning meeting",
						"At the beginning of the project"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title: 		"Which is the most important stakeholder Product Owners must satisfy?",
		answerType: "S",
		answers: 	[
						"The company owner or shareholders",
						"Executive staff",
						"The Chief Product Owner",
						"The product's users"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title: 		"A Development Team is required to deliver a done increment by the end of a Sprint. Select two statement that explain what 'done' means. Choose two answers",
		answerType: "M",
		answers: 	[
						"No work left from the Definition of 'Done'",
						"Ready for integration",
						"All work to create software that is ready to be released to end users",
						"Whatever the Product Owner defines as quality",
						"All work the Development Team is willing to do"	
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title: 		"A Product Backlog is : Choose three answers",
		answerType: "M",
		answers: 	[
						"An inventory of things to be done for the Product",	
						"Ordered based on priority, value, dependencies, and risk",	
						"An exhaustive list of upfront approved requirements to be implemented for the system",	
						"Managed by the Product Owner",	
						"Only visible to the Product Owner and stakeholders"
					],
		answer: 	[0,1,3],
		feedback: 	""
	},
	{
		title: 		"A Project Manager working with your Scrum Team has raised concerns about progress and money spent. What are the two best responses ?",
		answerType: "M",
		answers: 	[
						"Scrum doesn't have Project Managers so disregard",	
						"Share the Product Backlog and the forecast for the Sprint ",	
						"Show the Earned Value Analysis for the last 3 Sprints",	
						"Share the current impediments",	
						"Share the last stakeholder briefing document prepared by the Product Owner"
					],
		answer: 	[1,3],
		feedback: 	""
	},
	{
		title: 		"At the end of a Sprint a Product Backlog item worked on during the Sprint does not meet the Definition of Done. What two things should happen with the undone Product Backlog item ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Put it on the Product Backlog for the Product Owner to decide what to do with it",	
						"If the stakeholders agree, the Product Owner can accept it and release it to the users",	
						"Do not include the item in the increment this Sprint",	
						"Review the item, add the 'Done' part of the estimate to the velocity and create a story for the remaining work"
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title:		"My role as a Product Owner focuses on which two of the following ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Writing User Stories",
						"Working with customers and stakeholders to identify the most important product requirements",
						"Being with the Scrum team all the time, just in case they need me to clarify a requirement",
						"Keeping the stakeholders informed of the project and release status"
					],
		answer: 	[1,3],
		feedback: 	"À VÉRIFIER"
	},
	{
		title:		"One of the Scrum events is the Daily Scrum. What are two intended outcomes of the Daily Scrum ? Choose two answers",
		answerType: "M",
		answers: 	[
						"A status report for the upper management indicating what each individual has done, will be doing, and what is impeding him/her",
						"A shared understanding of the most important work to be undertaken next to achieve the best possible progress toward the Sprint Goal",
						"An updated Scrum Board to make Sprint progress transparent for the stakeholders",
						"New impediments for the Scrum Master to take care of",
						"An update of completed tasks and of the remaining work so the Scrum Master can plan the next day"
					],
		answer: 	[1,3],
		feedback: 	""
	},
	{
		title:		"Scrum is based on empirical process control theory. All of its artefacts must be transparent to ensure sufficient accuracy of inspection.  Which two measures ensure that the Product Backlog is transparent ? Choose two answers",
		answerType: "M",
		answers: 	[
						"The Product Backlog is ordered",
						"Each Product Backlog item has a MoSCoW priority",
						"The Product Backlog is managed using a web-based tool",
						"The Product Backlog is available to all stakeholders",
						"The Product Backlog only has work for the next 2 Sprints"
					],
		answer: 	[0,3],
		feedback: 	""
	},
	{
		title:		"Scrum is based on empirical process control theory. All of its artefacts must be transparent to ensure sufficient accuracy of inspection. Select two ways to maintain the Product Backlog to maximize its transparency. Choose two answers",
		answerType: "M",
		answers: 	[
						"Product Backlog items are sized appropriately, i.e. not bigger than a Sprint and with a preference for several do-able items in a Sprint",
						"Product Backlog is only updated at the Sprint Review, when both the Scrum Team and the stakeholders are available",
						"Product Backlog is only updated at a release planning meeting with the stakeholders and the release train engineers present ",
						"The Product Backlog always has the most actual insights",
						"Product Backlog items should hold no more than 8 points of work, which is the average in the range of acceptable sizes of 1,2,3,5,8,13"
					],
		answer: 	[0,3],
		feedback: 	""
	},
	{
		title:		"The Product Owner must use : Choose all that apply",
		answerType: "M",
		answers: 	[
						"Release burndown diagram",
						"Burndown chart",			
						"Feature burn-up",
						"Critical Path Analysis",
						"Refactoring",
						"Project Gantt chart",
						"None of the above"
					],
		answer: 	[6],
		feedback: 	""
	},
	{
		title:		"What are advantages of a Product Owner with a solid product vision ? Choose three answers",
		answerType: "M",
		answers: 	[
						"It gives a good overall direction so Sprints will feel less like isolated pieces of work",
						"It is easier to inspect incremental progress at the Sprint Review",
						"It's not mandatory in Scrum. There is no real advantage.",
						"It helps the Scrum Team keep focus and they can check any decision against it, even within a Sprint",
						"It helps the Scrum Team to keep focus on when the complete Product Backlog should be finished"
					],
		answer: 	[0,1,3],
		feedback: 	""
	},
	{
		title:		"What are three ways Scrum promotes self-organization ? Choose three answers",
		answerType: "M",
		answers: 	[
						"By being a lightweight framework",
						"By removing titles for Development Team members",
						"By preventing stakeholders from entering the development room",			
						"By the Development Team deciding what work to do in a Sprint",
						"By not allowing documentation"
					],
		answer: 	[0,1,3],
		feedback: 	""
	},
	{
		title:		"What are two good ways for a Scrum Team to ensure security concerns are satisfied ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Have the Scrum Team create a Product Backlog items for each concern",
						"Add a Sprint to specifically resolve all security concerns",
						"Add security concerns to the definition of 'Done'",
						"Delegate the work to the concerned department",
						"Postpone the work until a specialist can perform a security audit and create a list of security-related Product Backlog items"
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title:		"What are two good ways for the Development Team to make non-functional requirements visible ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Add them to the Product Backlog and keep the Product Owner posted on the expected effort",
						"Add them to the definition of 'Done' so the work is taken care of every Sprint",
						"Put them on a separate list on the Scrum board, available for all to see",
						"Run the integration and regression tests before the end of the Sprint, and capture the open work for the Sprint Backlog of the next Sprint"					],
		answer: 	[1,2],
		feedback: 	""
	},
	{
		title:		"What are two responsibilities of testers in a Development Team ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Scrum has no 'tester' role",	
						"Finding bugs",
						"Verifying the work of programmers",
						"Tracking quality metrics",
						"Everyone in the Development Team is responsible for quality"
					],
		answer: 	[0,4],
		feedback: 	""
	},
	{
		title:		"What is a Development Team responsible for ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Organizing the work required to meet the Sprint Goal",
						"Reporting productivity",
						"Resolving internal conflicts",
						"Selecting the Product Owner"
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title:		"What sources may a Product Owner use when considering the value of a product ? ",
		answerType: "M",
		answers: 	[
						"VP of Sales",
						"CEO",
						"Customers and Prospects",
						"Market research results and analyst reports",
						"Development Team"
					],
		answer: 	[0,2,3],
		feedback: 	""
	},
	{
		title:		"What three factors are best considered when establishing the Sprint length ? Choose three answers",
		answerType: "M",
		answers: 	[
						"The ability to go to market with a product release",
						"Sprints must have the same length throughout an organization",
						"The frequency at which team formation can be changed",
						"The level of uncertainty over the technology to be used",
						"The risk of being disconnected from the stakeholders"
					],
		answer: 	[0,3,4],
		feedback: 	""
	},
	{
		title:		"When should the Product Backlog be refined ? Choose two answers",
		answerType: "M",
		answers: 	[
						"The Product Owner and the Development Team do it in 1-2 preceding Sprint",
						"The Product Owner takes the time between the Sprints to do it",
						"The Product Owner must do this as essential work in Sprint 0",
						"The Product Owner and the Development Team do it in the actual Sprint if they haven't been able to do it in preceding Sprints",
						"Business analysts in the organization should do this work for the Scrum Team 1-2 Sprints ahead of the development Sprints"
					],
		answer: 	[0,3],
		feedback: 	""
	},
	{
		title:		"Which 2 metrics will help a Product Owner establish that value is being delivered ? Choose two answers",
		answerType: "M",
		answers: 	[
						"Time to market",
						"Customer satisfaction",
						"Velocity",
						"Productivity",
						"Budget spent"
					],
		answer: 	[0,1],
		feedback: 	""
	},
	{
		title:		"Which are properties of the Daily Scrum ? Choose two answers",
		answerType: "M",
		answers: 	[
						"It is free form and designed to promote conversation",
						"It consists of the Scrum Master asking the Team members the three questions",
						"It is fifteen minutes or less in duration",
						"It is facilitated by the team lead",
						"Its location and time should remain constant",
						"It is held first thing in the morning"
					],
		answer: 	[2,4],
		feedback: 	""
	},
	{
		title:		"Which three of the following are feedback loops in Scrum ? Choose three answers",
		answerType: "M",
		answers: 	[
						"Daily Scrum",
						"Sprint Review",
						"Release Planning",
						"Sprint Retrospective",
						"Refinement Meeting"
					],
		answer: 	[0,1,3],
		feedback: 	""
	},
	{
		title:		"Which three of the following are time boxed events in Scrum ? Choose three answers",
		answerType: "M",
		answers: 	[
						"Sprint Testing",
						"Release Testing",
						"Daily Scrum",
						"Sprint 0",
						"Release Retrospective",
						"Sprint Planning",
						"Sprint Retrospective"
					],
		answer: 	[2,5,6],
		feedback: 	""
	},
	{
		title:		"Which three purposes does the definition of 'Done' serve ? Choose three answers",
		answerType: "M",
		answers: 	[
						"Increase transparency",
						"Create a shared understanding of when work is complete",
						"Describe the work that must be done before the Sprint is allowed to end",
						"Describe the purpose, objective and time-box of each Scrum event",
						"Guide the Development Team on how many Product Backlog items to select for the Sprint"
					],
		answer: 	[0,1,4],
		feedback: 	""
	},
	{
		title:		"Which topics should be discussed in the Sprint Review ?",
		answerType: "M",
		answers: 	[
						"The Scrum process, and how it was used during the Sprint",
						"Coding and engineering practices",
						"Sprint results",
						"All of the above"
					],
		answer: 	[2],
		feedback: 	""
	},
	{
		title:		"Which two things should the Development Team do during the first Sprint ?",
		answerType: "M",
		answers: 	[
						"Create an increment of potentially releasable software",
						"Analyse, describe, and document the requirements for the subsequent Sprints",
						"Develop at least one piece of functionality",
						"Make up a plan for the rest of the project",
						"Analyse, design and describe the complete architecture and infrastructure"
					],
		answer: 	[0,2],
		feedback: 	""
	},
	{
		title:		"Why is it important that there is only one Product Owner per product ? Choose three answers",
		answerType: "M",
		answers: 	[
						"It is clear who is accountable for the ultimate success of the product.",
						"The Development Team always knows who determines priorities",
						"It helps the economy by increasing employment",
						"It helps avoid barriers to effective communication and rapid decision-making",
						"The Scrum Master knows who will be his back-up whenever he goes on vacation"
					],
		answer: 	[0,1,3],
		feedback: 	""
	},
	{
		title:		"Why would you expect a Product Owner to care about the Development Team adhering to its definition of 'Done' ? Choose two answers",
		answerType: "M",
		answers: 	[
						"He doesn't have to care. Other systems aren't very good either.",
						"To predict the team's productivity over time",
						"To control the Total Cost of Ownership of the product",
						"To be able to reprimand the team when  they don't meet their velocity goal for the Sprint",
						"To have complete transparency into what has been done at the end of each Sprint"
					],
		answer: 	[2,4],
		feedback: 	""
	},
	{
		title:		"A Scrum Team has been working on a product for 9 Sprints. A new Product Owner comes in, understanding he is accountable for Product Backlog. However, he is unsure about the purpose of the Product Backlog. He's read that the Product Backlog should be a list of all user features for the product. He goes to the Scrum Master asking where to put the other types of requirements that are going to be taken into account. Are all of the following types of requirements acceptable on a Product Backlog ? Stability requirements, Performance requirements, Product Functionality, Documentation, Fixes",
		answerType: "S",
		answers: 	[
						"Yes, they all belong on the Product Backlog. Product Backlog is supposed to be the 'single source of truth' for all the work for the product",
						"No, Product Backlog is a toll for the Product Owner. The Product Owner represents the users and stakeholders. Other types of requirements should be managed separately by the Development Team. They are not the Product Owner's concern"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"As the Development Team starts work during the Sprint, it realizes it has selected too much work to finish in the Sprint. What should it do ?",
		answerType: "S",
		answers: 	[
						"Reduce the definition of 'Done' and get all of the Product Backlog items 'done' by the new definition.",
						"Inform the Product Owner at the Sprint Review, but prior to the demonstration.",
						"As soon as possible in the Sprint, work with the Product Owner to remove some work or Product Backlog items.",
						"Find another Scrum Team to give the excess work to"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"Does Scrum have a role called 'Project Manager' ?",
		answerType: "S",
		answers: 	[
						"Yes",
						"No"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"During a Sprint Retrospective, for what is the Product Owner responsible ?",
		answerType: "S",
		answers: 	[
						"The Product Owner should not take part in Sprint Retrospectives",
						"Capturing requirements for the Product Backlog",
						"Participating as a Scrum Team member",
						"Summarizing and reporting the discussions to the stakeholders that he/she represents in the Scrum Team"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"During the Daily Scrum, the Scrum Master's role is to :",
		answerType: "S",
		answers: 	[
						"Lead the discussion of the Development Team",
						"Make sure that all 3 questions have been answered.",
						"Manage the meeting in a way that each member has a chance to speak",
						"Teach the Development Team to keep the Daily Scrum within the 15 minute time-box",
						"All of the above"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Every Development Team should have :",	
		answerType: "S",
		answers: 	[
						"The competencies and skills needed to deliver a Done Increment in a Sprint",
						"At least one representative from each major software engineering discipline (like QA, Dev, UX)",
						"One Lead Developer and no more than 8 other members."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"How much time must a Product Owner spend with the Development Team ?",
		answerType: "S",
		answers: 	[
						"100%",
						"40%, or more if the stakeholders agree",
						"However much time the Development Team asks the Product Owner to be present",
						"Enough for the Product Owner to remain up to date on the evolution of the increment"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"How much work must a Development Team do to a Product Backlog item it selects for a Sprint ?",
		answerType: "S",
		answers: 	[
						"As much as it has told the product Owner will be done for every Product Backlog item it selects in conformance with the definition of 'Done'",
						"As much as it can fit into the Sprint. Any remaining work will be transferred to a subsequent Sprint.",
						"All development work and at least some testing",
						"A proportional amount of time on analysis, design, programming, testing and documentation"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"How should Product Backlog items be chosen when multiple Scrum Teams work for the same Product Backlog ? ",
		answerType: "S",
		answers: 	[
						"Each Scrum Team takes an equal number of items",
						"The Scrum Team with the highest velocity pulls Product Backlog item first",
						"The Product Owner decides",
						"The Development Team pulls in work in agreement with the Product Owner",
						"The Product Owner should provide each team with its own Product Backlog "
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"In order to maximize the value of the product, a Product Owner needs awareness of the following.",
		answerType: "S",
		answers: 	[
						"Competitive research",
						"Customer feedback",
						"Product vision",
						"Forecasting & feasibility",
						"All of the above",
						"None of the above"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title:		"Sprint burndown chart are an efficient tracking tool because they show : ",
		answerType: "S",
		answers: 	[
						"How much effort has gone into a Sprint",
						"An estimate of the total work remaining for the Sprint",
						"How many hours have been worked by each Development Team member",
						"How many Product Backlog items remain"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"The 'cone of uncertainty' can be used to do what ?",
		answerType: "S",
		answers: 	[
						"Determine the cost of a project before it is begun",
						"Project what will be complete by a given Sprint",
						"Determine whether to cut quality, similar to the 'Iron Triangle' of software development",
						"Illustrate that, as a forecast lengthens, it is increasingly less certain"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"The Development Team finds out during the Sprint that they aren't likely to build everything they forecasted. What would you expect a Product Owner to do ?",
		answerType: "S",
		answers: 	[
						"Cancel the Sprint",
						"Change the Sprint Goal",
						"Re-work the selected Product Backlog items with the Development Team to meet the Sprint Goal",
						"Skip Product Backlog refinement activities",
						"Inform management that more resources are needed"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"The Product Backlog is ordered by : ",
		answerType: "S",
		answers: 	[
						"Size, where small items are at the top and large items are at the bottom",
						"Risk, where safer items are at the top, and riskier items are at the bottom.",
						"Items are randomly arranged",
						"Importance, where the most important items are at the top at all times."
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"The Product Owner is accountable for the functionality included in each increment. Does he or she have the final say over the definition of 'Done' ?",
		answerType: "S",
		answers: 	[
						"Yes, the Product Owner is responsible for the definition of 'Done'. The Development Team may be consulted.",
						"No, the Development Team is responsible for the definition of 'Done'. The Product Owner may be consulted."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"The Product Owner must release each Increment to production.",
		answerType: "S",
		answers: 	[
						"Without exception",
						"When it makes sense",
						"Whenever the product is free of defects",
						"To make sure the Development Team is done every Sprint"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"The Product Owner wants advice from the Scrum Master about estimating work in Scrum. Which of these is the guideline that a Scrum Master should give ?",
		answerType: "S",
		answers: 	[
						"Product Backlog items must be estimated in story point",
						"Estimates must be in relative units",
						"Estimates are made by the Development Team",
						"Estimates are made by the Product Owner but are best checked with the Development Team",
						"Scrum forbids estimating"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"The top priority items of the Product Backlog should be analysed, estimated and prioritized adequately to begin a Sprint. This is referred to as an actionable, or 'Ready', Product Backlog. At the start of the Sprint Planning meeting, select the best description of the Product Backlog items that the Product Owner wants to have done.",
		answerType: "S",
		answers: 	[
						"They are stated as User Stories and cannot be epics",
						"They are stated as User Stories or use cases and test cases must have been identified",
						"They are clearly stated, refined and understood by the Product Owner and the Development Team such that a forecast of items can be made to implement the Sprint Goal",
						"They are fully described as User Stories or use cases already decomposed into tasks that will require no more than one-person day to complete by the Development Team"	
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"What activities would a Product Owner typically undertake in the phase between the end of the current Sprint and the start of the next Sprint ?",
		answerType: "S",
		answers: 	[
						"Refine the Product Backlog",
						"Update the project plan with stakeholders",
						"There are no such activities. The next Sprint starts immediately after the current Sprint.",
						"Work with the QA departments on the Increment of the current Sprint"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"What are criteria to order Product Backlog items ?",
		answerType: "S",
		answers: 	[
						"Value of Product Backlog item",
						"Dependencies between Product Backlog items",
						"Dependencies to other products",
						"All of the above"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"What enhances the transparency of an Increment ?",
		answerType: "S",
		answers: 	[
						"Doing all work needed to meet the definition of 'Done'",
						"Keeping track of an estimating all undone work to be completed in a separate Sprint",
						"Reporting Sprint progress to the stakeholders daily",
						"Updating Sprint tasks properly in the electronic tracking tool"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"What is included in the Sprint Backlog ?",
		answerType: "S",
		answers: 	[
						"User Stories",
						"Tasks",
						"Use Cases",
						"Tests",
						"Any of the above (or others) which are a decomposition of the selected Product Backlog items"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title:		"What is Product Owner work that a Product Owner might delegate ?",
		answerType: "S",
		answers: 	[
						"Write User Stories",
						"Order the Product Backlog",
						"Represent stakeholders to the Scrum Team",
						"Attend the Sprint Review"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"What is the main reason for the Scrum Master to be at the Daily Scrum ?",
		answerType: "S",
		answers: 	[
						"To make sure every team member answers the three question",
						"He or she does not have to be there, he or she only has to ensure the Development Team has a Daily Scrum",
						"To write down any changes to the Sprint Backlog, including adding new items, and tracking progress on the burn down",
						"To gather status and progress information to report to management"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"What is the recommended size for a Development Team ?",
		answerType: "S",
		answers: 	[
						"At least 7",
						"3 to 9",
						"7 plus or minus 3",
						"9"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"What is the time-box for the Sprint Review ?",
		answerType: "S",
		answers: 	[
						"2 hours for a monthly Sprint",
						"4 hours for a monthly Sprint",
						"As long as needed",
						"1 day",
						"4 hours and longer as needed"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"What might indicate to a Product Owner that she needs to work more with the Scrum Team ?",	
		answerType: "S",
		answers: 	[
						"She isn't working full time with the Scrum Team",
						"The increment presented at the Sprint Review does not reflect what she thought she had asked for.",
						"Developers leave the Team",
						"The acceptance tests don't appear to be complete"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"What typically happens if the Product Backlog is not sufficiently clear at Sprint Planning ?",
		answerType: "S",
		answers: 	[
						"The Development Team has difficulties creating a forecast of work for the Sprint",
						"Nothing in particular",		
						"It is compensated if the Product Owner gives the team a clear Sprint Goal instead",
						"The meeting in cancelled so refinement can be done first",
						"The Scrum Master shouldn't allow this to happen. Look for a new Scrum Master and re-start the Sprint"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"When a Development Team is having trouble delivering a working increment because they don't understand a functional requirement, what should they do ?",
		answerType: "S",
		answers: 	[
						"Defer the work to a more appropriate Sprint",
						"Collaborate with the Product Owner to determine what is possible and acceptable",
						"Add a specialist to the Development Team",
						"Partially complete the functionality, and discuss the remaining work at the Sprint Review"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"When does the second Sprint start ?",
		answerType: "S",
		answers: 	[
						"After the customer completes acceptance testing of the first Sprint",			
						"Immediately after the first Sprint",
						"After the Product Backlog for the second Sprint has been selected",
						"Once the architectural changes for the second Sprint have been approved by the senior architect"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"When might a Sprint be abnormally terminated ?",
		answerType: "S",
		answers: 	[
						"When it becomes clear that not everything will be finished by the end of the Sprint",
						"When the Development Team feels that the work is too hard",
						"When the sales department has an important new opportunity",
						"When the Sprint Goal becomes obsolete"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"When should a Sprint Goal be created ? ",
		answerType: "S",
		answers: 	[
						"At any time during the Sprint",
						"It must be established before Sprint Planning in order to begin planning",
						"During Sprint Planning",
						"A Sprint Goal is not mandatory in Scrum",
						"It should have been created in the previous Sprint during Product Backlog refinement"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"When should the Product Owner update the project plan ?",
		answerType: "S",
		answers: 	[
						"The Product Backlog is the plan in Scrum. It is updated as new information and insights emerge.",
						"Before the Sprint Planning to know how much work will have to be done in the Sprint.",
						"After the Daily Scrum to ensure an accurate daily overview of project progress",
						"Scrum forbids having a project plan.",
						"The Product Owner shouldn't be occupied by that. It is work for the Project Manager."
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"Which answer best describes the topics covered in Sprint Planning ?",
		answerType: "S",
		answers: 	[
						"What can be done and how to do it",
						"Who is on the team and what team members roles will be ",
						"What to do and who will do it ",
						"How conditions have changed and how the Product Backlog should evolve",			
						"What went wrong in the last Sprint and what to do differently this Sprint"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"Which is NOT a valid consideration when ordering a Product Backlog ?",
		answerType: "S",
		answers: 	[
						"Alignment with business strategy and goals",
						"Risk",
						"Importance to customers",
						"Development Team tools and techniques",
						"Dependencies on other Product Backlog Items"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Which is the most important stakeholder Product Owner must satisfy ?",
		answerType: "S",
		answers: 	[
						"The company owner or shareholders",
						"Executive staff",
						"The Chief Product Owner",
						"The product's users"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Which of these may a Development Team deliver at the end of a Sprint ?",
		answerType: "S",
		answers: 	[
						"An increment of working software that is 'done'",
						"An increment of software with minor known bugs in it",
						"A single document, if that is what the Scrum Master asked for",
						"Failing unit tests, to identify acceptance tests for the next Sprint"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"Which outcome is expected as Scrum Teams mature ? ",
		answerType: "S",
		answers: 	[
						"A Scrum Master is no longer needed since they are a mature team now",
						"There is no need for a time boxed Sprint, since time-boxed are only for new Scrum Teams",
						"The Sprint Retrospective will grow to be longer than 4 hours ",
						"They will improve their definition of 'Done' to include more stringent criteria",
						"Sprint Reviews will no longer be needed"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Who can abnormally terminate a Sprint ?",
		answerType: "S",
		answers: 	[
						"The Development Team or its member",
						"The Product Owner",
						"The Stakeholder",
						"The Scrum Master"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"Who creates a Product Backlog item's estimate ?",
		answerType: "S",
		answers: 	[
						"The Product Owner with input from the Development Team",
						"The Development Team, alone",
						"The Development Team after clarifying requirements with the Product Owner",
						"The Scrum Master",
						"The most senior people in the organization, including architects and subject matter experts"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"Who has the final say on the order of the Product Backlog ?",
		answerType: "S",
		answers: 	[
						"The Stakeholders",
						"The Development Team",
						"The Scrum Master",
						"The Product Owner",
						"The CEO"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Who is responsible for clearly expressing Product Backlog items ?",
		answerType: "S",
		answers: 	[
						"The Product Owner ",
						"The Scrum Master",
						"The Scrum Master, or the Scrum Master may have the Development Team do it",
						"The business analyst who represents the Product Owner in the Development Team"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"Who is responsible for engaging the stakeholders ?",
		answerType: "S",
		answers: 	[
						"The team manager",
						"The business analyst",
						"The project manager",
						"The Development Team",
						"The Product Owner"
					],
		answer: 	4,
		feedback: 	""
	},
	{
		title:		"Who is responsible for tracking the remaining work of the Sprint ?",
		answerType: "S",
		answers: 	[
						"The Scrum Master",
						"The Project Manager",
						"The Product Owner",
						"The Development Team",
						"The Development Team in consultation with the Product Owner "
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"Who must do all the work to make sure Product Backlog items conform to the Definition of 'Done' ?",
		answerType: "S",
		answers: 	[
						"The Scrum Team",
						"The Development Team",
						"The Product Owner",
						"QA Specialists",
						"The Scrum Master"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"Who owns the Sprint Backlog ? ",
		answerType: "S",
		answers: 	[
						"The Scrum Team",
						"The Development Team",
						"The Product Owner",
						"The Scrum Master"
					],
		answer: 	1,
		feedback: 	""
	},
	{
		title:		"Who should know the most about the progress toward a business objective or a release ?",
		answerType: "S",
		answers: 	[
						"The Product Owner",
						"The Development Team",
						"The Scrum Master",
						"The Project Manager"
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title:		"Why does the Product Owner want the Development Team to adhere to its definition of 'Done' ? ",
		answerType: "S",
		answers: 	[
						"To predict the team's productivity over time",
						"To know what the team will deliver over the next three Sprints",
						"To be able to reprimand the team when they don't meet their velocity goal for the Sprint",
						"To have complete transparency into what has been done at the end of each Sprint"
					],
		answer: 	3,
		feedback: 	""
	},
	{
		title:		"You are a product manager with a proven track record in your company. Your management has asked you to take the lead in the development of a new product. Six teams new to Scrum will build this product. You have gathered a number of requirements and ideas into an early form of a Product Backlog. How would you minimize dependencies between the Scrum Team?",
		answerType: "S",
		answers: 	[
						"You create an independent Product Backlog per Scrum Team",
						"You identify the dependencies and re-order the Product Backlog for them",
						"You work with the Development Teams on how to best parse the worked",			
						"You divide Product Backlog items among the six Product Owners",
						"You raise this as an impediment with the Scrum Master"
					],
		answer: 	2,
		feedback: 	""
	},
	{
		title:		"A product Increment must be released to production at the end of each Sprint.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"A Product Owner can measure success y an increase in the team's velocity.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"A Product Owner with multiple teams working on one product should maintain separate Product Backlogs for each team.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"A Scrum Team is only allowed to meet with stakeholders during Sprint Review.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"All work to be done by the Development Team must ultimately originate from the Product Backlog ?",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title:		"Multiple Scrum Team working on the same project must have the same Sprint start date",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"Product Owner must specify complete acceptance criteria for a Product Backlog item before the team can select the item in Sprint Planning.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"The Product Owner must write all of the Product Backlog items (e.g. user stories, non-functional requirements, etc.) on the Product Backlog before handing them over the Development Team.",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"The Product Owner should have a complete and exhaustive Product Backlog before the first Sprint can start ?",
		answerType: "TF",
		answer: 	false,
		feedback: 	""
	},
	{
		title:		"The Sprint Goal is a result of Sprint Planning, as is the Sprint Backlog.",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title:		"To get started in terms of what to build, Scrum requires no more than a Product Owner with enough solid ideas for a first Sprint, a Development Team to implement those ideas and a Scrum Master to help guide the process",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	}
];
/*
	{
		title: 		"",
		answerType: "TF",
		answer: 	true,
		feedback: 	""
	},
	{
		title: 		"",
		answerType: "S",
		answers: 	[
						""
					],
		answer: 	0,
		feedback: 	""
	},
	{
		title: 		"",
		answerType: "M",
		answers: 	[
						""
					],
		answer: 	[0],
		feedback: 	""
	}
*/