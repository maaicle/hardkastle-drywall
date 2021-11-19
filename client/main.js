//Get elements
const logo = document.querySelector('.logo');

// Calls the createObserver function once the page is loaded.
window.addEventListener("load", event => createObserver(), false);

const testCall = event => {
    console.log('Front End Works')
    // axios.get('/rollbartest').then(res => {
        // console.log(res);
    // })
}

logo.addEventListener('click', testCall);

