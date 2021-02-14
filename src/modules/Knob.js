import $ from 'jquery'
import knob from 'jquery-knob';
import { colors } from './_colors';


export default class Knob {
	constructor(id, options, defaultValue = 0, callback) {

		this.id = id || `new-knob-${~~(Math.random()* 100)}`;
		
		this.defaultOptions = {
			min:			1,
			max:			100,
			step:			1,
			width: 			'50%',
			bgColor:		colors.primary,
			fgColor:		colors.accent,
			thickness: 		.2,
			angleOffset: 	-125,
			angleArc:		250,
			displayInput:	false,
			font:			'Orbitron',
			fontSize:		10,
			cursor:			20,
			change: 		value => this.handleChange(value)
		};
		this.options = Object.assign({}, this.defaultOptions, options);
		
		this.callback = callback;

		this.defaultValue = defaultValue;

		this.init();
	}

	init = () => {
		
		let input = document.getElementById(this.id);

		if(!input) {
			let input = document.createElement('input');
			input.id = this.id;
			input.value = 1;
			document.body.appendChild(input);
		};

		let knobID = '#' + this.id;

		$(knobID).knob(this.options);
		$(knobID).val(this.defaultValue).trigger('change');
	}

	handleChange = (value) => {
		this.callback(this.id, value);
	}
};