import notes from './_notes'

export default class MIDI {
	constructor(synth) {
		this.synth = synth
		this.enable = false

		this.init()
	}

	init() {
		if (navigator.requestMIDIAccess) {
			console.log('This browser supports MIDI')

			navigator.requestMIDIAccess()
				.then(
					midiAccess => {
						for (let input of midiAccess.inputs.values()) {
							input.onmidimessage = this.getMessage
						}
					},
					() => console.log('Could not access your MIDI devices'),
				)
		} else {
			console.log('MIDI is not supported in this browser')

			let midiOption = document.querySelector('li[data-option="midi"]')

			midiOption.parentNode.removeChild(midiOption)
		}
	}

	set(value) {
		this.enable = value
	}

	getMessage = message => {
		if (!this.enable) return

		let command = message.data[0]
		let note = notes[ message.data[1] ]
		let velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

		if (!note) return

		({
			144: () => {
				if (velocity > 0) {
					// this.synth.resumeAudio()

					this.synth.play(note.name, note.freq, velocity)

				} else this.synth.stop(note.name)
			},

			128: () => this.synth.stop(note.name),

		})[command]()
	}
}