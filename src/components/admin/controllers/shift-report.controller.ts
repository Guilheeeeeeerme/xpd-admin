import { EventLogSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/eventlog-setupapi.service';
import { SectionSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class RPDController {
	// 'use strict';

	// angular.module('xpd.admin').controller('RpdController', rpdController);

	public static $inject = ['$scope', '$routeParams', '$location', '$filter', 'wellSetupAPIService', 'sectionSetupAPIService', 'eventlogSetupAPIService'];

	constructor(
		$scope: any,
		$routeParams: any,
		$location: any,
		$filter: any,
		wellSetupAPIService: WellSetupAPIService,
		sectionSetupAPIService: SectionSetupAPIService,
		eventlogSetupAPIService: EventLogSetupAPIService) {

		$scope.dados = {};

		$scope.dados.wellId = $routeParams.wellId = isNaN($routeParams.wellId) ? 0 : +$routeParams.wellId;

		$scope.dados.wellList = null;
		$scope.dados.sectionList = null;
		$scope.dados.operationList = null;

		$scope.dados.groupedEvents = {};

		// 	Quando alterar o select
		$scope.reloadReport = reloadReport;

		loadWellList().then(function (wells) {

			$scope.dados.wellList = wells;
			$scope.dados.well = null;

			for (const i in $scope.dados.wellList) {
				const well = $scope.dados.wellList[i];

				if (!$scope.dados.wellId && well.current) {
					$scope.dados.wellId = well.id;
					reloadReport();
					break;
				} else if (well.id === $scope.dados.wellId) {
					$scope.dados.well = well;
					wellIsSelected();
					break;
				}
			}

		});

		function wellIsSelected() {
			loadSectionList($scope.dados.wellId).then(function (sections) {
				const promises = [];
				$scope.dados.sectionList = sections;

				$scope.dados.sectionList.map(function (section) {
					promises.push(loadOperations(section.id));
				});

				Promise.all(promises).then(setOperations);
			});
		}

		function setOperations(results) {

			while (results && results.length) {
				const operations = results.shift();

				if (!$scope.dados.operationList) {
					$scope.dados.operationList = operations;
				} else {
					for (const i in operations) {
						$scope.dados.operationList.push(operations[i]);
					}
				}
			}

			$scope.dados.operationList = $scope.dados.operationList.filter(function (op) {
				return op.startDate != null;
			});

			const eventsPromises = [];

			$scope.dados.operationList = $scope.dados.operationList.map(function (operation) {
				const eventPromise = getEvents(operation.id);
				eventsPromises.push(eventPromise);

				eventPromise.then(function (events) {
					operation.events = events;
				});

				return operation;
			});

			$scope.dados.operationList = $filter('orderBy')($scope.dados.operationList, 'operationOrder');

			Promise.all(eventsPromises).then(allReady);

		}

		function groupBy(events, criterias, criteriaIndex) {

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
					grouped[j].children = groupBy(values[j], criterias, (criteriaIndex + 1));
				}
			}

			return grouped;
		}

		function allReady() {

			let events = [];

			$scope.dados.operationList = $scope.dados.operationList.map(function (operation) {

				operation.events = operation.events[0].concat(operation.events[1].concat(operation.events[2]));
				operation.events = $filter('orderBy')(operation.events, 'startTime');

				events = events.concat(operation.events);

				return operation;
			});

			events = events.filter(function (event) {
				return event.duration && event.endTime;
			});

			const groupedEvents = groupBy(events, [function (x) {
				return new Date(x.startTime).toDateString();
			}, 'state', 'tripin', 'eventType'], null);

			$scope.dados.groupedEvents = groupedEvents;
		}

		function getEvents(operationId) {

			const promises = [];

			promises.push(new Promise(function (resolve, reject) {
				eventlogSetupAPIService.listByFilters('TRIP', operationId, null, null, null, function (events) {
					events = events.map(function (event) {
						return event;
					});
					resolve(events);
				}, reject);
			}));

			promises.push(new Promise(function (resolve, reject) {
				eventlogSetupAPIService.listByFilters('CONN', operationId, null, null, null, function (events) {
					events = events.map(function (event) {
						return event;
					});
					resolve(events);
				}, reject);
			}));

			promises.push(new Promise(function (resolve, reject) {
				eventlogSetupAPIService.listByFilters('TIME', operationId, null, null, null, function (events) {
					events = events.map(function (event) {
						return event;
					});
					resolve(events);
				}, reject);
			}));

			return Promise.all(promises);
		}

		function reloadReport() {
			if ($routeParams.wellId !== $scope.dados.wellId) {
				$location.path('/shift-report/' + $scope.dados.wellId).search();
			}
		}

		function loadOperations(sectionId) {
			return new Promise(function (resolve, reject) {
				sectionSetupAPIService.getListOfOperationsBySection(sectionId, function (operations) {
					resolve($filter('orderBy')(operations, 'operationOrder'));
				}, reject);
			});
		}

		function loadWellList() {
			return new Promise(function (resolve, reject) {
				wellSetupAPIService.getList(function (wellList) {
					resolve(wellList);
				}, reject);
			});
		}

		function loadSectionList(wellId) {
			return new Promise(function (resolve, reject) {
				sectionSetupAPIService.getListOfSectionsByWell(wellId, function (sections) {
					resolve($filter('orderBy')(sections, 'sectionOrder'));
				}, reject);
			});
		}

	}

}
