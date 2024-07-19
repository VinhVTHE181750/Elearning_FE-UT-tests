import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/add-course');
  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('course1');
  await page.getByLabel('Price:').click();
  await page.getByLabel('Price:').fill('1000');

  await page.getByLabel('Link Thumbnail:').click();
  await page.getByLabel('Link Thumbnail:').fill('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStBrb2FRGZnIDNw8ytX-2WR_wPiID1s9C0YQ&s');
  await page.getByText('Name:Price:Price2:Link').click();
  await page.getByLabel('Description:').click();
  await page.getByLabel('Description:').fill('Test add course');
  await page.getByRole('button', { name: 'Add Course' }).click();
});