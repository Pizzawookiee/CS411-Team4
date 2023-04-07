const axios = require('axios');
const cookieParser = require('cookie-parser');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n',
  headers: { 
    'Authorization': 'Bearer BQA6ZzoUNu6MkCa6rwhRo-ljQuJ6MlpVH8F--dTuK8zxmcNvYfR-wRKYHmZuiAO_DWAgfE5sdvoUSDkGnzUVjfSacirC2aYoxZag6t67yRBTWX6g6wPFDnGsr0v9-BOWjxBlEg4Vo2jr1IoAJLQAfaSFfilsTfvn1fI2m9JNUIzEVrCKv3eHf4A-GUkw1ql-3BAVLT6UUoeTLHNWxZQu', 
    'Cookie': 'e'
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