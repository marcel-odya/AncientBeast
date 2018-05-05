import socket from './socket';

const Emit = {
	startNewGame: config => {
		socket.emit('start new game', config);
	},
	userClickedButton: data => {
		socket.emit('clicked button', data);
	}
};

export default Emit;
