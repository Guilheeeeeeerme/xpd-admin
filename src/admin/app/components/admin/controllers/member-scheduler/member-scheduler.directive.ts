export class MemberSchedulerDirective implements ng.IDirective {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.directive('memberScheduler', memberScheduler);

	// memberScheduler.$inject = ['$compile', 'ganttService'];
	public static $inject: string[] = ['$compile', 'ganttService'];

	public restrict = 'A';
	public scope = {
		scheduleList: '=',
		referenceDate: '=',
		scheduleActions: '=',
		monthlyView: '=',
	};

	constructor(private $compile: ng.ICompileService, private ganttService: GanttService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {
		const self = this;

		this.ganttService.gantt().then(function (gantt) {

			let prevSelected = null;
			let columnWidth = 15;
			const taskCellWidth = {
				left: columnWidth * 24,
				width: columnWidth * 24,
			};

			loadDailyConfiguration();

			loadDefaultConfiguration();

			gantt.init(attrs.id);

			const identificationSpan = document.createElement('span');
			identificationSpan.className = 'member-scheduler-identification-label';

			document.querySelector('.gantt_data_area').appendChild(identificationSpan);

			createMonthlyOverlay();

			/********************************************************************/
			/********************************************************************/
			/********************************************************************/

			scope.$watch('scheduleList', updateSchedule);

			scope.$watch('referenceDate', updateReferenceDate);

			scope.$watch('monthlyView', changeMontlhyView);

			gantt.attachEvent('onGanttRender', function () {
				initTaskCellWidth();
				renderOddBgColumn();
			});

			gantt.attachEvent('onDataRender', function () {
				renderOddBgColumn();
			});

			gantt.attachEvent('onXPDButtonAddMember', function (task) {
				scope.scheduleActions.onUpsertMember(task, {});
			});

			gantt.attachEvent('onXPDButtonAddFunction', function () {
				scope.scheduleActions.onUpsertFunction({});
			});

			gantt.attachEvent('onXPDButtonAddSchedule', function (sibling) {
				scope.scheduleActions.onUpsertSchedule(sibling, {
					startDate: scope.referenceDate,
					startDate_time: scope.referenceDate.getHours(),
				});
			});

			gantt.attachEvent('onXPDButtonRemoveSchedules', function (sibling) {
				scope.scheduleActions.onRemoveSchedules(sibling, {
					startDate: scope.referenceDate,
					startDate_time: scope.referenceDate.getHours(),
				});
			});

			gantt.attachEvent('onAfterTaskUpdate', function (id, item) {
				scope.scheduleActions.onMouseScheduleUpdate(gantt.getTask(id));
			});

			gantt.attachEvent('onXPDButtonEditFunction', function (task) {
				scope.scheduleActions.onFunctionUpdate(task);
			});

			gantt.attachEvent('onXPDButtonEditMember', function (task) {
				scope.scheduleActions.onMemberUpdate(task);
			});

			gantt.attachEvent('onXPDButtonEditSchedule', function (task) {
				scope.scheduleActions.onScheduleUpdate(task);
			});

			gantt.attachEvent('onMouseMove', function (id, event) {
				let taskId;

				if (event.path[1].className !== 'gantt_cell') {
					taskId = event.path[1].getAttribute('task_id');
				} else {
					taskId = event.path[2].getAttribute('task_id');
				}

				if (taskId != null) {
					let task = gantt.getTask(taskId);

					if (task.sib_id) {
						taskId = task.sib_id;
						task = gantt.getTask(task.sib_id);
					}

					const element = document.querySelectorAll('div[task_id=\'' + taskId + '\']');

					if (element.length === 2) {

						if (prevSelected) {
							removeClass(prevSelected[0], 'gantt_selected');
							removeClass(prevSelected[1], 'gantt_selected');
						}

						addClass(element[0], 'gantt_selected');
						addClass(element[1], 'gantt_selected');

						createIdentificationDiv(element[1], task, event);

						prevSelected = element;
					}

				} else {
					identificationSpan.textContent = '';

					if (prevSelected) {
						removeClass(prevSelected[0], 'gantt_selected');
						removeClass(prevSelected[1], 'gantt_selected');
					}

					prevSelected = null;
				}

			});

			gantt.attachEvent('onXPDEmptyRowClick', function (task, date) {
				if (typeof (task.sib_id) === 'undefined') {
					const schedule = {
						endDate: new Date(new Date(date).getTime() + 3600000),
						startDate: new Date(new Date(date).getTime()),
						shiftHours: 3600000,
						member: { id: task.memberId },
					};

					scope.scheduleActions.insertScheduleOnEmptyRow(schedule);
				}
			});

			function updateSchedule(scheduleList) {

				gantt.clearAll();

				gantt.parse({
					data: scheduleList,
				});
			}

			function updateReferenceDate(newValue) {

				if (scope.monthlyView) {
					gantt.config.start_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth(), 1);
					gantt.config.end_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth() + 1, 1);
				} else {
					gantt.config.start_date = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate() - 1);
					gantt.config.end_date = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate() + 1, 23, 59, 59);
				}

				gantt.render();
			}

			function changeMontlhyView(monthlyViewValue) {
				if (monthlyViewValue != null) {
					if (monthlyViewValue) {
						loadMontlhyConfiguration();
						renderMonthyOverlay();
					} else {
						loadDailyConfiguration();
						hideMontlhyOverlay();
					}

					gantt.render();
				}
			}

			function loadDefaultConfiguration() {
				gantt.config.min_column_width = columnWidth;
				gantt.config.work_time = false;
				gantt.config.correct_work_time = false;

				gantt.config.show_errors = false;
				gantt.config.show_progress = false;
				gantt.config.show_links = false;

				gantt.config.columns = [
					{ name: 'text', label: 'Functions', tree: true, width: '*' },
					{ name: 'remove', label: '', width: 36 },
					{ name: 'add', label: '', width: 36 },
				];
			}

			function hasClass(ele, cls) {
				return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
			}

			function addClass(ele, cls) {
				if (!hasClass(ele, cls)) { ele.className += ' ' + cls; }
			}

			function removeClass(ele, cls) {
				if (hasClass(ele, cls)) {
					const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
					ele.className = ele.className.replace(reg, '');
				}
			}

			function loadDailyConfiguration() {
				/**
				 * GANTT CONFIGURATION
				 **/

				columnWidth = 15;

				gantt.config.scale_unit = 'hour';
				gantt.config.duration_step = 1;
				gantt.config.duration_unit = 'hour';
				gantt.config.step = 1;
				gantt.config.date_scale = '<span class=\'member-scheduler-hour-label\'>%H</span>';
				gantt.config.grid_width = 300;

				gantt.config.scale_height = 50;

				gantt.config.start_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth(), scope.referenceDate.getDate() - 1);
				gantt.config.end_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth(), scope.referenceDate.getDate() + 1, 23, 59, 59);

				gantt.config.subscales = [
					{ unit: 'day', step: 1, date: '<b>%j %F %Y, %l</b>' },
				];
			}

			function loadMontlhyConfiguration() {
				/**
				 * GANTT CONFIGURATION
				 **/

				columnWidth = 30;

				gantt.config.scale_unit = 'day';
				gantt.config.duration_step = 1;
				gantt.config.duration_unit = 'day';
				gantt.config.step = 1;
				gantt.config.date_scale = '<span class=\'member-scheduler-hour-label\'>%j</span>';

				gantt.config.grid_width = 300;

				gantt.config.scale_height = 50;

				gantt.config.start_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth(), 1);
				gantt.config.end_date = new Date(scope.referenceDate.getFullYear(), scope.referenceDate.getMonth() + 1, 1);

				gantt.config.subscales = [
					{ unit: 'month', step: 1, date: '<b>%F</b>' },
				];
			}

			function createMonthlyOverlay() {
				const bgOverlay = document.createElement('div');
				bgOverlay.className = 'member-scheduler-monthly-view-overlay';

				document.querySelector('.gantt_data_area').appendChild(bgOverlay);

				const iconSize = 50;
				const dataAreaRect = document.querySelector('.gantt_data_area').getBoundingClientRect();

				const iconPosition = {
					top: ((dataAreaRect.height / 2) - (iconSize) - 25),
					left: ((dataAreaRect.width / 2) - (iconSize / 2)),
				};

				const monthlyViewLockIcon = document.createElement('span');
				monthlyViewLockIcon.className = 'glyphicon glyphicon-lock member-scheduler-monthly-view-overlay-icon';

				monthlyViewLockIcon.style.fontSize = iconSize + 'px';
				monthlyViewLockIcon.style.top = iconPosition.top + 'px';
				monthlyViewLockIcon.style.left = iconPosition.left + 'px';

				bgOverlay.appendChild(monthlyViewLockIcon);
			}

			function renderMonthyOverlay() {
				const monthlyOverlayHeight = document.querySelector('.gantt_task_bg').getBoundingClientRect().height;

				document.querySelector('.member-scheduler-monthly-view-overlay').style.height = monthlyOverlayHeight;
				document.querySelector('.member-scheduler-monthly-view-overlay').style.display = 'block';
			}

			function hideMontlhyOverlay() {
				document.querySelector('.member-scheduler-monthly-view-overlay').style.display = 'none';
			}

			function createIdentificationDiv(taskRowElement, task, event) {
				/**
				 * CREATING NEW IDENTIFICATION DIV
				 */

				const dataGridReference = document.querySelector('.gantt_data_area');
				identificationSpan.style.top = event.clientY - dataGridReference.getBoundingClientRect().top + dataGridReference.scrollTop + 'px';
				identificationSpan.style.left = event.clientX - dataGridReference.getBoundingClientRect().left + 15 + 'px';

				/**
				 * GETTING TASK INFO AND SETTING LABELS
				 **/
				identificationSpan.textContent = task.text;

				if (task.memberIdentification) {
					identificationSpan.textContent += ' - ' + task.memberIdentification;
				}
			}

			function initTaskCellWidth() {
				const row = document.querySelector('.gantt_task_row');

				if (row != null) {
					const taskCells = row.querySelectorAll('.gantt_task_cell');

					taskCellWidth.left = 0;
					taskCellWidth.width = 0;

					for (let i = 0; i < taskCells.length; i++) {
						if (i < 24) {
							taskCellWidth.left += taskCells[i].getBoundingClientRect().width;
						} else if (i >= 24 && i < 48) {
							taskCellWidth.width += taskCells[i].getBoundingClientRect().width;
						} else {
							break;
						}
					}
				}
			}

			function renderOddBgColumn() {
				const oldOddBgColumns = document.querySelectorAll('.member-scheduler-odd-bg-column');

				if (oldOddBgColumns.length > 0) {
					// FOR EACH HACK
					[].forEach.call(oldOddBgColumns, function (element) {
						element.remove();
					});
				}

				const oddBGColumnReferenceElements = document.querySelectorAll('.gantt_task_row');

				if (oddBGColumnReferenceElements.length > 0) {
					if (scope.monthlyView) {
						// FOR EACH HACK
						[].forEach.call(oddBGColumnReferenceElements, createOddColumnsMonthlyView);
					} else {
						[].forEach.call(oddBGColumnReferenceElements, createOddColumnsDailyView);
					}
				}
			}

			function createOddColumnsDailyView(element) {
				const referenceBoundingRect = element.getBoundingClientRect();

				const oddBGColumn = document.createElement('div');
				oddBGColumn.className = 'member-scheduler-odd-bg-column';

				oddBGColumn.style.height = referenceBoundingRect.height + 'px';

				oddBGColumn.style.width = taskCellWidth.width + 'px';
				oddBGColumn.style.left = taskCellWidth.left + 'px';

				element.appendChild(oddBGColumn);
			}

			function createOddColumnsMonthlyView(element) {
				[].forEach.call(element.childNodes, function (cellElement, index) {
					if (index % 2 === 1) {
						const oddBGColumn = document.createElement('div');
						oddBGColumn.className = 'member-scheduler-odd-bg-column';

						oddBGColumn.style.width = '100%';
						oddBGColumn.style.height = '100%';

						cellElement.style.position = 'relative';

						cellElement.appendChild(oddBGColumn);
					}
				});
			}

			scope.scheduleActions.addToGantt = function (type, data) {

				try {
					let newTask = null;
					let placeHolderTask = null;

					if (type === 'function') {
						const functionTaskId = 'f_' + data.id;

						newTask = {};
						newTask.id = functionTaskId;
						newTask.text = data.name;
						newTask.open = true;
						newTask.type = 'section';
						newTask.functionId = data.id;

						// FUNCTION PLACEHOLDER
						placeHolderTask = {};
						placeHolderTask.id = 'p_' + data.id;
						placeHolderTask.text = '';
						placeHolderTask.parent = functionTaskId;
						placeHolderTask.sib_id = functionTaskId;
					} else if (type === 'member') {

						const memberTaskId = 'm_' + data.id;

						newTask = {};
						newTask.id = memberTaskId;
						newTask.text = data.name;
						newTask.memberId = data.id;
						newTask.parent = 'f_' + data.function.id;

					} else if (type === 'schedule') {
						newTask = {};
						newTask.id = data.id;
						newTask.text = '';
						newTask.start_date = new Date(data.startDate).getTime();
						newTask.end_date = new Date(data.endDate).getTime();
						newTask.sib_id = 'm_' + data.member.id;
					}

					if (newTask != null) {
						gantt.addTask(newTask);

						if (type === 'function') {
							gantt.addTask(placeHolderTask);
						}
					}

				} catch (e) {
					// alert(e.stack);
				}

			};

			scope.scheduleActions.removeFromGantt = function (type, data) {

				try {

					if (type === 'function') {
						gantt.deleteTask('f_' + data.id);
					} else if (type === 'member') {
						gantt.deleteTask('m_' + data.id);
					} else if (type === 'schedule') {
						if (data && data.length) {
							for (const i in data) {
								gantt.deleteTask(data[i].id);
							}
						} else {
							gantt.deleteTask(data.id);
						}
					}

				} catch (e) {
					// alert(e.stack);
				}

				// else if (type === 'schedule')
				// 	gantt.deleteTask(data.data.id);
				// else
				//     gantt.deleteTask(data.id);
			};

			scope.scheduleActions.updateFromGantt = function (type, data) {

				try {

					let newTask;

					if (type === 'function') {
						newTask = gantt.getTask('f_' + data.id);

						newTask.text = data.name;
					} else if (type === 'member') {
						newTask = gantt.getTask('m_' + data.id);

						newTask.text = data.name;
					} else if (type === 'schedule') {
						newTask = gantt.getTask(data.id);

						newTask.start_date = new Date(data.startDate).getTime();
						newTask.end_date = new Date(data.endDate).getTime();
					}

					gantt.updateTask(newTask.id);
					gantt.refreshData();

				} catch (e) {
					// alert(e.stack);
				}
			};
		});
	}

	public static Factory(): ng.IDirectiveFactory {
		return ($compile: ng.ICompileService, ganttService: GanttService) => new MemberSchedulerDirective($compile, ganttService);
	}
}
