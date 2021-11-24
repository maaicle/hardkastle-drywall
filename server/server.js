const express = require('express');
const path = require('path');
const app = express();
const ctrl = require("./ctrl.js");

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '9648c58445df43a8b17bcf72c3464a74',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

app.get('/rollbartest', (req, res) => {
    rollbar.log("This is a new test");
    console.log("This is a new test");
})

app.get('/bidder.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/bidder.html'));
    rollbar.info('html file loaded successfully');
});

app.get('/bidder.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/bidder.css'));
})

app.get('/bidder.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/bidder.js'));
    rollbar.info('html file loaded successfully');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
    rollbar.info('html file loaded successfully');
});

app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.css'));
    rollbar.info('css file loaded successfully')
});

app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/main.js'));
});

app.get('/object-observer.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/object-observer.js'));
});

app.get('/pics/hkdrywall-curve.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/HKdrywall-curve.png'));
});

app.get('/pics/stonewall-bw.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/stonewall-bw.jpg'));
});

app.get('/pics/elevator-bw.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/elevator-bw.jpg'));
});

app.get('/pics/paint-hole-window-bw.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/paint-hole-window-bw.jpg'));
});

app.get('/pics/stud-wall-bw.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/stud-wall-bw.jpg'));
});

app.use(rollbar.errorHandler());

app.post('/createLineItem', ctrl.createLineItem);
console.log(ctrl.createLineItem);


const port = process.env.PORT || 4007;

app.listen(port, () => {
    console.log(`Docked at port ${port}`);
});