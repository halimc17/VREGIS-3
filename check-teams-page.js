const { chromium } = require('playwright');

async function checkTeamsPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to admin teams page...');
    await page.goto('http://localhost:3004/admin/teams');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Take a screenshot
    await page.screenshot({
      path: 'admin-teams-page.png',
      fullPage: true
    });

    // Check if CSS is loaded
    const stylesheets = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => ({
        href: link.href,
        loaded: link.sheet !== null
      }));
    });

    console.log('Stylesheets found:');
    stylesheets.forEach(sheet => {
      console.log(`- ${sheet.href}: ${sheet.loaded ? 'LOADED' : 'NOT LOADED'}`);
    });

    // Check for common styling elements
    const stylingCheck = await page.evaluate(() => {
      const body = document.body;
      const main = document.querySelector('main');
      const sidebar = document.querySelector('[data-sidebar]');

      return {
        bodyHasStyles: getComputedStyle(body).fontFamily !== 'Times',
        mainExists: !!main,
        sidebarExists: !!sidebar,
        tailwindWorking: getComputedStyle(body).margin !== '0px' ||
                        document.querySelector('.bg-background, .text-foreground') !== null,
        hasContent: document.body.textContent.trim().length > 0
      };
    });

    console.log('\nStyling analysis:');
    console.log('- Body has custom styles:', stylingCheck.bodyHasStyles);
    console.log('- Main element exists:', stylingCheck.mainExists);
    console.log('- Sidebar exists:', stylingCheck.sidebarExists);
    console.log('- Tailwind working:', stylingCheck.tailwindWorking);
    console.log('- Has content:', stylingCheck.hasContent);

    // Check for any console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit more to catch any lazy-loaded errors
    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('\nConsole errors found:');
      errors.forEach(error => console.log(`- ${error}`));
    } else {
      console.log('\nNo console errors found.');
    }

    console.log('\nScreenshot saved as admin-teams-page.png');

  } catch (error) {
    console.error('Error checking page:', error);
  } finally {
    await browser.close();
  }
}

checkTeamsPage();