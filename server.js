// Setup basic express server
const compression = require('compression');
const express = require('express');
const webpack = require('webpack');
const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const ip = process.env.IP || null; // Use specified IP to bind to otherwise, bind to default for the API.
const gameManager = require('./server/gamemanager.js');
const qManager = require('./server/queuemanager.js');
const H = require('./server/helpers');
/**
 * Require a module if it's available, returns the module if so, otherwise, false.
 * @param {string} path Path to the module.
 * @return {Object|boolean} Return either the module or false.
 */
function requireIfAvailable(path) {
	try {
		require.resolve(path);
		return require(path); // eslint-disable-line global-require
	} catch (e) {
		return false;
	}
}

const webpackDevMiddleware = requireIfAvailable('webpack-dev-middleware');

// Enable gzip compression.
app.use(compression());

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base, but only if we are not in a production environment.
if (process.env.NODE_ENV !== 'production' && webpackDevMiddleware) {
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: config.output.publicPath
		})
	);
}

// Setup the game queue and connection details
io.on('connection', function(session) {
	console.log('a user connected');

	// Check the queue on every connection

	// Store the ID in the socket session for this client
	let ID = H.Helpers.makeId();
	session.ID = ID;

	session.on('start new game', data => {
		// Add user to the queue
		console.log(data);
		session.gameConfig = data;
		qManager.addToQueue(session);

		let players = qManager.checkQueueForGame();

		if (players.length > 1) {
			let gameID = gameManager.startGame(players);
			for (let i in players) {
				if (typeof players[i] !== undefined) {
					let player = players[i];
					player.join(gameID);
					qManager.removeFromQueue(player);
				} else {
					return;
				}
			}
			// Sending gameID to all players
			io.in(gameID).emit('joined game', gameID);
		}
	});

	session.on('disconnect', function() {
		console.log('user disconnected');
		qManager.removeFromQueue(session);
	});

	// Send user the username
	session.emit('login', session.username);
});

// Listen for server, and use static routing for deploy directory
server.listen(port, ip, function() {
	console.log('Server listening at port %d', port);
});

app.use(
	express.static('./deploy', {
		maxAge: 86400000
	})
);
