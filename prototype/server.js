//code adapted from https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/

const express = require('express'); 
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000; 
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const AuthRoutes = require('./routes/authRoutes.js');
const cors = require("cors");
const morgan = require('morgan');
const axios = require('axios');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', cors(), AuthRoutes);
app.use(morgan('combined'));
app.use(cookieParser());


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
/*
app.post('/test_spotify_api', (req, res) => {
  const { playlist, keyword } = req.body;
  console.log(`New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}`);
  
  const response = await fetch('http://localhost:5000/api/logged/');
  const token = response.headers.get('token');

  //const token = req.cookies.token; // Get the value of the 'token' cookie
  console.log(`Token: ${token}`);

  console.log('pulling spotify playlist data...');
  exec(`node get_playlist_data.js ${token} ${playlist}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send(stdout) 
  });
});
*/

app.post('/token', (req, res) => {
	const params = req.body;
	console.log(params); //seems like this works!
	res.sendStatus(200);
});

app.post('/test_spotify_api', async (req, res) => {
  const { playlist, keyword } = req.body;
  console.log(`New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}`);

  try {
    const response = await axios.get('http://localhost:5000/token/', { responseType: 'json' }); //change method to POST
    const token = response.data.token; //correct property name to access token

    console.log(`Token: ${token}`);

    console.log('pulling spotify playlist data...');
    exec(`node get_playlist_data.js ${token} ${playlist}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(stdout) 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});



// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// GET route instructions to prove express backend connected
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 
/*
// API endpoint that returns the log data as JSON
app.get('/logs', (req, res) => {
  // Get the log buffer from the morgan middleware
  const logs = req.app.get('morgan').buffer;
  
  // Split the logs into an array of lines
  const lines = logs.trim().split('\n');
  
  // Map each line to an object with a "message" property
  const logData = lines.map(line => ({ message: line }));

  res.json(logData);
});
*/
//app.get('/token', (req,res) => {res.status(200).send(Cookies.get('token'))});