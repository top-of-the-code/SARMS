// @ts-check
import { test, expect } from '@playwright/test';
import {
  generateRandomName,
  generateRandomPhone,
  generateRandomPincode,
  generateRandomString
} from './utils';

test('test', async ({ page }) => {
  // 1. Generate all the random data upfront
  const studentName = generateRandomName("Student");
  const fatherName = generateRandomName("Father");
  const motherName = generateRandomName("Mother");
  const phone1 = generateRandomPhone();
  const phone2 = generateRandomPhone();
  const apt = generateRandomString(6);
  const road = generateRandomString(10);

  // Using generateRandomName and grabbing just the random letters for city/state
  const city = generateRandomName("City").split(' ')[1];
  const state = generateRandomName("State").split(' ')[1];
  const pincode = generateRandomPincode();

  // 2. Your exact recorded flow
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Enter your ID' }).click();
  await page.getByRole('textbox', { name: 'Enter your ID' }).fill('ADM-001');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Student Registration' }).click();

  await page.getByRole('textbox', { name: 'e.g. John Doe' }).click();
  await page.getByRole('textbox', { name: 'e.g. John Doe' }).fill(studentName);

  await page.locator('input[type="date"]').fill('2005-03-19');

  await page.getByRole('textbox', { name: 'Father\'s full name' }).click();
  await page.getByRole('textbox', { name: 'Father\'s full name' }).fill(fatherName);

  await page.getByRole('textbox', { name: 'Mother\'s full name' }).click();
  await page.getByRole('textbox', { name: 'Mother\'s full name' }).fill(motherName);

  await page.getByRole('textbox', { name: '+91 87654' }).click();
  await page.getByRole('textbox', { name: '+91 87654' }).fill(phone1);

  await page.getByRole('textbox', { name: '+91 98765' }).click();
  await page.getByRole('textbox', { name: '+91 98765' }).fill(phone2);

  await page.getByRole('textbox', { name: 'e.g. Apt 4B' }).click();
  await page.getByRole('textbox', { name: 'e.g. Apt 4B' }).fill(apt);

  await page.getByRole('textbox', { name: 'e.g. Example Road' }).click();
  await page.getByRole('textbox', { name: 'e.g. Example Road' }).fill(road);

  await page.getByRole('textbox', { name: 'e.g. New Delhi' }).click();
  await page.getByRole('textbox', { name: 'e.g. New Delhi' }).fill(city);

  await page.getByRole('textbox', { name: 'e.g. Delhi' }).click();
  await page.getByRole('textbox', { name: 'e.g. Delhi' }).fill(state);

  await page.getByRole('textbox', { name: 'e.g. 110001' }).click();
  await page.getByRole('textbox', { name: 'e.g. 110001' }).fill(pincode);

  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('2025');

  await page.getByRole('button', { name: 'Confirm Registration' }).click();
  await page.getByRole('heading', { name: 'Registration Successful' }).click();
  await page.getByRole('button', { name: 'Copy Password' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await page.getByRole('textbox', { name: 'Enter your ID' }).click();
});