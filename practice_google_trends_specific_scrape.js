const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const searchQueries = ["Mercedes"]; // what we want to search (for interestOverTime, interestByRegion, relatedQueries, relatedTopics)
// const searchQueries = ["Mercedes", "BMW", "Audi"];    // what we want to search (for interestOverTime, comparedByRegion, interestByRegion, relatedQueries)

const URL = `https://trends.google.com/trends/explore?q=${encodeURI(searchQueries.join(","))}&hl=en`;

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
  const interestOverTime = {};
  const comparedByRegion = [];
  const interestByRegion = [];
  const relatedQueries = [];
  const relatedTopics = {}; 
  const valuePattern = /%22value%22:%22(?<value>[^%]+)/gm; //https://regex101.com/r/PNcP1u/1  
  page.on("response", async (response) => {
    if (response.headers()["content-type"]?.includes("application/")) {
      const responseData = await response.text();
      const responseURL = await response.url();
      if (responseURL.includes("widgetdata/multiline?")) {
        const parsedData = JSON.parse(responseData.slice(6))?.default;
        interestOverTime.timelineData = parsedData?.timelineData?.map((dataEl) => ({
          date: decodeURI(dataEl.formattedTime),
          values: searchQueries.map((queryEl, i) => ({
            query: queryEl,
            value: dataEl.formattedValue[i],
            extractedValue: dataEl.value[i],
          })),
        }));
        interestOverTime.averages = parsedData.averages.map((dataEl, i) => ({
          query: searchQueries[i],
          value: dataEl,
        }));
      } else {
        const values = [...responseURL.matchAll(valuePattern)].map(({ groups }) => groups.value);
        if (responseURL.includes("widgetdata/comparedgeo?")) {
          if (values.length > 1) {
            const parsedData = JSON.parse(responseData.slice(6))?.default;
            comparedByRegion.push(
              ...parsedData.geoMapData.map((dataEl) => ({
                geo: dataEl.geoCode,
                location: dataEl.geoName,
                maxValueIndex: dataEl.maxValueIndex,
                values: searchQueries.map((queryEl, i) => ({
                  query: queryEl,
                  value: dataEl.formattedValue[i],
                  extractedValue: dataEl.value[i],
                })),
              }))
            );
          } else {
            for (query of searchQueries) {
              if (values[0] === query) {
                const parsedData = JSON.parse(responseData.slice(6))?.default;
                interestByRegion.push({
                  query,
                  data: parsedData.geoMapData.map((dataEl) => ({
                    geo: dataEl.geoCode,
                    location: dataEl.geoName,
                    maxValueIndex: dataEl.maxValueIndex,
                    value: dataEl.formattedValue[0],
                    extractedValue: dataEl.value[0],
                  })),
                });
              }
            }
          }
        } else if (responseURL.includes("widgetdata/relatedsearches?")) {
          for (query of searchQueries) {
            if (values[0] === query) {
              if (responseURL.includes("%22keywordType%22:%22ENTITY%22")) {
                const parsedData = JSON.parse(responseData.slice(6))?.default;
                relatedTopics.top = parsedData.rankedList[0].rankedKeyword.map((dataEl) => ({
                  topic: {
                    title: dataEl.topic.title,
                    type: dataEl.topic.type,
                  },
                  value: dataEl.formattedValue,
                  extractedValue: dataEl.value,
                  link: "https://trends.google.com" + dataEl.link,
                }));
                relatedTopics.rising = parsedData.rankedList[1].rankedKeyword.map((dataEl) => ({
                  topic: {
                    title: dataEl.topic.title,
                    type: dataEl.topic.type,
                  },
                  value: dataEl.formattedValue,
                  extractedValue: dataEl.value,
                  link: "https://trends.google.com" + dataEl.link,
                }));
              } else {
                const parsedData = JSON.parse(responseData.slice(6))?.default;
                relatedQueries.push({
                  searchQuery: query,
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
        }
      }
    }
  });
  
  await page.waitForTimeout(10000);
  await browser.close();  
  return { interestOverTime, comparedByRegion, interestByRegion, relatedQueries, relatedTopics };
}

getGoogleTrendsResults().then((result) => console.dir(result, { depth: null }));