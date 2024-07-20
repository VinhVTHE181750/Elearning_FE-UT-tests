import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

const testData = require('./resource/updateCourse.json');

const defaultCase = testData.default;
const testCases = testData.cases;
const failmessage = 'Failed to update course';
const successmessage = 'Course updated successfully';

const signInUrl = 'http://localhost:3000/signin';
const url = 'http://localhost:3000/editCourse/1';

// Test every case in testCases
for (const testCase of testCases) {
  test(testCase.tc, async ({ page }) => {
    page.setDefaultTimeout(10000);
    
    // Navigate to login
    await page.goto(signInUrl);

    // Input username and password
    const emailInput = await page.getByRole('textbox', { name: 'Enter your email' });
    if (!emailInput) throw new Error('Email input not found');
    await emailInput.fill('admin@mail.com');

    const passwordInput = await page.getByRole('textbox', { name: 'Enter your password' });
    if (!passwordInput) throw new Error('Password input not found');
    await passwordInput.fill('Pass_1234');

    const signInButton = await page.getByRole('button', { name: 'Sign In' });
    if (!signInButton) throw new Error('Sign In button not found');
    await signInButton.click();

    // Navigate to edit course page
    await page.goto(url);

    // Fill the form
    const courseNameInput = await page.getByLabel('Course Name:');
    if (!courseNameInput) throw new Error('Course Name input not found');
    await courseNameInput.fill(testCase.CourseName || defaultCase.CourseName);

    const priceInput = await page.getByLabel('Price:');
    if (!priceInput) throw new Error('Price input not found');
    await priceInput.fill(testCase.Price || defaultCase.Price);

    const linkThumbnailInput = await page.getByLabel('Link Thumbnail:');
    if (!linkThumbnailInput) throw new Error('Link Thumbnail input not found');
    await linkThumbnailInput.fill(testCase.LinkThumbnail || defaultCase.LinkThumbnail);

    const categoryInput = await page.getByLabel('Category:');
    if (!categoryInput) throw new Error('Category input not found');
    await categoryInput.fill(testCase.Category || defaultCase.Category);

    const descriptionInput = await page.getByLabel('Description:');
    if (!descriptionInput) throw new Error('Description input not found');
    await descriptionInput.fill(testCase.Description || defaultCase.Description);

    // Submit the form
    const saveButton = await page.getByRole('button', { name: 'Save' });
    if (!saveButton) throw new Error('Save button not found');
    await saveButton.click();

    // Check for expected result
    const response = await page.getByText(testCase.expected || defaultCase.expected);
    if (!response) throw new Error('Response not found');

    await expect(response).toHaveText(testCase.expected || defaultCase.expected, { exact: false });
  });
}
