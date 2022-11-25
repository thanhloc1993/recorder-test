import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await page.goto('https://backoffice.staging.manabie.io/lesson/lesson_management');

  await page.goto('https://backoffice.staging.manabie.io/login-tenant?redirectUrl=%2Flesson%2Flesson_management');

  await page.getByTestId('LoginTenantForm__textFieldOrganizations').click();

  await page.getByTestId('LoginTenantForm__textFieldOrganizations').fill('manabie');

  await page.getByTestId('LoginTenantForm__textFieldUsername').click();

  await page.getByTestId('LoginTenantForm__textFieldUsername').fill('ducbinh.pham+stgmaadmin@manabie.com');

  await page.getByTestId('LoginTenantForm__textFieldPassword').click();

  await page.getByTestId('LoginTenantForm__textFieldPassword').fill('123123');

  await page.getByTestId('LoginTenantForm__buttonLogin').click();
  await expect(page).toHaveURL('https://backoffice.staging.manabie.io/lesson/lesson_management');

  await page.getByRole('button', { name: 'Filter' }).click();

});