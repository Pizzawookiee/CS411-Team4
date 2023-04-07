# CS411-Team4

Friday morning lab Team 4

please make a pull request to put things into main branch


HOW TO RUN APP:

Prereqs: Node and npm

1) git clone repo
2) Windows Users: open command prompt configured to use Node and npm ("Node.js command prompt" from Windows key search menu works)
3) cd into prototype folder within the repo, type "npm install" then type "node server.js". Let the file run, don't close the window.
4) add a file called ".env" into your prototype folder. Its contents should be...

PORT=5000

CLIENT_ID="your client_id from spotify here"

CLIENT_SECRET="your client_secret from spotify here"

REDIRECTURI="http://localhost:5000/api/logged"

CLIENT_REDIRECTURI="http://localhost:3000/"

For Client_ID and Client_Secret, make an app with your Spotify for Developers account and use the keys it gives you.
Additionally, in the settings for the Spotify app you should add under the REDIRECT_URIs section "http://localhost:5000/api/logged".

5) Open a second window of "Node.js command prompt". cd into prototype/react_frontend, type "npm install" then type "npm start"; a pop-up of the app should appear in your browser
6) you should see a "Log In" button on the top right of your screen. Click it, log into Spotify. You should get a popup with your access token.
You can copy this token and paste in your code to make Spotify API calls. Tokens expire after an hour, so you may have to refresh the page again for a new token.
If you get a random pop-up that says 'undefined', just click OK or close it for now.


