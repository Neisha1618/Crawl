const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

require('dotenv').config();
const path = require('path');
// const { session } = require('passport');
const { apiRouter } = require('./api/index');

const app = express();

const PORT = process.env.PORT || 8081;

const CLIENT_PATH = path.join(__dirname, '../client/dist');
app.use(cors());
app.use(express.static(CLIENT_PATH));
app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server Listening on Port:${PORT} 🚀`);
});

module.exports = {
  PORT,
};
