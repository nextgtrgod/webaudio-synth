import { AudioContext as sAudioContext } from 'standardized-audio-context';

import Store from './Store'
import VCO from './VCO'
import VCF from './VCF'
import LFO from './LFO'
import VCA from './VCA'
import Delay from './Delay'
import Keyboard from './Keyboard'
import ControlItem from './ControlItem'
import Wires from './Wires'
import Visual from './Visual'

import { controlItems } from './_interfaceSettings';
import { defaultSettings as settings } from './_paramSettings';
import notes from './_notes';


export default class Synth {
	constructor() {

		try {
			this.context = window.webkitAudioContext
				? new sAudioContext()
				: new AudioContext()

			document.body.addEventListener('mousedown', this.resumeAudio)
			document.body.addEventListener('keydown', this.resumeAudio)
		}
		catch (e) {
			alert('Web Audio API is not supported in this browser');
			return;
		};

		this.store = new Store(settings);


		// creating controls
		this.controls = [];

		controlItems.map(item => {
			this.controls.push(
				new ControlItem(
					item,
					this.store.changeParam,
					this.store.subscribe // for wavetype list select highlighting
				)
			);
		});


		// creating filter 
		this.VCF = new VCF(this.context);
		['freq', 'qual'].map(paramName => {
			this.store.subscribe(
				`filter__${paramName}`,
				() => this.VCF.set(paramName, this.store.settings[`filter__${paramName}`])
			)
		});


		this.VCOs = {}
		Object.entries(notes).map(([ n, note ]) => {

			let newVCO = new VCO(this.context, note.name, this.VCF)

			// creating osclillators for every key(note)
			// and binding it with settings store
			Object.keys(newVCO.oscillators).forEach(oscName => {
				['gain', 'detune', 'wavetype', 'offset'].forEach(paramName => {
					this.store.subscribe(
						`${oscName}__${paramName}`,
						() => newVCO.set(
							oscName,
							paramName,
							this.store.settings[`${oscName}__${paramName}`]
						)
					)
				})
			})

			this.VCOs = Object.assign({}, this.VCOs, {
				[note.name]: newVCO
			})
		})

		// creating keyboard and bindings
		this.keyboard = new Keyboard(
			{ id: 'keyboard', startNote: 'C3' },
	
			(note, freq) => this.play(note, freq), // 'keyPressed' event callback
			
			(note, freq) => this.stop(note) // 'keyUp' event callback -> stop oscillators
		);
		this.store.subscribe(
			'options',
			() => this.keyboard.set('enabled', this.store.settings.options.keyboard)
		);


		// creating LFO modulator
		this.LFO = new LFO(
			this.context,
			{ VCOs: this.VCOs, VCF: this.VCF } // objects that will be modulated
		);
		['amount', 'freq', 'wavetype'].map(paramName => {
			this.store.subscribe(
				`lfo__${paramName}`,
				() => this.LFO.set(paramName, this.store.settings[`lfo__${paramName}`])
			)
		});
		// subscribe LFO for wires connection changes
		this.store.subscribe(
			'modulation',
			() => this.LFO.set('modulation', this.store.settings['modulation'])
		);


		// creating VCA (ADSR) modulator
		this.VCA = new VCA(
			this.context,
			{ VCOs: this.VCOs, VCF: this.VCF }
		);
		['attack', 'decay', 'sustain', 'release'].map(paramName => {
			this.store.subscribe(
				`${paramName}`,
				() => this.VCA.set(paramName, this.store.settings[`${paramName}`])
			)
		});
		this.store.subscribe(
			'modulation',
			() => this.VCA.set('modulation', this.store.settings['modulation'])
		);


		// creating delay
		this.Delay = new Delay(this.context);
		['gain', 'time', 'feedback', 'cutoff'].map(paramName => {
			this.store.subscribe(
				`delay__${paramName}`,
				() => this.Delay.set(paramName, this.store.settings[`delay__${paramName}`])
			)
		});


		// creating wires
		this.Wires = new Wires(
			this.store.settings.modulation, // default params
			this.store.changeParam
		)


		// creating visualization
		this.Visual = new Visual(this.context)
		this.store.subscribe(
			'options',
			() => this.Visual.set('visible', this.store.settings.options.visualization)
		)

	
		this.init()
	}

	init = () => {

		this.overallGain = this.context.createGain()
		this.overallGain.gain.value = .5

		// connections
		this.VCF.connect(this.Delay)
		this.VCF.connect(this.overallGain)
		this.Delay.connect(this.overallGain)
		this.overallGain.connect(this.Visual.input)
		this.Visual.connect(this.context.destination)

		document.body.classList.add('loaded')
	}

	play = (note, freq, velocity) => this.VCOs[note].play(freq, velocity)

	stop = note => this.VCOs[note].stop()

	resumeAudio = () => {
		if (this.context.state !== 'suspended') return

		this.context.resume().then(() => {
			console.log('Playback resumed successfully')
		})
	}
}