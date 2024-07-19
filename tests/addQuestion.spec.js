import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/add-question/1');

  await page.getByLabel('Question Name:').click();

  await page.getByLabel('Question Name:').fill('name');

  await page.getByLabel('Question Name:').press('Tab');

  await page.getByPlaceholder('Answer A').fill('a');

  await page.getByPlaceholder('Answer A').press('Tab');

  await page.getByPlaceholder('Answer B').fill('b');

  await page.getByPlaceholder('Answer B').press('Tab');

  await page.getByPlaceholder('Answer C').fill('c');

  await page.getByPlaceholder('Answer C').press('Tab');

  await page.getByPlaceholder('Answer D').fill('d');

  await page.getByLabel('A', { exact: true }).check();

  page.once('dialog', (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);

    dialog.dismiss().catch(() => {});
  });

  await page.getByRole('button', { name: 'Add Question' }).click();
});
