import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'

class Arrow extends Pixi.Sprite {
	constructor (texture, x, y, rotation) {
		super(texture)

		this.zIndex = 12
		this.anchor.set(0.5)
		this.scale.set(1.4)
		this.position.set(x, y)
		this.rotation = rotation
		this.interactive = true
		this.buttonMode = true
	}
}

export default Arrow