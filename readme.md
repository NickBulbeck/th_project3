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

Order of files in index.html:
You write a test that fails, then make it pass. It stands to reason, therefore, that the object of test results
comes before the tests and forms a kind of spec. It has a component (I use the term loosely) for each of the form element
I'm validating and, possibly, one or more integration tests for combinations of elements - we'll see how that
pans out. Then the test code file itself comes after it. Could combine these two.
The actual code, which should not refer to any of the test functions, appears first.

Note to self: there needs to be a "submit" eventListener attached to the form object. It then needs to
run a' the validations together and output some kind of report.

******************************************
  NEXT FEATURES
******************************************
- Fix the red background in the credit caird fields if you put errors, select another option, then select credit caird again
- Create a tool-tip popup div, with a show/hide function for it, that can contain the errors
- Show it while you're typing, hide it when you move away.
- On submit: Show all the errors, with an additional yin for the Submit button itself saying ye cannae submit while there's errors.
- The checkboxes:
 - 