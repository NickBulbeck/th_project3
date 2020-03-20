/****************************************************************

The set of functions used to validate basic user input feels like
the kind of code that should be put in its own module and , potentially, reused.

*****************************************************************/

const isValidUserName = (input) => {
// Specification: must not be blank (or all spaces), and must contain only
// letters and spaces. The validation is case-insensitive.
    return /^[a-zA-Z ]+$/.test(input) && !/^ +$/.test(input);
}

const isValidEmail = (input) => {
  return /^[^@]+@[a-z]+(\.[a-z]+)+$/i.test(input);
}

const isValidCreditCairdNumber = (input) => {
// Specification: between 13 and 16 digits inclusive
  return /^[0-9]{13,16}$/.test(input);
}

const isValidZipCode = (input) => {
// Specification: a 5-digit number
  return /^[0-9]{5}$/.test(input);
}

const isValidCVV = (input) => {
// Specification: a 3-digit number
  return /^[0-9]{3}$/.test(input);
}

const isBlank = (input) => {
  return input === "" || input === null  // belt-and-braces: in practice it's not likely to be null here
}

const containsOnlySpaces = (input) => {
  return /^ +$/.test(input);
}

const containsLetters = (input) => {
  return /[a-zA-Z]+/.test(input);
}

const containsNumbers = (input) => {
  return /[0-9]+/.test(input);
}

// Is this the clunkiest-named function ever?
const containsNonAlphaNumericExceptSpaces = (input) => {
  return /[^a-zA-Z0-9 ]/.test(input);
}
// Or is THIS the clunkiest-named function ever?
const containsNonAlphaNumericIncludingSpaces = (input) => {
  return /\W/.test(input);
}

const hasTooFewDigits = (input,minimum) => {
  const regex = new RegExp('^[0-9]{1,' + minimum + '}$');
  return regex.test(input);
}

const hasTooManyDigits = (input,maximum) => {
  maximum++;
  const regex = new RegExp('^[0-9]{' + maximum + ',}$');
  return regex.test(input);
}



