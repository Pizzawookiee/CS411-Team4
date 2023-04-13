const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n',
  headers: { 
// TokenNumber will be the token associated to authorization
    'Authorization': 'Bearer TokenNumber'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});