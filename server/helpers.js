exports.Helpers = {
	/**
	 * Generate a random id for each player that connects to the game.
	 * @return {string} The id.
	 */
	makeId: () => {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 30; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}
};
