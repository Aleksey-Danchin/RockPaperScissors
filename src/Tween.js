const Tween = {
	create (params) {
		params = Object.assign({
			duration: 1000,
			targets: [],
			properties: {},
			delay: 0,
			end: () => {}
		}, params)

		return new Promise(async (resolve, reject) => {
			const startMoment = Date.now()
			const flats = toFlats(params.properties)

			const objectsSet = new Set
			for (const target of params.targets) {
				for (const flat of flats) {
					let isExsist = true
					let startValue = target
					let finishValue = params.properties

					for (const field of flat) {
						if (startValue[field] === undefined) {
							isExsist = false
							break
						}

						startValue = startValue[field]
						finishValue = finishValue[field]
					}

					if (isExsist) {
						objectsSet.add([target, startValue, finishValue, ...flat])
					}
				}
			}

			await delay(params.delay)

			const interval = setInterval(() => {
				const timer = Date.now() - startMoment
				const percent = Math.min(1, timer / params.duration)

				for (const [target, startValue, finishValue, ...flat] of objectsSet.values()) {
					const field = flat.splice(-1)
					let subTarget = target

					for (let i = 0; i < flat.length; i++) {
						subTarget = target[flat[i]]
					}

					subTarget[field] = startValue + (finishValue - startValue) * percent
				}

				if (percent === 1) {
					resolve()
					params.end()
					clearInterval(interval)
				}
			})
		})

		function toFlats (obj) {
			const flats = []

			for (const key of Object.keys(obj)) {
				if (obj[key] instanceof Object) {
					for (const subFlat of toFlats(obj[key])) {
						flats.push([key, ...subFlat])
					}
				} else {
					flats.push([key])
				}
			}

			return flats
		}

		function delay (milliseconds) {
			return new Promise(resolve => setTimeout(resolve, milliseconds))
		}
	}
}

export default Tween