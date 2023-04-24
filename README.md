# CS411-Team4

Friday morning lab Team 4

please make a pull request to put things into main branch


HOW TO RUN APP:

Prereqs: Node, npm and MongoDB

MongoDB setup (warning, you need a few GB of storage on your machine):
a) Install MongoDB. Assuming you're on Windows, try (https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
b) Install Mongosh (Mongo shell) and add it to PATH environment variable with these instructions (https://www.mongodb.com/docs/mongodb-shell/install/)
c) open any command prompt window. Type "mongosh", hit Enter. Keep the window open the entire time you use the app.

You should see something that looks like this:

Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0

If you see you are connecting to another address, go to \prototype\server.js and edit the uri variable on Line 16.


Main setup:
1) git clone repo
2) Windows Users: open command prompt configured to use Node and npm ("Node.js command prompt" from Windows key search menu works)
3) cd into prototype folder within the repo, type "npm install" then type "node server.js". Let the file run, don't close the window.
4) ask on Discord channel for certain config files which are not shared
5) Open a second window of "Node.js command prompt". cd into prototype/react_frontend, type "npm install" then type "npm start"; a pop-up of the app should appear in your browser
6) you should see a "Log In" button on the top right of your screen. Click it, log into Spotify. 
7) you should see a form with a field asking for Playlist.
8) currently, you can put in a link to a Spotify playlist. Click submit and you will see a list of song tracks appear under the first Node.js command prompt window (see step 3).
The first time you do this will take up to a minute, depending on the size of the playlist. However, subsequent tries with the same playlist will be much faster, as queries are
cached in MongoDB.

