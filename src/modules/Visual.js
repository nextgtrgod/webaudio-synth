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

			this.canvas.width = WIDTH
			this.canvas.height = HEIGHT

			sliceWidth = Math.round(WIDTH / this.bufferLength)
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

			// create many arcs
			for (let i = 0; i < this.bufferLength; i++) {

				ctx.beginPath();
				ctx.arc(
					WIDTH,
					CENTER.y,
					~~(circleRadius * (this.frequencyData[i] / 255)),
					circleAngle[i].startAngle,
					circleAngle[i].endAngle
				);
				ctx.lineWidth = 1;
				ctx.strokeStyle = `rgba(${this.colors.contrast}, 
										${this.frequencyData[i] / 255})`;
										
				ctx.stroke();

			};

		};


		let x
		let y

		const drawCurve = () => {

			ctx.beginPath()

			x = 0
			y = 0

			ctx.lineWidth = 1
			ctx.strokeStyle = `${colors.accent}`

			ctx.moveTo(0, CENTER.y)

			for (let i = 0; i < this.bufferLength; i++) {

				y = (sliceHeight * (this.timeDomainData[i] / 255) + offsetY)

				ctx.lineTo(x, y)

				x += sliceWidth
			}

			ctx.moveTo(WIDTH, CENTER.y)
			ctx.stroke()
			
		}


		const drawBars = () => {

			// direction
			let m = 1;

			for (let i = 0; i < this.bufferLength; i++) {

				ctx.beginPath();
				ctx.moveTo(WIDTH, (i * m) + CENTER.y);

				ctx.lineTo(
					WIDTH - this.frequencyData[i],
					(i * m) + CENTER.y
				);

				ctx.strokeStyle = `rgba(${this.colors.accent},
										${this.frequencyData[i] / 255})`;
				ctx.stroke();

				// change direction
				m *= -1;
			};

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