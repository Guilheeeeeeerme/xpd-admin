namespace worker.d3.dmec {

	const ctx: Worker = self as any;

	ctx.addEventListener('message', (event) => {
		const data = event.data;

		try {
			data.zoomStartAt = new Date(data.zoomStartAt).getTime();
			data.zoomEndAt = new Date(data.zoomEndAt).getTime();
		} catch (error) {
			console.error(error);
		}

		const exclude = (point) => {
			return point.x >= data.zoomStartAt && point.x <= data.zoomEndAt;
		};

		const overflowPoints = (tracks, points) => {

			const result = {};

			tracks.map((track) => {
				try {
					points[track.param] = points[track.param].filter(exclude);
					result[track.param] = handleOverflow(points[track.param], track);
				} catch (error) {
					// faça nada
				}
			});

			return result;
		};

		const handleOverflow = (points, track) => {

			const result = [];
			let distance = 0;
			let lastPoint = null;

			distance = Math.abs(track.max - track.min);

			points.map((point) => {

				const empty = {
					x: point.x,
					y: null,
					actual: null,
				};

				if (point.y != null) {

					point.overflow = 0;
					let tempPoint = null;

					while (point.y < track.min) {
						tempPoint = JSON.parse(JSON.stringify(point));
						point.overflow++;
						point.y += distance;
					}

					while (point.y > track.max) {
						tempPoint = JSON.parse(JSON.stringify(point));
						point.overflow--;
						point.y -= distance;
					}

					if (lastPoint != null && lastPoint.overflow !== point.overflow) {
						if (tempPoint) {
							result.push(tempPoint);
						}
						result.push(empty);
					}

					lastPoint = point;

				} else {
					lastPoint = null;
				}

				result.push(point);

			});

			return result;
		};

		const getParamPointAVL = (timestamp, param, oldPoints, newPoints) => {

			return new Promise((resolve, reject) => {

				let points = [];

				if (newPoints &&
					newPoints[param] &&
					newPoints[param].length) {

					points = newPoints[param];

				}

				if (oldPoints &&
					oldPoints[param] &&
					oldPoints[param].length) {

					points = [...oldPoints[param], ...points];
				}

				while (points && points.length > 1) {

					const half = Math.ceil(points.length / 2);

					const firstHalf = points.slice(0, half);
					const lastHalf = points.slice(-1 * half);

					if (lastHalf &&
						lastHalf.length &&
						timestamp > lastHalf[0].x) {

						points = lastHalf;

					} else {
						points = firstHalf;
					}

				}

				resolve({
					param: param,
					point: points[0] || null,
				});

			});

		};

		const readingsToPoints = (readings, tracks) => {
			const points = {};

			const preparePoints = (reading) => {

				const convertToXY = (track) => {

					const xyPoint = {
						x: reading.timestamp,
						y: reading[track.param] || null,
						actual: reading[track.param] || null,
					};

					if (!points[track.param]) {
						points[track.param] = [];
					}

					// points[track.param].push(xyPoint);

					if (points[track.param].length >= 2 &&
						points[track.param][points[track.param].length - 1].y === xyPoint.y &&
						points[track.param][points[track.param].length - 2].y === xyPoint.y) {
						points[track.param][points[track.param].length - 1] = xyPoint;
					} else {
						points[track.param].push(xyPoint);
					}

				};

				tracks.map(convertToXY);

			};

			readings.map(preparePoints);

			return points;

		};

		switch (data.cmd) {
			case 'find-point-avl':
				getParamPointAVL(data.timestamp, data.param, data.oldPoints, data.newPoints).then((point) => {
					ctx.postMessage({
						cmd: data.cmd,
						point: point,
						param: data.param,
					});
				});
				break;
			case 'handle-overflow':
				ctx.postMessage({
					cmd: data.cmd,
					trackName: data.trackName,
					points: overflowPoints(data.tracks, data.points),
				});
				break;
			case 'reading-to-points':

				data.readings = data.readings.filter((reading) => {
					return reading.timestamp >= data.zoomStartAt && reading.timestamp <= data.zoomEndAt;
				});

				ctx.postMessage({
					cmd: data.cmd,
					points: readingsToPoints(data.readings, data.tracks),
				});
				break;
			default:
				console.log('[Worker] Unable to handle ', data);
				break;

		}

	}, false);

}
