import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'

class ResultScene extends Scene {
	init () {
		// this.autoStart = true
	}

	create (container, loader, renderer) {
		console.log(this.startData)
	}
}

export default ResultScene