import * as io from 'socket.io-client';
import { startGameLocallyWithConfig, G } from '../script';
import Helpers from '../ui/helpers';

let socket = io();
let server = {};

// Whenever the server emits 'login', log the login message
socket.on('login', function(data) {
	server.connected = true;
	// Display the welcome message
	let message = 'Connected To local Game Server as user: ' + data;
	server.ID = data;
	console.log(message);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function(data) {
	console.log(data.ID + ' joined');
	//addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', function(data) {
	console.log(data.ID + ' left');
	//addParticipantsMessage(data);
	//removeChatTyping(data);
});

// Whenever the server emits 'typing', show the typing message
socket.on('typing', function(data) {
	//addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', function(data) {
	//removeChatTyping(data);
});

socket.on('joined game', (id, config) => {
	console.log('Joined game with ID ' + id);
	Helpers.changeQueueModalText('The game will begin soon');
	startGameLocallyWithConfig(config);
});

socket.on('all players loaded', () => {
	console.log('Everyone loaded');
	Helpers.changeQueueModalText('The game is starting!');
	Helpers.toggleQueueModal();
});

socket.on('player left game', name => {
	console.log('Player ' + name + ' left game.');
	Helpers.changeQueueModalText(name + ' has left the game!');
	Helpers.toggleQueueModal(Helpers.toggleQueueModal());
});
/** Sends a chat message
 *
 */
function sendMessage() {
	//var message = $inputMessage.val();
	// Prevent markup from being injected into the message
	//message = cleanInput(message);
	// if there is a non-empty message and a socket connection
	//if (message && connected) {
	//  $inputMessage.val('');
	//  addChatMessage({
	//    ID: ID,
	//    message: message
	//  });
	// tell server to execute 'new message' and send along one parameter
	//  socket.emit('new message', message);
	//  }
}

export default socket;
