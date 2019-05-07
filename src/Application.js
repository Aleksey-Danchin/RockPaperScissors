import * as Pixi from 'pixi.js'

class Application {
	constructor (params) {
		this.lastTickMomemnt = Date.now()
		this.loader = new Pixi.Loader
		this.renderer = new Pixi.Renderer(params)
		this.container = new Pixi.Container
		this.ticker = new Pixi.Ticker

		this.createMomemnt = null

		this.scenesMap = new Map
		this.scenesSet = new Set
	}

	get scenes () {
		return Array.from(this.scenesSet)
	}

	get startedScenes () {
		return this.scenes.filter(scene => scene.state === 'started')
	}

	get runningScenes () {
		return this.scenes.filter(scene => scene.state === 'running')
	}

	startScene (sceneName) {
		this.scenesMap.get(sceneName).startScene()
	}

	stopScene (sceneName) {
		this.scenesMap.get(sceneName).stopScene()
	}

	addScene (name, scene) {
		if (this.scenesSet.has(scene)) {
			return resolve()
		}

		this.scenesMap.set(name, scene)
		this.scenesSet.add(scene)

		scene.application = this

		return this
	}

	async start () {
		const loading = () => new Promise(resolve => this.loader.load(resolve))
		const autoStartedScenes = this.scenes.filter(scene => scene.autoStart)

		this.createMomemnt = Date.now()

		for (const scene of this.scenes) {
			scene.load(this.loader)
			scene.state = 'loading'
		}

		await loading()

		for (const scene of this.scenes) {
			scene.state = 'loaded'
		}

		for (const scene of autoStartedScenes) {
			scene.state = 'started'
		}

		this.ticker.add(async () => {
			const startedScenes = this.startedScenes

			if (startedScenes.length) {
				await Promise.all(this.startedScenes.map(scene => scene.create(scene.container, this.loader, this.renderer)))

				for (const scene of startedScenes) {
					if (scene.state === 'started') {
						scene.state = 'created'						
					}
				}

				for (const scene of startedScenes) {
					if (scene.state === 'created') {
						scene.state = 'running'						
					}
				}
			}

			const nowMomemnt = Date.now()
			const duration = nowMomemnt - this.createMomemnt
			const delta = nowMomemnt - this.lastTickMomemnt
			this.lastTickMomemnt = nowMomemnt

			this.container.removeChildren()
			for (const scene of this.runningScenes) {
				scene.update(delta, duration)
				this.container.addChild(scene.container)
			}

			this.renderer.render(this.container)
		})

		this.ticker.start()
	}
}

export default Application