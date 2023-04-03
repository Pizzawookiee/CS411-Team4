const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());

const searchQuery = process.argv[2]; // search query taken from command line argument
const URL = `https://trends.google.com/trends/explore?q=${encodeURI(searchQuery)}&hl=en`;

async function getGoogleTrendsResults() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);
  await page.waitForTimeout(5000);
  await page.reload();
  const relatedQueries = [];
  const valuePattern = /%22value%22:%22(?<value>[^%]+)/gm; //https://regex101.com/r/PNcP1u/1  
  page.on("response", async (response) => {
    if (response.headers()["content-type"]?.includes("application/")) {
      const responseData = await response.text();
      const responseURL = await response.url();
      if (responseURL.includes("widgetdata/relatedsearches?")) { //widgetdata/relatedsearches?
        const values = [...responseURL.matchAll(valuePattern)].map(({ groups }) => groups.value);
        if (values[0] === searchQuery) {
          const parsedData = JSON.parse(responseData.slice(6))?.default;
          relatedQueries.push({
            searchQuery,
            top: parsedData.rankedList[0].rankedKeyword.map((dataEl) => ({
              query: dataEl.query,
              value: dataEl.formattedValue,
              extractedValue: dataEl.value,
              link: "https://trends.google.com" + dataEl.link,
            })),
            rising: parsedData.rankedList[1].rankedKeyword.map((dataEl) => ({
              query: dataEl.query,
              value: dataEl.formattedValue,
              extractedValue: dataEl.value,
              link: "https://trends.google.com" + dataEl.link,
            })),
          });
        }
      }
    }
  });

  await page.waitForTimeout(5000); // wait for 5 seconds to get all responses
  await browser.close(); // close the browser

  fs.writeFile("related_queries.json", JSON.stringify(relatedQueries), (err) => {
    if (err) throw err;
    console.log("Results saved as related_queries.json");
  });
}

getGoogleTrendsResults();
