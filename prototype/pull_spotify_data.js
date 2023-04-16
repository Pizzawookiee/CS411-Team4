const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n',
  headers: { 
    'Authorization': 'Bearer BQCzWsZ-MnIJC6VG4-rM6gf439pYztiu5KlYYnfGkIPyETn25tg2eqsSU5XIkTf_WqbYUR04qDSpvTpDHmrw96M3_TYdq6PWsaNtJjeav9iBgkmml9e1QQrSxZ2OX34JEoKIf-CwfNpY7WmcjwcFHplv6upnBaJQDcO4DsSi-1y5PVUuk9w68eQmJTtS1cfrI7bdPTG8zrqRK0Eq0QFq69SvHGP4uwI6LFDB3QQQwLlH6Qv9o8MlefarmMyA6TiYwVA1PG63mjSLuM_111s', 
    'Cookie': 'sp_t=9e55e952365cde5824e5b5a3288bde4d'
  }
};

async function makeRequest() {
  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  }
  catch (error) {
    console.log(error);
  }
}

makeRequest();
