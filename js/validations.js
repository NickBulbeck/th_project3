/****************************************************************

The set of functions used to validate basic user input feels like
the kind of code that should be put in its own module and reused.

This is intended to go with test_validations.js, which unit-tests
everything in here.

*****************************************************************/

const validateUserName = (input) => {
  if (!input ||'' === input) {
    return 'Please enter your name';
  }
}