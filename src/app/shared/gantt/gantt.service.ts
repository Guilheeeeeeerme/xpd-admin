
import '../../../assets/js/dhtmlxgantt.js';

export class GanttService {

	public static $inject = ['$document', '$q', '$rootScope'];
	private d: angular.IDeferred<{}>;
	private readonly ganttIntance: any = (window as any).gantt;

	constructor(
		private $document: ng.IDocumentService,
		private $q: ng.IQService,
		private $rootScope: ng.IRootScopeService) {

		this.d = $q.defer();
		this.d.resolve(this.ganttIntance);

	}
	public gantt() {
		return this.d.promise;
	}
}
// })();
