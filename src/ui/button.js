import * as $j from 'jquery';
import Emit from '../network/emitFunctions';

export class Button {
	/**
	 * Constructor
	 *
	 *	Create attributes and default buttons
	 * @param {Object} opts - Objects for extending the jQuery Object
	 * @param {Object} game - The game's instance
	 * @param {bool} ifOnlineGame - Defaults by false, true if the game is online
	 */
	constructor(opts, game, ifOnlineGame = false) {
		this.game = game;
		this.onlineGame = ifOnlineGame;

		let defaultOpts = {
			click: function() {},
			mouseover: function() {},
			mouseleave: function() {},
			clickable: true,
			state: 'normal', // disabled, normal, glowing, selected, active
			$button: undefined,
			attributes: {},
			css: {
				disabled: {},
				glowing: {},
				selected: {},
				active: {},
				normal: {}
			}
		};
		// It's controlled by the server response
		if (ifOnlineGame) {
			this.clickInjectedFunction = () => {
				Emit.userClickedButton(this.$button);
			};
			opts.clickable = false;
			opts.state = 'disabled';
			opts.click = () => {
				this.clickInjectedFunction();
				opts.click();
			};
		}

		opts = $j.extend(defaultOpts, opts);
		$j.extend(this, opts);
		this.changeState(this.state);
	}

	changeState(state) {
		let game = this.game;

		state = state || this.state;
		this.state = state;
		this.$button
			.unbind('click')
			.unbind('mouseover')
			.unbind('mouseleave');

		if (state != 'disabled') {
			this.$button.bind('click', () => {
				if (game.freezedInput || !this.clickable) {
					return;
				}

				this.click();
			});
		}

		this.$button.bind('mouseover', () => {
			if (game.freezedInput || !this.clickable) {
				return;
			}

			this.mouseover();
		});

		this.$button.bind('mouseleave', () => {
			if (game.freezedInput || !this.clickable) {
				return;
			}

			this.mouseleave();
		});

		this.$button.removeClass('disabled glowing selected active noclick');
		this.$button.css(this.css.normal);

		if (state != 'normal') {
			this.$button.addClass(state);
			this.$button.css(this.css[state]);
		}
	}

	triggerClick() {
		if (this.game.freezedInput || !this.clickable) {
			return;
		}

		this.click();
	}

	triggerMouseover() {
		if (this.game.freezedInput || !this.clickable) {
			return;
		}

		this.mouseover();
	}

	triggerMouseleave() {
		if (this.game.freezedInput || !this.clickable) {
			return;
		}

		this.mouseleave();
	}
}
