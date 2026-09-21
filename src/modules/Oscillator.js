import { setParam } from './_helpers';


// one-shot oscillator: created on note on, stopped and dropped after release
export default class Oscillator {
	constructor(context, settings) {

		this.context = context;

		this.osc = this.context.createOscillator();

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


		this.detune = settings.detune;
		this.offset = settings.offset * 100;

		this.volume.gain.value = settings.gain;
		this.setWavetype(settings.wavetype);
		this.osc.detune.value = this.offset + this.detune;


		this.easing = .006; // 6 ms easing
	}

	setFrequency = freq => {
		if (isFinite(freq)) {
			this.osc.frequency.setValueAtTime(freq, this.context.currentTime);
		};
	}

	setGain = value => setParam(this.volume.gain, value, this.context);

	setWavetype = type => this.osc.type = type;

	setDetune = value => {
		this.detune = value;
		setParam(this.osc.detune, this.offset + this.detune, this.context);
	}

	setOffset = value => {
		this.offset = value * 100;
		setParam(this.osc.detune, this.offset + this.detune, this.context);
	}

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}

	disconnect = () => {
		this.osc.disconnect();
		this.volume.disconnect();
		this.modulated.disconnect();
		this.gate.disconnect();
	}

	play = envelope => {
		let now = this.context.currentTime;

		this.osc.start(now);

		this.envelope = {
			start: now,
			attack: Math.max(envelope.attack, this.easing),
			decay: envelope.decay,
			sustain: envelope.sustain,
		};
		this.release = null;

		let { attack, decay, sustain } = this.envelope;

		this.gate.gain.setValueAtTime(0, now);
		this.gate.gain.linearRampToValueAtTime(1, now + attack);
		this.gate.gain.linearRampToValueAtTime(sustain, now + attack + decay);
	}

	stop = envelope => this.fadeOut(Math.max(envelope.release, this.easing));

	choke = () => this.fadeOut(this.easing);

	fadeOut = duration => {
		let now = this.context.currentTime;
		let from = this.valueAt(now);
		let timeConstant = duration / 5;

		this.gate.gain.cancelScheduledValues(now);
		this.gate.gain.setValueAtTime(from, now);
		this.gate.gain.setTargetAtTime(0, now, timeConstant);

		this.release = { start: now, from, timeConstant };

		return now + duration * 1.5;
	}

	valueAt = time => {
		if (this.release) {
			let { start, from, timeConstant } = this.release;

			return from * Math.exp(-Math.max(time - start, 0) / timeConstant);
		}

		let { start, attack, decay, sustain } = this.envelope;
		let t = time - start;

		if (t <= 0) return 0;
		if (t < attack) return t / attack;
		if (t < attack + decay) return 1 + (sustain - 1) * (t - attack) / decay;

		return sustain;
	}

	kill = when => this.osc.stop(when);
};
