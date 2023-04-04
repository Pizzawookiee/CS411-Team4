const express = require('express'); 
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000; 
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const AuthRoutes = require('./routes/authRoutes.js');
const cors = require("cors");
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', cors(), AuthRoutes);
app.use(morgan('combined'));


//POST route instructions
app.post('/express_backend', (req, res) => {
  const { playlist, keyword } = req.body;
  console.log('New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}');
  console.log('pulling google trends related query data for keyword...');
  exec(`node find_related_terms.js ${keyword}`, (error, stdout, stderr) => {
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