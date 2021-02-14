
export default class Delay {
	constructor(context) {

		this.context = context;
		this.delay = this.context.createDelay(15.0);
		this.feedback = this.context.createGain();
		this.filter = this.context.createBiquadFilter();
		this.filter.type = 'lowpass';
		this.filter.Q.value = 5;

		this.volume = this.context.createGain();

		this.input = this.delay;
		this.delay.connect(this.feedback);
		this.feedback.connect(this.filter);
		this.filter.connect(this.delay);
		this.delay.connect(this.volume);
		this.output = this.volume;
	}

	set = (paramName, value) => {
		switch (paramName) {
			case 'gain':
				this.volume.gain.value = value;
				break;
			case 'time':
				this.delay.delayTime.value = value;
				break;
			case 'feedback':
				this.feedback.gain.value = value;
				break;
			case 'cutoff':
				this.filter.frequency.value = value;
				break;
		}
	}

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}
}