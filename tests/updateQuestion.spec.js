import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

const testData = require('./resource/addQuestion.json');

const defaultCase = testData.default;
const testCases = testData.cases;

const signInUrl = 'http://localhost:3000/signin';
const url = 'http://localhost:3000/edit-question/1';
const successUrl = 'http://localhost:3000/quiz/1';
const noQuestionUrl = 'http://localhost:3000/edit-question/10000';
const expectedFail = "Failed to update question"

// when the quiz does not exist
test('Question does not exist', async ({ page }) => {
  page.setDefaultTimeout(10000);
  // navigate to login
  await page.goto(signInUrl);

  // input username and password
  let emailInput = await page.getByRole('textbox', { name: 'Enter your email' });
  if (!emailInput) return fail('Email input not found');
  await emailInput.fill('admin@mail.com');

  let passwordInput = await page.getByRole('textbox', { name: 'Enter your password' });
  if (!passwordInput) return fail('Password input not found');
  await passwordInput.fill('Pass_1234');

  let signInButton = await page.getByRole('button', { name: 'Sign In' });
  if (!signInButton) return fail('Sign In button not found');
  await signInButton.click();

  // navigate to this screen
  await page.goto(noQuestionUrl);

  const message = await page.getByText('Question does not exist');
  await expect(message).toBeVisible();
});

// test every cases in testCases
for (const testCase of testCases) {
  test(testCase.tc, async ({ page }) => {
    page.setDefaultTimeout(10000);
    // navigate to login
    await page.goto(signInUrl);

    // input username and password
    let emailInput = await page.getByRole('textbox', { name: 'Enter your email' });
    if (!emailInput) return fail('Email input not found');
    await emailInput.fill('admin@mail.com');

    let passwordInput = await page.getByRole('textbox', { name: 'Enter your password' });
    if (!passwordInput) return fail('Password input not found');
    await passwordInput.fill('Pass_1234');

    let signInButton = await page.getByRole('button', { name: 'Sign In' });
    if (!signInButton) return fail('Sign In button not found');
    await signInButton.click();

    // navigate to this screen
    await page.goto(url);

    // fill the form

    // set the question name
    let questionNameInput = await page.getByLabel('Question Name:');
    if (!questionNameInput) return fail('Question Name input not found');
    await questionNameInput.fill(testCase.name || defaultCase.name);

    // set the question type
    // let questionTypeSelect = await page.getByLabel('Question Type:');
    // if (!questionTypeSelect) return fail('Question Type select not found');
    // await questionTypeSelect.selectOption(testCase.type || defaultCase.type);

    // fill the answers
    let answerAInput = await page.getByPlaceholder('Answer A');
    if (!answerAInput) return fail('Answer A input not found');
    await answerAInput.fill(testCase.a || defaultCase.a);

    let answerBInput = await page.getByPlaceholder('Answer B');
    if (!answerBInput) return fail('Answer B input not found');
    await answerBInput.fill(testCase.b || defaultCase.b);

    let answerCInput = await page.getByPlaceholder('Answer C');
    if (!answerCInput) return fail('Answer C input not found');
    await answerCInput.fill(testCase.c || defaultCase.c);

    let answerDInput = await page.getByPlaceholder('Answer D');
    if (!answerDInput) return fail('Answer D input not found');
    await answerDInput.fill(testCase.d || defaultCase.d);

    // for each char in correctAnswer, check the corresponding checkbox
    for (const char of testCase.result || defaultCase.result) {
      let checkbox = await page.getByLabel(char.toUpperCase(), { exact: true });
      if (!checkbox) return fail(`Checkbox for ${char} not found`);
      await checkbox.setChecked(true);
    }

    // submit the form
    let addButton = await page.getByRole('button', { name: 'Add Question' });
    if (!addButton) return fail('Add Question button not found');
    await addButton.click();

    // if error => check the message and does not navigate
    // since this test function reuses test cases from addQuestion.json, the corresponding error message has to be "Failed to update question"
    if (testCase.expected) {
      await page.getByText(expectedFail);
      return;
    }

    // else => navigate to success page
    await expect(page.url()).toBe(successUrl);
  });
}
