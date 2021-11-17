const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.css'));
});

app.get('/mainjs', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/main.js'));
});

app.get('/objobs', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/object-observer.js'));
});

app.get('/hklogo', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/HKdrywall-curve.png'));
});

app.get('/stonewall', (req, res) => {
    res.sendFile(path.join(__dirname, '../pics/stonewall-bw.jpg'));
});



const port = process.env.PORT || 4007;

app.listen(port, () => {
    console.log(`Docked at port ${port}`);
});