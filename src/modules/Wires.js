import { colors } from './_colors';
import { modulationPorts } from './_interfaceSettings';
import { defaultSettings } from './_paramSettings';


export default class Wires {
	constructor(defaultSettings, changeStoreParam) {

		this.modulationSettings = defaultSettings;
		this.changeStoreParam = changeStoreParam;

		this.init();
	}

	init = () => {

		this.wires = [];

		this.canvas = document.getElementById('wires');

		// drawing functions
		this.canvas.drawCircle = (x, y, R = 5, opacity = 1) => {
			const ctx = this.canvas.getContext('2d');
			ctx.beginPath();
	
			ctx.arc(x, y, R, 0, 2*Math.PI);
			ctx.lineWidth = 6;
			ctx.strokeStyle = '#111111';
			ctx.globalAlpha = opacity;
			ctx.stroke();

			ctx.lineWidth = 5;
			ctx.strokeStyle = colors.accent;
			ctx.stroke();
		};

		this.canvas.drawCurve = (startPoint, endPoint) => {
			const ctx = this.canvas.getContext('2d');

			ctx.beginPath();
			ctx.moveTo(startPoint.x, startPoint.y);

			let controlPoint = {
				x: (startPoint.x + endPoint.x) / 2,
				y: (startPoint.y + endPoint.y),
			};

			ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
			ctx.lineWidth = 6;
			ctx.lineCap = 'round';
			ctx.strokeStyle = '#111111';
			ctx.globalAlpha = 1;
			ctx.stroke();

			ctx.lineWidth = 4;
			ctx.strokeStyle = colors.accent;
			ctx.stroke();
		};


		const bodyDOM = document.querySelector('body');
		let onDrawingCurve = false; // curve drawing state
		let highlightPortType;		// for fading port port with same type
		let mousePos 	= {};
		let port 		= {};
		let startPort 	= {}; 
		let endPort 	= {};

		let selectedPort = {};
		let loopID;


		// draw ports
		const drawPorts = (startPort) => {

			modulationPorts.map(port => {
				let portOpacity;

				if (startPort.type) {
					portOpacity = (startPort.type !== port.type || startPort.name === port.name) ? 1 : .5;
				} else {
					portOpacity = 1;
				};

				this.canvas.drawCircle(
					port.pos.x,
					port.pos.y,
					4,
					portOpacity
				);
			});
		};

		const drawWires = () => {

			Object.keys(this.modulationSettings).map(key => {
				this.canvas.drawCurve(
					(modulationPorts.find(item => item.name === key)).pos,
					(modulationPorts.find(item => item.name === this.modulationSettings[key])).pos
				);
			});

		};

		const detectPort = (easing = 10) => {
			let detectedPort;

			modulationPorts.map(port => {
				if ( (mousePos.x >= (port.pos.x - easing)) && (mousePos.x <= (port.pos.x + easing)) ) {
					if ( (mousePos.y >= (port.pos.y - easing)) && (mousePos.y <= (port.pos.y + easing)) ) {
						detectedPort = port;
						return;
					}	
				};
			});

			return detectedPort;
		};

		const checkPort = (port) => {
			let keys = Object.keys(this.modulationSettings);
			switch (port.type) {
				case 'out':
					for (let i = 0; i < keys.length; i++) {
						if (keys[i] === port.name) {
							return {
								[keys[i]]: this.modulationSettings[keys[i]]
							};
						};
					};
					break;
				case 'in':
					for (let i = 0; i < keys.length; i++) {
						if (this.modulationSettings[keys[i]] === port.name) {
							return {
								[keys[i]]: this.modulationSettings[keys[i]]
							};
						};
					};
					break;
			}
		};

		// mouse events
		this.canvas.addEventListener('mousemove', event => {
			mousePos.x = event.offsetX;
			mousePos.y = event.offsetY;
		});	

		this.canvas.addEventListener('mousedown', event => {
			
			port = detectPort();

			if (port) { // if this is a port, not random place on canvas
				redraw(true);
				bodyDOM.classList.add('on-wires-drawing');
				startPort = {};
				endPort   = {}; // clear previous

				let portInUse = checkPort(port);

				if (portInUse) {

					let key = Object.keys(portInUse)[0];

					switch (port.type) {
						case 'in':
							startPort = modulationPorts.find(item => item.name === key);
							break;
						case 'out':
							startPort = modulationPorts.find(item => item.name === portInUse[key]);
					};

					delete this.modulationSettings[key]; // delete that connection
					this.changeStoreParam('modulation', this.modulationSettings); // update in store

				} else {
					startPort = modulationPorts.find(item => item.name === port.name);
				}

			};
		});

		this.canvas.addEventListener('mouseup', event => {

			port = detectPort();

			if (port) {

				if (checkPort(port)) {
					endDraw();
					return;
				};

				endPort = modulationPorts.find(item => item.name === port.name)

				// add new wire
				if ( (startPort.pos && endPort.pos) && (startPort.type !== endPort.type) ) {
	
					switch (startPort.type) { // sort to { out: in }
						case 'out':
							this.modulationSettings[startPort.name] = endPort.name;
							break;
						case 'in':
							this.modulationSettings[endPort.name] = startPort.name;
							break;
					};

					this.changeStoreParam('modulation', this.modulationSettings); // update store

				};

			};

			endDraw();
		});


		const endDraw = () => {
			onDrawingCurve = false;
	
			bodyDOM.classList.remove('on-wires-drawing');
			port = {};
			startPort = {};
			endPort = {};
	
			window.cancelAnimationFrame(loopID);
			redraw(false); // call once
		};

		const redraw = (loopRedraw = false) => {

			const ctx = this.canvas.getContext('2d');

			// clear previous drawings
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			drawPorts(startPort);
			drawWires();

			if (loopRedraw) {
				// draw new wire
				this.canvas.drawCurve(
					startPort.pos ? startPort.pos : mousePos,
					endPort.pos   ?  endPort.pos  : mousePos
				);
				
				loopID = window.requestAnimationFrame(redraw);
			}
		};
		redraw(); // call for first draw
		

	}
}