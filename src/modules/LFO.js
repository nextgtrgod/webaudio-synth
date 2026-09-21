import { setParam } from './_helpers';


export default class LFO {
	constructor(context, modulatedItems) {

		this.context = context;
		this.modulatedItems = modulatedItems;
		this.modulatedPorts = [];
		
		this.osc = this.context.createOscillator();
		this.osc.start();

		this.amount = this.context.createGain();

		this.osc.connect(this.amount);

		this.output = this.osc.connect(this.amount);
	}

	set = (paramName, value) => {

		switch (paramName) {
			case 'amount':
				setParam(this.amount.gain, value, this.context);
				break;
			case 'freq':
				setParam(this.osc.frequency, value, this.context);
				break;
			case 'wavetype':
				this.osc.type = value;
				break;
			case 'modulation':
				this.modulate(value);
				break;
		}

	}

	modulate = (modulationSettings) => {

		let newPorts = [];

		Object.keys(modulationSettings).map(key => {

			if (key.startsWith('lfo')) { // deal with lfo only

				let value = modulationSettings[key];
				
				switch (value) {
					case 'osc1':
					case 'osc2':
					case 'osc3':

						newPorts.push(this.modulatedItems['oscillators'][value]);
						break;

					case 'filter':
						let VCF = this.modulatedItems['VCF'];

						let port = VCF.modulated; // multiplier gain inside

						newPorts.push(port);
						break;
				}

			}
		});

		// disconnect early ports
		this.modulatedPorts.map(port => this.output.disconnect(port));

		// connect new
		newPorts.map(port => this.output.connect(port));

		this.modulatedPorts = newPorts;

	}

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}

	disconnect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.disconnect(node.input);
		} else {
			this.output.disconnect(node);
		};
	}

}