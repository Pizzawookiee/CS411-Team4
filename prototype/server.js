//code adapted from https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/
//code adapted from https://github.com/thelinmichael/spotify-web-api-node
//code adapted from https://github.com/tombaranowicz/SpotifyPlaylistExport/
//code adapted from https://medium.com/@mikhail.a.zub/web-scraping-google-trends-with-nodejs-1fd064ef0df0
//code adapted from https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());


const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0';

//const dbName = 'music';

async function insertDocument(databaseName, collectionName, doc) {
  const client = await MongoClient.connect(uri);
  const collection = client.db(databaseName).collection(collectionName);
  const result = await collection.insertOne(doc);
  console.log(`Document inserted with the _id: ${result.insertedId}`);
  client.close();
}	


/*
client.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to MongoDB');
  // Code to save output to MongoDB goes here
});

*/




const express = require('express'); 
const app = express();
require('dotenv').config();
const port = process.env.PORT = 8888; 
const bodyParser = require('body-parser');
const config = require('./config/spotify.js');
const { exec } = require('child_process');
//const AuthRoutes = require('./routes/authRoutes.js');
const cors = require("cors");
const morgan = require('morgan');
const axios = require('axios');
const cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];
  
var spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.CLIENT_ID,
    clientSecret: config.spotify.CLIENT_SECRET,
    redirectUri: config.spotify.REDIRECTURI
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
//app.use('/api', cors(), AuthRoutes);
app.use(morgan('combined'));
app.use(cookieParser());


  app.get('/login', (req, res) => {
	console.log('logging in');
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
	console.log('progress');
  });
  
  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
	
	console.log('reached callback');
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        //res.send('Success! You can now close the window.');
		res.redirect(config.spotify.CLIENT_REDIRECTURI); //maybe not necessary
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });


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
  return tracks;
}

async function getRelatedQueries(URL, searchQuery, browser, result) {
  //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const client = await MongoClient.connect(uri);  
  try{
	  //await client.connect();
	  const database = client.db('music');
	  const collection = database.collection('tracks');
	  const db_query = await collection.findOne({ track: searchQuery });  
	  
	  if (db_query) {
		  
		  result.push(db_query);
		  
	  } else {
		  
		  const page = await browser.newPage();
		  await page.setDefaultNavigationTimeout(120000);
		  const relatedQueries = [];

		  await page.setRequestInterception(true);
			
		   page.on('request', (req) => {
			  if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
					req.abort();
				}
			  else {
				  req.continue();
			  }
			});



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
		  //alert(searchQuery, relatedQueries);
		  const json = JSON.parse(JSON.stringify(relatedQueries));
		  
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
		  
		  const doc = { track: searchQuery, keywords: searchQueryString};
		  insertDocument('music','tracks',doc);
		  
		  
		  result.push(doc);
      }
	} catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
	return true;
  }
}


async function getGoogleTrendsResults(URLs, searchQueries) {
  let result = [];

  const browser = await puppeteer.launch({
    headless: true, //prevents browser windows from popping up
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }); 	
  const promises = [];

  for (let i = 0; i < URLs.length; i++) {
    const URL = URLs[i];
    const searchQuery = searchQueries[i];
    promises.push(getRelatedQueries(URL, searchQuery, browser, result)); //pushes all requests into promises
  }

  const relatedQueries = await Promise.all(promises); //runs all promises at same time
  //process.stdout.write(JSON.stringify(result));
  //console.log(result);
  return result;
  
}



async function generateRelatedTermsfromPlaylist(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];
  //let tracks = '';
  for (let track_obj of data.body.items) {
    const track = track_obj.track;
	//tracks + track.name;
    tracks.push(track.name.replace(/\s+/g, "+"));
    //console.log(track.name + " : " + track.artists[0].name)
  }
  
  const URLs = tracks.map((query) => `https://trends.google.com/trends/explore?date=now 1-d&geo=US&q=${encodeURI(query)}&hl=en`);
  
  const results = await getGoogleTrendsResults(URLs, tracks);
  
  //console.log(results);
  
  return results;
  
  //console.log(tracks);
  
  
  
  //DEPRECATED FROM BACK WHEN PUPPETEER FUNCTIONALITY WAS LOCATED ON ANOTHER FILE
  //FOR CONVENIENCE EVERYTHING MOVED INTO THIS FILE
  /*
  let trackStr = tracks.toString();
  
  trackStr = "{" + trackStr.toLowerCase().replace(/[^a-z, ]/g, '').replace(/\s+/g, "+") + "}";
  //console.log(trackStr);
  //console.log(typeof(trackStr));
  
  
  let temp = [];
  
  exec(`node get_related_terms.js ${trackStr}`, (error, stdout, stderr) => {
	  if (error) {
		console.error(`exec error: ${error}`);
		return;
	  }
	  temp = stdout;
	  console.log('e');
	  //console.log(stdout); //yay this works
	  return stdout;
	});
  console.log(temp);
  console.log("---------------+++++++++++++++++++++++++")
  //return tracks;
  */
}

//POST route instructions
app.post('/test_google_trends', (req, res) => {
  const { playlist, keyword } = req.body;
  console.log('New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}');
  console.log('pulling google trends related query data for keyword...');
  exec(`node get_related_terms.js ${keyword}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
	res.header("Access-Control-Allow-Origin", "*");
	res.status(200).send(stdout) 
  });
  //res.status(200).send(`New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}`);
});


app.post('/test_spotify_api', async (req, res) => {
  const { playlist, keyword } = req.body;
  console.log(`New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}`);
  const parts = playlist.split('/');
  const playlistID = parts[parts.length - 1];
  getPlaylistTracks(playlistID, 'playlist');
  res.status(200).send('worked');
});

app.post('/related_terms', async (req, res) => {
  const { playlist, keyword } = req.body;
  console.log(`New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}`);
  const parts = playlist.split('/');
  const playlistID = parts[parts.length - 1];
  const result = await generateRelatedTermsfromPlaylist(playlistID, 'playlist');
  console.log(result);
  res.status(200).send(JSON.stringify(result));
});

  
  


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// GET route instructions to prove express backend connected
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 
