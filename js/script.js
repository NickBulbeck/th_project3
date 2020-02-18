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
const tShirtTheme = document.getElementById('theme');
const nameField = document.getElementById('name');
const jobRoleOtherInput = document.getElementById('jobRoleOtherInput');
const jobRoleOtherLabel = document.getElementById('jobRoleOtherLabel');
const colorsAvailable = document.getElementById('colors-js-puns');
const colorSelectList = document.getElementById('color');
const submitButton = document.getElementsByTagName('BUTTON')[0];
// The idea of the next object (which would be part of a database in real life, probably) is to keep
// source data separate from the logic. The onColorSelect() function displays whatever is in this
// object.
// It still needs a hard-coded correspondence between the key/values here and the html for the
// corresponding divs (see id = "colors-js-puns") in index.html; so it's not perfect. But since
// I wanted to change the wording in the list options to remove the redundant references to the 
// theme, this is at least a way of removing lots of hard-coded data from the function.
const tShirtColors = {
	js_puns: [["cornflowerblue","Corn Flower Blue"],
					  ["darkslategrey","Dark Slate Grey"],
					  ["gold","Gold"],
					  ["cadburyspurple","Cadbury's Purple"]],
	heart_js: [["tomato","Tomato"],
						 ["steelblue","Steel Blue"],
						 ["dimgrey","Dim Grey"],
						 ["cadburyspurple","Cadbury's Purple"]]
}


/* BASIC INFO BOX
	1) The first field should have focus automatically. Should be easy enough.
	2) There's nothing in here about specific validations, so I'll just choose some:
	 - First name and surname. Capitalisation is fixed automatically.
	 - nae numbers in the name.
	 - Email address has stuff, followed by @, stuff,  ., stuff
*/
const setUpBasicInfo = () => {
	nameField.focus();
}


/*************************************************************** 
	T-SHIRT BOX
***************************************************************/

const onColorSelect = (event) => {
	const selectedTheme = event.target.value;
	const colors = tShirtColors[selectedTheme];
	// If there's no actual value matching a key in the tShirtColors object, keep the
	// list hidden (or hide it if it isn't already). This includes the menu option "Select Theme".
	if (!colors) {
		colorsAvailable.style.display = "none";
		return;
	}
	let html = '';
	for (let i=0; i<colors.length; i++) {
		html += `<option value="${colors[i][0]}">${colors[i][1]}</option>`
	}
	colorSelectList.innerHTML = html;
	colorsAvailable.style.display='';
}

const setUpTShirt = () => {
	colorsAvailable.style.display = "none";
	tShirtTheme.addEventListener('change', onColorSelect, false);
}


// REGISTER FOR ACTIVITIES: DATE/TIME CLASH DETECTOR
/*
	1) When anything is checked, the total cost appears at the bottom of the div
	2) When anything is checked, any conflicting activity is disabled.
	3) When it is unchecked, the conflicting activity is re-enabled.

	The event-handler is on the form. You need to know the event target, and all the others.
	If it's disabled, you do nothing. BTW - just disabling it should re-style it. Just set
	element.disabled=true. If the handler is on the form, I might need to test what happens
	here and test for disabled.
	So, you check a box: then you disable everything else with the same time.
	BUT you UN-check a box: what then? With the existing data, there are only two possible 
	clashes. So, could have two click handlers; one for a potential clash and one for the
	others.
*/

/* PAYMENT OPTIONS 
	1) Defaults to credit card
	2) Which means that the other bits are hidden
	3) When you change the selection, you display the relevant bit and hide the others

*/

/* SUBMIT BUTTON
	1) Error messages (if applicable) apply to the name, email, activity and credit-card fields
	2) To disable javascript: devtools, three dots, settings, scroll down to Debugger.
*/
const onSubmitting = () => {
	/* Validations are called fae here. MVP:
	1) Name cannae be blank
	2) Email must be a valid email address
	3) At least one checkbox fae Register for activities selected
	4) Iff payment option is credit caird:
		i) Credit Caird field should be a number with 13-16 digits
		ii) Zip Code should be 5-digit number... I'm thinking of making this a post code
		iii) CVV should be a 3-digit number
	*/
}



setUpBasicInfo();
setUpTShirt();




