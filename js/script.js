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

	Easter egg... not sure yet. Current thinking is to have it replace all the text with 
	Vogon poetry.

**************************************************************************************/
const tShirtTheme = document.getElementById('theme');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const creditCairdField = document.getElementById('cc-num');
const zipCodeField = document.getElementById('zip');
const cvvField = document.getElementById('cvv');
const jobRoleList = document.getElementById('role');
const jobRoleOtherInput = document.getElementById('jobRoleOtherInput');
const jobRoleOtherLabel = document.getElementById('jobRoleOtherLabel');
const colorsAvailable = document.getElementById('colors-js-puns');
const colorSelectList = document.getElementById('color');
const paymentOption = document.getElementById('payment');
const paypalDiv = document.getElementById('paypal');
const bitcoinDiv = document.getElementById('bitcoin');
const creditcairdDiv = document.getElementById('credit-caird');
const submitButton = document.getElementsByTagName('BUTTON')[0];
const activitiesFieldset = document.getElementsByClassName('activities')[0];
const activities = activitiesFieldset.getElementsByTagName('input');
const form = document.getElementsByTagName('form')[0];

// The idea of the next object (which would be part of a database in real life, probably) is to keep
// source data separate from the logic. The onColorSelect() function displays whatever is in this
// object.
// It still has hard-coded key/values here that have to match the html for the
// corresponding divs (see id = "colors-js-puns") in index.html; so it's not perfect. 
const tShirtColors = {
	js_puns: [["cornflowerblue","Corn Flower Blue"],
					  ["darkslategrey","Dark Slate Grey"],
					  ["gold","Gold"],
					  ["cadburyspurple","Cadbury's Purple"]], // that's my favourite colour.
	heart_js: [["tomato","Tomato"],
						 ["steelblue","Steel Blue"],
						 ["dimgrey","Dim Grey"],
						 ["cadburyspurple","Cadbury's Purple"]] // google it if you need to...
						 																				// then it will become your favourite
}																										// colour too.

let errors = {
	nameErrors: [],
	emailErrors: [],
	activitiesError: [],
	creditCairdErrors: [],
	zipCodeErrors: [],
	cvvErrors: [],
}

const thereAreErrors = () => {
	for (let [key,value] of Object.entries(errors)) { // and yes, I did have to look that up
		if (value.length > 0) {
			return true;
		}
	}
	return false;
}


/*************************************************************** 
	GENERIC ERROR PROCESSING
***************************************************************/

const clearErrorsDiv = (errorCategory) => {
	//test
	const obsoleteDiv = document.getElementById(errorCategory);
	if (obsoleteDiv) {
		obsoleteDiv.parentNode.removeChild(obsoleteDiv);
	}
}

const displayErrorsDiv = (nodeOfInterest,errorCategory) => {
	clearErrorsDiv(errorCategory);
	const listOfErrors = errors[errorCategory];
	if (listOfErrors.length === 0) {
		return null;
	}
	const referenceNode = nodeOfInterest.nextElementSibling;
	const errorsDiv = document.createElement('DIV');
	errorsDiv.setAttribute('id',errorCategory);
	errorsDiv.classList.add('error-display');
	for (let i=0; i<listOfErrors.length; i++) {
		errorsDiv.innerHTML += `<p>${listOfErrors[i]}</p>`;
	}
	nodeOfInterest.parentNode.insertBefore(errorsDiv,referenceNode);
}

const setAppearance = (element,status) => {
	const borderColours = {
		inprogress: 'goldenrod',
		invalid: 'crimson',
		valid: 	'green'
	}
	element.style.borderColor = borderColours[status];
	element.style.borderWidth = '4px';
}



/* BASIC INFO BOX
	2) There's nothing in here about specific validations, so I'll just choose some:
	 - First name and surname. Capitalisation is fixed automatically.
	 - nae numbers in the name.
	 - Email address has stuff, followed by @, stuff,  ., stuff
*/
const setUpBasicInfo = () => {
	nameField.focus();
	jobRoleOtherInput.style.display = 'none';
	jobRoleOtherLabel.style.display = 'none';
	emailField.title=""; // Disables the HTML default to keep everything in-Project
	jobRoleList.addEventListener('change',onRoleSelect,false);
	nameField.addEventListener('input',handleNameFieldInput,false);
	nameField.addEventListener('blur',handleNameFieldBlur,false);
	nameField.setAttribute('autoComplete','false');
	emailField.addEventListener('input',handleEmailFieldInput,false);
	emailField.addEventListener('blur',handleEmailFieldBlur,false);
	emailField.setAttribute('autocomplete',"false");
}

