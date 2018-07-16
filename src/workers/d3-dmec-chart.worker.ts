namespace worker.d3.dmec {

const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
	const data = event.data;

	// var threadId = getRandomArbitrary(0, 1000) + ' ' + data.cmd;
	// var startTime = new Date().getTime();
	// console.log('%s começou', threadId);

	switch (data.cmd) {

		case 'find-point':
			getPoint(data.timestamp, data.tracks, data.oldPoints, data.newPoints).then(function (points) {
				ctx.postMessage({
					cmd: data.cmd,
					points: points,
				});
			});
			break;
		case 'find-point-avl':
			getParamPointAVL(data.timestamp, data.param, data.oldPoints, data.newPoints).then(function (point) {
				ctx.postMessage({
					cmd: data.cmd,
					point: point,
					param: data.param,
				});
			});
			break;
		case 'find-point-linear':
			getParamPointLinear(data.timestamp, data.param, data.oldPoints, data.newPoints).then(function (point) {
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
			ctx.postMessage({
				cmd: data.cmd,
				points: readingsToPoints(data.readings, data.tracks),
			});
			break;
		default:
			console.log('[Worker] Unable to handle ', data);
			break;

	}

	// var endTime = new Date().getTime();
	// console.log('%s terminou [%s ms]', threadId, (endTime - startTime));

	function getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function overflowPoints(tracks, points) {

		const result = {};

		tracks.map(function (track) {
			result[track.param] = handleOverflow(points[track.param], track);
		});

		return result;
	}

	function handleOverflow(points, track) {

		const result = [];
		let distance = 0;
		let lastPoint = null;

		distance = Math.abs(track.max - track.min);

		points.map(function (point) {

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
	}

	function getPoint(timestamp, tracks, oldPoints, newPoints) {

		const promises = [];

		tracks.map(function (track) {
			promises.push(getParamPointAVL(timestamp, track.param, oldPoints, newPoints));
			// promises.push(getParamPointLinear(timestamp, track.param, oldPoints, newPoints));
		});

		return new Promise(function (resolve, reject) {

			Promise.all(promises).then(function (top) {

				const reading = {};

				for (const i in top) {
					reading[top[i].param] = top[i].point;
				}

				resolve(reading);

			});

		});

	}

	function getParamPointAVL(timestamp, param, oldPoints, newPoints) {

		return new Promise(function (resolve, reject) {

			let points = [];

			if (newPoints &&
				newPoints[param] &&
				newPoints[param].length &&
				timestamp >= newPoints[param][0].x) {

				points = newPoints[param];

			} else {
				if (oldPoints &&
					oldPoints[param] &&
					oldPoints[param].length) {

					points = oldPoints[param];
				}
			}

			while (points && points.length > 1) {

				const half = Math.ceil(points.length / 2);

				const firstHalf = points.slice(0, half);
				const lastHalf = points.slice(-1 * half);

				if (lastHalf &&
					lastHalf.length &&
					timestamp >= lastHalf[0].x) {

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

	}

	function getParamPointLinear(timestamp, param, oldPoints, newPoints) {

		return new Promise(function (resolve, reject) {

			let points = [];

			if (newPoints &&
				newPoints[param] &&
				newPoints[param].length &&
				timestamp >= newPoints[param][0].x) {

				points = newPoints[param];

			} else {
				if (oldPoints &&
					oldPoints[param] &&
					oldPoints[param].length) {

					points = oldPoints[param];
				}
			}

			while (points && points.length > 1) {

				if ((points[0].x <= timestamp) && (points[1].x >= timestamp)) {
					break;
				}

				points.shift();
			}

			resolve({
				param: param,
				point: points[0] || null,
			});

		});

	}

	function readingsToPoints(readings, tracks) {
		const points = {};

		readings.map(preparePoints);

		function preparePoints(reading) {

			tracks.map(convertToXY);

			function convertToXY(track) {

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

			}

		}

		return points;

	}

}, false);

}
