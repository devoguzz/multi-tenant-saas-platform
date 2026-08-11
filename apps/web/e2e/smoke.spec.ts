import { test, expect } from '@playwright/test';

test.describe('Frontend Phase 1 Smoke Test', () => {
  test('simulates frontend-only authentication and navigates dashboard', async ({ page }) => {
    // 1. Start at the root, which redirects to login
    await page.goto('/');
    
    // Expect to be on login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
    await page.waitForLoadState('networkidle'); // Wait for React hydration

    // 2. Perform frontend-only local authentication simulation
    // Note: This does NOT test backend security, JWTs, or real authentication.
    // It verifies the frontend form logic and routing.
    await page.getByLabel(/Work Email/i).fill('test@example.com');
    await page.getByLabel(/Password/i).fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();

    // 3. Verify successful navigation to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

    // 4. Verify dashboard KPIs render for first org (Northstar)
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Open Tasks')).toBeVisible();
    await expect(page.getByText('Website Redesign')).toBeVisible();
    
    // 5. Test workspace switching
    await page.getByRole('button', { name: /Northstar Studio/i }).click();
    await page.getByText('Meridian Labs').click();
    
    // Verify dashboard metrics updated to Meridian Labs
    await expect(page.getByRole('button', { name: /Meridian Labs/i })).toBeVisible();
    await expect(page.getByText('Data Migration')).toBeVisible();
    await expect(page.getByText('Website Redesign')).not.toBeVisible();
    
    // 6. Test sidebar navigation
    await page.getByRole('link', { name: /Projects/i }).click();
    await expect(page).toHaveURL(/.*\/projects/);
    await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  });
});
