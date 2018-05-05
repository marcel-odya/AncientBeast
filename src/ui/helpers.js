import * as $j from 'jquery';

const Helpers = {
	hideSettings: () => {
		$j('#gameSetupContainer').hide();
	},
	toggleQueueModal: (callback = () => {}) => {
		let modal = $j('#waitingQueueModal');
		if (modal.css('display') == 'block') {
			modal.animate(
				{
					opacity: 0
				},
				5000,
				() => {
					// Animation complete.
					modal.css('display', 'none');
					callback();
				}
			);
		} else {
			modal.css('display', 'block');
			modal.animate(
				{
					opacity: 100
				},
				5000,
				() => {
					// Animation complete.
					callback();
				}
			);
		}
	},
	changeQueueModalText: text => {
		$j('#waitingQueueModalMessage').text(text);
	}
};
export default Helpers;
