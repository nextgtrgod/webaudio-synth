
const knobSize = {
	small: 40,
	medium: 60,
	big: 90,
	huge: 110
};


const controlItems = [
	// VCO
	{
		type: 'knob',
		id: 'osc1__gain',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium
		}
	},
	{
		type: 'knob',
		id: 'osc1__detune',
		options: {
			width: knobSize.small,
			height: knobSize.small,
			min: -100,
			max: 100,
			step: 1,
			thickness: .3
		}
	},
	{
		type: 'list',
		id: 'osc1__wavetype'
	},
	{
		type: 'input',
		id: 'osc1__offset'
	},
	{
		type: 'knob',
		id: 'osc2__gain',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium
		},
	},
	{
		type: 'knob',
		id: 'osc2__detune',
		options: {
			width: knobSize.small,
			height: knobSize.small,
			min: -100,
			max: 100,
			step: 1,
			thickness: .3
		}
	},
	{
		type: 'list',
		id: 'osc2__wavetype'
	},
	{
		type: 'input',
		id: 'osc2__offset'
	},
	{
		type: 'knob',
		id: 'osc3__gain',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium
		}
	},
	{
		type: 'knob',
		id: 'osc3__detune',
		options: {
			width: knobSize.small,
			height: knobSize.small,
			min: -100,
			max: 100,
			step: 1,
			thickness: .3
		}
	},
	{
		type: 'list',
		id: 'osc3__wavetype'
	},
	{
		type: 'input',
		id: 'osc3__offset'
	},

	// VCF
	{
		type: 'knob',
		id: 'filter__freq',
		options: {
			min: 32,
			max: 7902,
			width: knobSize.big,
			height: knobSize.big,
			displayInput: true
		}
	},
	{
		type: 'knob',
		id: 'filter__qual',
		options: {
			min: 0,
			max: 10,
			step: .1,
			width: knobSize.small,
			height: knobSize.small,
			thickness: .3,
		}
	},

	// LFO
	{
		type: 'knob',
		id: 'lfo__amount',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium
		}
	},
	{
		type: 'knob',
		id: 'lfo__freq',
		options: {
			min: 0,
			max: 20,
			step: .05,
			width: knobSize.big,
			height: knobSize.big,
			displayInput: true,
		}
	},
	{
		type: 'list',
		id: 'lfo__wavetype'
	},

	// VCA (ADSR)
	{
		type: 'knob',
		id: 'attack',
		options: {
			min: 0,
			max: 4,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium,
			displayInput: true,
		}
	},
	{
		type: 'knob',
		id: 'decay',
		options: {
			min: 0,
			max: 4,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium,
			displayInput: true,
		}
	},
	{
		type: 'knob',
		id: 'sustain',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium,
			displayInput: true,
		}
	},
	{
		type: 'knob',
		id: 'release',
		options: {
			min: 0,
			max: 8,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium,
			displayInput: true,
		}
	},

	// Delay
	{
		type: 'knob',
		id: 'delay__gain',
		options: {
			min: 0,
			max: 1,
			step: .01,
			width: knobSize.medium,
			height: knobSize.medium
		}
	},
	{
		type: 'knob',
		id: 'delay__time',
		options: {
			min: 0,
			max: 5,
			step: .01,
			width: knobSize.big,
			height: knobSize.big,
			// displayInput: true,
		}
	},
	{
		type: 'knob',
		id: 'delay__feedback',
		options: {
			min: 0,
			max: .9,
			step: .01,
			thickness: .3,
			width: knobSize.small,
			height: knobSize.small
		}
	},
	{
		type: 'knob',
		id: 'delay__cutoff',
		options: {
			min: 30,
			max: 6000,
			step: 1,
			width: knobSize.medium,
			height: knobSize.medium,
			displayInput: true,
		}
	},

	{
		type: 'options',
		id: 'options'
	}
];


const modulationPorts = [
	// osc ports
	{
		name: 'osc1',
		type: 'in',
		pos: {
			x: 30,
			y: 330
		}
	},
	{
		name: 'osc2',
		type: 'in',
		pos: {
			x: 70,
			y: 330
		}
	},
	{
		name: 'osc3',
		type: 'in',
		pos: {
			x: 110,
			y: 330
		}
	},

	// filter ports
	{
		name: 'filter',
		type: 'in',
		pos: {
			x: 305,
			y: 150
		}
	},

	// lfo ports
	{
		name: 'lfo__out-1',
		type: 'out',
		pos: {
			x: 345,
			y: 330,
		}
	},
	{
		name: 'lfo__out-2',
		type: 'out',
		pos: {
			x: 375,
			y: 330,
		}
	},
	{
		name: 'lfo__out-3',
		type: 'out',
		pos: {
			x: 405,
			y: 330,
		}
	},
	{
		name: 'lfo__out-4',
		type: 'out',
		pos: {
			x: 435,
			y: 330,
		}
	},
	{
		name: 'lfo__out-5',
		type: 'out',
		pos: {
			x: 465,
			y: 330,
		}
	},

	// vca ports
	{
		name: 'vca__out-1',
		type: 'out',
		pos: {
			x: 510,
			y: 330,
		}
	},
	{
		name: 'vca__out-2',
		type: 'out',
		pos: {
			x: 540,
			y: 330,
		}
	},
	{
		name: 'vca__out-3',
		type: 'out',
		pos: {
			x: 570,
			y: 330,
		}
	},
	{
		name: 'vca__out-4',
		type: 'out',
		pos: {
			x: 600,
			y: 330,
		}
	},
	{
		name: 'vca__out-5',
		type: 'out',
		pos: {
			x: 630,
			y: 330,
		}
	}
];


export {
	controlItems,
	modulationPorts
};