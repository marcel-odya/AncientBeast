// Game manager module
const H = require('./helpers');

let games = [];

class Game {
	constructor(playersList) {
		this.players = playersList;
	}
}

exports.startGame = function(playersList) {
	let newGame = new Game(playersList);
	games.push(newGame);
	console.log('Starting a 2 players match');
	return H.Helpers.makeId();
};
