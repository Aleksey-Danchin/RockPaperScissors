import { Sprite } from 'pixi.js'

class Button extends Sprite {
	constructor (...args) {
		super(...args)

		this.interactive = true
		this.buttonMode = true

		this.on('pointerupuoutside', (...args) => this.pointerUpuOutsideHandler(...args))
		this.on('pointermove', (...args) => this.pointerMoveHandler(...args))
		this.on('pointerdown', (...args) => this.pointerDownHandler(...args))
		this.on('pointerup', (...args) => this.pointerUpHandler(...args))

		this.on('mouseover', (...args) => this.mouseOverHandler(...args))
		this.on('mouseout', (...args) => this.mouseOutHandler(...args))
	}

	pointerDownHandler (event) {}
	pointerUpHandler (event) {}
	pointerUpuOutsideHandler (event) {}
	pointerMoveHandler (event) {}

	mouseOverHandler (event) {}
	mouseOutHandler (event) {}
}

export default Button