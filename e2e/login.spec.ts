import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({page}) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('Login als Hörer', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Lea');
    await page.getByRole('button', { name: 'Als Hörer starten' }).click();
    await expect(page.getByTestId('now-playing-page')).toBeVisible();
  });

  test('Login als Moderator', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Benutzername', exact: true }).fill('Jessica');
    await page.getByRole('textbox', { name: 'Passwort', exact: true }).fill('radio123');
    await page.getByRole('button', { name: 'Als Moderator anmelden' }).click();
    await expect(page.getByTestId('moderator-dashboard-page')).toBeVisible();
  });
});