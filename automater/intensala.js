const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(cors());  // Enable CORS
app.use(express.static('public'));

let internshipsData = [];

async function waitAndClick(selector, cPage) {
    try {
        await cPage.waitForSelector(selector, { visible: true });
        await cPage.click(selector);
    } catch (err) {
        console.error(err);
    }
}

async function scrapeInternships() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto('https://internshala.com/');
    await waitAndClick('.login-cta', page);
    
    const email = 'bighneshkumarsahoo58@gmail.com';
    const password = '3sj#CLLzSFJZfTM';

    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email, { delay: 100 });
    await page.type('input[type="password"]', password, { delay: 100 });
    await waitAndClick('#modal_login_submit', page);

    await page.goto('https://internshala.com/internships');
    await page.waitForSelector('.individual_internship', { visible: true });

    internshipsData = await page.evaluate(() => {
        const internshipsList = [];
        const elements = document.querySelectorAll('.individual_internship');
        
        elements.forEach(element => {
            const titleElement = element.querySelector('.job-internship-name');
            const companyElement = element.querySelector('.company_name');
            const locationElement = element.querySelector('.row-1-item.locations');
            const imageElement = element.querySelector('.internship_logo img');

            const title = titleElement ? titleElement.innerText : null;
            const company = companyElement ? companyElement.innerText : null;
            const location = locationElement ? locationElement.innerText : null;
            const image = imageElement ? imageElement.getAttribute('src') : null;

            internshipsList.push({ title, company, location, image });
        });

        return internshipsList;
    });

    await browser.close();
}

// Serve the scraped data
app.get('/api/internships', (req, res) => {
    res.json(internshipsData);
});

// Start scraping on server startup
scrapeInternships().catch(console.error);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
