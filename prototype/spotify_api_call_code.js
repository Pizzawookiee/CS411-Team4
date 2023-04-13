const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n',
  headers: { 
    'Authorization': 'Bearer BQDAbrYQgaxP9PTO5xqXUm1Pa8II3j5CuX0rDMkRy8tIl4TukT-gQFgdwT0B2To5o8Y4HHnTETRwB1k4eLQePMxS8HF8UIozye-n5P-ho95xd4fpioIvUwBgNmyqpw2SrcScse7f-21p9jJoPsi4YaedscM_myUH7bUaYlOoQUbI5D87YLOtBmkS3m7uwr2vsYj0-Udj7sXRoqE_0f2t4b97YPGD3rrq75fBMBHONlTW2uzEaN1zs8OdmEg_BGUntrBodkie28-vHc00tw'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});