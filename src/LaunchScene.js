import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'

class LaunchScene extends Scene {
	init () {
		// this.autoStart = true
	}

	create (container, loader, renderer) {
		this.stopScene()
		this.application.startScene('MainScene')
	}
}

export default LaunchScene