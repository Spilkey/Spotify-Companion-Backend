var config = module.exports = {};

const dotenv = require('dotenv');
dotenv.config();

config.env = 'development';

config.client_id = process.env.API_KEY
config.client_secret = process.env.API_SECRET