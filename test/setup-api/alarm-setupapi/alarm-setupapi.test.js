(function () {
	'use strict';

	angular.module('setup.test').controller('alarmSetupTestController', alarmSetupTestController);

	alarmSetupTestController.$inject = ['$scope', 'alarmSetupAPIService','operationSetupAPIService'];

	function alarmSetupTestController($scope, alarmSetupAPIService, operationSetupAPIService) {

		$scope.error = [];
		$scope.success = [];

		$scope.dados = {

		};

		test1(function(){
			$scope.success.push( 'FIM' );
			$scope.error.push( 'FIM' );

			test2(function(){
				$scope.success.push( 'FIM' );
				$scope.error.push( 'FIM' );
			});
		});

		function test1(callback){

			$scope.success.push('START');
			$scope.error.push( 'START' );
			
			getOperationList(function(operations){

				var indexes = [];

				operations = operations.filter(function(op){
					return op.type != 'time';
				});

				if(!operations || !operations.length){
					$scope.error.push('must have a bha, a riser or a casing');
					return;
				}

				var randomOperation = operations[ getRandomInt(0, operations.length - 1) ];
			
				var alarmName = 'Alarm X';
				var newAlarmName = 'Alarm Y';

				var randomAlarm = getRandomAlarm(alarmName, randomOperation);

				insertAlarm(randomAlarm, function(alarm){

					$scope.success.push( ( alarm.name + ' kept the name? ' + (alarm.name == alarmName) ) );
					alarm.name = newAlarmName;

					updateAlarm(alarm, function(alarm){

						$scope.success.push( ( alarm.name + ' changed the name? ' + (alarm.name == newAlarmName) ) );

						$scope.success.push( ( alarm.name + ' is archived? ' + (alarm.archivedAlarm) ) );
						updateArchive(alarm.id, !alarm.archivedAlarm, function(alarm){
						
							$scope.success.push( ( alarm.name + ' is archived? ' + (alarm.archivedAlarm) ) );
							updateArchive(alarm.id, !alarm.archivedAlarm, function(alarm){
						
								$scope.success.push( ( alarm.name + ' is archived? ' + (alarm.archivedAlarm) ) );
								updateArchive(alarm.id, !alarm.archivedAlarm, function(alarm){
							
									removeAlarm(alarm, callback);

								});
						
							});
					
						});
					
					});

				});
			});
		}


		function test2(callback){

			$scope.success.push('START');
			$scope.error.push('START');
			
			getOperationList(function(operations){

				operations = operations.filter(function(op){
					return op.type == 'bha';
				});

				if(!operations || operations.length < 2){
					$scope.error.push('you must have at least 2 BHAs on database');
					return;
				}

				getByOperationType('bha', operations[0].id, function(alarms){
					var numberOfAlarms = alarms.length;
					var promises = [];

					for(var i = 0; i < 4; i++){
						promises.push(new Promise(function(resolve, reject){
							insertAlarm(getRandomAlarm('t', operations[1]), resolve, reject)
						}));
					}

					Promise.all(promises).then(function(){
						getByOperationType('bha', operations[0].id, function(alarms){
							if(alarms.length == (numberOfAlarms + 4) ){
								$scope.success.push('funcionou a função but not');
								callback();
							}else{
								$scope.error.push('não funcionou a função but not');
							}
						});
					})


				});

			});

		}

		function getByOperationType(type, operationId, callback){

			alarmSetupAPIService.getByOperationType(type, operationId, function(alarms){
				$scope.success.push('alarmSetupAPIService.getByOperationType worked !!!');
				callback(alarms);
			}, function(){
				$scope.error.push('alarmSetupAPIService.getByOperationType invalid return');
			});

		}

		function getOperationById(operationId, callback){
			operationSetupAPIService.getObjectById(operationId, function(operation){
				if(!operation || !operation.id){
					$scope.error.push('operationSetupAPIService.getObjectById invalid return');
					return;
				}

				$scope.success.push('operationSetupAPIService.getObjectById worked !!!');
				callback(operation);
			}, function(){
				$scope.error.push('operationSetupAPIService.getObjectById invalid return');
			});
		}

		function getOperationList(callback){
		
			operationSetupAPIService.getList(function(operations){

				if(!operations){
					$scope.error.push('operationSetupAPIService.getList invalid return');
					return;
				}else{
					$scope.success.push('operationSetupAPIService.getList worked !!!');
				}

				callback(operations);

			}, function(){
				$scope.error.push('operationSetupAPIService.getList invalid return');
			});

		}

		function updateArchive(id, archived, callback){

			alarmSetupAPIService.updateArchive(id, archived, 

				function(alarm){

					if(!alarm || !alarm.id){
						$scope.error.push('alarmSetupAPIService.updateArchive invalid return');
						return;
					}

					$scope.success.push('alarmSetupAPIService.updateArchive worked !!!');
					callback(alarm);

				},
				function(error){
					$scope.error.push('alarmSetupAPIService.updateArchive invalid return');
					$scope.error.push(error);
				}
			);
		}

		function removeAlarm(alarm, callback){
			alarmSetupAPIService.removeAlarm(alarm, 
				function(alarm){

					if(!alarm || !alarm.id){
						$scope.error.push('alarmSetupAPIService.removeAlarm invalid return');
						return;
					}

					$scope.success.push('alarmSetupAPIService.removeAlarm worked !!!');
					callback(alarm);

				},
				function(error){
					$scope.error.push('alarmSetupAPIService.removeAlarm invalid return');
					$scope.error.push(error);
				}
			);
		}

		function updateAlarm(alarm, callback){
			alarmSetupAPIService.updateAlarm(alarm, 
				function(alarm){

					if(!alarm || !alarm.id){
						$scope.error.push('alarmSetupAPIService.updateAlarm invalid return');
						return;
					}

					$scope.success.push('alarmSetupAPIService.updateAlarm worked !!!');
					callback(alarm);

				},
				function(error){
					$scope.error.push('alarmSetupAPIService.updateAlarm invalid return');
					$scope.error.push(error);
				}
			);
		}

		function insertAlarm(alarm, callback){

			alarmSetupAPIService.insertAlarm(alarm,

				function(alarm){

					if(!alarm || !alarm.id){
						$scope.error.push('alarmSetupAPIService.insertAlarm invalid return');
						return;
					}

					$scope.success.push('alarmSetupAPIService.insertAlarm worked !!!');
					callback(alarm);

				},

				function(error){
					$scope.error.push('alarmSetupAPIService.insertAlarm invalid return');
					$scope.error.push(error);
				});
		}
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomAlarm(alarmName, randomOperation){
		return {
			name: alarmName,
			archivedAlarm: ( getRandomInt(0,1) == 0 ),
			defaultAlarm: ( getRandomInt(0,1) == 0 ),
			hasvre: ( getRandomInt(0,1) == 0 ),
			alarmType: 'depth',
			tripin: ( getRandomInt(0,1) == 0 ),
			tripout: ( getRandomInt(0,1) == 0 ),
			alwaysTripin: ( getRandomInt(0,1) == 0 ),
			alwaysTripout: ( getRandomInt(0,1) == 0 ),
			hasSpeedRestriction: ( getRandomInt(0,1) == 0 ),
			speedRestriction: ( getRandomInt(0, 5000) ),
			isDurationAlarm: ( getRandomInt(0,1) == 0 ),
			startDepth: ( getRandomInt(0, 5000) ),
			endDepth: ( getRandomInt(0, 5000) ),
			optimumSpeed: ( getRandomInt(0, 5000) ),
			duration: ( getRandomInt(0, 5000) ),
			message: 'Alarme do teste',
			startTime: null,
			endTime: null,
			operation: { id: randomOperation.id },
			timeSlices: []
		};
	}

})();