require("dotenv").config();

const http = require('http');
//const bodyParser=require('body-parser');
const router = require("./routes");
// var cors = require('cors');
// const compression = require('compression');
var cors_proxy = require('cors-anywhere');
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;


// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
if (!env) {
	return [];
}
	return env.split(',');
}

// Set up rate-limiting to avoid abuse of the public CORS Anywhere server.
var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);
var cors_proxy = require('./lib/cors-anywhere');

app.use(cors_proxy.createServer({
		originBlacklist: originBlacklist,
		originWhitelist: originWhitelist,
		requireHeader: ['origin', 'x-requested-with'],
		checkRateLimit: checkRateLimit,
		removeHeaders: [
			'cookie',
			'cookie2',
			// Strip Heroku-specific headers
			'x-heroku-queue-wait-time',
			'x-heroku-queue-depth',
			'x-heroku-dynos-in-use',
			'x-request-start',
	],
		redirectSameOrigin: true,
		httpProxyOptions: {
		// Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
		xfwd: false,
	},
	})
)

// app.enable('trust proxy');
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('public'));


// app.use(cors());
// app.options('*', cors());
// app.use(compression());

app.use('/public', express.static('public/img'));
app.use('/api/v1', router);
// app.use('/static', express.static(path.join(__dirname,'public')));


app.listen(port, () =>
	console.log(`Server is running at http://localhost:${port}`)
);

// https://dumbsound-backend-777.herokuapp.com/api/v1/users --> deploy site