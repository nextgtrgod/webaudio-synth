import Oscillator from './Oscillator';


export default class VCO {
	constructor(context, outputNode, { freq, velocity = 128, oscSettings, modulationInputs, getEnvelope }) {

		this.context = context
		this.outputNode = outputNode
		this.modulationInputs = modulationInputs
		this.getEnvelope = getEnvelope
		this.oscillators = {}
		this.onended = null

		// 3 oscillators at full gain sum up to 3 -> keep one voice within 0..1
		this.headroom = 1 / 3

		this.velocity = this.context.createGain()
		this.velocity.gain.value = velocity / 128 * this.headroom
		this.velocity.connect(this.outputNode.input)

		this.init(oscSettings, freq)
	}

	init = (oscSettings, freq) => {

		Object.keys(oscSettings).forEach(oscName => {
			let osc = new Oscillator(this.context, oscSettings[oscName])

			osc.setFrequency(freq)
			osc.connect(this.velocity)
			this.modulationInputs[oscName].connect(osc.modulated.gain)

			this.oscillators[oscName] = osc
		})

		Object.values(this.oscillators)[0].osc.onended = this.dispose
	}

	dispose = () => {
		for (let oscName in this.oscillators) {
			this.modulationInputs[oscName].disconnect(this.oscillators[oscName].modulated.gain)
			this.oscillators[oscName].disconnect()
		}
		this.velocity.disconnect()

		if (this.onended) this.onended(this)
	}

	set = (oscName, paramName, value) => {

		switch (paramName) {
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
		}

	}

	play = () => {
		for (let oscName in this.oscillators) {
			this.oscillators[oscName].play(this.getEnvelope(oscName));
		};
	};

	stop = () => {
		let end = 0

		for (let oscName in this.oscillators) {
			end = Math.max(end, this.oscillators[oscName].stop(this.getEnvelope(oscName)));
		};

		this.kill(end)
	}

	choke = () => {
		let end = 0

		for (let oscName in this.oscillators) {
			end = Math.max(end, this.oscillators[oscName].choke());
		};

		this.kill(end)
	}

	kill = when => {
		for (let oscName in this.oscillators) {
			this.oscillators[oscName].kill(when);
		};
	}
}
