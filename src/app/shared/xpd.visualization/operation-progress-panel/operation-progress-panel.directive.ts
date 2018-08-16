import './operation-progress-panel.style.scss';
import template from './operation-progress-panel.template.html';

export class OperationProgressPanelDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new OperationProgressPanelDirective();
	}
	public restrict = 'EA';
	public template = template;
	public scope = {
		currentScore: '=',
		progressData: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const keyName = 'panelOperationProgressIsCollapsed';
		scope.collapse = getPanelState();

		scope.getProgressPercentage = getProgressPercentage;

		scope.$watch('progressData', getDirectiveData);

		function getDirectiveData(progressData) {
			const directiveData = [{
				label: 'Target Operation',
				totalTime: 0,
				expectedTime: 0,
				actualTime: 0,
			}];

			for (const eventKey in progressData) {
				if (eventKey === 'CONN') {
					progressData[eventKey].label = 'Connection';
				} else if (eventKey === 'TRIP') {
					progressData[eventKey].label = 'Trip';
				}

				directiveData[0].totalTime += progressData[eventKey].totalTime;
				directiveData[0].expectedTime += progressData[eventKey].expectedTime;
				directiveData[0].actualTime += progressData[eventKey].actualTime;

				directiveData.push(progressData[eventKey]);
			}

			scope.directiveData = directiveData;
		}

		function getProgressPercentage(totalTime, currentTime) {
			return (currentTime * 100) / totalTime + '%';
		}

		function getPanelState() {
			try {
				return JSON.parse(localStorage.getItem(keyName));
			} catch (error) {
				return true;
			}
		}

		scope.changePanelState = () => {
			const newState = !getPanelState();
			scope.collapse = newState;
			localStorage.setItem(keyName, JSON.stringify(newState));
		};
	}
}
