

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

			if( ( track.min >= 0 && track.max >= 0 ) || ( track.min <= 0 && track.max <= 0 ) ){
				distance = Math.abs(track.min - track.max);
			} else{
				distance = Math.abs(track.min - 0) - Math.abs(track.max - 0);
			}

			points.map(function (point) {

				var empty = {
					x: point.x,
					y: null,
					actual: null
				};

				point.overflow = 0;

				if (point.y != null) {

					for (var i = 0; i < 2; i++) {

						if (point.y < track.min) {

							while (point.y < track.min) {
								point.overflow++;
								point.y += distance;
							}

						}

						if (point.y > track.max) {

							while (point.y > track.max) {
								point.overflow--;
								point.y -= distance;
							}

						}

					}

				}

				if (lastPoint != null && lastPoint.overflow != point.overflow) {
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

			var points = [];
			var point = null;


			if (oldPoints &&
				oldPoints[track.param] &&
				oldPoints[track.param].length &&
				oldPoints[track.param][0].x <= timestamp &&
				oldPoints[track.param][oldPoints[track.param].length - 1].x >= timestamp) {

				points = oldPoints[track.param];
			} else if (newPoints &&
				newPoints[track.param] &&
				newPoints[track.param].length &&
				newPoints[track.param][0].x <= timestamp &&
				newPoints[track.param][newPoints[track.param].length - 1].x >= timestamp) {

				points = newPoints[track.param];
			}

			for (var i in points) {
				if ((points[i].x / 1000) >= (timestamp / 1000)) {
					point = points[i];
					break;
				}
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
				}

				if (!points[track.param]) {
					points[track.param] = [];
				}

				points[track.param].push(xyPoint);

			}

		}

		return points;

	}

})();