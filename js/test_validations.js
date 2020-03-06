/*******************************************************************
As the name implies, this file is created as a technical exercise to
provide unit tests for the functions in the app, and supports basic
TDD. Specifically, it provides a set of unit-tests for the validations
in validations.js. 

It's a technical exercise because there are many frameworks in
existence that provide the same functionality (and more), but this
is developed from scratch. The entire purpose of this app is 
learning, so hand-crafting a simple TDD framework is a suitable 
activity here.
(Practicing importing and using an external framework is ALSO a good
learning activity, but this can wait a few weeks until the course
moves on to NodeJS. At that point I'll probably switch to Mocha.)

(Or something.)
*******************************************************************/
// Test outputs

let testOutput = [];


// assertXYZ functions that are called from all of the validations

const assert_equals = (expected,actual) => {
  if (expected === actual) {
    return true;
  }
  return false;
}

const logTestOutput = () => {
  for (let i=0; i<testOutput.length; i++) {
    let result;
    if (testOutput[i][0]) {
      result = "pass";
    } else {
      result = "FAIL";
    }
    let testName = testOutput[i][1];
    let expected = testOutput[i][2];
    let actual = testOutput[i][3];
    console.log(`${result}: ${testName}. Expected: '${expected}', actual '${actual}'.`)
  }
}

// Unit tests

const test_isValidUserName = () => {
  let expected;
  let result;
  let actual;
  let report = [];
  // reject blank user name
  actual = isValidUserName("");
  expected = "Please enter your name";
  result = assert_equals(expected,isValidUserName(""));
  report = [result,"isValidUserName with blank name",expected,actual];
  testOutput.push(report);
  // reject null user name
  actual = isValidUserName(null);
  expected = "Please enter your name";
  result = assert_equals(expected,isValidUserName(null));
  report = [result,"isValidUserName with null name",expected,actual];
  testOutput.push(report);
  // reject user name with other than letters in it
  actual = isValidUserName('Nick5');
  expected = "Name should not contain non-alphabetic characters";
  result = assert_equals(expected,isValidUserName('Nick5'));
  report = [result,"isValidUserName with a number",expected,actual];
  testOutput.push(report);
  actual = isValidUserName('Nick!smith');
  expected = "Name should not contain non-alphabetic characters";
  result = assert_equals(expected,isValidUserName('Nick!smith'));
  report = [result,"isValidUserName with a special character",expected,actual];
  testOutput.push(report);

}





// Run all the tests. There will be ways to automate this better (for instance,
// by removing the name-by-name hard-coding of the test functions) but this will do
// for now: 

const run_all_tests = () => {
  test_isValidUserName();

  logTestOutput();
}

// run_all_tests();



