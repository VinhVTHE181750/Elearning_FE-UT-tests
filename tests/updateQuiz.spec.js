import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

const testData = require('./resource/addQuiz.json');

const defaultCase = testData.default;
const testCases = testData.cases;
const failmessage = 'Failed to update quiz';
const successmessage = 'Quiz updated successfully';

const signInUrl = 'http://localhost:3000/signin';
const url = 'http://localhost:3000/edit-quiz/1';
// const successUrl = 'http://localhost:3000/quiz/1';
// const noQuizUrl = 'http://localhost:3000/add-question/10000';

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

    // set the quiz name

    let quizNameInput = await page.getByLabel('Quiz Name:');

    if (!quizNameInput) return fail('Quiz Name input not found');
    await quizNameInput.fill(testCase.name || defaultCase.name);

    // submit the form
    let addButton = await page.getByRole('button', { name: 'Save' });
    if (!addButton) return fail('Save button not found');
    await addButton.click();

    // if error => check the message and does not navigate

    let response = await page.getByText(testCase.expected || defaultCase.expected);
    if (!response) return fail('Response not found');

    // else => navigate to success page
    // await expect(page.url()).toBe(successUrl);
    await expect(response).toHaveText(testCase.expected || defaultCase.expected, { exact: false });

  });
}
