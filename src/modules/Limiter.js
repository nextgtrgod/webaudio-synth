
export default class Limiter {
	constructor(context) {

		this.context = context;

		this.compressor = this.context.createDynamicsCompressor();
		this.compressor.threshold.value = -10;
		this.compressor.knee.value = 6;
		this.compressor.ratio.value = 12;
		this.compressor.attack.value = .003;
		this.compressor.release.value = .25;

		this.drive = this.context.createGain();
		this.drive.gain.value = 1 / this.range;

		this.clipper = this.context.createWaveShaper();
		this.clipper.curve = this.createCurve();
		this.clipper.oversample = '2x';

		this.compressor.connect(this.drive);
		this.drive.connect(this.clipper);

		this.input = this.compressor;
		this.output = this.clipper;
	}

	range = 2;

	createCurve = (threshold = .8, length = 4096) => {
		let curve = new Float32Array(length);

		for (let i = 0; i < length; i++) {
			let x = (i / (length - 1) * 2 - 1) * this.range;
			let abs = Math.abs(x);

			let y = abs <= threshold
				? abs
				: threshold + (1 - threshold) * Math.tanh((abs - threshold) / (1 - threshold));

			curve[i] = Math.sign(x) * y;
		}

		return curve;
	}

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}
}
