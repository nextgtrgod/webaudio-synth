import { colors } from './_colors';

import QwertyHancock from 'qwerty-hancock';


export default class Keyboard {
	constructor(options, keyDownCallback, keyUpCallback) {

		this.defaultOptions = {
			id: 'keyboard',
			width: 664,
			height: 72,
			startNote: 'C3',
			octaves: 2,
			whiteKeyColour: 'rgba(38, 39, 47, 0.85)',
			blackKeyColour: '#A0FFFF',
			borderColour: '#A0FFFF',
			activeColour: '#FF6E19',
		};

		this.options = Object.assign({}, this.defaultOptions, options);

		this.keyDownCallback = keyDownCallback;
		this.keyUpCallback = keyUpCallback;

		this.init();
	}

	init = () => {
		this.keyboard = new QwertyHancock(this.options);

		this.keyboard.keyDown = (note, freq) => this.handleKeyDown(note, freq);
		this.keyboard.keyUp = (note, freq) => this.handleKeyUp(note, freq);
	}

	handleKeyDown = (note, freq) => {
		this.keyDownCallback(note, freq);
	}
	
	handleKeyUp = (note, freq) => {
		this.keyUpCallback(note, freq);
	}

	set = (paramName, value) => {
		if (value) {
			this.keyboard.keyDown = (note, freq) => this.handleKeyDown(note, freq);
			this.keyboard.keyUp = (note, freq) => this.handleKeyUp(note, freq);

			document.getElementById('keyboard').dataset['enabled'] = true;
			return;
		};
		this.keyboard.keyDown = (note, freq) => {};
		this.keyboard.keyUp = (note, freq) => {};

		document.getElementById('keyboard').dataset['enabled'] = false;
	}
}