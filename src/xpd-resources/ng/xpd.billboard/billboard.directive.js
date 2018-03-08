(function () {
	'use strict';

	angular.module('xpd.billboard', ['xpd.communication', 'xpd.setupapi', 'xpd.dialog']).directive('xpdBillboard', xpdBillboard);

	xpdBillboard.$inject = ['$location', '$anchorScroll', '$timeout', 'dialogFactory', 'setupAPIService', 'billboardSetupAPIService'];

	function xpdBillboard($location, $anchorScroll, $timeout, dialogFactory, setupAPIService, billboardSetupAPIService) {

		function link(scope, element, attrs) {

			var lastItemClickCount = 0;
			var lastItemTimeOut = null;

			scope.showBillboardModal = false;
			scope.confirmButtonModalAction = confirmButtonModalAction;
			scope.cancelButtonModalAction = cancelButtonModalAction;

			if (scope.xpdBillboardType == 'warning') {

				scope.$watch('alarms', function (newValue) {

					//$timeout(function() {
					scope.billboardItems = newValue;
					scope.lastItem = null;

					var lastItem = null;

					for (var i in newValue) {

						if (newValue[i].seenAt == null) {
							lastItem = newValue[i];
						}
					}

					scope.lastItem = lastItem;
					scope.hasItem = (lastItem == null) ? false : true;

					//}, 100);

				}, true);
			} else {
				scope.$watch('messages', function (newValue) {
					//$timeout(function() {

					scope.lastItem = null;
					scope.billboardItems = newValue;

					var lastItem = null;

					for (var i in newValue) {

						if (newValue[i].seenAt == null) {
							lastItem = newValue[i];
						}
					}

					scope.lastItem = lastItem;
					scope.hasItem = (lastItem == null) ? false : true;
					//}, 100);

				}, true);
			}


			scope.$watch('well', function () {

				if (scope.well != null && scope.well.id != null) {

					scope.lastItem = null;

					if (scope.xpdBillboardType == 'warning') {
						scope.alarms = [];
						delete scope.messages;
					} else {
						scope.messages = [];
						delete scope.alarms;
					}

					scope.clickOnBillboard = clickOnBillboard;

					scope.actionButtonSend = actionButtonSend;

					lastItemClickCount = 0;
					lastItemTimeOut = null;

					billboardSetupAPIService.getWellBillboardItems(scope.well.id, function (billboardItems) {

						for (var i in billboardItems) {
							if (billboardItems[i].type == 'MSG' && scope.xpdBillboardType != 'warning') {
								scope.messages.push(billboardItems[i]);
							} else if (billboardItems[i].type != 'MSG' && scope.xpdBillboardType == 'warning') {
								scope.alarms.push(billboardItems[i]);
							}
						}
					});
				}

			});

			if (scope.xpdBillboard == 'driller') {
				scope.communication.emitNewBillboardItem(function (item) {

					if (item.type == 'MSG' && scope.xpdBillboardType != 'warning') {
						scope.messages.push(item);
					} else if (item.type != 'MSG' && scope.xpdBillboardType == 'warning') {
						scope.alarms.push(item);
					}

				});
			} else {
				scope.communication.emitConfirmBillboardItem(replaceOnList);
			}

			function replaceOnList(item) {
				$timeout(function () {

					if (item.type == 'MSG' && scope.xpdBillboardType != 'warning') {
						for (var i in scope.messages) {

							if (scope.messages[i].id == item.id) {
								scope.messages[i] = item;
								break;
							}
						}
					} else if (item.type != 'MSG' && scope.xpdBillboardType == 'warning') {
						for (var i in scope.alarms) {

							if (scope.alarms[i].id == item.id) {
								scope.alarms[i] = item;
								break;
							}
						}
					}
				}, 100);
			}

			function emitConfirmBillboardItem(item) {
				var object = {
					id: item.id,
					text: item.text,
					sentAt: item.sentAt,
					type: item.type,
					well: {id: scope.well.id},
					seenAt: new Date().toISOString()
				};

				setupAPIService.updateObject('tripin/billboard-item', object, function (item) {
					scope.communication.emitConfirmBillboardItem(item);
					replaceOnList(item);
				});
			}

			function actionButtonSend() {

				var object = {
					text: scope.message,
					sentAt: new Date().toISOString(),
					type: 'MSG',
					well: {id: scope.well.id}
				};

				setupAPIService.insertObject('tripin/billboard-item',
					object,
					function (item) {
    					scope.messages.push(item);
    					scope.communication.emitConfirmBillboardItem(item);
    					delete scope.message;
					});
			}

			function clickOnBillboard() {

				if (scope.xpdBillboard != 'driller') {
					return;
				}

				if (lastItemClickCount == 0 && scope.lastItem != null) {
					lastItemClickCount = 1;

					$location.hash('item-' + scope.lastItem.id);
					$anchorScroll();

					document.querySelector('#item-' + scope.lastItem.id).className = 'xpd-billboard-item xpd-billboard-item-selected';

					$timeout.cancel(lastItemTimeOut);

					lastItemTimeOut = $timeout(function () {
						lastItemClickCount = 0;
						$location.hash('item-top');
						$anchorScroll();
						scope.showBillboardModal = false;

						document.querySelector('#item-' + scope.lastItem.id).className = 'xpd-billboard-item';
					}, 7000);

				} else if (lastItemClickCount == 1 && scope.lastItem != null) {
					createBillboardModal();
					/*dialogFactory.showConfirmDialog('Do you confirm you read: "' + scope.lastItem.text + '"',
                     function() {
                     emitConfirmBillboardItem(scope.lastItem);
                     });*/
				} else {
					lastItemClickCount = 0;
					$location.hash('item-top');
					$anchorScroll();
				}
			}

			function createBillboardModal() {
				/*var obj = document.querySelector('#item-' + scope.lastItem.id);

                 var childPosTop = obj.offsetTop;
                 var parentPosTop = obj.parentElement.offsetTop;
                 scope.modalPosition = childPosTop - parentPosTop;*/

				scope.showBillboardModal = true;
				scope.billboardText = 'Do you confirm you read: \'' + scope.lastItem.text + '\'?';
			}

			function confirmButtonModalAction() {
				scope.showBillboardModal = false;
				console.log('confirmButtonModalAction');
				lastItemClickCount = 0;
				emitConfirmBillboardItem(scope.lastItem);
			}

			function cancelButtonModalAction() {
				console.log('cancelButtonModalAction');
				lastItemClickCount = 0;
				scope.showBillboardModal = false;
			}
		}

		return {
			scope: {
				'well': '=',
				'xpdBillboard': '@',
				'xpdBillboardType': '@',
				'hasItem': '=',
				'communication': '='
			},
			restrict: 'A',
			link: link,
			templateUrl: '../xpd-resources/ng/xpd.billboard/billboard.template.html'
		};
	}

})();
