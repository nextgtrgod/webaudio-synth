
class Events {
	eList = {}

	on = (name, cb) => {
		if (this.eList[name]) return this.eList[name].push(cb)

		this.eList[name] = []
		this.eList[name].push(cb)
	}

	emit = (name, payload = {}) => {

		if (!this.eList[name]) return

		this.eList[name].map(cb => cb(payload))
	}

	off = (name, offCb) => {
		if (!this.eList[name]) return

		this.eList[name] = this.eList[name].filter(cb => cb !== offCb)
	}
}

let events = new Events()

export default events
