import { colors } from './_colors';
import { getRandom, convertColor } from './_helpers';
import { defaultSettings as settings } from './_paramSettings';


export default class Visual {
	constructor(context) {

		this.context = context;

		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 512;
		this.analyser.maxDecibels = 0;
		this.bufferLength = this.analyser.frequencyBinCount;

		this.frequencyData = new Uint8Array(this.bufferLength);
		this.timeDomainData = new Uint8Array(this.bufferLength)

		this.input = this.analyser;
		this.output = this.analyser;

		this.init();
	}

	init = () => {

		this.canvas = document.getElementById('visual');

		const ctx = this.canvas.getContext('2d');

		ctx.lineWidth = 1;

		let WIDTH
		let HEIGHT
		let CENTER = {}

		let sliceWidth
		let sliceHeight
		let offsetY

		const getViewportSize = () => {
			WIDTH = window.innerWidth
			HEIGHT = window.innerHeight
			CENTER = {
				x: WIDTH / 2,
				y: HEIGHT / 2,
			}

			let dpr = Math.min(window.devicePixelRatio || 1, 2)

			this.canvas.width = WIDTH * dpr
			this.canvas.height = HEIGHT * dpr
			this.canvas.style.width = `${WIDTH}px`
			this.canvas.style.height = `${HEIGHT}px`

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

			sliceWidth = WIDTH / (this.bufferLength - 1)
			sliceHeight = Math.round(HEIGHT / 8)
			offsetY = CENTER.y - sliceHeight / 2
		};
		getViewportSize()

		this.colors = {
			accent: convertColor(colors.accent).toDec(),
			contrast: convertColor(colors.contrast).toDec(),
		}

		window.addEventListener('resize', () => getViewportSize())


		const circleRadius = (HEIGHT)

		// create arcs angles
		let circleAngle = []

		for (let i = 0; i <= this.analyser.frequencyBinCount; i++) {
			let newCircleParams = {
				startAngle: getRandom(-2 * Math.PI, 2 * Math.PI),
				endAngle: getRandom(-2 * Math.PI, 2 * Math.PI),
			}
			circleAngle.push(newCircleParams)
		}


		// draw functions
		const drawArcs = () => {

			ctx.strokeStyle = `rgb(${this.colors.contrast})`;

			// create many arcs
			for (let i = 0; i < this.bufferLength; i++) {

				let value = this.frequencyData[i];

				if (value === 0) continue;

				ctx.globalAlpha = value / 255;

				ctx.beginPath();
				ctx.arc(
					WIDTH,
					CENTER.y,
					~~(circleRadius * (value / 255)),
					circleAngle[i].startAngle,
					circleAngle[i].endAngle
				);
				ctx.stroke();

			};

			ctx.globalAlpha = 1;

		};


		let x
		let y

		const drawCurve = () => {

			ctx.beginPath()

			x = 0
			y = 0

			ctx.strokeStyle = colors.accent

			ctx.moveTo(0, CENTER.y)

			for (let i = 0; i < this.bufferLength; i++) {

				y = (sliceHeight * (this.timeDomainData[i] / 255) + offsetY)

				ctx.lineTo(x, y)

				x += sliceWidth
			}

			ctx.stroke()
			
		}


		const drawBars = () => {

			ctx.strokeStyle = `rgb(${this.colors.accent})`;

			// direction
			let m = 1;

			for (let i = 0; i < this.bufferLength; i++) {

				let value = this.frequencyData[i];

				if (value !== 0) {

					ctx.globalAlpha = value / 255;

					ctx.beginPath();
					ctx.moveTo(WIDTH, (i * m) + CENTER.y);

					ctx.lineTo(
						WIDTH - value,
						(i * m) + CENTER.y
					);

					ctx.stroke();
				}

				// change direction
				m *= -1;
			};

			ctx.globalAlpha = 1;

		};

		this.render = () => {

			// clear previous drawings
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			this.analyser.getByteFrequencyData(this.frequencyData);
			this.analyser.getByteTimeDomainData(this.timeDomainData);

			drawArcs();
			drawCurve();
			drawBars();

			this.requestAnimID = requestAnimationFrame(this.render);
		}

	}

	set = (paramName, value) => {
		if (value) {
			this.render()
			document.getElementById('visual').dataset['visible'] = true
			return
		}

		cancelAnimationFrame(this.requestAnimID);
		document.getElementById('visual').dataset['visible'] = false
	}

	connect = node => {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	}
}