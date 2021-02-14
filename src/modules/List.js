
export default class List {
	constructor(id, defaultValue = 'sine', callback) {

		this.id = id;
		this.defaultValue = defaultValue;
		this.callback = callback;

		this.items = [];

		this.init();
	}

	init = () => {

		this.items = [...document.querySelectorAll(`#${this.id} li`)];
		this.updateDOM(this.defaultValue); // add class to list item

		this.items.map(item => {
			item.addEventListener('click', () => {
				let selectedValue = item.dataset.wavetype; // selected wavetype

				this.callback(this.id, selectedValue);

				this.updateDOM(selectedValue);
			});
		});
	}

	updateDOM = value => {
		this.items.map(item => {
			if (item.dataset.wavetype === value) {
				item.classList.add('selected');
			} else {
				item.classList.remove('selected');
			}
		});
	}
}