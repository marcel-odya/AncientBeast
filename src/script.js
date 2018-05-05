// Import jquery related stuff
import * as $j from 'jquery';
import 'jquery-ui/ui/widgets/button';
import 'jquery-ui/ui/widgets/slider';
import 'jquery.transit';

// Load phaser (https://github.com/photonstorm/phaser/issues/1974)
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import Game from './game';
import Helpers from './ui/helpers';
import Emit from './network/emitFunctions';

// Load the stylesheet
import './style/main.less';

// Abilities
import abolishedAbilitiesGenerator from './abilities/Abolished';
import chimeraAbilitiesGenerator from './abilities/Chimera';
import cyberHoundAbilitiesGenerator from './abilities/Cyber-Hound';
import darkPriestAbilitiesGenerator from './abilities/Dark-Priest';
import goldenWyrmAbilitiesGenerator from './abilities/Golden-Wyrm';
import gumbleAbilitiesGenerator from './abilities/Gumble';
import iceDemonAbilitiesGenerator from './abilities/Ice-Demon';
import impalerAbilitiesGenerator from './abilities/Impaler';
import lavaMolluskAbilitiesGenerator from './abilities/Lava-Mollusk';
import magmaSpawnAbilitiesGenerator from './abilities/Magma-Spawn';
import nightmareAbilitiesGenerator from './abilities/Nightmare';
import nutcaseAbilitiesGenerator from './abilities/Nutcase';
import scavengerAbilitiesGenerator from './abilities/Scavenger';
import snowBunnyAbilitiesGenerator from './abilities/Snow-Bunny';
import swineThugAbilitiesGenerator from './abilities/Swine-Thug';
import uncleFungusAbilitiesGenerator from './abilities/Uncle-Fungus';

// Create the game
export const G = new Game('0.3');

// Load the abilities
const abilitiesGenerators = [
	abolishedAbilitiesGenerator,
	chimeraAbilitiesGenerator,
	cyberHoundAbilitiesGenerator,
	darkPriestAbilitiesGenerator,
	goldenWyrmAbilitiesGenerator,
	gumbleAbilitiesGenerator,
	iceDemonAbilitiesGenerator,
	impalerAbilitiesGenerator,
	lavaMolluskAbilitiesGenerator,
	magmaSpawnAbilitiesGenerator,
	nightmareAbilitiesGenerator,
	nutcaseAbilitiesGenerator,
	scavengerAbilitiesGenerator,
	snowBunnyAbilitiesGenerator,
	swineThugAbilitiesGenerator,
	uncleFungusAbilitiesGenerator
];
abilitiesGenerators.forEach(generator => generator(G));

$j(document).ready(() => {
	let button = $j('#startButton');

	$j('.typeRadio').buttonset();
	button.button();

	// Disable initial game setup until browser tab has focus
	window.addEventListener('blur', G.onBlur.bind(G), false);
	window.addEventListener('focus', G.onFocus.bind(G), false);
	button.click(e => {
		e.preventDefault(); // Prevent submit
		let gameconfig = getGameConfig();
		console.debug(gameconfig);
		if (gameconfig.background_image == 'random') {
			// nth-child indices start at 1
			let index = Math.floor(Math.random() * ($j('input[name="combatLocation"]').length - 1)) + 1;
			gameconfig.background_image = $j('input[name="combatLocation"]')
				.slice(index, index + 1)
				.attr('value');
		}
		if (gameconfig.connectionMode === 'local') {
			G.loadGame(gameconfig);
		} else if (gameconfig.connectionMode === 'lan') {
			G.setAsOnline();

			Emit.startNewGame(gameconfig);
			Helpers.hideSettings();
			Helpers.toggleQueueModal();
		}

		return false; // Prevent submit
	});
});
/**
 *
 */
export function getGameConfig() {
	let defaultConfig = {
			playerMode: $j('input[name="playerMode"]:checked').val() - 0,
			creaLimitNbr: $j('input[name="activeUnits"]:checked').val() - 0, // DP counts as One
			unitDrops: $j('input[name="unitDrops"]:checked').val() - 0,
			abilityUpgrades: $j('input[name="abilityUpgrades"]:checked').val() - 0,
			plasma_amount: $j('input[name="plasmaPoints"]:checked').val() - 0,
			turnTimePool: $j('input[name="turnTime"]:checked').val() - 0,
			timePool: $j('input[name="timePool"]:checked').val() * 60,
			background_image: $j('input[name="combatLocation"]:checked').val(),
			connectionMode: $j('input[name="connectionMode"]:checked').val()
		},
		config = G.gamelog.gameConfig || defaultConfig;

	return config;
}

export function isEmpty(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}

/** The function is used in socket.on events
 * @param {object} config - Game config
 * @returns {bool} - Returns true if the game starts to load
 */
export function startGameLocallyWithConfig(config) {
	if (G.loadGame(config)) {
		Helpers.toggleQueueModal();
		return true;
	} else {
		return false;
	}
}
