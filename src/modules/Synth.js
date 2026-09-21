import Store from './Store'
import VCO from './VCO'
import VCF from './VCF'
import LFO from './LFO'
import VCA from './VCA'
import Delay from './Delay'
import Limiter from './Limiter'
import Keyboard from './Keyboard'
import ControlItem from './ControlItem'
import Wires from './Wires'
import Visual from './Visual'

import { controlItems } from './_interfaceSettings';
import { defaultSettings as settings } from './_paramSettings';


export default class Synth {
	constructor() {

		try {
			this.context = new (window.AudioContext || window.webkitAudioContext)()

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



		this.voices = new Map() // note name -> voice
		this.releasingVoices = new Set()
		this.maxVoices = 16

		this.oscSettings = {}
		this.modulationInputs = {} // shared LFO input for each oscillator of every voice

		const oscNames = ['osc1', 'osc2', 'osc3']
		const oscParams = ['gain', 'detune', 'wavetype', 'offset']

		oscNames.forEach(oscName => {
			this.oscSettings[oscName] = {}

			this.modulationInputs[oscName] = this.context.createGain()

			oscParams.forEach(paramName => {
				this.store.subscribe(
					`${oscName}__${paramName}`,
					() => {
						let value = this.store.settings[`${oscName}__${paramName}`]

						this.oscSettings[oscName][paramName] = value
						this.forEachVoice(voice => voice.set(oscName, paramName, value))
					}
				)
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
			{ oscillators: this.modulationInputs, VCF: this.VCF } // objects that will be modulated
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
		this.VCA = new VCA(this.context);
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

		this.Limiter = new Limiter(this.context)

		// connections
		this.VCF.connect(this.Delay)
		this.VCF.connect(this.overallGain)
		this.Delay.connect(this.overallGain)
		this.overallGain.connect(this.Limiter.input)
		this.Limiter.connect(this.Visual)
		this.Visual.connect(this.context.destination)

		document.body.classList.add('loaded')
	}

	play = (note, freq, velocity) => {
		if (this.voices.has(note)) this.stop(note)

		this.stealVoices()

		let voice = new VCO(this.context, this.VCF, {
			freq,
			velocity,
			oscSettings: this.oscSettings,
			modulationInputs: this.modulationInputs,
			getEnvelope: this.VCA.getEnvelope,
		})

		voice.onended = () => this.releasingVoices.delete(voice)
		voice.play()

		this.voices.set(note, voice)
	}

	stop = note => {
		let voice = this.voices.get(note)

		if (!voice) return

		this.voices.delete(note)
		this.releasingVoices.add(voice)

		voice.stop()
	}

	stealVoices = () => {
		while (this.voices.size + this.releasingVoices.size >= this.maxVoices) {

			let [ voice ] = this.releasingVoices

			if (voice) {
				this.releasingVoices.delete(voice)
			} else {
				let [ note, oldest ] = this.voices.entries().next().value

				this.voices.delete(note)
				voice = oldest
			}

			voice.onended = null
			voice.choke()
		}
	}

	forEachVoice = callback => {
		this.voices.forEach(callback)
		this.releasingVoices.forEach(callback)
	}

	resumeAudio = () => {
		if (this.context.state !== 'suspended') return

		this.context.resume().then(() => {
			console.log('Playback resumed successfully')
		})
	}
}