const onRoleSelect = () => {
	let role = jobRoleList.value;
	if (role === 'other') {
		jobRoleOtherInput.style.display = 'inherit';
		jobRoleOtherInput.focus();
		jobRoleOtherInput.placeholder = `(Leave blank if you don't wish to state your role)`;
		jobRoleOtherLabel.style.display = 'inherit';
	}
}

const validateUserName = (inputSoFar) => {
	let errors = [];
	if (isValidUserName(inputSoFar)) {
		return errors;
	} else if (isBlank(inputSoFar)) {
		errors.push("Name cannot be left blank.");
	} else {
		if (containsNumbers(inputSoFar)) {
			errors.push("Name cannot contain numbers.");
		}
		if (containsNonAlphaNumericExceptSpaces(inputSoFar)) {
			errors.push("Name cannot contain non-alphanumeric characters.")
		}
		if (containsOnlySpaces(inputSoFar)) {
			errors.push("Name cannot contain only spaces.")
		}
	}
	return errors;
}

const handleNameFieldInput = (event) => {
	const inputSoFar = nameField.value;
	setAppearance(nameField,'inprogress');
	clearErrorsDiv("nameErrors");
	errors.nameErrors = validateUserName(inputSoFar);
	if (errors.nameErrors.length === 0) {
		setAppearance(nameField,'valid');
	} else {
		displayErrorsDiv(nameField,"nameErrors");
	}
}

const handleNameFieldBlur = (event) => {
	const name = nameField.value;
	if (!isValidUserName(name)) {
		setAppearance(nameField,'invalid');
	}
}

const validateEmail = (inputSoFar) => {
	let errors = [];
	if (isValidEmail(inputSoFar)) {
		return errors;
	}
	if (isBlank(inputSoFar)) {
		errors.push("Email cannot be left blank.");
	} else {
		errors.push("Valid examples: valid@email.com, valid@email.me.net");
	}
	return errors;
}

const handleEmailFieldInput = (event) => {
	emailField.style.backgroundColor = "goldenrod";
	emailField.classList.add('is-invalid');
	let inputSoFar = emailField.value;
	errors.emailErrors = validateEmail(inputSoFar);
	if (errors.emailErrors.length === 0) {
		emailField.style.backgroundColor = "#80ff80";
		emailField.classList.remove('is-invalid');
		emailField.classList.add('is-valid');
	}
	displayErrorsDiv(emailField,"emailErrors");
}

