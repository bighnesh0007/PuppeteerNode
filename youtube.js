const puppeteer = require('puppeteer');

const loginLink = "https://www.youtube.com/";

let browserOpen = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
});

browserOpen.then(function (browser) {
    let allTabsPromise = browser.newPage();
    return allTabsPromise;
}).then(function (newTab) {
    page = newTab;
    let loginPage = newTab.goto(loginLink);
    return loginPage;
}).then(function () {
    console.log("Logged in Successfully");
    let clickSearchBarPromise = waitAndClick("input[id='search']", page);
    return clickSearchBarPromise;
}).then(function () {
    console.log("Search bar clicked");
    let typeSearchBarPromise = page.type("input[id='search']", "coc", { delay: 10 });
    return typeSearchBarPromise;
}).then(function () {
    console.log("Search bar typed");
    let enterSearchBarPromise = page.keyboard.press('Enter');
    return enterSearchBarPromise;
}).then(function () {
    console.log("Search initiated");
    // Wait for the results to load
    return page.waitForSelector("ytd-video-renderer", { visible: true });
})
    .then(function () {
        console.log("Results loaded");
        // Extract the video titles
        let videoTitlesPromise = page.evaluate(() => {
            let titles = [];
            let videoElements = document.querySelectorAll("ytd-video-renderer #video-title");
            videoElements.forEach(element => {
                titles.push(element.innerText);
            });
            return titles;
        });
        return videoTitlesPromise;
    }).then(function (videoTitles) {
        console.log("Video titles:");
        videoTitles.forEach((title, index) => {
            console.log(`${index + 1}: ${title}`);
        });
    }).catch(function (err) {
        console.error("Error occurred:", err);
    });

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        cPage.waitForSelector(selector, { visible: true })
            .then(function () {
                return cPage.click(selector);
            })
            .then(resolve)
            .catch(reject);
    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
