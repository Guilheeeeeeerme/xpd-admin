

'use strict';

(function () {

	addEventListener('message', function (e) {
		var data = e.data;

		switch (data.cmd) {

			case 'reading-to-points':
				var readings = data.readings;
				var tracks = data.tracks;

				var points = readingsToPoints(readings, tracks);
				this.postMessage({
					cmd: 'points',
					points: points
				});

				// var bTree = prepareBTree(readings, tracks);
				// this.postMessage({
				// 	cmd: 'bTree',
				// 	bTree: bTree
				// });

				break;
			default:
				console.log('[Worker] Unable to handle ', data);
				break;
		}

	}, false);

	function prepareBTree(readings, tracks) {

		var bTree = {};

		var half1 = Math.ceil(readings.length / 2);
		var half2 = Math.floor(readings.length / 2);

		while (half1 >= 0) {

			tracks.map(convertToXY);

			function convertToXY(track) {

				if (!bTree[track.param]) {
					bTree[track.param] = new BTree();
				}

				if (readings[half1]) {
					bTree[track.param].insert({
						x: readings[half1].timestamp,
						y: readings[half1][track.param] || null,
						actual: readings[half1][track.param] || null
					});
				}

				if (readings[half2]) {
					bTree[track.param].insert({
						x: readings[half2].timestamp,
						y: readings[half2][track.param] || null,
						actual: readings[half2][track.param] || null
					});
				}

			}

			half1--;
			half2++;

		}

		return bTree;

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

	class BTree {

		constructor() {
			this.values = {};
		}

		insert(point, index) {

			if (index == null) {
				index = 0;
			}

			if (!this.values[index] || point.x == this.values[index].x) {
				this.values[index] = point;
			} else if (point.x > this.values[index].x) {
				this.insert(point, this.rightOf(index));
			} else {
				this.insert(point, this.leftOf(index));
			}

			var alturaDireita = this.height(this.rightOf(index));
			var alturaEsquerda = this.height(this.leftOf(index));

			if ((alturaEsquerda - alturaDireita) == 2) {

				var subAlturaEsquerda = this.height(this.leftOf(this.leftOf(index)));
				var subAlturaDireita = this.height(this.leftOf(this.rightOf(index)));

				if ((subAlturaEsquerda - subAlturaDireita) == 1) {
					this.turnRigth(index);
				} else {
					this.turnLeft(this.leftOf(index));
					this.turnRigth(index);
				}

			} else if ((alturaDireita - alturaEsquerda) == 2) {

				var subAlturaDireita = this.height(this.rightOf(this.rightOf(index)));
				var subAlturaEsquerda = this.height(this.rightOf(this.leftOf(index)));

				if ((subAlturaDireita - subAlturaEsquerda) == 1) {
					this.turnLeft(index);
				} else {
					this.turnRigth(this.rightOf(index));
					this.turnLeft(index);
				}

			}

		}

		turnLeft(index) {
			var x = this.values[index];
			var y = this.values[this.rightOf(index)];
			var z = this.values[this.rightOf(this.rightOf(index))];

			delete this.values[index];
			delete this.values[this.rightOf(index)];
			delete this.values[this.rightOf(this.rightOf(index))];

			this.values[index] = y;
			this.values[this.rightOf(index)] = x;
			this.values[this.leftOf(index)] = z;
		}

		turnRigth(index) {
			var x = this.values[index];
			var y = this.values[this.leftOf(index)];
			var z = this.values[this.leftOf(this.leftOf(index))];

			delete this.values[index];
			delete this.values[this.leftOf(index)];
			delete this.values[this.leftOf(this.leftOf(index))];

			this.values[index] = y;
			this.values[this.rightOf(index)] = z;
			this.values[this.leftOf(index)] = x;
		}

		leftOf(index) {
			return ((index * 2) + 1);
		}

		rightOf(index) {
			return ((index * 2) + 2);
		}

		height(index) {
			if (!this.values[index]) {
				return 0;
			} else {
				var alturaDireita = this.height(this.rightOf(index));
				var alturaEsquerda = this.height(this.leftOf(index));
				return 1 + Math.max(alturaEsquerda, alturaDireita);
			}
		}

		search(timestamp, index) {

			let next = null

			if (index == null) {
				index = 0;
			}

			if (!this.values[index]) {
				return null;
			}

			if (timestamp > this.values[index].x) {
				next = (this.search(timestamp, this.rightOf(index)));
			} else if (timestamp < this.values[index].x) {
				next = (this.search(timestamp, this.leftOf(index)));
			}

			return (next != null) ? next : this.values[index];
		}
	}

})();