const handleEmailFieldBlur = (event) => {
	// const email = emailField.value;
	// emailField.classList.add('blub');
	// if (isValidEmail(email)) {
	// 	emailField.classList.add('is-valid');
	// } else {
	// 	emailField.classList.add('is-invalid');
	// }
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

	Have an array of all the checkboxes.
	ToDo: add click event handler to the form

*/

const setUpActivities = () => {
	activitiesFieldset.addEventListener('click',handleActivitiesClick,false);
	for (let i=0; i<activities.length; i++) {
		const costString = activities[i].dataset.cost;
		const cost = costString.replace('$','');
	}
}


const handleActivitiesClick = (event) => {
	errors.activitiesError = [];
	const target = event.target;
	detectClashingActivities(target);
	const cost = calculateCost();
	// Based on the HTML as it currently is, if cost is zero then nothing has been clicked.
	// This will do for now, but I realise it's brittle - it would break in future if another,
	// free, activity were added, or if an existing one were made free. See also comment for
	// onSubmitting function
	if (!setCostDivDisplay(cost)) {
		errors.activitiesError.push("You must select one or more activities.");
	}
	displayErrorsDiv(activitiesFieldset,"activitiesError");
}

const detectClashingActivities = (activity) => {
	const timeSlot = activity.dataset.dayAndTime;
	for (let i=0; i<activities.length; i++) {
		if (activities[i] === activity) {
			continue;
		}
		if (activities[i].dataset.dayAndTime === timeSlot) {
			if (activity.checked) {
				activities[i].disabled = true;
				activities[i].parentNode.classList.add('disabled');
			} else {
				activities[i].disabled = false;
				activities[i].parentNode.classList.remove('disabled');
			}
		}
	}
}

const calculateCost = () => {
	let cost = 0;
	for (let i=0; i<activities.length; i++) {
		const activity = activities[i];
		if (activity.checked) {
			cost += parseInt(activity.dataset.cost.replace('$',''));
		}
	}
	return cost;
}

const setCostDivDisplay = (cost) => {
	const div = document.getElementById('costDiv');
	if (div) { 
		div.parentNode.removeChild(div);
	}
	if (cost === 0) {
		return false;
	}
	let costDiv = document.createElement('DIV');
	costDiv.setAttribute('id','costDiv');
	costDiv.classList.add('cost-display');
	costDiv.textContent = `Total cost of activities: \$${cost}`;
	activitiesFieldset.appendChild(costDiv);
	return true;
}

/* PAYMENT OPTIONS
	1) Defaults to credit card
*/

const setUpPaymentInfo = () => {
	paymentOption.addEventListener('change',onPaymentOptionSelect,false)
	paypalDiv.style.display = 'none';
	bitcoinDiv.style.display = 'none';
	document.getElementById('cc-num').addEventListener('input',handleCreditCairdNumberInput,false);
	document.getElementById('cc-num').addEventListener('blur',handleCreditCairdFieldBlur ,false);
	document.getElementById('zip').addEventListener('input',handleZipCodeInput,false);
	document.getElementById('zip').addEventListener('blur',handleZipCodeFieldBlur,false);
	document.getElementById('cvv').addEventListener('input',handleCVVinput,false);
	document.getElementById('cvv').addEventListener('blur',handleCVVfieldBlur,false);
}

const validateCreditCairdNumber = (inputSoFar) => {
	let errors = [];
	if (isValidCreditCairdNumber(inputSoFar)) {
		return errors;
	}
	if (isBlank(inputSoFar)) {
			errors.push("Credit caird number cannot be left blank.");
	} else {
		if (containsLetters(inputSoFar)) {
			errors.push("Credit caird number cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.push("Credit caird number cannot contain non-alphanumeric characters.")
		}
		if (hasTooFewDigits(inputSoFar,13)){
			errors.push("Credit caird number has fewer than 13 digits.");
		}
		if (hasTooManyDigits(inputSoFar,16)){
			errors.push("Credit caird number has more than 16 digits.");
		}
	}
	return errors;
}

const handleCreditCairdNumberInput = (event) => {
	creditCairdField.style.backgroundColor = "goldenrod";
	let inputSoFar = creditCairdField.value;
	errors.creditCairdErrors = validateCreditCairdNumber(inputSoFar);
	if (errors.creditCairdErrors.length === 0) {
		creditCairdField.style.backgroundColor = "#80ff80";
	} 
	displayErrorsDiv(creditCairdField,"creditCairdErrors");
}

const handleCreditCairdFieldBlur = (event) => {
	const number = creditCairdField.value;
	if (!isValidCreditCairdNumber(number)) {
		creditCairdField.style.backgroundColor = "";
	}
}

const validateZipCode = (inputSoFar) => {
	let errors = [];
	if (isValidZipCode(inputSoFar)) {
		return errors;
	}
	if (isBlank(inputSoFar)) {
		errors.push("Zip code cannot be left blank.");
	} else {
		if (containsLetters(inputSoFar)) {
			errors.push("Zip Code cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.push("Zip Code cannot contain non-alphanumeric characters.");
		}
		if (hasTooFewDigits(inputSoFar,5)){
			errors.push("Zip Code has fewer than 5 digits.");
		}
		if (hasTooManyDigits(inputSoFar,5)){
			errors.push("Zip Code has more than 5 digits.");
		}
	}
	return errors;
}

const handleZipCodeInput = (event) => {
	let inputSoFar = zipCodeField.value;
	zipCodeField.style.backgroundColor = "goldenrod";
	errors.zipCodeErrors = validateZipCode(inputSoFar);
	if (errors.zipCodeErrors.length === 0) {
		zipCodeField.style.backgroundColor = "#80ff80";
	}
	displayErrorsDiv(zipCodeField,"zipCodeErrors");
}

const handleZipCodeFieldBlur = (event) => {
	const number = zipCodeField.value;
	if (!isValidZipCode(number)) {
		zipCodeField.style.backgroundColor = "";
	}
}

const validateCVV = (inputSoFar) => {
	let errors = [];
	if (isValidCVV(inputSoFar)) {
		return errors;
	}
	if (isBlank(inputSoFar)) {
		errors.push('CVV cannot be left blank.');
	} else {
		if (containsLetters(inputSoFar)) {
			errors.push("CVV cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.push("CVV cannot contain non-alphanumeric characters.")
		}
		if (hasTooFewDigits(inputSoFar,3)){
			errors.push("CVV has fewer than 3 digits.");
		}
		if (hasTooManyDigits(inputSoFar,3)){
			errors.push("CVV has more than 3 digits.");
		}
	}
	return errors;
}

const handleCVVinput = (event) => {
	let inputSoFar = cvvField.value;
	cvvField.style.backgroundColor = "goldenrod";
	errors.cvvErrors = validateCVV(inputSoFar);
	if (errors.cvvErrors.length === 0) {
		cvvField.style.backgroundColor = "#80ff80";
	}
	displayErrorsDiv(cvvField,"cvvErrors");
}

const handleCVVfieldBlur = (event) => {
	const number = cvvField.value;
	if (!isValidCVV(number)) {
		cvvField.style.backgroundColor = "";
	}
}

const onPaymentOptionSelect = () => {
	let theUsersChoice = paymentOption.value;
	const firstClearTheStage = () => {
		errors.creditCairdErrors = [];
		errors.zipCodeErrors = [];
		errors.cvvErrors = [];
		bitcoinDiv.style.display = 'none';
		creditcairdDiv.style.display = 'none';
		document.getElementById('cc-num').value = '';
		document.getElementById('zip').value = '';
		document.getElementById('cvv').value = '';
		paypalDiv.style.display = 'none';
		cvvField.style.backgroundColor = "";
		creditCairdField.style.backgroundColor = "";
		zipCodeField.style.backgroundColor = "";
	}
	const thenShow = {
		'Bitcoin': function() {
									bitcoinDiv.style.display = 'inherit';
									bitcoinDiv.innerHTML = `<p>We'll take you to the Coinbase site to set up your billing information when you click "Register" below.</p>
									  <p>All Bitcoin transactions will be final (because obviously).</p>`
							 },
		'PayPal': function() {
								paypalDiv.style.display = 'inherit';
								paypalDiv.firstElementChild.textContent = `We'll take you to Paypal's site to set up your billing information when you click “Register” below.`
							},
		'Credit Caird': function() {
											creditcairdDiv.style.display = 'inherit';
											document.getElementById('cc-num').focus();
										},
		'select method': function() {
							  			creditcairdDiv.style.display = 'inherit'; // Keep this as the default
										 }
	}
	firstClearTheStage();
	thenShow[theUsersChoice]();
}

/* SUBMIT BUTTON
	1) Error messages (if applicable) apply to the name, email, activity and credit-card fields
	2) To disable javascript: devtools, three dots, settings, scroll down to Debugger.
*/
const onSubmitting = (event) => {
	errors.nameErrors = validateUserName(nameField.value);
	displayErrorsDiv(nameField,"nameErrors");
	errors.emailErrors = validateEmail(emailField.value);
	displayErrorsDiv(emailField,"emailErrors");
	if (calculateCost() === 0) {
// See comment for handleActivitiesClick function
		errors.activitiesError = ["You must select one or more activities."];
	}
	displayErrorsDiv(activitiesFieldset,"activitiesError");
	if (!(paymentOption.value === "PayPal" || paymentOption === "Bitcoin")) {
		errors.creditCairdErrors = validateCreditCairdNumber(creditCairdField.value);
		displayErrorsDiv(creditCairdField,"creditCairdErrors");
		errors.zipCodeErrors = validateZipCode(zipCodeField.value);
		displayErrorsDiv(zipCodeField,"zipCodeErrors");
		errors.cvvErrors = validateCVV(cvvField.value);
		displayErrorsDiv(cvvField,"cvvErrors");
	}
	if (thereAreErrors()) {
		event.preventDefault();
	}

}


setUpPaymentInfo();
setUpBasicInfo();
setUpTShirt();
setUpActivities();

form.addEventListener("submit",onSubmitting,false);




