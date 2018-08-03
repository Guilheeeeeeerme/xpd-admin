import { IWindowService } from 'angular';
import { ReadingSetupAPIService } from '../xpd.setupapi/reading-setupapi.service';
import { XPDIntervalService, XPDTimeoutService } from '../xpd.timers/xpd-timers.service';

export class DMECService {

	public static $inject: string[] = [
		'$xpdTimeout',
		'$xpdInterval',
		'$location',
		'$window',
		'$routeParams',
		'$q',
		'readingSetupAPIService'];

	constructor(
		private $xpdTimeout: XPDTimeoutService,
		private $xpdInterval: XPDIntervalService,
		private $location: ng.ILocationService,
		private $window: IWindowService,
		private $routeParams: any,
		private $q: ng.IQService,
		private readingSetupAPIService: ReadingSetupAPIService) {

	}

	public dmec(scope, localStoragePath, getCurrentOperation?, getCurrentReading?) {

		const vm = this;

		const ONE_HOUR = 3600000;
		const getTickFrequency = 1000;
		let getTickInterval;
		let resetPageTimeout;

		/**
		 * Função que inicializa o serviço e as buscas
		 */
		const initializeComponent = () => {

			let startAtMillis;
			const endAtMillis = new Date().getTime();
			let intervalToShow = 0;
			const inputRangeForm = scope.inputRangeForm = getInputRangeForm();

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
				new Date(endAtMillis + (intervalToShow / 2)),
			);

			// tslint:disable-next-line:no-empty
			scope.initializeComponent = () => { };

		};

		/**
		 * Auxilias da Configuração de busca
		 * @param {Date} startDate
		 */
		const actionButtonUseOperationStartDate = (startDate) => {
			scope.inputRangeForm.startTime = new Date(startDate);
			scope.inputRangeForm.startTime.setMilliseconds(0);
			scope.inputRangeForm.startTime.setSeconds(0);
		};

		/**
		 * Salvando as configurações de busca
		*/
		const actionButtonSubmitDmecRange = () => {
			// localStorage.setItem(localStoragePath, JSON.stringify(scope.inputRangeForm));

			const param = {};
			param[localStoragePath] = JSON.stringify(scope.inputRangeForm);

			vm.$location.path(vm.$location.path()).search(param);

			reload();
		};

		/**
		 * Recarregar a página
		 */
		const reload = () => {
			vm.$window.location.reload();
		};

		/**
		 * Quando sair do controller
		 */
		const destroy = () => {
			if (resetPageTimeout) {
				vm.$xpdTimeout.cancel(resetPageTimeout);
			}
			if (getTickInterval) {
				vm.$xpdInterval.cancel(getTickInterval);
			}
		};
		/**
		 * Por onde as directive alteram o zoom
		 * @param {Date} zoomStartAt
		 * @param {Date} zoomEndAt
		 */
		const setZoom = (zoomStartAt, zoomEndAt) => {
			scope.zoomStartAt = new Date(zoomStartAt);
			scope.zoomEndAt = new Date(zoomEndAt);
		};

		/**
		 * Get Reading. Se tiver no ela em tempo real vindo operation, pega do opertion.
		 * Se não, vai no banco
		 */
		const getTick = () => {

			const now = new Date().getTime();

			scope.onReading = vm.$q((resolve, reject) => {
				if (getCurrentReading) {

					const currentReading = getCurrentReading();

					if (currentReading.timestamp && currentReading.timestamp) {
						currentReading.timestamp = new Date(currentReading.timestamp).getTime();
						resolve(currentReading);
					}

				} else {
					vm.readingSetupAPIService.getTick((now - getTickFrequency)).then((arg) => { resolve(arg); }, (arg) => { reject(arg); });
				}
			});

			scope.onReading.then((reading) => {

				scope.maxDepth = Math.max(scope.maxDepth, reading.bitDepth);

				if (scope.bitDepthPoints) {
					scope.bitDepthPoints.push({
						x: reading.timestamp,
						y: reading.bitDepth,
					});
				}

			});

			if (scope.inputRangeForm.keepZoomAtTheEnd && now >= new Date(scope.zoomEndAt).getTime()) {

				const intervalToShow = new Date(scope.zoomEndAt).getTime() - new Date(scope.zoomStartAt).getTime();

				setZoom(
					new Date(now - (intervalToShow / 1)),
					new Date(now + (intervalToShow / 2)),
				);

			}

		};

