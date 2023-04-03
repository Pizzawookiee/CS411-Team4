const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const baseURL = `https://trends.google.com`;
const countryCode = "US";
const category = "all";
/* allows next categories: 
b - business,
e - entertainment,
m - health,
t - sci/tech,
s - sports,
h - top stories
*/
async function fillTrendsDataFromPage(page) {
  while (true) {
    const isNextPage = await page.$(".feed-load-more-button");
    if (!isNextPage) break;
    await page.click(".feed-load-more-button");
    await page.waitForTimeout(2000);
  }
  const dataFromPage = await page.evaluate((baseURL) => {
    return Array.from(document.querySelectorAll(".feed-item")).map((el) => ({
      index: el.querySelector(".index")?.textContent.trim(),
      title: Array.from(el.querySelectorAll(".title a"))
        .map((el) => el.getAttribute("title"))
        .join(" • "),
      titleLinks: Array.from(el.querySelectorAll(".title a")).map((el) => ({
        [el.getAttribute("title")]: `${baseURL}${el.getAttribute("href")}`,
      })),
      subtitle: el.querySelector(".summary-text a")?.textContent.trim(),
      subtitleLink: el.querySelector(".summary-text a")?.getAttribute("href"),
      source: el.querySelector(".source-and-time span:first-child")?.textContent.trim(),
      published: el.querySelector(".source-and-time span:last-child")?.textContent.trim(),
      thumbnail: `https:${el.querySelector(".feed-item-image-wrapper img")?.getAttribute("src")}`,
    }));
  }, baseURL);
  return dataFromPage;
}

async function getGoogleTrendsRealtimeResults() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 700 });

  const URL = `${baseURL}/trends/trendingsearches/realtime?geo=${countryCode}&category=${category}&hl=en`;

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);

  await page.waitForSelector(".feed-item");

  const realtimeResults = await fillTrendsDataFromPage(page);

  await browser.close();

  return realtimeResults;
}

getGoogleTrendsRealtimeResults().then((result) => console.dir(result, { depth: null }));
