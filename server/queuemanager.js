const gameManager = require('./gamemanager.js');
let queue = [];

exports.addToQueue = function(player) {
	queue.push(player);
	console.log('ADDED PLAYER: ' + player.username + ' TO QUEUE, Size:' + queue.length);
};

exports.removeFromQueue = function(player) {
	removePlayerFromQueue(player.username);
	console.log('Remove Player Queue Size: ' + queue.length);
};

// We will call this periodically to check if there are enough players
// If we have enough players it will return 2 of the player sessions for a game
exports.checkQueueForGame = function() {
	let queueCount = 0,
		players = [];
	for (let i in queue) {
		if (typeof i !== undefined) {
			if (queueCount == 0) {
				players.push(queue[i]);
			}
			if (queueCount == 1) {
				players.push(queue[i]);
				queueCount = 0;
				return players;
			}
			queueCount++;
		}
	}
	return 0;
};

function removePlayerFromQueue(username) {
	for (let i = 0; i < queue.length; i++) {
		if (queue[i].username === username) {
			queue.splice(i, 1);
			break;
		}
	}
}
