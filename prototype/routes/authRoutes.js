//source: https://ahmetomer.net/spotify-api-authorization-in-nodejs/

const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const cors = require('cors');
const axios = require('axios');
const Cookies = require('js-cookie');

// this can be used as a seperate module
const encodeFormData = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

const corsOptions = {
  origin: '*', // You can set specific origins instead of '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const getHashParams = (url) => {
  const hashParams = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = url.substring(url.indexOf('?') + 1);

  let e;
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
}


router.use(cors(corsOptions));

router.get('/login', async (req, res) => {
  const scope =
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;
  res.header("Access-Control-Allow-Origin", "*");
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI
    })
  );
});

router.get('/logged', async (req, res) => {
  const body = {
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: process.env.REDIRECTURI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  }

	try {
	  const response = await axios.post('https://accounts.spotify.com/api/token', encodeFormData(body), {
		headers: {
		  "Content-Type": "application/x-www-form-urlencoded",
		  "Accept": "application/json"
		}
	  });

	  const data = response.data;
	  const query = querystring.stringify(data);
	  const param_address = `${process.env.CLIENT_REDIRECTURI}?${query}`;
	  const params = getHashParams(param_address);
	  console.log(params); //replace with SAVING TO A COOKIE WHICH IS RETRIEVED BY BACKEND, then FRONTEND retrieves BACKEND with get
	  res.cookie('token', params);
	  //console.log(req.cookies.token)
	  res.header("token", params.access_token);
	  res.header("Access-Control-Allow-Origin", "*");
	  //res.status(200).json(params);
	  res.redirect('http://localhost:3000/');
	} catch (error) {
	  console.log(error);
	  res.status(500).json({ message: "Error fetching data" });
	}

  /*	
  const fetch = await import('node-fetch');
  
  await fetch.default('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: encodeFormData(body)
  })
  .then(response => response.json())
  .then(data => {
    const query = querystring.stringify(data);
	res.header("Access-Control-Allow-Origin", "*");
    const param_address = `${process.env.CLIENT_REDIRECTURI}?${query}`;
	const params = getHashParams(param_address);
	console.log(params);
	result = params;
	//res.status(200).send(params) 
	//return(params)
	//res.redirect('http://localhost:3000/'); //this needs to be here otherwise infinite loading, BUT this erases any forms.
	res.status(200).json(params);
  })
    .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error fetching data" });
  });
  */
  /*
  router.get('/login', async (req, res) => {
  const scope =
    `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;
  res.header("Access-Control-Allow-Origin", "*");
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI
    })
  );
  */
  
  //To-Do: add super-logout capability to revoke Spotify API token
  router.get('/super-logout', async(req,res) => {
	  
	const token = 'your access token here'; // retrieve token from cookie
  
    const url = 'https://accounts.spotify.com/api/token';
    const data = new URLSearchParams();
    data.append('token', token);
    data.append('token_type_hint', 'access_token');
	
    const config = {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from('client_id:client_secret').toString('base64')}` // replace with your app's client ID and secret
      }
    };

	axios.post(url, data, config)
	  .then(response => {
		console.log(response.data);
		console.log('Access token revoked');
	  })
	  .catch(error => {
		console.error(error);
	  });
  });	  

});

module.exports = router;