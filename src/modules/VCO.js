import Oscillator from './Oscillator';


export default class VCO {
	constructor(context, noteBind, outputNode) {

		this.context = context
		this.noteBind = noteBind
		this.outputNode = outputNode
		this.oscillators = {}

		this.velocity = this.context.createGain()
		this.velocity.connect(this.outputNode.input)

		this.init()
	}

	init = () => {

		this.oscillators = {
			osc1: new Oscillator(this.context),
			osc2: new Oscillator(this.context),
			osc3: new Oscillator(this.context)
		};

		this.connect();
	}

	connect = () => {
		for (let osc in this.oscillators) {
			this.oscillators[osc].connect(this.velocity)
		}
	}

	disconnect = () => {
		for (let osc in this.oscillators) {
			this.oscillators[osc].disconnect()
		}
	}

	set = (oscName, paramName, value) => {

		switch (paramName) {
			case 'frequency':
				for (let osc in this.oscillators) {
					this.oscillators[osc].setFrequency(value);
				};
				break;
			case 'gain':
				this.oscillators[oscName].setGain(value);
				break;
			case 'detune':
				this.oscillators[oscName].setDetune(value);
				break;
			case 'wavetype':
				this.oscillators[oscName].setWavetype(value);
				break;
			case 'offset':
				this.oscillators[oscName].setOffset(value);
				break;
			case 'velocity':
				this.velocity.gain.value = value / 128;
				break;
			case 'attack':
			case 'decay':
			case 'sustain':
			case 'release':
				this.oscillators[oscName].setEnvelope(paramName, value);
				break;
		}

	}

	play = (freq, velocity = 128) => {
		this.set(null, 'frequency', freq);
		for (let osc in this.oscillators) {
			this.set(null, 'velocity', velocity)
			this.oscillators[osc].play();
		};
	};

	stop = () => {
		for (let osc in this.oscillators) {
			this.oscillators[osc].stop();
		};
	}
}