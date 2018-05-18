(function () {
	'use strict';

	angular.module('setup.test').controller('scheduleSetupTestController', scheduleSetupTestController);

	scheduleSetupTestController.$inject = ['$scope', 'scheduleSetupAPIService'];

	function scheduleSetupTestController($scope, scheduleSetupAPIService) {
		// new Date(year, month, day, hours, minutes, seconds, milliseconds)
		var fromDate = new Date(2018, 1, 1, 0, 0, 0, 0);
		var toDate = new Date(2018, 1, 2, 0, 0, 0, 0);

		$scope.error = [];
		$scope.success = [];

		$scope.dados = {

		};

		var createdFunction;
		var createdMember;
		var createdSchedule;

		testFunction(function (func) {
			createdFunction = func;

			testMember(func, function (member) {
				createdMember = member;

				testSchedule(member, function (schedule) {
					createdSchedule = schedule;

					textExtra(function () {

					});

				});
			});

		});

		function testFunction(callback) {

			insertFunction({
				name: 'function() { console.log(' + getRandomInt(0, 1000) + ') }'
			}, function (func) {

				var rand = 'updated ' + getRandomInt(0, 1000);
				func.name = rand;

				updateFunction(func, function (func2) {

					if (func2.name == rand) {
						$scope.success.push('UPDATE HAPPENED !!!');
						getFunctionById(func2.id, callback);
					} else {
						$scope.success.push('UPDATE FAILED !!!');
					}

				});

			});

		}

		function testMember(func, callback) {

			insertMember({
				name: 'function() { console.log(' + getRandomInt(0, 1000) + ') }',
				identification: getRandomInt(0, 1000),
				sector: 'RIG_CREW',
				function: { id: func.id }
			}, function (member) {

				var rand = 'updated ' + getRandomInt(0, 1000);
				member.name = rand;
				member.function = { id: func.id };

				updateMember(member, function (member2) {

					if (member2.name == rand) {
						$scope.success.push('UPDATE HAPPENED !!!');

						getMemberById(member2.id, callback);

					} else {
						$scope.success.push('UPDATE FAILED !!!');
					}

				});

			});

		}

		function testSchedule(member, callback) {

			var random1 = getRandomInt(fromDate.getTime(), toDate.getTime());
			var random2 = getRandomInt(fromDate.getTime(), toDate.getTime());

			insertSchedule({
				shiftHours: Math.max(random1, random2) - Math.min(random1, random2),
				startDate: new Date(Math.min(random1, random2)).toISOString(),
				endDate: new Date(Math.max(random1, random2)).toISOString(),
				member: { id: member.id }
			}, function (schedule) {

				var random1 = getRandomInt(fromDate.getTime(), toDate.getTime());
				var random2 = getRandomInt(fromDate.getTime(), toDate.getTime());

				schedule.shiftHours = Math.max(random1, random2) - Math.min(random1, random2);
				schedule.startDate = new Date(Math.min(random1, random2)).toISOString();
				schedule.endDate = new Date(Math.max(random1, random2)).toISOString();
				schedule.member = { id: member.id };

				updateSchedule(schedule, function (schedule2) {

					if (new Date(schedule2.startDate).getTime() == Math.min(random1, random2) &&
						new Date(schedule2.endDate).getTime() == Math.max(random1, random2)) {

						$scope.success.push('UPDATE HAPPENED !!!');

						getScheduleById(schedule2.id, callback);

					} else {
						$scope.success.push('UPDATE FAILED !!!');
					}

				});

			});

		}

		function textExtra(callback) {

			// getMemberScore(function () {

			// });


			// indentificationExists(10, 10, function () {

			// });

			getOnlyScheduled(fromDate.getTime(), toDate.getTime(), function (os1) {

				fullScheduleByRangeDate(fromDate.getTime(), toDate.getTime(), function (fs1) {

					removeSchedule(createdSchedule, function () {

						getOnlyScheduled(fromDate.getTime(), toDate.getTime(), function (os2) {

							fullScheduleByRangeDate(fromDate.getTime(), toDate.getTime(), function (fs2) {

								removeMember(createdMember, function () {

									getOnlyScheduled(fromDate.getTime(), toDate.getTime(), function (os3) {

										fullScheduleByRangeDate(fromDate.getTime(), toDate.getTime(), function (fs3) {

											removeFunction(createdFunction, function () {

												getOnlyScheduled(fromDate.getTime(), toDate.getTime(), function (os4) {

													fullScheduleByRangeDate(fromDate.getTime(), toDate.getTime(), function (fs4) {

														console.log(os1, fs1);
														console.log(os2, fs2);
														console.log(os3, fs3);
														console.log(os4, fs4);

													});

												});

											});

										});

									});

								});

							});

						});

					});

				});

			});
		}

		function getMemberScore(callback) {

			scheduleSetupAPIService.getMemberScore(

				function (scheduleList) {
					if (!scheduleList) {
						$scope.error.push('scheduleSetupAPIService.getMemberScore invalid return');
					} else {
						$scope.success.push('scheduleSetupAPIService.getMemberScore worked !!!');
						callback(scheduleList);
					}
				},

				function (error) {
					$scope.error.push('scheduleSetupAPIService.getMemberScore invalid return');
					$scope.error.push(error);
				}

			);

		}

		function getOnlyScheduled(fromDate, toDate, callback) {

			scheduleSetupAPIService.getOnlyScheduled(fromDate, toDate,

				function (scheduleList) {
					if (!scheduleList) {
						$scope.error.push('scheduleSetupAPIService.getOnlyScheduled invalid return');
					} else {
						$scope.success.push('scheduleSetupAPIService.getOnlyScheduled worked !!!');
						callback(scheduleList);
					}
				},

				function (error) {
					$scope.error.push('scheduleSetupAPIService.getOnlyScheduled invalid return');
					$scope.error.push(error);
				}

			);

		}

		function fullScheduleByRangeDate(fromDate, toDate, callback) {

			scheduleSetupAPIService.fullScheduleByRangeDate(fromDate, toDate,

				function (scheduleList) {
					if (!scheduleList) {
						$scope.error.push('scheduleSetupAPIService.fullScheduleByRangeDate invalid return');
					} else {
						$scope.success.push('scheduleSetupAPIService.fullScheduleByRangeDate worked !!!');
						callback(scheduleList);
					}
				},

				function (error) {
					$scope.error.push('scheduleSetupAPIService.fullScheduleByRangeDate invalid return');
					$scope.error.push(error);
				}

			);

		}

		function indentificationExists(currentId, newId, callback) {

			scheduleSetupAPIService.indentificationExists(currentId, newId,

				function (exists) {
					if (exists != true && exists != false) {
						$scope.error.push('scheduleSetupAPIService.indentificationExists invalid return');
					} else {
						$scope.success.push('scheduleSetupAPIService.indentificationExists worked !!!');
						callback(exists);
					}
				},

				function (error) {
					$scope.error.push('scheduleSetupAPIService.indentificationExists invalid return');
					$scope.error.push(error);
				}

			);

		}

		/**
		 * FUNCTION
		 */
		function insertFunction(func, callback) {
			scheduleSetupAPIService.insertFunction(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.insertFunction worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.insertFunction invalid return');
					$scope.error.push(error);
				}
			);
		}

		function getFunctionById(func, callback) {
			scheduleSetupAPIService.getFunctionById(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.getFunctionById worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.getFunctionById invalid return');
					$scope.error.push(error);
				}
			);
		}

		function removeFunction(func, callback) {
			scheduleSetupAPIService.removeFunction(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.removeFunction worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.removeFunction invalid return');
					$scope.error.push(error);
				}
			);
		}

		function updateFunction(func, callback) {
			scheduleSetupAPIService.updateFunction(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.updateFunction worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.updateFunction invalid return');
					$scope.error.push(error);
				}
			);
		}

		/**
		 * MEMBER
		 */
		function insertMember(func, callback) {
			scheduleSetupAPIService.insertMember(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.insertMember worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.insertMember invalid return');
					$scope.error.push(error);
				}
			);
		}

		function getMemberById(func, callback) {
			scheduleSetupAPIService.getMemberById(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.getMemberById worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.getMemberById invalid return');
					$scope.error.push(error);
				}
			);
		}

		function removeMember(func, callback) {
			scheduleSetupAPIService.removeMember(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.removeMember worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.removeMember invalid return');
					$scope.error.push(error);
				}
			);
		}

		function updateMember(func, callback) {
			scheduleSetupAPIService.updateMember(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.updateMember worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.updateMember invalid return');
					$scope.error.push(error);
				}
			);
		}

		/**
		 * SCHEDULE
		 */
		function insertSchedule(func, callback) {
			scheduleSetupAPIService.insertSchedule(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.insertSchedule worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.insertSchedule invalid return');
					$scope.error.push(error);
				}
			);
		}

		function getScheduleById(func, callback) {
			scheduleSetupAPIService.getScheduleById(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.getScheduleById worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.getScheduleById invalid return');
					$scope.error.push(error);
				}
			);
		}

		function removeSchedule(func, callback) {
			scheduleSetupAPIService.removeSchedule(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.removeSchedule worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.removeSchedule invalid return');
					$scope.error.push(error);
				}
			);
		}

		function updateSchedule(func, callback) {
			scheduleSetupAPIService.updateSchedule(
				func, function (response) {
					$scope.success.push('scheduleSetupAPIService.updateSchedule worked !!!');
					callback(response);
				}, function (error) {
					$scope.error.push('scheduleSetupAPIService.updateSchedule invalid return');
					$scope.error.push(error);
				}
			);
		}

	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

})();