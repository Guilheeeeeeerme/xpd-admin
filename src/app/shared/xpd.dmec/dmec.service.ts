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

		const colors = [
			'#1CE6FF', '#FF34FF', '#008941', '#A30059',
			'#7A4900', '#63FFAC', '#B79762', '#8FB0FF',
			'#4FC601', '#3B5DFF', '#FF2F80', '#7B4F4B',
			'#BA0900', '#6B7900', '#00C2A0', '#FFAA92', '#FF90C9', '#B903AA', '#D16100',
			'#A1C299', '#300018', '#0AA6D8', '#013349', '#00846F',
			'#372101', '#FFB500', '#C2FFED', '#A079BF', '#CC0744', '#C0B9B2', '#C2FF99', '#001E09',
			'#00489C', '#6F0062', '#0CBD66', '#EEC3FF', '#456D75', '#B77B68', '#7A87A1', '#788D66',
			'#885578', '#FAD09F', '#FF8A9A', '#D157A0', '#BEC459', '#456648', '#0086ED', '#886F4C',
			'#34362D', '#B4A8BD', '#00A6AA', '#452C2C', '#636375', '#A3C8C9', '#FF913F', '#938A81',
			'#575329', '#00FECF', '#B05B6F', '#8CD0FF', '#3B9700', '#04F757', '#C8A1A1', '#1E6E00',
			'#7900D7', '#A77500', '#6367A9', '#A05837', '#6B002C', '#772600', '#D790FF', '#9B9700',
			'#549E79', '#FFF69F', '#201625', '#72418F', '#BC23FF', '#99ADC0', '#3A2465', '#922329',
			'#5B4534', '#FDE8DC', '#404E55', '#0089A3', '#CB7E98', '#A4E804', '#324E72', '#6A3A4C',
			'#83AB58', '#001C1E', '#D1F7CE', '#004B28', '#C8D0F6', '#A3A489', '#806C66', '#222800',
			'#BF5650', '#E83000', '#66796D', '#DA007C', '#FF1A59', '#8ADBB4', '#1E0200', '#5B4E51',
			'#C895C5', '#320033', '#FF6832', '#66E1D3', '#CFCDAC', '#D0AC94', '#7ED379', '#012C58',
		];

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

		const getReading = (point) => {

			if (!point.timestamp) { return; }

			const tick = new Date(point.timestamp).getTime();
			this.readingSetupAPIService.getTick(tick).then((reading: any) => {

				reading.color = point.color = getColor();

				try {
					scope.selectedReadings.push(reading);
				} catch (e) {
					scope.selectedReadings = [reading];
				}

				// O time stamp enviado na rota é diferente do que vem na leitura
				// Isso garante que o ponto e a leitura tenha o mesmo timestamp
				point.timestamp = reading.timestamp;
				scope.lastSelectedPoint = point;
			});
		};

		const getColor = () => {
			return colors.shift();
		};

		const selectedPoint = (point) => {
			getReading(point);
		};

		const restoreColor = (color: string) => {
			colors.push(color);
		};

		const setSelectedPoint = (position) => {
			scope.selectedPoint(position);
		};

		scope.actionButtonUseOperationStartDate = (arg) => { actionButtonUseOperationStartDate(arg); };
		scope.actionButtonSubmitDmecRange = () => { actionButtonSubmitDmecRange(); };
		scope.initializeComponent = () => { initializeComponent(); };
		scope.setZoom = (arg1, arg2) => { setZoom(arg1, arg2); };
		scope.selectedPoint = (arg) => { selectedPoint(arg); };
		scope.setSelectedPoint = (position) => { setSelectedPoint(position); };

	}

}

// })();
