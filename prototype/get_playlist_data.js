const remainingArgs = process.argv.slice(2); //splits inputs by spaces, which creates an issue solved in next line...
let firstArg = remainingArgs.splice(0, 1).join(' '); //the access token is in form "Bearer ...", so it is split into "Bearer" and "...", so we just pick the two
//firstArg = firstArg.endsWith('\r\n') ? firstArg.slice(0, -2) : firstArg; //very hacky way to remove some extra characters from token string
//console.log(firstArg);
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();

const playlist_URLs = remainingArgs; // array of playlist URLs
//console.log(playlist_URLs);
const token = firstArg;
spotifyApi.setAccessToken(token);
console.log(spotifyApi);
const axios = require('axios');
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');

async function getPlaylistInfo(URL) {
  const parts = URL.split('/');
  const playlistID = parts[parts.length - 1];
  //console.log(`playlist ID: ${playlistID}`);

  let url = 'https://api.spotify.com/v1/playlists/';
  url = url + playlistID;
  console.log(`this is the ${url}`);
  
  let base = 'Authorization: '
  let full_token = base + token;
  
  //const result = exec(`curl --request GET ${url} --header "${full_token}"`);
  //const result = exec(`curl --location '${url}' --header '${full_token}'`);
  //console.log(result);
  //return result;
 
  /*
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${url}`,
    headers: {
      'Authorization': `${token}`,
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
  
  /*
  //source: https://www.linkedin.com/pulse/so-short-guide-using-spotify-api-cedric-mensah/
  let result = await axios.request({
        method: "get",
        url: url,
        headers: { 'Authorization': token }
    }).catch(async function handleError(err) {
        console.log(err)
        //let refreshed_token = await refreshToken(username)
        //let result_new = await findSongs(username, refreshed_token, search_query)
        //console.log(result_new)
        //return result_new.data
   
    
    })
	return result;
	*/
	async function getPlaylistTracks(playlistId, playlistName) {

	  const data = await spotifyApi.getPlaylistTracks(playlistId, {
		offset: 1,
		limit: 100,
		fields: 'items'
	  })

	  // console.log('The playlist contains these tracks', data.body);
	  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
	  // console.log("'" + playlistName + "'" + ' contains these tracks:');
	  let tracks = [];

	  for (let track_obj of data.body.items) {
		const track = track_obj.track
		tracks.push(track);
		console.log(track.name + " : " + track.artists[0].name)
	  }
	  
	  console.log("---------------+++++++++++++++++++++++++")
	  console.log(tracks);
	  return tracks;
	}
    return getPlaylistTracks(playlistID,'test');
}


async function getAllPlaylistInfo() {
  const promises = [];

  for (let i = 0; i < playlist_URLs.length; i++) {
    const URL = playlist_URLs[i];
    promises.push(getPlaylistInfo(URL)); //pushes all requests into promises
  }

  const all_playlist_info = await Promise.all(promises); //runs all promises at same time
  //console.log(all_playlist_info);
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
