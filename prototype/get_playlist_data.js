const remainingArgs = process.argv.slice(2); //splits inputs by spaces, which creates an issue solved in next line...
let firstArg = remainingArgs.splice(0, 2).join(' '); //the access token is in form "Bearer ...", so it is split into "Bearer" and "...", so we just pick the two
firstArg = firstArg.endsWith('\r\n') ? firstArg.slice(0, -2) : firstArg; //very hacky way to remove some extra characters from token string
//console.log(firstArg);


const playlist_URLs = remainingArgs; // array of playlist URLs
//console.log(playlist_URLs);
const token = firstArg;
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');

async function getPlaylistInfo(URL) {
  const parts = URL.split('/');
  const playlistID = parts[parts.length - 1];
  console.log(playlistID);

  let url = 'https://api.spotify.com/v1/playlists/';
  url = url + playlistID;
  console.log(`this is the ${url}`);
  
  let base = 'Authorization: '
  let full_token = base + token;
  
  const result = exec(`curl --request GET ${url} --header "${full_token}"`);
  console.log(result);
  return result;
 
  /*
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Authorization': token,
      'Cookie': 'sp_t=9e55e952365cde5824e5b5a3288bde4d'
    }
  }; //this doesn't work

   async function makeRequest() {
    try {
      const response = await axios.request(config); //this isn't working!
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }
  
  return await makeRequest();
  */
}


async function getAllPlaylistInfo() {
  const promises = [];

  for (let i = 0; i < playlist_URLs.length; i++) {
    const URL = playlist_URLs[i];
    promises.push(getPlaylistInfo(URL)); //pushes all requests into promises
  }

  const all_playlist_info = await Promise.all(promises); //runs all promises at same time
  return all_playlist_info;
  //const json = JSON.parse(JSON.stringify(all_playlist_info));
  //console.log(json);
  
  //return json;
  
  //console.log (relatedQueries);
  
  // Extract relevant playlist title, song and album info; UNDER CONSTRUCTION
  /*
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
  const searchQueryString = searchQueryValues.join(', ');
  console.log(searchQueryString);
  
  return(searchQueryString);

  //const fileName = `${searchQueries.join("_")}.json`;
  //fs.writeFile(fileName, JSON.stringify(relatedQueries), (err) => {
  //  if (err) throw err;
  //  console.log(`Results saved as ${fileName}`);
  //});
  */
}

getAllPlaylistInfo();
