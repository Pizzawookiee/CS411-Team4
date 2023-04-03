const puppeteer = require('puppeteer');

async function scrapeGoogleTrends() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://trends.google.com/trends/explore?date=now%201-d&geo=US&q=cheese,cake&hl=en';
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for related queries section to be loaded
  await page.waitForSelector('.item-title');

  // Get all related queries
  const relatedQueries = await page.$$eval('.item-title', (titles) => {
    return titles.map((title) => title.textContent.trim());
  });

  console.log('Related Queries:', relatedQueries);

  await browser.close();
}

scrapeGoogleTrends();
