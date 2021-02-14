import Store from './Store';

export default class Options {
	constructor(id, defaultParams, callback) {

		this.id = id;
		this.params = defaultParams;
		this.callback = callback;

		this.optionsDOM = [];

		this.init();
	}

	init = () => {
		
		this.container = document.getElementById(this.id);
		this.toggleButton = this.container.getElementsByClassName('toggle-options')[0];

		// show/hide options list
		this.toggleButton.addEventListener('click', () => {
			this.container.classList.toggle('visible');
		});

		// options click events
		this.optionsDOM = this.container.getElementsByTagName('li');

		[...this.optionsDOM].map(el => {

			// toggle initial params
			el.dataset.status = (this.params[el.dataset.option] ? 'on' : 'off')

			el.addEventListener('click', () => {
				this.params[el.dataset.option] = !this.params[el.dataset.option];

				this.callback(this.id, this.params);

				this.updateDOM();
			});
		});

	}

	updateDOM = () => {
		// console.log(this.params);

		[...this.optionsDOM].map(el => {
			el.dataset.status = (this.params[el.dataset.option] ? 'on' : 'off');
		});
	}
}