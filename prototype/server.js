const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const bodyParser = require('body-parser');
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//POST route instructions
app.post('/express_backend', (req, res) => {
  const { playlist, keyword } = req.body;
  console.log('New contact form submission: Playlist: ${playlist}, Keyword: ${keyword}');
  res.status(200).send('Form submission received!');
});

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11