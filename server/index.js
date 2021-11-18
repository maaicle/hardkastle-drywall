const express = require('express');
const path = require('path');
const app = express();

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
    rollbar.info('html file loaded successfully');
});

app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.css'));
    rollbar.info('css file loaded successfully')
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/main.js'));
});

app.get('/objobs', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/object-observer.js'));
});

app.get('/pics/hkdrywall-curve.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pics/HKdrywall-curve.png'));
});

app.get('/stonewall', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/stonewall-bw.jpg'));
});

app.get('/elevator', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/elevator-bw.jpg'));
});

app.get('/painthole', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/paint-hole-window-bw.jpg'));
});

app.get('/studwall', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/stud-wall-bw.jpg'));
});

app.use(rollbar.errorHandler());

const port = process.env.PORT || 4007;

app.listen(port, () => {
    console.log(`Docked at port ${port}`);
});