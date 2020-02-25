/****************************************************************

The set of functions used to validate basic user input feels like
the kind of code that should be put in its own module and reused.

This is intended to go with test_validations.js, which unit-tests
everything in here.

*****************************************************************/

const isValidUserName = (input) => {
// Specification: must not be blank, and must contain only
// letters. The validation is case-insensitive.
    return /[a-zA-Z]/;
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



/*
  Approach for validating the input-able fields.
  1) There's the final check of whether it conforms to standard. isValidCreditCairdNumber, for instance, which
     returns a boolean.
  2) There's the ongoing real-time check of whether the user has done something valid or invalid.
  3) There's the question of whether to display forbidden characters with a validation message,
     or to prevent them (e.g. by replacing them with "" on keyup or similar). The answer is to display
     the message, at least for now. There *are* ways to prevent non-numeric characters from being shown, but
     they're more trouble than they're worth here. The best way is to use the 'pattern' attribute, which builds
     a regex into the input text field itself. But I think that's banned here.
  Generally, there's a really good approach in the workspace for Validating a Username. In brief: you have an
  element added next to the input field, and it's displayed as long as the field is invalid. Check out the 'input'
  and 'blur' events, btw. 'change' fires when you navigate away from the field. So does 'blur' - not sure what the
  difference between the two is.


*/



