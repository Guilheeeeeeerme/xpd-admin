

'use strict';

(function () {

	function getRandomArbitrary(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	addEventListener('message', function (e) {
		var data = e.data;

		// var threadId = getRandomArbitrary(0, 1000) + ' ' + data.cmd;
		// var startTime = new Date().getTime();
		// console.log('%s começou', threadId);

		switch (data.cmd) {

		case 'find-point':
			this.postMessage({
				cmd: 'find-point',
				points: getPoint(data.timestamp, data.tracks, data.oldPoints, data.newPoints)
			});
			break;
		case 'handle-overflow':
			this.postMessage({
				cmd: 'handle-overflow',
				trackName: data.trackName,
				points: overflowPoints(data.tracks, data.points)
			});
			break;
		case 'reading-to-points':
			this.postMessage({
				cmd: 'reading-to-points',
				points: readingsToPoints(data.readings, data.tracks)
			});
			break;
		default:
			console.log('[Worker] Unable to handle ', data);
			break;
		}

		// var endTime = new Date().getTime();
		// console.log('%s terminou [%s ms]', threadId, (endTime - startTime));

	}, false);

	function overflowPoints(tracks, points) {

		var result = {};

		tracks.map(function (track) {
			result[track.param] = handleOverflow(points[track.param], track);
		});

		return result;

		function handleOverflow(points, track) {

			var result = [];
			var distance = 0;
			var lastPoint = null;

			distance = Math.abs(track.max - track.min);

			points.map(function (point) {

				var empty = {
					x: point.x,
					y: null,
					actual: null
				};

				point.overflow = 0;
				var tempPoint = null;

				if (point.y != null) {

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

				}

				if (lastPoint != null && lastPoint.overflow != point.overflow) {
					if(tempPoint){
						result.push(tempPoint);tempPoint;
					}
					result.push(empty);
				}

				lastPoint = point;

				result.push(point);

			});

			return result;
		}
	}

	function getPoint(timestamp, tracks, oldPoints, newPoints) {

		var reading = {};

		tracks.map(function (track, trackIndex) {

			var point = null;
			var points = [];

			try {
				points = points.concat(oldPoints[track.param]);
			} catch (e) {
				// faça nada
			}

			try {
				points = points.concat(newPoints[track.param]);
			} catch (e) {
				// faça nada
			}

			while (points && points.length > 1) {

				var half = Math.ceil(points.length / 2);

				var firstHalf = points.slice(0, half);
				var lastHalf = points.slice(-1 * half);

				if (lastHalf &&
					lastHalf.length &&
					timestamp >= lastHalf[0].x) {
					
					points = lastHalf;

				} else {
					points = firstHalf;
				}

			}

			for (var i in points) {
				point = points[i];
				break;
			}

			reading[track.param] = point;

		});

		return reading;
	}


	function readingsToPoints(readings, tracks) {
		var points = {};

		readings.map(preparePoints);

		function preparePoints(reading) {

			tracks.map(convertToXY);

			function convertToXY(track) {

				var xyPoint = {
					x: reading.timestamp,
					y: reading[track.param] || null,
					actual: reading[track.param] || null
				};

				if (!points[track.param]) {
					points[track.param] = [];
				}

				// points[track.param].push(xyPoint);

				if (points[track.param].length >= 2 &&
					points[track.param][points[track.param].length - 1].y == xyPoint.y &&
					points[track.param][points[track.param].length - 2].y == xyPoint.y) {
					points[track.param][points[track.param].length - 1] = xyPoint;
				} else {
					points[track.param].push(xyPoint);
				}

			}

		}

		return points;

	}

})();