// const axios = require('axios');
// const port = process.env.PORT || 4007;

//Get elements
const logo = document.querySelector('.logo');

// Calls the createObserver function once the page is loaded.
window.addEventListener("load", event => createObserver(), false);

const testCall = event => {
    console.log('Front End Works')

    axios.get(`https://hardkastledrywall.herokuapp.com/rollbartest`).then(res => {
        console.log(res.data);
    })
    .catch(err => console.log(err.data))
}

logo.addEventListener('click', testCall);

