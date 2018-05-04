import socket from './socket';

const Emit = {
	startNewGame: config => {
		socket.emit('start new game', config);
	}
};

export default Emit;
