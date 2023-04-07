const [firstArg, ...remainingArgs] = process.argv.slice(2);
const playlist_URLs = remainingArgs; // array of playlist URLs
const token = firstArg;
const axios = require('axios');
const cookieParser = require('cookie-parser');

async function getPlaylistInfo(URL) {
  const parts = URL.split('/');
  const playlistID = parts[parts.length - 1];
  console.log(playlistID);

  let url = 'https://api.spotify.com/v1/playlists/';
  url = url + playlistID;
  console.log(url);
  
  
  const token_base = 'Bearer ';
  //let token = req.cookies.token;
  
  if (token !== null) {
    const tokenObject = JSON.parse(token.substring(2)); // Remove the "j:" prefix and parse the JSON string
    const accessToken = tokenObject.access_token; // Extract the access_token property from the token object
    console.log(accessToken);
  }
  //console.log(token)
  //const tokenObject = JSON.parse(token.substring(2)); // Remove the "j:" prefix and parse the JSON string
  //const accessToken = tokenObject.access_token; // Extract the access_token property from the token object

  //console.log(accessToken);
  token = token_base + accessToken;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Authorization': token,
      'Cookie': 'e'
    }
  };

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
