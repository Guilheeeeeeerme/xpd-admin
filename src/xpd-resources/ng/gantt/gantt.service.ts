(function() {
	'use strict';

	/**
     * @author Xavier
     * @description Service para injeção da biblioteca d3 como dependência e
     *        manter o namespace limpo
     * @source http://www.ng-newsletter.com/posts/d3-on-angular.html
     */
	angular.module('gantt')
		.factory('ganttService', ganttService);

	ganttService.$inject = ['$document', '$q', '$rootScope'];

	function ganttService($document, $q, $rootScope) {
		let d = $q.defer();

		function onScriptLoad() {
			// Load client in the browser
			$rootScope.$apply(function() {
				d.resolve(window.gantt);
			});
		}

		// Create a script tag with d3 as the source
		// and call our onScriptLoad callback when it
		// has been loaded
		let scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		scriptTag.src = '../assets/js/dhtmlxgantt.js';

		scriptTag.onreadystatechange = function() {
			if (this.readyState == 'complete') { onScriptLoad(); }
		};
		scriptTag.onload = onScriptLoad;

		let s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

		return {
			gantt() {
				return d.promise;
			},
		};
	}
})();
