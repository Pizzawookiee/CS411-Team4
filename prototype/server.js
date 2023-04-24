//code adapted from https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/
//code adapted from https://github.com/thelinmichael/spotify-web-api-node
//code adapted from https://github.com/tombaranowicz/SpotifyPlaylistExport/

const express = require('express'); 
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000; 
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
    tracks.push(track.name);
    //console.log(track.name + " : " + track.artists[0].name)
  }
  let trackStr = tracks.toString();
  trackStr = "{" + trackStr.toLowerCase().replace(/[^a-z, ]/g, '').replace(/\s+/g, "+") + "}";
  console.log(trackStr);
  console.log(typeof(trackStr));
  
  exec(`node get_related_terms.js ${trackStr}`, (error, stdout, stderr) => {
	  if (error) {
		console.error(`exec error: ${error}`);
		return;
	  }
	  console.log(stdout); //yay this works
	  return stdout;
	});
  console.log("---------------+++++++++++++++++++++++++")
  //return tracks;
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
  generateRelatedTermsfromPlaylist(playlistID, 'playlist');
  res.status(200).send('worked');
});

  
  


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// GET route instructions to prove express backend connected
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 
