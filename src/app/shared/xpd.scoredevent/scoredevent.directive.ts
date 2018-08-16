
export class XPDScoredEventsDirective implements ng.IDirective {

		public static Factory(): ng.IDirectiveFactory {
		  return () => new XPDScoredEventsDirective();
		}
	// Runs during compile
	public scope = {
		eventList: '=',
		name: '@name',
	};
	public restrict = 'A';
	public template = '<table class="table">' +
		'<caption>{{ name }}</caption>' +
		'<thead>' +
		'<tr>' +
		'<th>Start Time</th>' +
		'<th>Duration</th>' +
		'<th>Vtarget</th>' +
		'<th>Consistence</th>' +
		'</tr>' +
		'</thead>' +
		'<tbody>' +
		'<tr ng-repeat="event in eventList | orderBy: \'startTime\' ">' +
		'<td>{{ event.startTime | date: \'mediumTime\' }}</td>' +
		'<td>{{ (event.duration / 1000) | number: 0 }}</td>' +
		'<td>{{ (event.target / 1000) }}</td>' +
		'<td>{{ event.score | number: 1 }}</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>';
}
