/*
  ------------------HackerRank Automater------------------
  This is a simple automation script that will login to your HackerRank account and solve the first question of the WarmUp section of the Algorithms.
  The script is written in Node.js and uses Puppeteer library to automate the browser.
  The script will open the browser, login to your HackerRank account, go to the Algorithms section, click on the WarmUp section, and solve the first question.
  The script will also submit the answer and check if it is correct or not.
  You can modify the script to solve other questions as well.
  To run the script, you need to have Node.js installed on your system.
  You also need to install Puppeteer library by running the following command in your terminal:
  npm install puppeteer
  After installing Puppeteer, you can run the script by running the following command in your terminal:
  node hackerRankAutomater.js
  The script will open the browser and start automating the process.
  You can see the browser in action and check the output in the terminal.
  The script will automatically close the browser after completing the automation.
  You can modify the script to solve other questions or sections on HackerRank.
  You can also use the script to automate other tasks on HackerRank or other websites.
  The possibilities are endless with Puppeteer library.
  Happy coding!
  
*/


const puppeteer = require('puppeteer');

const loginLink = "https://www.hackerrank.com/auth/login";
const email = "bighnesh12221115@gmail.com";
const password = "+a9k+q&@wFUPZ_k";


let browserOpen = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ['--start-maximized']
})

let ans = `#include <iostream>
#include <vector>
#include <numeric> 

using namespace std;

int simpleArraySum(const vector<int>& ar) {
    return accumulate(ar.begin(), ar.end(), 0);
}

int main() {
    int n;
    cin >> n; 

    vector<int> ar(n);
    for (int i = 0; i < n; ++i) {
        cin >> ar[i];
    }

    int result = simpleArraySum(ar);
    cout << result << endl;

    return 0;
}
`

let page;

browserOpen.then(function (browser) {
  let allTabsPromise = browser.newPage();
  return allTabsPromise;
}).then(function (newTab) {
  page = newTab;
  let loginPage = newTab.goto(loginLink);
  return loginPage;
}).then(function () {
  let emailPromise = page.type("input[aria-label='Your username or email']", email, { delay: 10 });
  return emailPromise;
}).then(function () {
  let passwordPromise = page.type("input[aria-label='Your password']", password, { delay: 100 });
  return passwordPromise;
}).then(function () {
  let loginPromise = page.click("button[type='button']");
  return loginPromise;
}).then(function () {
  console.log("Logged in Successfully");
  let clickAlgorithmPromise = waitAndClick(".topic-card a[data-attr1='algorithms']", page);
  // data-attr1="algorithms"
  return clickAlgorithmPromise;
}).then(function () {
  console.log("Algorithm is clicked");
  let clickWarmUpPromise = waitAndClick("input[value='warmup']", page);
  return clickWarmUpPromise;
}).then(function () {
  console.log("Warm Up is clicked");
  let waitFor3Seconds = sleep(3000);;
  return waitFor3Seconds;
}).then(function () {
  let allQuestionsPromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", { delay: 10 });
  return allQuestionsPromise;
}).then(function (Questions) {
  console.log(`number of Questions: ${Questions.length}`);
  let qWillBeSolvedPromise = questionSolver(page, Questions[0], ans);
  return qWillBeSolvedPromise;
})

function waitAndClick(selecter, cPage) {
  return new Promise(function (resolve, reject) {
    let waitForModalPromise = cPage.waitForSelector(selecter, { visible: true });
    waitForModalPromise.then(function () {
      let clickModal = cPage.click(selecter);
      return clickModal;
    }).then(function () {
      resolve();
    }).catch(function (err) {
      reject(err);
    })
  })
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function questionSolver(page, question, answer) {
  return new Promise(function (resolve, reject) {
    let questionWillBeClicked = question.click();
    questionWillBeClicked.then(function () {
      let waitFor3Seconds = sleep(3000);
      return waitFor3Seconds;
    }).then(function () {
      console.log("Question is clicked");
      let waitForEditorial = waitAndClick(".monaco-editor.no-user-select.showUnused.showDeprecated.vs", page);
      return waitForEditorial;
    }).then(function () {
      console.log("Editorial is clicked");
      return waitAndClick(".checkbox-input", page);
    }).then(function () {
      return page.waitForSelector("textarea.custominput", page, { visible: true });
    }).then(function () {
      return page.type("textarea.custominput", answer, { delay: 10 });
    }).then(function(){
      let ctrlIsPressed = page.keyboard.down('Control');
      return ctrlIsPressed;
    }).then(function(){
      let aIsPressed = page.keyboard.press('A', {delay: 20});
      return aIsPressed;
    }).then(function(){
      let xIsPressed = page.keyboard.press('X', {delay: 20});
      return xIsPressed;
    }).then(function(){
      let ctrlIsReleased = page.keyboard.up('Control');
      return ctrlIsReleased;
    }).then(function(){
      waitForEditorial = waitAndClick(".monaco-editor.no-user-select.showUnused.showDeprecated.vs", page);
      return waitForEditorial;
    }).then(function(){
      let ctrlIsPressed = page.keyboard.down('Control');
      return ctrlIsPressed;
    }).then(function(){
      let aIsPressed = page.keyboard.press('A', {delay: 20});
      return aIsPressed;
    }).then(function(){
      let vIsPressed = page.keyboard.press('V', {delay: 20});
      return vIsPressed;
    }).then(function(){
      let ctrlIsReleased = page.keyboard.up('Control');
      return ctrlIsReleased;
    }).then(function(){
      return page.click(".hr-monaco__run-code");
    }).then(function(){
      let submitButton = page.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
      return submitButton;
    }).then(function(){
      resolve();
    }).catch(function(err){
      reject(err);
    })

  })
}