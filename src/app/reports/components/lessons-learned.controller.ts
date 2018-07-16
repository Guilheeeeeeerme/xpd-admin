import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import template from './modal/lessons-learned-report.modal.html';

export class LessonsLearnedController {
	// 'use strict';

	// angular.module('xpd.reports').controller('LessonsLearnedController', lessonsLearnedController);

	public static $inject = ['$scope', '$uibModal', 'reportsSetupAPIService'];
	public totalTime: any;
	public totalLessons: any;
	public nodeList: any[];
	public chartPareto: { title: string; data: any[]; totalTime: number; };
	public chartDonut: { title: any; data: any[]; };
	public onClickFilterButton: (fromDate: any, toDate: any) => void;
	public actionButtonSelectCategory: (node: any) => void;
	public actionClickBreadcrumbs: (key: any, node: any) => void;
	public actionButtonClickCategory: (category: any) => void;
	public modalActionButtonClose: () => void;

	constructor($scope, $modal, reportsSetupAPIService: ReportsSetupAPIService) {
		const vm = this;

		vm.totalTime = null;
		vm.totalLessons = null;
		vm.nodeList = [];

		vm.chartPareto = {
			title: 'Lesson | Learned',
			data: [],
			totalTime: 0,
		};

		vm.chartDonut = {
			title: null,
			data: [],
		};

		$scope.lessonsData = {
			fromDate: null,
			toDate: null,
			categories: null,
			breadcrumbs: [
				{name: 'Lesson / Learned Categories'},
			],
			modalData: {
				category: [],
			},
		};

		let listCategory = null;

		vm.onClickFilterButton = onClickFilterButton;
		vm.actionButtonSelectCategory = actionButtonSelectCategory;
		vm.actionClickBreadcrumbs = actionClickBreadcrumbs;
		vm.actionButtonClickCategory = actionButtonClickCategory;
		vm.modalActionButtonClose = modalActionButtonClose;

		getLessonList();

		/**
         * Busca uma lista de categorias e lessons
         * dentro de um intervalo de tempo
         */
		function getLessonList() {

			const parentData = $scope.reportsData;

			reportsSetupAPIService.getLessonsLearnedDataChart(
				parentData.fromDate,
				parentData.toDate,
				getLessonListSuccessCallback,
				getLessonListErrorCallback,
			);
		}

		/**
         * Prepara todo o scopo do grafico de lessons
         * @param  {obj} result lista de lessons e categorias
         */
		function getLessonListSuccessCallback(result) {

			if (Object.keys(result.lessons_learned).length === 0) {
				vm.nodeList = [];
				return;
			}

			const lessons = result.lessons_learned;
			listCategory = result.categories;

			for (const i in lessons) {
				const node = insertLessonsInCategory(lessons[i]);
				createTreeStructure(node);
			}

			setTimeAndLessonLength([listCategory[1]]);

			$scope.lessonsData.categories = listCategory[1];

			console.log(listCategory);

			console.log(listCategory[1].time / 3600);

			vm.chartDonut.title = listCategory[1].name;
			vm.totalTime = listCategory[1].time;
			vm.totalLessons = listCategory[1].lessonsLength;
			vm.nodeList = listCategory[1].children;
			createSeriesDataChart(vm.nodeList);
		}

		function getLessonListErrorCallback(error) {
			console.log(error);
		}

		/**
         * Insere a lesson na categoria relacionada
         * @param  {obj} lesson lesson
         * @return {obj}        categoria com sua lesson
         */
		function insertLessonsInCategory(lesson) {

			const node = listCategory[lesson.lessonLearnedCategory.id];
			const time = (new Date(lesson.endTime).getTime() - new Date(lesson.startTime).getTime()) / 1000;
			lesson.time = time;

			/** Time / SelfTime */
			if (node.time === undefined) {
				node.time = 0;
			}

			if (node.selfTime === undefined) {
				node.selfTime = 0;
			}

			node.selfTime += time;

			/** BestPractincesTime / SelfBestPractincesTime */
			if (node.bestPracticesTime === undefined) {
				node.bestPracticesTime = 0;
			}

			if (node.selfBestPracticesTime === undefined) {
				node.selfBestPracticesTime = 0;
			}

			if (!node.bestPracticesLength) {
				node.bestPracticesLength = 0;
			}

			if (!node.selfBestPracticesLength) {
				node.selfBestPracticesLength = 0;
			}

			if (lesson.bestPractices) {
				node.selfBestPracticesTime += time;
				node.selfBestPracticesLength += 1;
			}

			if (!node.lessons) {
				node.lessons = [];
			}

			if (!node.lessonsLength) {
				node.lessonsLength = 0;
			}

			node.lessons.push(lesson);

			return node;
		}

		/**
         * Busca uma lista de categorias e lessons
         * com as datas selecionada pelo usu�rio
         * @param  {date} fromDate data inicial
         * @param  {date} toDate   data final
         */
		function onClickFilterButton(fromDate, toDate) {
			$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

			$scope.lessonsData.breadcrumbs = [
				{name: 'Failure / Delay Categories'},
			];

			reportsSetupAPIService.getLessonsLearnedDataChart(
				fromDate,
				toDate,
				getLessonListSuccessCallback,
				getLessonListErrorCallback,
			);

		}

		/**
         * Redesenha a lista com os filhos da
         * categoria selecionada e adiciona o
         * pai no breadcrums
         * @param  {obj} node Categoria e filhos
         */
		function actionButtonSelectCategory(node) {

			const nodeList = node.children;

			vm.chartDonut.title = node.name;
			vm.totalTime = node.time;
			vm.totalLessons = node.lessonsLength;

			createSeriesDataChart(nodeList);

			$scope.lessonsData.breadcrumbs.push(
				{id: node.id, name: node.name},
			);

			vm.nodeList = nodeList;
		}

		/**
         * Redesenha a lista com os filhos da
         * categoria selecionada e remove o
         * ultimo indice do breadcrumbs
         * @param  {int} key  indice atual do breadcrumbs
         * @param  {obj} node categoria selecionada
         */
		function actionClickBreadcrumbs(key, node) {
			vm.chartDonut.title = node.name;

			if (node.id) {
				vm.totalTime = listCategory[node.id].time;
				vm.totalLessons = listCategory[node.id].lessonsLength;
				vm.nodeList = listCategory[node.id].children;
			} else {
				vm.totalTime = $scope.lessonsData.categories.time;
				vm.totalLessons = $scope.lessonsData.categories.lessonsLength;
				vm.nodeList = $scope.lessonsData.categories.children;
			}

			createSeriesDataChart(vm.nodeList);
			$scope.lessonsData.breadcrumbs.splice(key + 1, $scope.lessonsData.breadcrumbs.length);
		}

		/**
         * Monta uma lista parcial das categorias
         * com as lessons inserindo o pai como
         * filho virtual
         * @param  {obj} node categoria
         */
		function createVirtualNode(node) {

			if (node.lessons) {
				const virtualNode = {
					name: 'Other',
					initial: node.initial,
					isParent: false,
					lessons: node.lessons,
					time: node.selfTime,
					bestPracticesTime: node.selfBestPracticesTime,
					lessonsLength: node.lessons.length,
					bestPracticesLength: node.selfBestPracticesLength,
				};

				node.children.push(virtualNode);

				node.time += node.selfTime;
				node.bestPracticesTime += node.selfBestPracticesTime;
				node.lessonsLength += node.lessons.length;
				node.bestPracticesLength += node.selfBestPracticesLength;
			}
		}

		/**
         * Monta a estrutura de arvore com as
         * categorias e suas lessons
         * @param  {obj} node categoria
         */
		function createTreeStructure(node) {
			let parentNode;

			if (node.parentId) {

				parentNode = listCategory[node.parentId];

				parentNode.isParent = true;

				if (node.inTree) {
					return;
				}

				if (!parentNode.children) {
					parentNode.children = [];
				}

				parentNode.time = 0;
				parentNode.bestPracticesTime = 0;
				parentNode.lessonsLength = 0;
				parentNode.bestPracticesLength = 0;

				parentNode.children.push(node);

				node.inTree = true;

			} else {
				return;
			}

			createTreeStructure(parentNode);
		}

		/**
         * Soma o tempo e lessons de todos
         * filhos e insere o total no pai
         * @param {array} node categoria pai
         */
		function setTimeAndLessonLength(nodes) {

			for (const i in nodes) {

				if (nodes[i].children) {
					setTimeAndLessonLength(nodes[i].children);
					createVirtualNode(nodes[i]);
				} else {

					if (!nodes[i].parentId && !nodes[i].children) {
						/**
						 * Caso só exista o nó raiz e o nó raiz possua lessons learned
						 * deverá ser criado um nó virtual para exibir os dados
						 */
						nodes[i].children = [];

						nodes[i].time = 0;
						nodes[i].bestPracticesTime = 0;
						nodes[i].lessonsLength = 0;
						nodes[i].bestPracticesLength = 0;

						createVirtualNode(nodes[i]);
					} else {
						nodes[i].time = nodes[i].selfTime;
						nodes[i].bestPracticesTime = nodes[i].selfBestPracticesTime;
						nodes[i].lessonsLength = nodes[i].lessons.length;
						nodes[i].bestPracticesLength = nodes[i].selfBestPracticesLength;
					}
				}

				if (!nodes[i].parentId) {
					return;
				}

				const parentNode = listCategory[nodes[i].parentId];
				parentNode.time += nodes[i].time;
				parentNode.bestPracticesTime += nodes[i].bestPracticesTime;
				parentNode.lessonsLength += nodes[i].lessonsLength;
				parentNode.bestPracticesLength += nodes[i].bestPracticesLength;
			}
		}

		/**
         * Abre um modal com a lista de
         * todas lessons relacionada a categoria
         * @param  {obj} categoria com suas respectivas lessons
         */
		function actionButtonClickCategory(category) {

			$scope.lessonsData.modalData.category = category;

			$scope.$modalInstance = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				template: template,
				scope: $scope,
			});
		}

		/** Fecha o modal com alista de lessons */
		function modalActionButtonClose() {
			$scope.$modalInstance.close();
		}

		/**
         * Monta a serie do gr�fico toda vez
         * que a lista � redesenhada
         * @param  {array} lista de categoria filho
         */
		function createSeriesDataChart(nodes) {

			let paretoItem;
			const chartDonut: any = {};
			const donut = [];
			const pie = [];

			const colors = [
				'#1B699E', '#419ede',
				'#bb0000', '#ff4a4a',
				'#ff7f0e', '#ff9a41',
				'#9D3BBD', '#D26BFF',
				'#8c564b', '#c49c94',
				'#e377c2', '#f7b6d2',
				'#7f7f7f', '#c7c7c7',
				'#bcbd22', '#dbdb8d',
				'#17becf', '#9edae5',
				'#2ca02c', '#98df8a',
			];

			let j = 0;
			let dark = 0;
			let light = 1;
			const paretoData = [];

			for (const i in nodes) {

				nodes[i].color = {
					light: colors[light],
					dark: colors[dark],
				};

				paretoItem = {
					bestPractices: {
						y: 0,
						color: colors[dark],
					},
				};

				donut[i] = {
					name: nodes[i].name,
					y: nodes[i].time,
					color: colors[light],
				};

				if (nodes[i].bestPracticesTime === 0) {

					pie[j] = {
						name: nodes[i].name,
						y: nodes[i].time,
						color: colors[light],
						type: 'Lesson',
					};

					paretoItem.bestPractices.y = 0;

				} else {

					paretoItem.bestPractices.y = nodes[i].bestPracticesLength;

					if (nodes[i].bestPracticesTime === nodes[i].time) {

						pie[j] = {
							name: nodes[i].name,
							y: nodes[i].time,
							color: colors[dark],
							type: 'B. Pract.',
						};

					} else {

						const time = nodes[i].time - nodes[i].bestPracticesTime;

						pie[j] = {
							name: nodes[i].name,
							y: time,
							color: colors[light],
							type: 'Lesson',
						};

						j++;

						pie[j] = {
							name: nodes[i].name,
							y: nodes[i].bestPracticesTime,
							color: colors[dark],
							type: 'B. Pract.',
						};
					}
				}

				paretoItem.percent = (nodes[i].lessonsLength * 100) / vm.totalLessons;
				paretoItem.category = nodes[i].name;

				const lessonsLength = {
					y: nodes[i].lessonsLength - nodes[i].bestPracticesLength,
					color: colors[light],
				};

				paretoItem.lessons = lessonsLength;

				j++;
				dark += 2;
				light += 2;

				paretoData.push(paretoItem);
			}

			const chartPareto = {
				categories: [],
				lessons: [],
				bestPractices: [],
				percentage: [],
			};

			paretoData.sort(function(a, b) {
				const totalFailuresA = ((a.lessons && a.lessons.y) ? a.lessons.y : 0) + ((a.bestPractices && a.bestPractices.y) ? a.bestPractices.y : 0);
				const totalFailuresB = ((b.lessons && b.lessons.y) ? b.lessons.y : 0) + ((b.bestPractices && b.bestPractices.y) ? b.bestPractices.y : 0);

				return totalFailuresB - totalFailuresA;
			});

			let accPercent = 0;

			// tslint:disable-next-line:no-shadowed-variable
			for (const paretoItem of paretoData) {
				accPercent += paretoItem.percent;

				chartPareto.categories.push(paretoItem.category);
				chartPareto.lessons.push(paretoItem.lessons);
				chartPareto.bestPractices.push(paretoItem.bestPractices);
				chartPareto.percentage.push(accPercent);
			}

			chartDonut.donut = donut;
			chartDonut.pie = pie;
			vm.chartDonut.data = chartDonut;
			(vm.chartPareto as any).data = chartPareto;

		}
	}
}
// })();
