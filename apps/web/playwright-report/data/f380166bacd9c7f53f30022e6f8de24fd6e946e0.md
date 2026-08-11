# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Master Frontend E2E Flows >> FLOW 1: Dashboard and Workspace Switch
- Location: e2e\smoke.spec.ts:16:7

# Error details

```
Error: expect(received).not.toEqual(expected) // deep equality

Expected: not "Dashboard"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]: Platform
      - generic [ref=e7]:
        - button "Meridian Labs" [ref=e9] [cursor=pointer]
        - navigation [ref=e19]:
          - link "Dashboard" [ref=e20] [cursor=pointer]:
            - /url: /dashboard
          - link "Clients" [ref=e26] [cursor=pointer]:
            - /url: /clients
          - link "Projects" [ref=e32] [cursor=pointer]:
            - /url: /projects
          - link "Tasks" [ref=e35] [cursor=pointer]:
            - /url: /tasks
          - link "Team" [ref=e39] [cursor=pointer]:
            - /url: /team
          - link "Activity" [ref=e45] [cursor=pointer]:
            - /url: /activity
      - link "Settings" [ref=e50] [cursor=pointer]:
        - /url: /settings
    - generic [ref=e54]:
      - banner [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e58]:
            - generic [ref=e59]: Search
            - searchbox "Search" [ref=e61]
          - generic [ref=e62]:
            - button "View notifications" [ref=e63] [cursor=pointer]
            - button "Open user menu A" [ref=e70] [cursor=pointer]:
              - generic [ref=e71]: Open user menu
              - generic [ref=e72]: A
      - main [ref=e73]:
        - generic [ref=e75]:
          - generic [ref=e76]:
            - heading "Dashboard" [level=1] [ref=e77]
            - paragraph [ref=e78]: Welcome back, Alice Freeman
          - generic [ref=e79]:
            - generic [ref=e80]:
              - heading "Active Projects" [level=3] [ref=e82]
              - generic [ref=e85]:
                - generic [ref=e86]: "1"
                - paragraph [ref=e87]: Total in progress
            - generic [ref=e88]:
              - heading "Open Tasks" [level=3] [ref=e90]
              - generic [ref=e94]:
                - generic [ref=e95]: "1"
                - paragraph [ref=e96]: Tasks requiring attention
            - generic [ref=e97]:
              - heading "Completed" [level=3] [ref=e99]
              - generic [ref=e103]:
                - generic [ref=e104]: "0"
                - paragraph [ref=e105]: Tasks finished
            - generic [ref=e106]:
              - heading "Overdue" [level=3] [ref=e108]
              - generic [ref=e111]:
                - generic [ref=e112]: "0"
                - paragraph [ref=e113]: Tasks past deadline
          - generic [ref=e114]:
            - generic [ref=e115]:
              - heading "Recent Projects" [level=3] [ref=e117]
              - generic [ref=e120]:
                - generic [ref=e121]:
                  - paragraph [ref=e122]: Data Migration
                  - paragraph [ref=e123]: Umbrella Corp
                - generic [ref=e124]:
                  - generic [ref=e125]: ACTIVE
                  - generic [ref=e126]: 40%
            - heading "My Tasks" [level=3] [ref=e129]
            - heading "Recent Activity" [level=3] [ref=e133]
            - generic [ref=e135]:
              - heading "Team Overview" [level=3] [ref=e137]
              - generic [ref=e139]:
                - generic [ref=e141]:
                  - generic [ref=e142]: C
                  - generic [ref=e145]:
                    - paragraph [ref=e146]: Charlie Davis
                    - paragraph [ref=e147]: ADMIN
                - generic [ref=e149]:
                  - generic [ref=e150]: D
                  - generic [ref=e153]:
                    - paragraph [ref=e154]: Diana Prince
                    - paragraph [ref=e155]: MEMBER
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e161] [cursor=pointer]
  - alert [ref=e165]
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
> 31  |     expect(newText).not.toEqual(initialText);
      |                         ^ Error: expect(received).not.toEqual(expected) // deep equality
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
  65  |     await expect(page.locator('text=E2E Project')).toBeVisible();
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