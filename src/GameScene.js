import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'

import Arrow from './Arrow'

class GameScene extends Scene {
	init () {
		this.autoStart = true

		this.score = 0
		this.circleReplaceMomemnt = Date.now()
		this.canSelect = true
		this.canShuffle = true

		this.scoreText = null
		this.arrowTop = null
		this.arrowLeft = null
		this.arrowRight = null
		this.currentObject = null
		this.topObject = null
		this.leftObject = null
		this.rightObject = null

		this.container.sortableChildren = true
		this.timer = null
		this.time = null
	}

	load (loader) {
		loader.add('arrow', 'assets/images/arrow.png')
		loader.add('paper', 'assets/images/paper.png')
		loader.add('rock', 'assets/images/rock.png')
		loader.add('scissors', 'assets/images/scissors.png')
	}

	create (container, loader, renderer) {
		const arrowTexture = loader.resources.arrow.texture

		this.scoreText = new Pixi.Text('Score: 0', { fill: 'white' })
		this.scoreText.anchor.set(1, 0)
		this.scoreText.position.set(renderer.width - 10, 10)
		container.addChild(this.scoreText)

		this.arrowTop = new Arrow(arrowTexture, renderer.width / 2, renderer.height / 2 - 70, Math.PI)
		this.arrowTop.on('click', () => this.arrowClickHandler('top'))
		container.addChild(this.arrowTop)

		this.arrowLeft = new Arrow(arrowTexture, renderer.width / 2 - 50, renderer.height / 2 + 60, Math.PI * 0.15)
		this.arrowLeft.on('click', () => this.arrowClickHandler('left'))
		container.addChild(this.arrowLeft)

		this.arrowRight = new Arrow(arrowTexture, renderer.width / 2 + 50, renderer.height / 2 + 60, -Math.PI * 0.15)
		this.arrowRight.on('click', () => this.arrowClickHandler('right'))
		container.addChild(this.arrowRight)

		this.addCurrentObject()

		this.time = 2000
		this.timer = new Pixi.Text(`${parseInt(this.time / 1000)} sec.`, { fill: 'white' })
		this.timer.anchor.set(0, 0)
		this.timer.position.set(10, 10)
		container.addChild(this.timer)

		// this.selectAll('arrow')
		// 	.data([1, 2, 3, 4, 5])
		// 	.enter()
		// 		.append(Arrow)
		// 		.attr('x', d => d)
		// 		.attr('x', d => d)

		// this.selectAll('arrow')
		// 	.data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		// 	.create()
		// 		.append(Arrow)
		// 		.attr('x', d => x)
		// 	.update()
		// 		.attr('y', d => y)

		// this.selectAll('arrow')
		// 	.data([1, 2, 3])
		// 	.update()
		// 		.attr('x', d => x)
		// 	.remove()
		// 		.tween({
		// 			fields: ['x'],
		// 			value: 0
		// 		})


		// this.objects
		// 	.for('arrow')
		// 	.data([1, 2, 3, 4, 5])
		// 	.update()
		// 		.attr('x', d => d)
		// 		.attr('y', d => d)
		// 	.create()
		// 	.remove()
	}

	update (delta) {
		this.time = Math.max(0, this.time - delta)
		this.timer.text = `${parseInt(this.time / 1000)} sec.`

		if (!this.topObject || !this.leftObject || !this.rightObject) {
			this.circleReplaceMomemnt = false
		}

		else if (this.circleReplaceMomemnt === false) {
			this.circleReplaceMomemnt = 0
		}

		else {
			this.circleReplaceMomemnt += delta
		}

		if (this.circleReplaceMomemnt > 1000 && this.canShuffle) {
			this.circleReplaceMomemnt = 0
			this.circleReplace()
		}

		if (this.time === 0) {
			this.end()
		}
	}

	end () {
		this.stopScene()
		this.application.startScene('ResultScene', this.score)
	}

	circleReplace () {
		this.canSelect = false

		const order = [this.topObject, this.leftObject, this.rightObject, this.topObject, this.leftObject, this.rightObject]
		const direct = Math.random() > Math.random() ? 1 : -1
		const tweens = []

		for (let i = 1; i <= 3; i++) {
			const tween = Tween.create({
				targets: [order[i]],
				duration: 200,
				properties: {
					x: order[i + direct].x,
					y: order[i + direct].y,
				}
			})

			tweens.push(tween)
		}

		this.leftObject = order[1 - direct]
		this.rightObject = order[2 - direct]
		this.topObject = order[3 - direct]

		Promise.all(tweens)
			.then(() => this.canSelect = true)
	}

	addCurrentObject () {
		const type = ['paper', 'rock', 'scissors'][Math.floor(Math.random() * 3)]
		this.currentObject = new Pixi.Sprite(this.application.loader.resources[type].texture)
		this.currentObject.position.set(this.application.renderer.width / 2, this.application.renderer.height / 2)
		this.currentObject.anchor.set(0.5)
		this.currentObject.type = type
		this.container.addChild(this.currentObject)
	}

	async arrowClickHandler (direct) {
		if (!this.currentObject || !this.canSelect) {
			return
		}

		this.canShuffle = false

		let newX = 0
		let newY = 0

		if (direct === 'left') {
			direct = 'leftObject'
			newX = 50
			newY = 400
		} else if (direct === 'right') {
			direct = 'rightObject'
			newX = this.application.renderer.width - 50
			newY = 400
		} else {
			direct = 'topObject'
			newX = this.currentObject.x
			newY = 100
		}

		if (this[direct]) {
			const isRightAnswer = this[direct].type === 'scissors' && this.currentObject.type === 'rock'
				|| this[direct].type === 'rock' && this.currentObject.type === 'paper'
				|| this[direct].type === 'paper' && this.currentObject.type === 'scissors'

			isRightAnswer ? this.rightAnswer() : this.wrongAnswer()

			await Tween.create({
				targets: [this.currentObject],
				duration: 250,
				properties: {
					x: newX,
					y: newY
				}
			})

			await Tween.create({
				targets: [this[direct], this.currentObject],
				duration: 100,
				properties: {
					alpha: 0
				}
			})

			this.container.removeChild(this[direct], this.currentObject)
			this[direct] = null
			this.currentObject = null

			this.addCurrentObject()

			return this.canShuffle = true
		}

		this[direct] = this.currentObject
		this.currentObject = null

		Tween.create({
			targets: [this[direct]],
			duration: 250,
			properties: {
				x: newX,
				y: newY
			},
			end: () => this.addCurrentObject()
		})

		this.canShuffle = true
	}

	rightAnswer () {
		this.score += 25
		this.scoreText.text = `Score: ${this.score}`
		this.time = Math.min(this.time + 1000, 20000)
	}

	wrongAnswer () {
		this.score = Math.max(this.score - 10, 0)
		this.scoreText.text = `Score: ${this.score}`
	}
}

export default GameScene