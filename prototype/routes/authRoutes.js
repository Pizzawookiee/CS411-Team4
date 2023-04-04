//source: https://ahmetomer.net/spotify-api-authorization-in-nodejs/

const express = require('express');
const router = express.Router();
//const fetch = require('node-fetch');
const querystring = require('querystring');
const cors = require('cors');

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
	res.redirect('http://localhost:3000/'); //this needs to be here otherwise infinite loading, BUT this erases any forms.
  });
});

module.exports = router;