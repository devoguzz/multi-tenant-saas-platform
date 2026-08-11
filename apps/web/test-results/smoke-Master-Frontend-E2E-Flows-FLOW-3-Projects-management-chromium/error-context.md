# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Master Frontend E2E Flows >> FLOW 3: Projects management
- Location: e2e\smoke.spec.ts:53:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=E2E Project')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=E2E Project')

```

```yaml
- text: Platform
- button "Northstar Studio"
- navigation:
  - link "Dashboard":
    - /url: /dashboard
  - link "Clients":
    - /url: /clients
  - link "Projects":
    - /url: /projects
  - link "Tasks":
    - /url: /tasks
  - link "Team":
    - /url: /team
  - link "Activity":
    - /url: /activity
- link "Settings":
  - /url: /settings
- banner:
  - text: Search
  - searchbox "Search"
  - button "View notifications"
  - button "Open user menu A"
- main:
  - heading "Projects" [level=1]
  - paragraph: Manage ongoing work, progress, and timelines.
  - button "Add Project"
  - textbox "Search projects..."
  - combobox:
    - option "All Statuses" [selected]
    - option "Planning"
    - option "Active"
    - option "On Hold"
    - option "Completed"
  - table:
    - rowgroup:
      - row "Project Name Client Status Progress Due Date Actions":
        - columnheader "Project Name"
        - columnheader "Client"
        - columnheader "Status"
        - columnheader "Progress"
        - columnheader "Due Date"
        - columnheader "Actions"
    - rowgroup:
      - row "Website Redesign Acme Corp ACTIVE 65% 9/1/2026 Open menu":
        - cell "Website Redesign":
          - link "Website Redesign":
            - /url: /projects/prj_1
        - cell "Acme Corp":
          - link "Acme Corp":
            - /url: /clients/cli_1
        - cell "ACTIVE"
        - cell "65%"
        - cell "9/1/2026"
        - cell "Open menu":
          - button "Open menu"
      - row "Mobile App MVP Globex PLANNING 10% 10/15/2026 Open menu":
        - cell "Mobile App MVP":
          - link "Mobile App MVP":
            - /url: /projects/prj_2
        - cell "Globex":
          - link "Globex":
            - /url: /clients/cli_2
        - cell "PLANNING"
        - cell "10%"
        - cell "10/15/2026"
        - cell "Open menu":
          - button "Open menu"
      - row "Marketing Campaign Initech COMPLETED 100% 8/1/2026 Open menu":
        - cell "Marketing Campaign":
          - link "Marketing Campaign":
            - /url: /projects/prj_3
        - cell "Initech":
          - link "Initech":
            - /url: /clients/cli_3
        - cell "COMPLETED"
        - cell "100%"
        - cell "8/1/2026"
        - cell "Open menu":
          - button "Open menu"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Master Frontend E2E Flows', () => {
  4   |   // Clear localStorage before tests
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('http://localhost:3000/login');
  7   |     await page.evaluate(() => localStorage.clear());
  8   |     
  9   |     // Login flow
  10  |     await page.fill('input[type="email"]', 'test@example.com');
  11  |     await page.fill('input[type="password"]', 'password123');
  12  |     await page.click('button[type="submit"]');
  13  |     await page.waitForURL('http://localhost:3000/dashboard');
  14  |   });
  15  | 
  16  |   test('FLOW 1: Dashboard and Workspace Switch', async ({ page }) => {
  17  |     await expect(page.locator('h1')).toHaveText('Dashboard');
  18  |     
  19  |     // Check initial metric
  20  |     const activeProjectsCard = page.locator('.text-2xl.font-bold').first();
  21  |     const initialText = await activeProjectsCard.textContent();
  22  |     
  23  |     // Switch workspace
  24  |     await page.click('button:has-text("Northstar Studio")');
  25  |     await page.click('text=Meridian Labs');
  26  |     
  27  |     // Wait for the UI to update
  28  |     await page.waitForTimeout(500);
  29  |     
  30  |     const newText = await activeProjectsCard.textContent();
  31  |     expect(newText).not.toEqual(initialText);
  32  |   });
  33  | 
  34  |   test('FLOW 2: Clients management', async ({ page }) => {
  35  |     await page.click('a[href="/clients"]');
  36  |     await expect(page.locator('h1')).toHaveText('Clients');
  37  |     
  38  |     // Create client
  39  |     await page.click('button:has-text("Add Client")');
  40  |     await page.fill('input#name', 'E2E Corp');
  41  |     await page.fill('input#website', 'https://e2e.com');
  42  |     await page.click('button:has-text("Create Client")');
  43  |     await expect(page.locator('text=Client created successfully')).toBeVisible();
  44  |     
  45  |     // Verify client in list
  46  |     await expect(page.locator('text=E2E Corp')).toBeVisible();
  47  |     
  48  |     // Edit client
  49  |     await page.click('text=E2E Corp');
  50  |     await expect(page.locator('h1')).toHaveText('E2E Corp');
  51  |   });
  52  | 
  53  |   test('FLOW 3: Projects management', async ({ page }) => {
  54  |     await page.click('a[href="/projects"]');
  55  |     await expect(page.locator('h1')).toHaveText('Projects');
  56  |     
  57  |     // Create project
  58  |     await page.click('button:has-text("Add Project")');
  59  |     await page.fill('input#name', 'E2E Project');
  60  |     await page.fill('input#dueDate', '2026-12-31');
  61  |     await page.click('button:has-text("Create Project")');
  62  |     await expect(page.locator('text=Project created successfully')).toBeVisible();
  63  |     
  64  |     // Verify project in list
> 65  |     await expect(page.locator('text=E2E Project')).toBeVisible();
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  66  |     
  67  |     // Open project
  68  |     await page.click('text=E2E Project');
  69  |     await expect(page.locator('h1')).toHaveText('E2E Project');
  70  |   });
  71  | 
  72  |   test('FLOW 4: Tasks management', async ({ page }) => {
  73  |     await page.click('a[href="/tasks"]');
  74  |     await expect(page.locator('h1')).toHaveText('Tasks');
  75  |     
  76  |     // Create task
  77  |     await page.click('button:has-text("Add Task")');
  78  |     await page.fill('input#title', 'E2E Task');
  79  |     // Select first available project
  80  |     await page.selectOption('select#project', { index: 1 });
  81  |     await page.fill('input#dueDate', '2026-12-31');
  82  |     await page.click('button:has-text("Create Task")');
  83  |     await expect(page.locator('text=Task created successfully')).toBeVisible();
  84  |     
  85  |     // Find task in To Do column
  86  |     await expect(page.locator('text=E2E Task')).toBeVisible();
  87  |   });
  88  | 
  89  |   test('FLOW 5: Team management', async ({ page }) => {
  90  |     await page.click('a[href="/team"]');
  91  |     await expect(page.locator('h1')).toHaveText('Team');
  92  |     
  93  |     // Invite member
  94  |     await page.click('button:has-text("Invite Member")');
  95  |     await page.fill('input#name', 'E2E Member');
  96  |     await page.fill('input#email', 'e2e@member.com');
  97  |     await page.selectOption('select#role', 'MEMBER');
  98  |     await page.click('button:has-text("Send Invite")');
  99  |     await expect(page.locator('text=Team member invited')).toBeVisible();
  100 |     
  101 |     // Verify member in list
  102 |     await expect(page.locator('text=E2E Member')).toBeVisible();
  103 |   });
  104 | 
  105 |   test('FLOW 6: Global search', async ({ page }) => {
  106 |     // Open search
  107 |     const searchInput = page.locator('input[type="search"]');
  108 |     await searchInput.focus();
  109 |     await searchInput.fill('Website Redesign');
  110 |     
  111 |     // Click result
  112 |     await page.click('li:has-text("Website Redesign")');
  113 |     
  114 |     // Verify navigation
  115 |     await expect(page.locator('h1')).toHaveText('Website Redesign');
  116 |   });
  117 | });
  118 | 
```