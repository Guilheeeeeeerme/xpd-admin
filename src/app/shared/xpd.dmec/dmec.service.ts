import { IModalService } from 'angular-ui-bootstrap';
import { XPDSecondsToHourMinutesSecondsFilter } from '../xpd.filters/xpd-seconds-to-hour-minutes-seconds.filter';
import { ReadingSetupAPIService } from '../xpd.setupapi/reading-setupapi.service';

import modalTemplate from './dmec-chart-modal.template.html';

export class DMECService {

	public static $inject: string[] = [
		'$location',
		'$uibModal',
		'$routeParams',
		'$q',
		'readingSetupAPIService',
		'$interval',
		'$xpdInterval',
		'$filter'];
	private tracks: any;

	constructor(
		private $location: ng.ILocationService,
		private $uibModal: IModalService,
		private $routeParams: any,
		private $q: ng.IQService,
		private readingSetupAPIService: ReadingSetupAPIService,
		private $interval: any,
		private $xpdInterval: any,
		private $filter: any) {

		if (!localStorage.getItem('xpd.admin.dmec.dmecTracks')) {
			localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(this.getDefaultTracks()));
		}

		this.tracks = JSON.parse(localStorage.getItem('xpd.admin.dmec.dmecTracks'));

	}

	public dmec(scope, localStoragePath, getCurrentOperation?, getCurrentReading?) {

		const vm = this;
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

		const getTickFrequency = 10000;

		/**
		 * Função que inicializa o serviço e as buscas
		 */
		const initializeComponent = () => {

			let startAtMillis;
			const endAtMillis = new Date().getTime();
			let intervalToShow = 0;
			const inputRangeForm = scope.inputRangeForm = this.getInputRangeForm(localStoragePath);

			if (inputRangeForm.realtime) {
				intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
				scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAtMillis - intervalToShow));
			} else {
				scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
			}

			startAtMillis = new Date(scope.dmecTrackingStartAt).getTime();

			intervalToShow = Math.abs(endAtMillis - startAtMillis);

			setZoom(
				new Date(endAtMillis - intervalToShow),
				new Date(endAtMillis),
			);

			// não tem como inicilizar duas vezes
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
			vm.reload();
		};

		/**
		 * Por onde as directive alteram o zoom
		 * @param {Date} zoomStartAt
		 * @param {Date} zoomEndAt
		 */
		const setZoom = (zoomStartAt, zoomEndAt) => {
			scope.zoomStartAt = new Date(zoomStartAt);
			scope.zoomEndAt = new Date(zoomEndAt);

			const intervalToShow = Math.abs(
				new Date(scope.zoomEndAt).getTime() -
				new Date(scope.zoomStartAt).getTime(),
			);

			scope.slider = {
				options: {
					floor: new Date(scope.dmecTrackingStartAt).getTime(),
					ceil: new Date().getTime() + (intervalToShow / 2),
					// tslint:disable-next-line:only-arrow-functions
					translate: function (value) {
						return vm.$filter('date')(value, 'medium');
					},
				},
			};

		};

		const toReading = (activity, useRaw: boolean) => {

			const reading = {
				timestamp: activity.xData[0],
			};

			activity.datasets.forEach((dataset, i) => {

				// reading[dataset.param] = dataset.data;

				if (useRaw === true) {
					reading[dataset.param] = dataset.data[0][1] == null ? dataset.data[0][0] : dataset.data[0][1];
				} else {
					reading[dataset.param] = dataset.data[0];
				}

			});

			return reading;
		};

		/**
		 * Get Reading. Se tiver no ela em tempo real vindo operation, pega do opertion.
		 * Se não, vai no banco
		 */
		const getTick = () => {

			// console.log('getTick');

			const now = new Date().getTime();

			scope.onReading = vm.$q((resolve, reject) => {
				// if (getCurrentReading) {

				// 	const currentReading = getCurrentReading();

				// 	if (currentReading.timestamp && currentReading.timestamp) {
				// 		currentReading.timestamp = new Date(currentReading.timestamp).getTime();
				// 		console.log(currentReading);

				// 		// blockPosition: (3) [29.0186781289047, 29.0186781289047, 0]
				// 		// flow: (3) [736.944641019626, 736.944641019626, 0]
				// 		// hookload: (3) [100, 100, 0]
				// 		// rop: (3) [25.9561911425934, 25.9561911425934, 0]
				// 		// rpm: (3) [102.036602322774, 102.036602322774, 0]
				// 		// sppa: (3) [2156.3318493977, 2156.3318493977, 0]
				// 		// timestamp: 1542638490444
				// 		// torque: (3) [4553.12246374157, 4553.12246374157, 0]
				// 		// wob: (3) [18.2070904990249, 18.2070904990249, 0]

				// 		// resolve(currentReading);

				// 	}

				// } else {
				vm.readingSetupAPIService.getTick((now - getTickFrequency), this.tracks).then(
					(activity) => {
						// console.log(activity);
						activity = toReading(activity, false);
						resolve(activity);
					},
					(arg) => { reject(arg); });
				// }
			});

			scope.inputRangeForm = this.getInputRangeForm(localStoragePath);

			if (scope.inputRangeForm && scope.inputRangeForm.keepZoomAtTheEnd && now >= new Date(scope.zoomEndAt).getTime()) {

				const intervalToShow = new Date(scope.zoomEndAt).getTime() - new Date(scope.zoomStartAt).getTime();

				setZoom(
					new Date(now - intervalToShow),
					new Date(now),
				);

			}

		};

		/**
		 * Vai no banco buscar o historico de leituras
		 * Se tiver um operação como base, limita a busca ao start date de operação
		 * @param {Date} fromTime
		 */
		const getAllReadingSince = (fromTime) => {

			fromTime = new Date(fromTime);

			if (getCurrentOperation) {
				const operationStartDate = new Date(getCurrentOperation().startDate);

				if (fromTime.getTime() < operationStartDate.getTime()) {
					fromTime = operationStartDate;
				}
			}

			fromTime = new Date(fromTime);
			const toTime = new Date();

			scope.onReadingSince = vm.readingSetupAPIService.getAllReadingByStartEndTime(
				fromTime.getTime(),
				toTime.getTime(),
				this.tracks,
			);

			return fromTime;

		};

		const getReading = (point) => {

			if (!point.timestamp) { return; }

			const tick = new Date(point.timestamp).getTime();
			this.readingSetupAPIService.getTick(tick, this.tracks).then((activity: any) => {

				// voltar aqui

				activity = toReading(activity, true);

				activity.timestamp = point.timestamp;

				activity.color = point.color = getColor();

				try {
					scope.selectedReadings.push(activity);
				} catch (e) {
					scope.selectedReadings = [activity];
				}

				// O time stamp enviado na rota é diferente do que vem na leitura
				// Isso garante que o ponto e a leitura tenha o mesmo timestamp
				// point.timestamp = reading.timestamp;
				scope.lastSelectedPoint = point;
			});
		};

		const getColor = () => {
			return colors.shift();
		};

		const setSelectedPoint = (position) => {
			getReading(position);
		};

		scope.actionButtonUseOperationStartDate = (arg) => { actionButtonUseOperationStartDate(arg); };
		scope.actionButtonSubmitDmecRange = () => { actionButtonSubmitDmecRange(); };
		scope.initializeComponent = () => { initializeComponent(); };
		scope.setZoom = (zstart, zend) => { setZoom(zstart, zend); };
		scope.setSelectedPoint = (position) => { setSelectedPoint(position); };
		scope.openScaleModal = () => { vm.openScaleModal(); };

		this.$interval(() => {
			getTick();
		}, getTickFrequency);

		// this.$xpdInterval.run(() => {
		// 	getTick();
		// }, getTickFrequency, scope);

	}

	/**
	 * Recarregar a página
	 */
	private reload() {
		location.reload();
	}

	private getDefaultTracks() {

		return [{
			label: 'BLOCK POSITION',
			min: -10,
			max: 50,
			unitMeasure: 'm',
			param: 'blockPosition',
			nextParam: true,
		}, {
			label: 'RATE OF PENETRATION',
			min: 0,
			max: 100,
			unitMeasure: 'm/hr',
			param: 'rop',
			nextParam: false,
		}, {
			label: 'WOB',
			min: -10,
			max: 40,
			unitMeasure: 'klbf',
			param: 'wob',
			nextParam: true,
		}, {
			label: 'HOOKLOAD',
			min: -10,
			max: 500,
			unitMeasure: 'klbf',
			param: 'hookload',
			nextParam: false,
		}, {
			label: 'RPM',
			min: -10,
			max: 200,
			unitMeasure: 'c/min',
			param: 'rpm',
			nextParam: true,
		}, {
			label: 'TORQUE',
			min: 0,
			max: 5000,
			unitMeasure: 'kft.lbf',
			param: 'torque',
			nextParam: false,
		}, {
			label: 'FLOW',
			min: 0,
			max: 1200,
			unitMeasure: 'gal/min',
			param: 'flow',
			nextParam: true,
		}, {
			label: 'STANDPIPE PRESSURE',
			min: 0,
			max: 5000,
			unitMeasure: 'psi',
			param: 'sppa',
			nextParam: false,
		}];
	}

	private openScaleModal() {
		const self = this;

		this.$uibModal.open({
			animation: false,
			keyboard: false,
			backdrop: 'static',
			template: modalTemplate,
			controller: 'DMECChartModalController',
			windowClass: 'change-scale-modal',
			resolve: {
				tracks() {
					return self.tracks;
				},
				onTracksChange() {
					return () => {
						self.reload();
					};
				},
			},
		});
	}

	/**
	 * Pega as confições salvas em localstorage
	 */
	private getInputRangeForm(localStoragePath) {

		let inputRangeForm;

		try {

			inputRangeForm = JSON.parse(this.$routeParams[localStoragePath]);
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
	}

}

// })();
