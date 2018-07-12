// (function() {
// 	'use strict';

// 	/**
//      * @author Xavier
//      * @description Service para injeção da biblioteca d3 como dependência e
//      *        manter o namespace limpo
//      * @source http://www.ng-newsletter.com/posts/d3-on-angular.html
//      */
// 	angular.module('gantt')
// 		.factory('ganttService', ganttService);

// ganttService.$inject = ['$document', '$q', '$rootScope'];

export class GanttService {

	public static $inject = ['$document', '$q', '$rootScope'];
	private d: angular.IDeferred<{}>;

	constructor(
		private $document: ng.IDocumentService,
		private $q: ng.IQService,
		private $rootScope: ng.IRootScopeService) {
		const self = this;

		this.d = $q.defer();

		function onScriptLoad() {
			// Load client in the browser
			$rootScope.$apply(function () {
				self.d.resolve((window as any).gantt);
			});
		}

		// Create a script tag with d3 as the source
		// and call our onScriptLoad callback when it
		// has been loaded
		const scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		scriptTag.src = '../assets/js/dhtmlxgantt.js';

		(scriptTag as any).onreadystatechange = function () {
			if (this.readyState === 'complete') { onScriptLoad(); }
		};
		scriptTag.onload = onScriptLoad;

		const s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

	}
	public gantt() {
		return this.d.promise;
	}
}
// })();
