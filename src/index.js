import { Application, Button, Scene, Pixi, Tween } from './OwnPixi'
import { Howl, Howler } from 'howler'

import GameScene from './GameScene'
import MainScene from './MainScene'
import LaunchScene from './LaunchScene'
import ResultScene from './ResultScene'

const app = new Application({
	view: document.querySelector('canvas'),
	// width: window.innerWidth,
	// height: window.innerHeight,
	width: 300,
	height: 500,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	backgroundColor: 0x1099bb
})

app.addScene('LaunchScene', new LaunchScene)
app.addScene('MainScene', new MainScene)
app.addScene('GameScene', new GameScene)
app.addScene('ResultScene', new ResultScene)

app.start()