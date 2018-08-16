import { EventLogSetupAPIService } from '../../../shared/xpd.setupapi/eventlog-setupapi.service';
import { SectionSetupAPIService } from '../../../shared/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../shared/xpd.setupapi/well-setupapi.service';

export class RPDController {

	public static $inject = ['$scope', '$routeParams', '$location', '$filter', 'wellSetupAPIService', 'sectionSetupAPIService', 'eventlogSetupAPIService'];

	constructor(
		private $scope: any,
		private $routeParams: any,
		private $location: any,
		private $filter: any,
		private wellSetupAPIService: WellSetupAPIService,
		private sectionSetupAPIService: SectionSetupAPIService,
		private eventlogSetupAPIService: EventLogSetupAPIService) {

		$scope.dados = {};

		$scope.dados.wellId = $routeParams.wellId = isNaN($routeParams.wellId) ? 0 : +$routeParams.wellId;

		$scope.dados.wellList = null;
		$scope.dados.sectionList = null;
		$scope.dados.operationList = null;

		$scope.dados.groupedEvents = {};

		// 	Quando alterar o select
		$scope.reloadReport = (arg) => { this.reloadReport(); };

		this.loadWellList().then((wells: any) => {

			$scope.dados.wellList = wells;
			$scope.dados.well = null;

			for (const i in $scope.dados.wellList) {
				const well = $scope.dados.wellList[i];

				if (!$scope.dados.wellId && well.current) {
					$scope.dados.wellId = well.id;
					this.reloadReport();
					break;
				} else if (well.id === $scope.dados.wellId) {
					$scope.dados.well = well;
					this.wellIsSelected();
					break;
				}
			}

		});

	}

	public reloadReport() {
		if (this.$routeParams.wellId !== this.$scope.dados.wellId) {
			this.$location.path('/shift-report/' + this.$scope.dados.wellId).search();
		}
	}

	private wellIsSelected() {
		this.loadSectionList(this.$scope.dados.wellId).then((sections: any) => {
			const promises = [];
			this.$scope.dados.sectionList = sections;

			this.$scope.dados.sectionList.map((section) => {
				promises.push(this.loadOperations(section.id));
			});

			Promise.all(promises).then((arg) => { this.setOperations(arg); } );
		});
	}

	private setOperations(results) {

		while (results && results.length) {
			const operations = results.shift();

			if (!this.$scope.dados.operationList) {
				this.$scope.dados.operationList = operations;
			} else {
				for (const i in operations) {
					this.$scope.dados.operationList.push(operations[i]);
				}
			}
		}

		this.$scope.dados.operationList = this.$scope.dados.operationList.filter( (op) => {
			return op.startDate != null;
		});

		const eventsPromises = [];

		this.$scope.dados.operationList = this.$scope.dados.operationList.map( (operation) => {
			const eventPromise = this.getEvents(operation.id);
			eventsPromises.push(eventPromise);

			eventPromise.then((events) => {
				operation.events = events;
			});

			return operation;
		});

		this.$scope.dados.operationList = this.$filter('orderBy')(this.$scope.dados.operationList, 'operationOrder');

		Promise.all(eventsPromises).then((arg) => { this.allReady(); });

	}

	private groupBy(events, criterias, criteriaIndex) {

		const grouped = {};
		const values = {};

		const joints = {};

		if (!criteriaIndex) {
			criteriaIndex = 0;
		}

		if (criterias && criterias.length >= 0 && criterias.length > criteriaIndex) {

			const criteria = criterias[criteriaIndex];

			for (const i in events) {

				let key;
				const event = events[i];

				if (typeof criteria === 'function') {
					key = criteria(event);
				} else {
					key = event[criteria];
				}

				if (!grouped[key]) {
					joints[key] = {};
					grouped[key] = {
						hasFailure: false,
						hasNpt: false,
						hasAlarm: false,
						attr: key,
						duration: 0,
						startBitDepth: event.startBitDepth,
						startTime: new Date(event.startTime),
					};
					values[key] = [];
				}

				joints[key][event.initJoint] = true;
				joints[key][event.finalJoint] = true;

				grouped[key].hasFailure = grouped[key].hasFailure || (event.failures.length > 0);
				grouped[key].hasNpt = grouped[key].hasNpt || event.npt;
				grouped[key].hasAlarm = grouped[key].hasAlarm || (event.alarms.length > 0 || event.durationAlarm != null);

				grouped[key].endBitDepth = event.endBitDepth;
				grouped[key].endTime = new Date(event.endTime);

				if (event.duration) {
					grouped[key].duration += (event.duration);
				}

				values[key].push(event);
			}

			for (const j in grouped) {
				grouped[j].values = values[j];
				grouped[j].joints = Object.keys(joints[j]).length;
				grouped[j].children = this.groupBy(values[j], criterias, (criteriaIndex + 1));
			}
		}

		return grouped;
	}

	private allReady() {

		let events = [];

		this.$scope.dados.operationList = this.$scope.dados.operationList.map((operation) => {

			operation.events = operation.events[0].concat(operation.events[1].concat(operation.events[2]));
			operation.events = this.$filter('orderBy')(operation.events, 'startTime');

			events = events.concat(operation.events);

			return operation;
		});

		events = events.filter( (event) => {
			return event.duration && event.endTime;
		});

		const groupedEvents = this.groupBy(events, [ (x) => {
			return new Date(x.startTime).toDateString();
		}, 'state', 'tripin', 'eventType'], null);

		this.$scope.dados.groupedEvents = groupedEvents;
	}

	private getEvents(operationId) {

		const promises = [];

		promises.push(new Promise( (resolve, reject) => {
			this.eventlogSetupAPIService.listByFilters('TRIP', operationId, null, null, null).then( (events: any) => {
				events = events.map( (event) => {
					return event;
				});
				resolve(events);
			}, reject);
		}));

		promises.push(new Promise( (resolve, reject) => {
			this.eventlogSetupAPIService.listByFilters('CONN', operationId, null, null, null).then( (events: any) => {
				events = events.map( (event) => {
					return event;
				});
				resolve(events);
			}, reject);
		}));

		promises.push(new Promise( (resolve, reject) => {
			this.eventlogSetupAPIService.listByFilters('TIME', operationId, null, null, null).then( (events: any) => {
				events = events.map( (event) => {
					return event;
				});
				resolve(events);
			}, reject);
		}));

		return Promise.all(promises);
	}

	private loadOperations(sectionId) {
		return new Promise( (resolve, reject) => {
			this.sectionSetupAPIService.getListOfOperationsBySection(sectionId).then( (operations) => {
				resolve(this.$filter('orderBy')(operations, 'operationOrder'));
			}, reject);
		});
	}

	private loadWellList() {
		return new Promise( (resolve, reject) => {
			this.wellSetupAPIService.getList().then( (wellList) => {
				resolve(wellList);
			}, reject);
		});
	}

	private loadSectionList(wellId) {
		return new Promise( (resolve, reject) => {
			this.sectionSetupAPIService.getListOfSectionsByWell(wellId).then( (sections) => {
				resolve(this.$filter('orderBy')(sections, 'sectionOrder'));
			}, reject);
		});
	}

}
