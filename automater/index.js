/*
    ----------------- STEPS -----------------
    1. Open the browser
    2. Open a new page
    3. Go to the URL https://unstop.com/competitions
    4. Wait for 5 seconds to ensure the page is loaded
    5. Get the list of all the posts
    6. Extract the details of each post
    7. Store the details of each post in an array
    8. Pass the array to the EJS template
    9. Create an Express server
    10. Render the EJS template on the server
    11. Listen on port 3000

*/

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

let page;
let data = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let browserOpen = puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized']
});

browserOpen.then(function (browser) {
    return browser.newPage();
}).then(function (newPage) {
    page = newPage;
    return page.goto('https://unstop.com/competitions');
}).then(function () {
    return sleep(5000); 
}).then(function () {
    return page.$$('.single_profile'); 
}).then(async function (posts) {
    let postDetailsPromises = posts.map(async post => {
        let title = await post.$eval('.double-wrap', el => el.textContent.trim());
        let image = await post.$eval('.img img', img => img.src);
        let registered = await post.$eval('.seperate_box:nth-child(1)', el => el.textContent.trim());
        let daysLeft = await post.$eval('.seperate_box:nth-child(2)', el => el.textContent.trim());
        return { title, image, registered, daysLeft };
    });
    return Promise.all(postDetailsPromises);
}).then(function (postDetails) {
    data = postDetails;
    console.log('Post Details:', postDetails);
}).catch(function (err) {
    console.error('Error:', err);
});


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', message: 'Welcome to my simple Express app!', data: data });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise.then(function () {
            let clickModal = cPage.click(selector);
            return clickModal;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    })
}
