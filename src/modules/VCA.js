
export default class VCA {
	constructor(context) {

		this.context = context;
		this.modulatedOscillators = new Set();

		this.envelope = {
			attack: 	.005,
			decay: 		.1,
			sustain: 	.6,
			release: 	.1
		}

		// for oscillators not connected to VCA
		this.defaultEnvelope = {
			attack: 	0,
			decay: 		0,
			sustain: 	1,
			release: 	0
		}
	}

	set = (paramName, value) => {
		if (paramName === 'modulation') {
			this.reconnect(value);
			return;
		};
		this.envelope[paramName] = value;
	}

	// voices ask for envelope on note on / note off
	getEnvelope = oscName => this.modulatedOscillators.has(oscName)
		? this.envelope
		: this.defaultEnvelope

	reconnect = (modulationSettings) => {

		let newOscillators = new Set();

		Object.keys(modulationSettings).map(key => {

			if (key.startsWith('vca')) { // deal with vca only

				let value = modulationSettings[key];

				switch (value) {
					case 'osc1':
					case 'osc2':
					case 'osc3':
						newOscillators.add(value);
						break;

					case 'filter':
						delete(modulationSettings[key]); // for now
						break;
				};
			}
		});

		this.modulatedOscillators = newOscillators;
	}
}
