const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n',
  headers: { 
    'Authorization': 'Bearer BQCN52l-ybU9KZ81d5ch_NNMq_Qgb2FVIQjVTjO8TQ3TJlBiJo6LWFbfu9iuB65dAZCS3-IrSw0-wnHEOVNSHRkKANFi7ue1TCf5g3AzlEFPHWSOvp4AXLpJqkdTTm-qHn3zceByrzGM1wyp-TP7M2r5YdOYOrntXH-e48zgmRyPJDAq7M_ZcTinOM3LV8p_5JC7pKt0O2X42PdbnhTP', 
    'Cookie': 'sp_landing=https%3A%2F%2Fopen.spotify.com%2Fplaylist%2F0CNNkkI2tserUv99SsY1BX%3Fsp_cid%3D9e55e952365cde5824e5b5a3288bde4d%26device%3Ddesktop; sp_t=9e55e952365cde5824e5b5a3288bde4d'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
