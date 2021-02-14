
export default class VCA {
	constructor(context, modulatedItems) {

		this.context = context;
		this.modulatedItems = modulatedItems;
		this.modulatedPorts = [];
		
		this.envelope = {
			attack: 	.005,
			decay: 		.1,
			sustain: 	.6,
			release: 	.1
		}
	}

	set = (paramName, value) => {
		if (paramName === 'modulation') {
			this.reconnect(value);
			return;
		};
		this.envelope[paramName] = value;
		this.updateValues();
	}

	updateValues = () => this.modulatedPorts.map(port => port.envelope = this.envelope);

	reconnect = (modulationSettings) => {

		let newPorts = [];

		Object.keys(modulationSettings).map(key => {

			if (key.startsWith('vca')) { // deal with vca only

				let value = modulationSettings[key];
				
				switch (value) {
					case 'osc1':
					case 'osc2':
					case 'osc3':
						let VCOs = this.modulatedItems['VCOs'];

						Object.keys(VCOs).map(key => {
							let port = VCOs[key].oscillators[value];
	
							newPorts.push(port);
						});
						break;

					case 'filter':
						delete(modulationSettings[key]); // for now
						break;
				};

				const defaultEnvelope = { // default
					attack: 	0,
					decay: 		0,
					sustain: 	1,
					release: 	0
				};
				
				this.modulatedPorts.map(port => port.envelope = defaultEnvelope);

				this.modulatedPorts = newPorts;
				this.updateValues();
			}
		});
	}
}