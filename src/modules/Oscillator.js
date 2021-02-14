import Knob from './Knob';


export default class Oscillator {
	constructor(context) {

		this.context = context;

		this.osc = this.context.createOscillator();
		this.osc.start();

		this.modulated = this.context.createGain();
		this.modulated.gain.value = 1;

		this.volume = this.context.createGain();

		this.gate = this.context.createGain();
		this.gate.gain.value = 0; // note off (muted)


		this.input = this.osc;
		this.osc.connect(this.volume);
		this.volume.connect(this.modulated);
		this.modulated.connect(this.gate);
		this.output = this.gate;


		this.detune = 0;
		this.offset = 0;


		this.envelope = { // default
			attack: 	.005,
			decay: 		.1,
			sustain: 	.6,
			release: 	.1
		};
		this.easing = .006; // 6 msec easing
	}

	setFrequency = freq => {
		if (isFinite(freq)) {
			this.osc.frequency.setValueAtTime(freq, this.context.currentTime);
		};
	}

	setGain = value => this.volume.gain.value = value;

	setWavetype = type => this.osc.type = type;

	setDetune = value => {
		this.detune = value;
		this.osc.detune.setValueAtTime((this.offset + this.detune), this.context.currentTime);
	}

	setOffset = value => {
		this.offset = value * 100;
		this.osc.detune.setValueAtTime((this.offset + this.detune), this.context.currentTime);
	}

	setEnvelope = (paramName, value) => this.envelope[paramName] = value;	

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}

	disconnect = () => this.output.disconnect();

	play = () => {
		let now = this.context.currentTime;
		 // shorthand
		this.gate.gain.cancelScheduledValues(now);
		this.gate.gain.setValueAtTime(0, now + this.easing);
		this.gate.gain.linearRampToValueAtTime(1, now + this.envelope.attack + this.easing);
		this.gate.gain.linearRampToValueAtTime(
			this.envelope.sustain,
			now + this.envelope.attack + this.envelope.decay + this.easing
		);
	}
		 

	stop = () => {
		let now = this.context.currentTime;
		this.gate.gain.cancelScheduledValues(now);
		this.gate.gain.linearRampToValueAtTime(0, now + this.envelope.release + this.easing);
	};
};