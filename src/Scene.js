import { Container } from 'pixi.js'

class Scene {
	constructor (...args) {
		this.container = new Container
		this.created = false

		this.application = null
		this.autoStart = false
		this.state = 'wait'

		this.init(...args)
	}

	init () {}

	stopScene () {
		this.state = 'stopped'

		this.container.removeChildren()
	}

	startScene () {
		this.state = 'started'
	}

	load () {}

	create () {}
	
	update () {}
}

export default Scene