// Game manager module
const H = require('./helpers');

let games = [];

class Game {
	constructor(playersList, gameConfig) {
		this.players = playersList;
		this.config = gameConfig;
	}
}

exports.startGame = function(playersList) {
	let newGame = new Game(playersList);
	games.push(newGame);
	console.log('Starting a ' + playersList.length + ' players match');
	return H.Helpers.makeId();
};
