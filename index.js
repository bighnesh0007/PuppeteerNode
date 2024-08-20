const puppeteer = require("puppeteer");
const fs = require("fs");
const loginLink = "https://www.linkedin.com/login";
const searchString = "software engineer";

let page;

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
    console.log("Login Page Opened");
    let emailPromise = page.type("input[name='session_key']", "email@gmail.com", { delay: 50 });
    return emailPromise;
}).then(function () {
    console.log("Email Entered");
    let passwordPromise = page.type("input[name='session_password']", "pass", { delay: 50 });
    return passwordPromise;
}).then(function () {
    console.log("Email and Password Entered");
    let loginPromise = page.click("button[type='submit']");
    return loginPromise;
}).then(function () {
    console.log("Logged in Successfully");
    let searchPromise = waitAndClick("input[placeholder='Search']", page);
    return searchPromise;
}).then(function () {
    console.log("Search Bar Clicked");
    let typePromise = page.type("input[placeholder='Search']", searchString, { delay: 100 });
    return typePromise;
}).then(function () {
    console.log("Search String Entered");
    let enterPromise = page.keyboard.press("Enter");
    return enterPromise;
}).then(function () {
    let allJobsPromise = page.evaluate(() => {
     
        const jobElements = document.querySelectorAll(".entity-result__title-line entity-result__title-line--2-lines  .app-aware-link");
        return Array.from(jobElements).map(job => job.innerText.trim());
    });
    return allJobsPromise;
}).then(function (jobs) {
    console.log("All Jobs Clicked");
    console.log(jobs);
})




function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        cPage.waitForSelector(selector, { visible: true }).then(function () {
            return cPage.click(selector);
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
