import { setParam } from './_helpers';


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
				setParam(this.volume.gain, value, this.context);
				break;
			case 'time':
				setParam(this.delay.delayTime, value, this.context, .05);
				break;
			case 'feedback':
				setParam(this.feedback.gain, value, this.context);
				break;
			case 'cutoff':
				setParam(this.filter.frequency, value, this.context);
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