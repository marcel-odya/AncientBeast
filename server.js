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
	session.name = H.Helpers.makeFunnyName();

	session.on('start new game', data => {
		// Add user to the queue
		console.log(data);
		qManager.addToQueue(session, data);

		let matchups = qManager.checkQueueForGame();
		// console.debug(matchups);
		// We're checking if there are any matchups possible and then
		// we send an information to the clients if they joined a game
		if (matchups) {
			for (let i in matchups) {
				if (typeof matchups[i] !== undefined) {
					let modes = matchups[i];

					for (let ii in modes) {
						if (typeof modes[ii] !== undefined) {
							let matchup = modes[ii];
							let gameID = gameManager.startGame(matchup);
							for (let iii in matchup) {
								if (typeof matchup[iii] !== undefined) {
									let player = matchup[iii];
									player.join(gameID);
									player.gameID = gameID;
									qManager.removeFromQueue(player);
								}
							}
							// Sending gameID to all players
							io.in(gameID).emit('joined game', gameID, matchup[0].gameConfig);
						} else {
							return;
						}
					}
				}
			}
		}
	});

	session.on('game loaded', () => {
		console.debug('User ' + session.ID + ' loaded the game');

		gameManager.getGame(session.gameID).setPlayerAsLoaded(session.ID);

		if (gameManager.getGame(session.gameID).checkIfPlayersLoaded()) {
			io.in(session.gameID).emit('all players loaded');
		}
	});

	session.on('disconnect', function() {
		console.log(session.ID + ' aka ' + session.name + ' disconnected');
		qManager.removeFromQueue(session);
		if (session.gameID) {
			io.in(session.gameID).emit('player left game', session.name);
		}
	});

	// Send user the username
	session.emit('login', session.ID);
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
