(function () {
	'use strict';

	angular.module('xpd.admin').controller('RpdController', rpdController);

	rpdController.$inject = ['$scope', 'setupAPIService', '$routeParams', '$location', '$filter', 'wellSetupAPIService', 'eventlogSetupAPIService'];

	function rpdController($scope, setupAPIService, $routeParams, $location, $filter, wellSetupAPIService, eventlogSetupAPIService) {

		$scope.dados = {};

		$scope.dados.wellId = $routeParams.wellId = isNaN($routeParams.wellId)?0:+$routeParams.wellId;

		$scope.dados.wellList = null;
		$scope.dados.sectionList = null;
		$scope.dados.operationList = null;
		
		$scope.dados.groupedEvents = {};
		
		//	Quando alterar o select
		$scope.reloadReport = reloadReport;

		loadWellList().then(function (wells) {

			$scope.dados.wellList = wells;
			$scope.dados.well = null;

			for (let i in $scope.dados.wellList) {
				let well = $scope.dados.wellList[i];

				if( !$scope.dados.wellId && well.current ){
					$scope.dados.wellId = well.id;
					reloadReport();
					break;
				}else if ( well.id == $scope.dados.wellId ) {
					$scope.dados.well = well;
					wellIsSelected();
					break;
				}
			}

		});

		function wellIsSelected() {
			loadSectionList($scope.dados.wellId).then(function (sections) {
				var promises = [];
				$scope.dados.sectionList = sections;

				$scope.dados.sectionList.map(function (section) {
					promises.push(loadOperations(section.id));
				});

				Promise.all(promises).then(setOperations);
			});
		}

		function setOperations(results) {

			while (results && results.length) {
				var operations = results.shift();

				if (!$scope.dados.operationList) {
					$scope.dados.operationList = operations;
				} else {
					for (var i in operations) {
						$scope.dados.operationList.push(operations[i]);
					}
				}
			}

			$scope.dados.operationList = $scope.dados.operationList.filter(function (op) {
				return op.startDate != null;
			});

			var eventsPromises = [];

			$scope.dados.operationList = $scope.dados.operationList.map(function (operation) {
				var eventPromise = getEvents(operation.id);
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

			var grouped = {};
			var values = {};

			var joints = {};

			if (!criteriaIndex)
				criteriaIndex = 0;

			if (criterias && criterias.length >= 0 && criterias.length > criteriaIndex) {

				var criteria = criterias[criteriaIndex];

				for (var i in events) {

					var key;
					var event = events[i];

					if (typeof criteria == 'function') {
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
							startTime: new Date(event.startTime)
						};
						values[key] = [];
					}

					joints[key][event.initJoint] = true;
					joints[key][event.finalJoint] = true;

					
					grouped[key].hasFailure = grouped[key].hasFailure || (event.failures.length > 0);
					grouped[key].hasNpt = grouped[key].hasNpt || event.npt;
					grouped[key].hasAlarm = grouped[key].hasAlarm || ( event.alarms.length > 0 || event.durationAlarm != null);

					grouped[key].endBitDepth = event.endBitDepth;
					grouped[key].endTime = new Date(event.endTime);
					
					if(event.duration)
						grouped[key].duration += (event.duration);

					values[key].push(event);
				}

				for (var j in grouped) {
					grouped[j].values = values[j];
					grouped[j].joints = Object.keys(joints[j]).length;
					grouped[j].children = groupBy(values[j], criterias, (criteriaIndex + 1));
				}
			}
			

			return grouped;
		}

		function allReady() {

			var events = [];

			$scope.dados.operationList = $scope.dados.operationList.map(function (operation) {

				operation.events = operation.events[0].concat(operation.events[1].concat(operation.events[2]));
				operation.events = $filter('orderBy')(operation.events, 'startTime');

				events = events.concat(operation.events);

				return operation;
			});

			events = events.filter(function(event) {
				return event.duration && event.endTime;
			});

			var groupedEvents = groupBy(events, [function (x) {
				return new Date(x.startTime).toDateString();
			}, 'state', 'tripin', 'eventType']);

			$scope.dados.groupedEvents = groupedEvents;
		}

		function getEvents(operationId) {

			var promises = [];

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
			if ($routeParams.wellId != $scope.dados.wellId) {
				$location.path('/shift-report/' + $scope.dados.wellId).search();
			}
		}

		function loadOperations(sectionId) {
			return new Promise(function (resolve, reject) {
				wellSetupAPIService.getListOfOperationsBySection(sectionId, function (operations) {
					resolve($filter('orderBy')(operations, 'operationOrder'));
				}, reject);
			});
		}

		function loadWellList() {
			return new Promise(function (resolve, reject) {
				setupAPIService.getList('setup/well', function (response) {
					resolve(response.data);
				}, reject);
			});
		}

		function loadSectionList(wellId) {
			return new Promise(function (resolve, reject) {
				wellSetupAPIService.getListOfSectionsByWell(wellId, function (sections) {
					resolve($filter('orderBy')(sections, 'sectionOrder'));
				}, reject);
			});
		}

	}

})();