//code adapted from https://medium.com/@mikhail.a.zub/web-scraping-google-trends-with-nodejs-1fd064ef0df0

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());

//const searchQueries = process.argv.slice(2); // search queries taken from command line arguments

const searchQueries = process.argv[2].replace(/[{}]/g, '').split(',').map(str => str.trim());
//hacky way of sending an array of phrases (which might contain spaces) as arguments
//basically, input format for an argument is in the form {element1,element2,element3,...,}

console.log(searchQueries);

const URLs = searchQueries.map((query) => `https://trends.google.com/trends/explore?date=now 1-d&geo=US&q=${encodeURI(query)}&hl=en`);



async function getRelatedQueries(URL, searchQuery, browser) {
  
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(120000);
  const relatedQueries = [];

  await page.goto(URL);
  await page.waitForTimeout(1000);
  await page.reload();
  const valuePattern = /%22value%22:%22(?<value>[^%]+)/gm; //https://regex101.com/r/PNcP1u/1  
  page.on("response", async (response) => {
    if (response.headers()["content-type"]?.includes("application/")) {
      const responseData = await response.text();
      const responseURL = await response.url();
      if (responseURL.includes("widgetdata/relatedsearches?")) {
        const values = [...responseURL.matchAll(valuePattern)].map(({ groups }) => groups.value);
        if (values[0] === searchQuery) {
          const parsedData = JSON.parse(responseData.slice(6))?.default;
          relatedQueries.push({
            searchQuery,
            top: parsedData.rankedList[0].rankedKeyword.map((dataEl) => ({
              query: dataEl.query,
              //value: dataEl.formattedValue,
              //extractedValue: dataEl.value,
              //link: "https://trends.google.com" + dataEl.link,
            })),
            rising: parsedData.rankedList[1].rankedKeyword.map((dataEl) => ({
              query: dataEl.query,
              //value: dataEl.formattedValue,
              //extractedValue: dataEl.value,
              //link: "https://trends.google.com" + dataEl.link,
            })),
          });
        }
      }
    }
  });
  await page.waitForTimeout(5000); // wait for 5 seconds to get all responses

  return relatedQueries;
}

async function getGoogleTrendsResults() {
  const browser = await puppeteer.launch({
    headless: true, //prevents browser windows from popping up
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }); 	
  const promises = [];

  for (let i = 0; i < URLs.length; i++) {
    const URL = URLs[i];
    const searchQuery = searchQueries[i];
    promises.push(getRelatedQueries(URL, searchQuery, browser)); //pushes all requests into promises
  }

  const relatedQueries = await Promise.all(promises); //runs all promises at same time
  const json = JSON.parse(JSON.stringify(relatedQueries));
  
  //console.log (relatedQueries);
  
  // Extract the values under the "query" field
  const searchQueryValues = [];
  


  function extractValues(obj) {
    for (const key in obj) {	  	
	  if (typeof obj[key] === 'object') {
		 //console.log('top')
	     extractValues(obj[key]);
	  } else if (key === 'query') {
		 searchQueryValues.push(obj[key]);
	  }
      //if (typeof obj[key] === 'object') {
      //  extractValues(obj[key]);
      //} else if (key === 'searchQuery') {
      //  searchQueryValues.push(obj[key]);
      //}
    }
  }

  extractValues(json);

  // Return a string of all searchQuery values
  const searchQueryString = searchQueryValues.join(',');
  console.log(searchQueryString);
  await browser.close(); // close the browser
  return(searchQueryString);

  //const fileName = `${searchQueries.join("_")}.json`;
  //fs.writeFile(fileName, JSON.stringify(relatedQueries), (err) => {
  //  if (err) throw err;
  //  console.log(`Results saved as ${fileName}`);
  //});
}

getGoogleTrendsResults();