		/**
		 * Vai no banco buscar o historico de leituras
		 * Se tiver um operação como base, limita a busca ao start date de operação
		 * @param {Date} startTime
		 */
		const getAllReadingSince = (startTime) => {

			startTime = new Date(startTime);

			if (getCurrentOperation) {
				const operationStartDate = new Date(getCurrentOperation().startDate);

				if (startTime.getTime() < operationStartDate.getTime()) {
					startTime = operationStartDate;
				}
			}

			const loopLimit = new Date();
			let loopStartTime = new Date(startTime);
			const loopEndTime = new Date(startTime);

			// loopStartTime.setHours(0);
			loopStartTime.setMinutes(0);
			loopStartTime.setSeconds(0);
			loopStartTime.setMilliseconds(0);

			const hours = (loopLimit.getTime() - loopStartTime.getTime()) / 3600000;

			let step = Math.floor(hours / 12) * 6;

			step = (step < 1) ? 1 : step;

			const promises = [];

			while (loopEndTime.getTime() < loopLimit.getTime()) {

				loopEndTime.setHours(loopStartTime.getHours() + step);
				let loopEndTimestamp = loopEndTime.getTime();

				if (loopEndTime.getTime() > loopLimit.getTime()) {
					loopEndTimestamp = null;
				}

				promises.push(vm.$q((resolve, reject) => {

					vm.readingSetupAPIService.getAllReadingByStartEndTime(
						loopStartTime.getTime(),
						loopEndTimestamp ? loopEndTimestamp : new Date().getTime()).then(
							(arg) => { resolve(arg); },
							(arg) => { reject(arg); },
					);

				}));

				loopStartTime = new Date(loopEndTime);
			}

			const onReadingSince = vm.$q((resolve, reject) => {

				vm.$q.all(promises).then((readingsList) => {

					const parsedReadings = {};

					try {

						while (readingsList && readingsList.length > 0) {

							const readings = readingsList.shift();

							for (const attr in readings) {
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

			onReadingSince.then((readings: any) => {
				if (readings && readings.bitDepth) {
					scope.bitDepthPoints = generateBitDepthPoints(readings.bitDepth);
				} else {
					scope.bitDepthPoints = [];
				}
			});

			onReadingSince.then(() => {
				destroy();
				resetPageTimeout = vm.$xpdTimeout.run(() => { reload(); }, (ONE_HOUR / 2), scope);
				getTickInterval = vm.$xpdInterval.run(() => { getTick(); }, getTickFrequency, scope);
			});

			scope.onReadingSince = onReadingSince;

			return startTime;
		};

		/**
		 * Pega as confições salvas em localstorage
		 */
		const getInputRangeForm = () => {

			let inputRangeForm;

			try {

				inputRangeForm = JSON.parse(vm.$routeParams[localStoragePath]);
				// inputRangeForm = JSON.parse(localStorage.getItem(localStoragePath));
			} catch (e) {
				inputRangeForm = null;
			}

			if (!inputRangeForm) {
				inputRangeForm = {
					realtime: true,
					keepZoomAtTheEnd: true,
					last: 30,
					toMilliseconds: '60000',
				};
			}

			if (inputRangeForm && inputRangeForm.startTime) {
				inputRangeForm.startTime = new Date(inputRangeForm.startTime);
			}

			return inputRangeForm;
		};

		/**
		 * Algoritmo para colocar a linha de bitdepth no zoom
		 * @param {Lista de bitdepths} bitDepthList
		 */
		const generateBitDepthPoints = (bitDepthList) => {
			const points = [];

			bitDepthList.map((bitDepthPoint) => {

				if (bitDepthPoint.actual) {
					if (scope.maxDepth == null) {
						scope.maxDepth = bitDepthPoint.actual;
					} else {
						scope.maxDepth = Math.max(scope.maxDepth, bitDepthPoint.actual);
					}
				}

				points.push({
					x: bitDepthPoint.x,
					y: bitDepthPoint.actual || null,
				});

			});

			return points;
		};

		scope.actionButtonUseOperationStartDate = (arg) => { actionButtonUseOperationStartDate(arg); };
		scope.actionButtonSubmitDmecRange = () => { actionButtonSubmitDmecRange(); };
		scope.initializeComponent = () => { initializeComponent(); };
		scope.setZoom = (arg1, arg2) => { setZoom(arg1, arg2); };

	}

}

// })();
