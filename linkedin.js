const https = require('https');
const express = require('express');
const app = express();

const options = {
    method: 'GET',
    hostname: 'linkedin-data-api.p.rapidapi.com',
    port: null,
    path: '/search-jobs-v2?keywords=golang&locationId=92000000&datePosted=anyTime&sort=mostRelevant',
    headers: {
        'x-rapidapi-key': '6ba42d6be9mshf3648d59bec4d5dp17cc72jsn03fb59f1b94d',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
    }
};

let data = [];

const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        const body = Buffer.concat(chunks);
        data = JSON.parse(body.toString()).data; // Extract the 'data' array
    });
});

req.on('error', function (e) {
    console.error(`Problem with request: ${e.message}`);
});

req.end();

app.get('/', (req, res) => {
    // Create HTML table structure
    const tableRows = data.map(job => `
        <tr>
            <td>${job.id}</td>
            <td>${job.title}</td>
            <td><a href="${job.url}" target="_blank">View Job</a></td>
            <td>${job.referenceId}</td>
            <td>${job.posterId}</td>
            <td><a href="${job.company.url}" target="_blank">${job.company.name}</a></td>
            <td><img src="${job.company.logo}" alt="${job.company.name} Logo"></td>
            <td>${job.location}</td>
            <td>${job.type}</td>
            <td>${job.postDate}</td>
        </tr>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>LinkedIn Jobs</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    background-color: #f4f4f4;
                }
                img {
                    width: 50px;
                    height: 50px;
                }
            </style>
        </head>
        <body>
            <h1>LinkedIn Jobs</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Job URL</th>
                        <th>Reference ID</th>
                        <th>Poster ID</th>
                        <th>Company</th>
                        <th>Company Logo</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Post Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
