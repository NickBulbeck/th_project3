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

let errors = {
	nameErrors: [],
	emailErrors: [],
	activitiesError: false,
	creditCairdErrors: [],
	zipCodeErrors: [],
	cvvErrors: []
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
	jobRoleList.addEventListener('change',onRoleSelect,false);
	nameField.addEventListener('input',handleNameFieldInput,false);
	nameField.addEventListener('blur',handleNameFieldBlur,false);
	emailField.addEventListener('input',handleEmailFieldInput,false);
	emailField.addEventListener('blur',handleEmailFieldBlur,false);
}

const onRoleSelect = () => {
	let role = jobRoleList.value;
	if (role === 'other') {
		jobRoleOtherInput.style.display = 'inherit';
		jobRoleOtherInput.focus();
		jobRoleOtherLabel.style.display = 'inherit';
		jobRoleOtherLabel.textContent = 'Please state your job role here:';
	}
}

const handleNameFieldInput = (event) => {
	const inputSoFar = nameField.value;
	errors.nameErrors = [];
	if (isValidUserName(inputSoFar)) {
		nameField.style.backgroundColor = "#80ff80";
	} else if (isBlank(inputSoFar)) {
		errors.nameErrors.push("Name cannot be left blank.");
		nameField.style.backgroundColor = "goldenrod";
	} else {
		if (containsNumbers(inputSoFar)) {
			errors.nameErrors.push("Name cannot contain numbers.");
			nameField.style.backgroundColor = "goldenrod";
		}
		if (containsNonAlphaNumericExceptSpaces(inputSoFar)) {
			errors.nameErrors.push("Name cannot contain non-alphanumeric characters.")
			nameField.style.backgroundColor = "goldenrod";
		}
		if (containsOnlySpaces(inputSoFar)) {
			errors.nameErrors.push("Name cannot contain only spaces.")
			nameField.style.backgroundColor = "goldenrod";
		}
	}
}

const handleNameFieldBlur = (event) => {
	const name = nameField.value;
	if (!isValidUserName(name) && errors.nameErrors.length > 0) {
		nameField.style.backgroundColor = "red";
	}
}

const handleEmailFieldInput = (event) => {
	errors.emailErrors = []
	let inputSoFar = emailField.value;
	if (isValidEmail(inputSoFar)) {
		emailField.style.backgroundColor = "#80ff80";
	} else if (isBlank(inputSoFar)) {
		errors.emailErrors.push("Email cannot be left blank.");
		emailField.style.backgroundColor = "goldenrod";
	} else {
		errors.emailErrors.push("Email address is invalid.")
		emailField.style.backgroundColor = "goldenrod";
	}
}

const handleEmailFieldBlur = (event) => {
	const email = emailField.value;
	if (!isValidEmail(email) && errors.emailErrors.length > 0) {
		emailField.style.backgroundColor = "red";
	}
}


/*************************************************************** 
	T-SHIRT BOX: DONE
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

const handleCreditCairdNumberInput = (event) => {
	errors.creditCairdErrors = [];
	creditCairdField.style.backgroundColor = "goldenrod";
	let inputSoFar = creditCairdField.value;
	if (isValidCreditCairdNumber(inputSoFar)) {
		creditCairdField.style.backgroundColor = "#80ff80";
	} else if (isBlank(inputSoFar)) {
			errors.creditCairdErrors.push("Credit caird number cannot be left blank.");
	} else {
		if (containsLetters(inputSoFar)) {
			errors.creditCairdErrors.push("Credit caird number cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.creditCairdErrors.push("Credit caird number cannot contain non-alphanumeric characters.")
		}
		if (hasTooFewDigits(inputSoFar,13)){
			errors.creditCairdErrors.push("Credit caird number has fewer than 13 digits.");
		}
		if (hasTooManyDigits(inputSoFar,16)){
			errors.creditCairdErrors.push("Credit caird number has more than 16 digits.");
		}
	}
}

const handleCreditCairdFieldBlur = (event) => {
	const number = creditCairdField.value;
	if (!isValidCreditCairdNumber(number) && errors.creditCairdErrors.length > 0) {
		creditCairdField.style.backgroundColor = "red";
	}
}


const handleZipCodeInput = (event) => {
	errors.zipCodeErrors = [];
	let inputSoFar = zipCodeField.value;
	zipCodeField.style.backgroundColor = "goldenrod";
	if (isValidZipCode(inputSoFar)) {
		zipCodeField.style.backgroundColor = "#80ff80";
	} else {
		if (containsLetters(inputSoFar)) {
			errors.zipCodeErrors.push("Zip Code cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.zipCodeErrors.push("Zip Code cannot contain non-alphanumeric characters.")
		}
		if (hasTooFewDigits(inputSoFar,5)){
			errors.zipCodeErrors.push("Zip Code has fewer than 5 digits.");
		}
		if (hasTooManyDigits(inputSoFar,5)){
			errors.zipCodeErrors.push("Zip Code has more than 5 digits.");
		}
	}
}

const handleZipCodeFieldBlur = (event) => {
	const number = zipCodeField.value;
	if (!isValidZipCode(number) && errors.zipCodeErrors.length > 0) {
		zipCodeField.style.backgroundColor = "red";
	}
}


const handleCVVinput = (event) => {
	let inputSoFar = cvvField.value;
	errors.cvvErrors = [];
	cvvField.style.backgroundColor = "goldenrod";
	if (isValidCVV(inputSoFar)) {
		cvvField.style.backgroundColor = "#80ff80";
	} else {
		if (containsLetters(inputSoFar)) {
			errors.cvvErrors.push("CVV cannot contain letters.");
		}
		if (containsNonAlphaNumericIncludingSpaces(inputSoFar)) {
			errors.cvvErrors.push("CVV cannot contain non-alphanumeric characters.")
		}
		if (hasTooFewDigits(inputSoFar,3)){
			errors.cvvErrors.push("CVV has fewer than 3 digits.");
		}
		if (hasTooManyDigits(inputSoFar,3)){
			errors.cvvErrors.push("CVV has more than 3 digits.");
		}
	}
}

const handleCVVfieldBlur = (event) => {
	const number = cvvField.value;
	if (!isValidCVV(number) && errors.cvvErrors.length > 0) {
		cvvField.style.backgroundColor = "red";
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
	console.log(`errors: ${errors.creditCairdErrors}, ${errors.zipCodeErrors}, ${errors.cvvErrors}`);
}

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


setUpPaymentInfo();
setUpBasicInfo();
setUpTShirt();




