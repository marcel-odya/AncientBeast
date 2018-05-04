// Game manager module
const H = require('./helpers');

let games = [];

class Game {
	constructor(playersList) {
		this.host = playersList[0];
		this.players = playersList;
		console.debug(this.host.gameConfig);
		this.config = this.host.gameConfig.playerMode;
	}

	getPlayersCount() {
		return this.players.length;
	}
}

exports.startGame = function(playersList) {
	let newGame = new Game(playersList);
	games.push(newGame);
	console.log('Starting a ' + newGame.getPlayersCount() + ' players match');
	return H.Helpers.makeId();
};
