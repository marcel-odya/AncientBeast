let queue = [];

exports.addToQueue = function(player, config) {
	player.gameConfig = config;
	queue.push(player);
	console.log('ADDED PLAYER: ' + player.ID + ' TO QUEUE, Size:' + queue.length);
};

exports.removeFromQueue = function(player) {
	removePlayerFromQueue(player.ID);
	console.log('Remove Player Queue Size: ' + queue.length);
};

// We will call this on every `start new game` event to check if there are any possible matchups
// If we have enough players it will return the object of 2 arrays of arrays with players's sessions
exports.checkQueueForGame = function() {
	let matchups = {},
		players1v1 = [],
		players2v2 = [];

	for (let i in queue) {
		if (typeof queue[i] !== undefined) {
			let player = queue[i];

			if (player.gameConfig.playerMode == 2) {
				players1v1.push(player);
				if (players1v1.length == 2) {
					if (!matchups.twoPlayers) {
						matchups.twoPlayers = [];
					}
					matchups.twoPlayers.push(players1v1);
					players1v1 = [];
				}
			} else if (player.gameConfig.playerMode == 4) {
				players2v2.push(player);
				if (players2v2.length == 4) {
					if (!matchups.fourPlayers) {
						matchups.fourPlayers = [];
					}
					matchups.fourPlayers.push(players2v2);
					players2v2 = [];
				}
			}
		}
	}
	// console.debug(matchups);
	return matchups;
};
/**
 *	function removePlayerFromQueue
 *
 * @param {string} ID - player's ID
 * @returns {boolean} - Returns true if the ID existed
 */
function removePlayerFromQueue(ID) {
	for (let i = 0; i < queue.length; i++) {
		if (queue[i].ID === ID) {
			queue.splice(i, 1);
			return true;
		}
	}
	return false;
}
