
let notes = {
	21: { name: 'A0',  freq: 27.5000000000 },
	22: { name: 'A#0', freq: 29.1352350949 },
	23: { name: 'B0',  freq: 30.8677063285 },

	24: { name: 'C1',  freq: 32.7031956626 },
	25: { name: 'C#1', freq: 34.6478288721 },
	26: { name: 'D1',  freq: 36.7080959897 },
	27: { name: 'D#1', freq: 38.8908729653 },
	28: { name: 'E1',  freq: 41.2034446141 },
	29: { name: 'F1',  freq: 43.6535289291 },
	30: { name: 'F#1', freq: 46.2493028390 },
	31: { name: 'G1',  freq: 48.9994294977 },
	32: { name: 'G#1', freq: 51.9130871975 },
	33: { name: 'A1',  freq: 55.0000000000 },
	34: { name: 'A#1', freq: 58.2704701898 },
	35: { name: 'B1',  freq: 61.7354126570 },
}


// create other octaves
for (let i = 24; i < 128; i++) {
	notes[i + 12] = {
		name: notes[i].name.slice(0, -1) + (~~(i / 12)),
		freq: notes[i].freq * 2,
	}
}

export default notes
