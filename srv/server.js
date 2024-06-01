const express = require('express');
const cds = require('@sap/cds');
const proxy = require('@sap/cds-odata-v2-adapter-proxy');
const s3Route = require('./s3_api/s3Routes')
const app = express();
const {cds_launchpad_plugin} = require('cds-launchpad-plugin');



// Bootstrap the application with cds
cds.on('bootstrap', async (app) => {
    // Use cds-odata-v2-adapter-proxy middleware
    const handler = new cds_launchpad_plugin();
    app.use(handler.setup());
    console.log(cds.env.production)
    app.use(proxy());
});

// Define a test route
// app.get('/test', (req, res) => {
//     res.send('Hello, world!');
// });

app.use('/s3', s3Route);


// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the server instance
module.exports = server;
