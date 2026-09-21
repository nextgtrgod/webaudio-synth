import { setParam } from './_helpers';


export default class VCF {
	constructor(context) {

		this.context = context;
		this.filter = this.context.createBiquadFilter();
		this.filter.type = 'lowpass';

		this.input = this.filter;
		this.output = this.filter;

		this.modulated = this.context.createGain();
		this.modulated.gain.value = 6000; // 6 * 100 cents => -6000..6000 (one octave)

		this.modulated.connect(this.filter.detune);
	}

	set = (paramName, value) => {

		switch (paramName) {
			case 'freq':
				setParam(this.filter.frequency, value, this.context);
				break;
			case 'qual':
				setParam(this.filter.Q, value, this.context);
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
};