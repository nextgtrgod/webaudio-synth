
export default class Input {
	constructor(id, defaultValue = 0, callback) {

		this.id = id;
		this.value = defaultValue;
		this.callback = callback;

		this.inputDOM = document.querySelector(`#${this.id} input`);
		this.inputDOM.value = this.value


		this.min = this.inputDOM.getAttribute('min') || -12;
		this.max = this.inputDOM.getAttribute('max') || 12;

		this.init();
	}

	init = () => {

		this.buttonInc = document.querySelector(`#${this.id} .step-up`);
		this.buttonDec = document.querySelector(`#${this.id} .step-down`);

		
		this.buttonInc.addEventListener('click', () => {
			
			if (this.value < this.max) {
				++this.value;

				this.updateDOM();
			};

		});

		this.buttonDec.addEventListener('click', () => {
			
			if (this.value > this.min) {

				--this.value;

				this.updateDOM();
			};

		});
	}

	updateDOM = value => {

		this.callback(this.id, this.value);
		
		this.inputDOM.value = this.value;

	};
}