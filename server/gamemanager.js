// Game manager module
const H = require('./helpers');

let games = {};

class Game {
	constructor(playersList) {
		this.gameID = H.Helpers.makeId();
		this.host = playersList[0];
		this.players = playersList;
		this.config = this.host.gameConfig.playerMode;
	}

	setPlayersAttr(ID, attr, value) {
		for (let i in this.players) {
			if (typeof this.players[i] !== undefined) {
				let player = this.players[i];
				if (player.ID === ID) {
					player[attr] = value;
					return true;
				}
			}
		}
		return false;
	}

	getPlayerByOrder(order) {
		if (order >= 0 && order <= this.getPlayersCount()) {
			return this.players[order];
		} else {
			console.debug('Bad order number given');
		}
	}

	setPlayerAsLoaded(playersID) {
		if (!this.setPlayersAttr(playersID, 'isLoaded', true)) {
			console.debug('Something went wrong while setting ' + playersID + ' as loaded');
			return false;
		}
		return true;
	}

	checkIfPlayersLoaded() {
		for (let i = 0; i < this.getPlayersCount(); i++) {
			if (!this.players[i].isLoaded) {
				console.debug(i + '. player still not loaded in game ' + this.gameID);
				return false;
			}
		}
		console.debug('Everyone is loaded now in game ' + this.gameID);
		return true;
	}

	getPlayersCount() {
		return this.players.length;
	}

	getGamesID() {
		return this.gameID;
	}

	randomizeFirstMovingPlayer() {
		let firstPlayer = Math.floor(Math.random() * this.getPlayersCount());
		console.debug(firstPlayer + '. has the first move');
		return firstPlayer;
	}
}

exports.startGame = function(playersList) {
	let newGame = new Game(playersList);
	let gamesID = newGame.getGamesID();

	games[gamesID] = newGame;
	console.log('Starting a ' + newGame.getPlayersCount() + ' players match');

	return gamesID;
};

exports.getGame = function(gamesID) {
	if (games[gamesID]) {
		return games[gamesID];
	}
};
