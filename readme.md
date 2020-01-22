Some TDD is in order.

File of tests, which is run when the page loads.
- Maybe it can either output stuff to the console, or display it in a div, depending on some 
  form of config.
- There may be an imaginative way of automating that config.

For each input field, there's a set of test conditions:
- These are written out first as tests
- They are called on the same events that trigger the validations
- They run after the validations have run, obviously
- They are able to read the validation output
- There's an array (better, an object) of test results that they look up
- The "assert" statements pit the validation output against the test results object
- This means the validations must be run by functions that take an input and return a value.