/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

var log = require('./middleware/log');

var authRouter = require('./routes/authRouter');
var followingRouter = require('./routes/followingRouter');
var profileRouter = require('./routes/profileRouter');
var playlistRouter = require('./routes/playlistRouter');

var app = express();

app.use(cors());

app.use('/auth', authRouter);
app.use('/follow', followingRouter);
app.use('/profile', profileRouter);
app.use('/playlist', playlistRouter)

log.info(`Listening on ${process.env.PORT}`);

app.listen(process.env.PORT);