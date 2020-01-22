/*************************************************************************************

	script.js contains all the official javascript for the Project 3 app.

	Some thoughts about functions I'll need (in no particular order):

	1) A date/time clash detector, with a decision on how generic and abstracted to
		make it - that is, do I keep it local to this project where there are only
		two days and two time slots, or do I make one that can detect an overlap 
		between any two dates/times?
	2) An event-handler on the entire form that runs a' the validations and stores an
		array of valid/invalid stuff (with error messages, maybe)
	3) A set of validating functions
	4) A data.js file with error messages in
	5) A way of storing and re-loading data?
	6) Functions to hide/show the Colour stuff until T-Shirt design is selected

	All this and much more!

	Easter egg... not sure yet. But maybe, if you enter the name "Arthur Dent" you get
	"you have been diverted...". Though that means not having a Douglas Adams button.

**************************************************************************************/

