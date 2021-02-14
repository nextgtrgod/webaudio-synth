import './styles/main.scss'

import Synth from './modules/Synth'
import MIDI from './modules/MIDI'

const synth = new Synth()
const midi = new MIDI(synth)

synth.store.subscribe(
	'options',
	() => midi.set(synth.store.settings.options.midi)
)

console.log(synth)
