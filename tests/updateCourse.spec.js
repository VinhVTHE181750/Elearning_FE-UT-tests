import { test, expect } from '@playwright/test';

test('Update course: ___', async ({ page }) => {
  await page.goto('http://localhost:3000/editCourse/1');
  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('test edit name course');
  await page.getByLabel('Description:').click();
  await page.getByLabel('Description:').fill('test edit description course');
  await page.getByLabel('Price:').click();
  await page.getByLabel('Price:').fill('10000');
  await page.getByLabel('Link Thumbnail:').click();
  await page.getByLabel('Link Thumbnail:').fill('https://ik.imagekit.io/tvlk/blog/2021/09/du-lich-anh-8-1024x576.jpg?tr=dpr-2,w-675');
 
  await page.getByRole('button', { name: 'Save' }).click();
});