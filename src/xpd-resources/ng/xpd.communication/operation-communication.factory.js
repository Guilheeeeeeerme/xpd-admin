(function () {
	'use strict',

	angular.module('xpd.communication').factory('operationCommunicationFactory', operationCommunicationFactory);

	operationCommunicationFactory.$inject = ['$q', 'socketFactory', 'xpdAccessFactory'];

	function operationCommunicationFactory($q, socketFactory, xpdAccessFactory) {

		var communicationChannel = null;

		operationCommunicationFactory
			.openCommunicationChannel(socketName, threads).then(function(gezzy){
				console.log(gezzy);
			});

		return {
			openCommunicationChannel: openCommunicationChannel 
		};

		function openCommunicationChannel(socketName, threads) {

			return $q(function (resolve, reject) {

				if (communicationChannel) {
					resolve(communicationChannel);
				} else {

					var socket = socketFactory(xpdAccessFactory.getOperationServerURL(), socketName + '-socket', threads);

					socket.on('subjects', function (data) {

						var ContextSubjects = data.ContextSubjects;
						var UserActions = data.UserActions;

						window.ContextSubjects = ContextSubjects;
						window.UserActions = UserActions;

						communicationChannel = new CommunicationChannel(socket, ContextSubjects, UserActions);

						resolve(communicationChannel);
					});

				}
			});
		}

		function CommunicationChannel(socket, ContextSubjects, UserActions) {

			var self = this;

			self.socket = socket;

			for (var i in ContextSubjects) {

				var contextSubject = ContextSubjects[i];

				var subject = contextSubject.toLowerCase();

				subject = subject.replace(/_./g, function (v) {
					return v.toUpperCase().replace(/_/g, '');
				});

				subject = 'set' + subject.charAt(0).toUpperCase() + subject.slice(1) + 'Listener';
				// alert(subject);

				self[subject] = setOn(contextSubject);
			}

			for (var i in UserActions) {

				var userAction = UserActions[i];

				var action = userAction.toLowerCase();

				action = action.replace(/_./g, function (v) {
					return v.toUpperCase().replace(/_/g, '');
				});

				action = 'emit' + action.charAt(0).toUpperCase() + action.slice(1);
				// alert(action);

				self[action] = setEmit(userAction);
			}

			function setOn(eventName) {

				return function (callback) {
					self.socket.on(eventName, callback);
				};
			}

			function setEmit(eventName) {

				return function (data) {
					self.socket.emit(eventName, data);
				};
			}

		}

	}

})();
