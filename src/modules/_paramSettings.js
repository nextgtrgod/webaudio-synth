import { VENDOR } from './_helpers'

let defaultSettings = {
	// VCO
	'osc1__gain': 	.85,
	'osc1__detune': 10,
	'osc1__wavetype': 'sine',
	'osc1__offset':	7,

	'osc2__gain': 	.95,
	'osc2__detune': 0,
	'osc2__wavetype': 'sawtooth',
	'osc2__offset':	0,

	'osc3__gain': 	.8,
	'osc3__detune': -10,
	'osc3__wavetype': 'square',
	'osc3__offset':	-12,

	// VCF
	'filter__freq': 1560,
	'filter__qual': 6,

	// LFO
	'lfo__amount': .25,
	'lfo__freq': 1.25,
	'lfo__wavetype': 'sine',

	// VCA
	'attack': 	2.45,
	'decay': 	.1,
	'sustain': 	.6,
	'release': 	1.2,

	// Delay
	'delay__gain':		.2,
	'delay__time': 		.5,
	'delay__feedback': 	.1,
	'delay__cutoff': 	1000,

	// Modulation
	modulation: {
		'lfo__out-1': 'osc2',
		'lfo__out-3': 'filter',
		'vca__out-1': 'osc1',
		'vca__out-2': 'osc3',
	},
}

// try local storage saved settings
try {
	let savedSettings = JSON.parse(localStorage.getItem('synthSettings'))

	if (savedSettings) defaultSettings = savedSettings

} catch (error) {
	console.log('No saved setting found')
}

defaultSettings.options = {
	midi: !!navigator.requestMIDIAccess,
	keyboard: true,
	visualization: (VENDOR === 'any-chrome')
}

export { defaultSettings }
