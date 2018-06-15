(function () {
	angular.module('xpd.dmec', []).service('dmecService', dmecService);

	dmecService.$inject = ['$timeout', '$interval', '$q', 'readingSetupAPIService'];

	function dmecService($timeout, $interval, $q, readingSetupAPIService) {

		return {
			dmec: DMECService
		};

		function DMECService(scope, localStoragePath, getCurrentOperation, getCurrentReading) {

			var ONE_HOUR = 3600000;
			var getTickFrequency = 1000;
			var getTickInterval;
			var resetPageTimeout;

			scope.$on('$destroy', destroy);

			scope.actionButtonUseOperationStartDate = actionButtonUseOperationStartDate;
			scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
			scope.initializeComponent = initializeComponent;
			scope.setZoom = setZoom;

			/**
			 * Função que inicializa o serviço e as buscas
			 */
			function initializeComponent() {

				var startAtMillis;
				var endAtMillis = new Date().getTime();
				var intervalToShow = 0;
				var inputRangeForm = scope.inputRangeForm = getInputRangeForm();

				if (inputRangeForm.realtime) {
					intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
					scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAtMillis - intervalToShow));
				} else {
					scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
				}

				startAtMillis = new Date(scope.dmecTrackingStartAt).getTime();

				intervalToShow = (endAtMillis - startAtMillis);

				setZoom(
					new Date(endAtMillis - (intervalToShow / 1)),
					new Date(endAtMillis + (intervalToShow / 2))
				);

				scope.initializeComponent = function () { };

			}

			/**
			 * Auxilias da Configuração de busca
			 * @param {Date} startDate 
			 */
			function actionButtonUseOperationStartDate(startDate) {
				scope.inputRangeForm.startTime = new Date(startDate);
				scope.inputRangeForm.startTime.setMilliseconds(0);
				scope.inputRangeForm.startTime.setSeconds(0);
			}

			/** 
			 * Salvando as configurações de busca
			*/
			function actionButtonSubmitDmecRange() {
				localStorage.setItem(localStoragePath, JSON.stringify(scope.inputRangeForm));
				reload();
			}

			/**
			 * Recarregar a página
			 */
			function reload() {
				location.reload();
			}

			/**
			 * Quando sair do controller
			 */
			function destroy() {
				if (resetPageTimeout) {
					$timeout.cancel(resetPageTimeout);
				}
				if (getTickInterval) {
					$interval.cancel(getTickInterval);
				}
			}
			/**
			 * Por onde as directive alteram o zoom
			 * @param {Date} zoomStartAt 
			 * @param {Date} zoomEndAt 
			 */
			function setZoom(zoomStartAt, zoomEndAt) {
				scope.zoomStartAt = new Date(zoomStartAt);
				scope.zoomEndAt = new Date(zoomEndAt);
			}

			/**
			 * Get Reading. Se tiver no ela em tempo real vindo operation, pega do opertion.
			 * Se não, vai no banco
			 */
			function getTick() {

				var now = new Date().getTime();

				scope.onReading = $q(function (resolve, reject) {
					if (getCurrentReading) {

						var currentReading = getCurrentReading();

						if (currentReading.timestamp && currentReading.timestamp) {
							currentReading.timestamp = new Date(currentReading.timestamp).getTime();
							resolve(currentReading);
						}

					} else {
						readingSetupAPIService.getTick((now - getTickFrequency), resolve, reject);
					}
				});

				scope.onReading.then(function (reading) {

					scope.maxDepth = Math.max(scope.maxDepth, reading.bitDepth);

					if (scope.bitDepthPoints) {
						scope.bitDepthPoints.push({
							x: reading.timestamp,
							y: reading.bitDepth
						});
					}

				});

				if (scope.inputRangeForm.keepZoomAtTheEnd && now >= new Date(scope.zoomEndAt).getTime()) {

					var intervalToShow = new Date(scope.zoomEndAt).getTime() - new Date(scope.zoomStartAt).getTime();

					setZoom(
						new Date(now - (intervalToShow / 1)),
						new Date(now + (intervalToShow / 2))
					);

				}

			}

			/**
			 * Vai no banco buscar o historico de leituras
			 * Se tiver um operação como base, limita a busca ao start date de operação
			 * @param {Date} startTime 
			 */
			function getAllReadingSince(startTime) {

				startTime = new Date(startTime);

				if (getCurrentOperation) {
					var operationStartDate = new Date(getCurrentOperation().startDate);

					if (startTime.getTime() < operationStartDate.getTime()) {
						startTime = operationStartDate;
					}
				}

				var loopLimit = new Date();
				var loopStartTime = new Date(startTime);
				var loopEndTime = new Date(startTime);

				loopStartTime.setMinutes(0);
				loopStartTime.setSeconds(0);
				loopStartTime.setMilliseconds(0);
				var step = 1;


				// var hours = (loopLimit.getTime() - loopStartTime.getTime()) / 3600000;
				// if (hours <= 12) {
				// 	step = 1;
				// } else if (hours > 12 && hours <= 24) {
				// 	step = 12;
				// } else if (hours > 24 && hours <= (7 * 24)) {
				// 	step = 24;
				// } else if (hours > (7 * 24) && hours <= (4 * 7 * 24)) {
				// 	step = (7 * 24);
				// } else {
				// 	step = (4 * 7 * 24);
				// }

				// console.log({hours, step});

				var promises = [];

				while (loopEndTime.getTime() < loopLimit.getTime()) {

					loopEndTime.setHours(loopStartTime.getHours() + step);
					var loopEndTimestamp = loopEndTime.getTime();

					if (loopEndTime.getTime() > loopLimit.getTime()) {
						loopEndTimestamp = null;
					}

					promises.push($q(function (resolve, reject) {

						// setTimeout(resolve, 1000, {});

						readingSetupAPIService.getAllReadingByStartEndTime(
							loopStartTime.getTime(),
							loopEndTimestamp, // ? loopEndTimestamp : new Date().getTime(),
							resolve,
							reject
						);

					}));

					loopStartTime = new Date(loopEndTime);
				}

				var onReadingSince = $q(function (resolve, reject) {

					$q.all(promises).then(function (readingsList) {

						var parsedReadings = {};

						try {

							while (readingsList && readingsList.length > 0) {

								var readings = readingsList.shift();

								for (var attr in readings) {
									if (!parsedReadings[attr]) {
										parsedReadings[attr] = readings[attr];
									} else {
										parsedReadings[attr] = parsedReadings[attr].concat(readings[attr]);
									}
								}
							}

						} catch (e) {
							console.error(e);
						}

						resolve(parsedReadings);

					});


				});

				scope.bitDepthPoints = null;
				scope.maxDepth = null;

				onReadingSince.then(function (readings) {
					if (readings && readings.bitDepth) {
						scope.bitDepthPoints = generateBitDepthPoints(readings.bitDepth);
					} else {
						scope.bitDepthPoints = [];
					}
				});

				onReadingSince.then(function () {
					destroy();
					resetPageTimeout = $timeout(reload, (ONE_HOUR / 2));
					getTickInterval = $interval(getTick, getTickFrequency);
				});

				scope.onReadingSince = onReadingSince;


				return startTime;
			}

			/**
			 * Pega as confições salvas em localstorage
			 */
			function getInputRangeForm() {

				var inputRangeForm;

				try {
					inputRangeForm = JSON.parse(localStorage.getItem(localStoragePath));
				} catch (e) {
					inputRangeForm = null;
				}

				if (!inputRangeForm) {
					inputRangeForm = {
						realtime: true,
						last: 30,
						toMilliseconds: '60000',
					};
				}

				if (inputRangeForm && inputRangeForm.startTime) {
					inputRangeForm.startTime = new Date(inputRangeForm.startTime);
				}

				return inputRangeForm;
			}

			/**
			 * Algoritmo para colocar a linha de bitdepth no zoom
			 * @param {Lista de bitdepths} bitDepthList 
			 */
			function generateBitDepthPoints(bitDepthList) {
				var points = [];

				bitDepthList.map(function (bitDepthPoint) {

					if (bitDepthPoint.actual) {
						if (scope.maxDepth == null) {
							scope.maxDepth = bitDepthPoint.actual;
						} else {
							scope.maxDepth = Math.max(scope.maxDepth, bitDepthPoint.actual);
						}
					}

					points.push({
						x: bitDepthPoint.x,
						y: bitDepthPoint.actual || null
					});

				});

				return points;
			}

		}

	}

})();