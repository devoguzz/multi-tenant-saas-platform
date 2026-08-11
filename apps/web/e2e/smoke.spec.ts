import { test, expect } from '@playwright/test';

test.describe('Master Frontend E2E Flows', () => {
  // Clear localStorage before tests
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.evaluate(() => localStorage.clear());
    
    // Login flow
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/dashboard');
  });

  test('FLOW 1: Dashboard and Metrics', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
    
    // Check initial metric
    const activeProjectsCard = page.locator('.text-2xl.font-bold').first();
    await expect(activeProjectsCard).toBeVisible();
  });

  test('FLOW 2: Clients management', async ({ page }) => {
    await page.click('a[href="/clients"]');
    await expect(page.locator('h1').filter({ hasText: 'Clients' })).toBeVisible();
    
    // Create client
    await page.click('button:has-text("Add Client")');
    await page.fill('input#name', 'E2E Corp');
    await page.fill('input#website', 'https://e2e.com');
    await page.click('button:has-text("Create Client")');
    await expect(page.getByText('Client created successfully')).toBeVisible();
    
    // Verify client in list
    await expect(page.getByText('E2E Corp')).toBeVisible();
    
    // Edit client
    await page.click('text=E2E Corp');
    await expect(page.locator('h1').filter({ hasText: 'E2E Corp' })).toBeVisible();
  });

  test('FLOW 3: Projects management', async ({ page }) => {
    await page.click('a[href="/projects"]');
    await expect(page.locator('h1').filter({ hasText: 'Projects' })).toBeVisible();
    
    // Create project
    await page.click('button:has-text("Add Project")');
    await page.fill('input#name', 'E2E Project');
    await page.fill('input#dueDate', '2026-12-31');
    await page.click('button:has-text("Create Project")');
    await expect(page.getByText('Project created successfully')).toBeVisible();
    
    // Verify project in list
    await expect(page.getByText('E2E Project')).toBeVisible();
  });

  test('FLOW 4: Tasks management', async ({ page }) => {
    await page.click('a[href="/tasks"]');
    await expect(page.locator('h1').filter({ hasText: 'Tasks' })).toBeVisible();
    
    // Create task
    await page.click('button:has-text("Add Task")');
    await page.fill('input#title', 'E2E Task');
    await page.fill('input#dueDate', '2026-12-31');
    await page.click('button:has-text("Create Task")');
    await expect(page.getByText('Task created successfully')).toBeVisible();
    
    // Find task in To Do column
    await expect(page.getByText('E2E Task')).toBeVisible();
  });

  test('FLOW 5: Team management', async ({ page }) => {
    await page.click('a[href="/team"]');
    await expect(page.locator('h1').filter({ hasText: 'Team' })).toBeVisible();
    
    // Invite member
    await page.click('button:has-text("Invite Member")');
    await page.fill('input#name', 'E2E Member');
    await page.fill('input#email', 'e2e@member.com');
    await page.selectOption('select#role', 'MEMBER');
    await page.click('button:has-text("Send Invite")');
    await expect(page.getByText('Team member invited')).toBeVisible();
    
    // Verify member in list
    await expect(page.getByText('E2E Member')).toBeVisible();
  });

  test('FLOW 6: Global search', async ({ page }) => {
    // Open search
    const searchInput = page.getByPlaceholder('Search clients, projects...');
    await searchInput.focus();
    await searchInput.fill('Website Redesign');
    
    // Verify results show up
    await expect(page.getByText('Website Redesign').first()).toBeVisible();
  });

  test('FLOW 7: Activity Log', async ({ page }) => {
    await page.click('a[href="/activity"]');
    await expect(page.locator('h1').filter({ hasText: 'Activity Log' })).toBeVisible();
    
    // Verify some activity exists
    await expect(page.getByText('System').first()).toBeVisible();
  });
});
