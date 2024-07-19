import { test, expect } from '@playwright/test';

test('Update question: ___', async ({ page }) => {
  await page.goto('http://localhost:3000/edit-question/1');
  await page.getByLabel('Question Name:').click();
  await page.getByLabel('Question Name:').fill('name');
  await page.getByLabel('Question Type:Select Question').selectOption('ONE_CHOICE');
  await page.getByRole('button', { name: 'Edit' }).click();
});