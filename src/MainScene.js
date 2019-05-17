import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'

class MainScene extends Scene {
	load (loader) {
		loader.add('buttonPlay', 'assets/images/buttonPlay.png')
	}

	create (container, loader, renderer) {
		this.buttonPlay = new Pixi.Sprite(loader.resources.buttonPlay.texture)
		this.buttonPlay.interactive = true
		this.buttonPlay.buttonMode = true
		this.buttonPlay.anchor.set(0.5)
		this.buttonPlay.position.set(renderer.width / 2, renderer.height / 2)

		this.buttonPlay.on('click', () => {
			this.stopScene()
			this.application.startScene('GameScene')
		})

		container.addChild(this.buttonPlay)
	}
}

export default MainScene