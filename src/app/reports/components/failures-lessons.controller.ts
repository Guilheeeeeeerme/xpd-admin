import { IModalService } from 'angular-ui-bootstrap';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import template from './../components/modal/failures-lessons-report.modal.html';

export class FailuresLassonsController {

	public static $inject = ['$scope', '$uibModal', 'reportsSetupAPIService'];
	public listCategory: any;
	public nodeList: any[];
	public chartDonut: any;
	public totalTime: any;
	public totalFailuresLessons: any;
	public chartPareto: any;

	constructor(
		private $scope: any,
		private $modal: IModalService,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		$scope.totalTime = null;
		$scope.totalFailuresLessons = null;
		$scope.nodeList = [];

		$scope.chartPareto = {
			title: $scope.paretoTitle,
			data: [],
			totalTime: 0,
		};

		$scope.chartDonut = {
			title: null,
			data: [],
		};

		$scope.modalData = {
			title: $scope.modalTitle,
			category: {
				failuresLessons: [],
			},
		};

		$scope.data = {
			fromDate: null,
			toDate: null,
			categories: null,
			breadcrumbs: [
				{ name: $scope.breadcrumbsName },
			],
		};

		this.listCategory = null;

	}

	/**
	 * Busca uma lista de categorias e failure
	 * dentro de um intervalo de tempo
	 */
	public getFailureList() {

		const parentData = this.$scope.reportsData;

		this.reportsSetupAPIService.getFailuresNptDataChart(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.getListSuccessCallback(arg); },
				(arg) => { this.getListErrorCallback(arg); },
		);

	}

	/**
	 * Busca uma lista de categorias e lessons
	 * dentro de um intervalo de tempo
	 */
	public getLessonList() {

		const parentData = this.$scope.reportsData;

		this.reportsSetupAPIService.getLessonsLearnedDataChart(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.getListSuccessCallback(arg); },
				(arg) => { this.getListErrorCallback(arg); },
		);

	}

	/**
	 * Busca uma lista de categorias e failures/lessons
	 * com as datas selecionada pelo usuário
	 * @param  {date} fromDate data inicial
	 * @param  {date} toDate   data final
	 */
	public onClickFilterButton(fromDate, toDate) {
		this.$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

		this.$scope.data.breadcrumbs = [
			{ name: this.$scope.breadcrumbsName },
		];

		if (this.$scope.type === 'failures') {
			this.reportsSetupAPIService.getFailuresNptDataChart(
				fromDate,
				toDate).then(
					(arg) => { this.getListSuccessCallback(arg); },
					(arg) => { this.getListErrorCallback(arg); },
			);
		} else {
			this.reportsSetupAPIService.getLessonsLearnedDataChart(
				fromDate,
				toDate).then(
					(arg) => { this.getListSuccessCallback(arg); },
					(arg) => { this.getListErrorCallback(arg); },
			);
		}

	}

	/**
	 * Redesenha a lista com os filhos da
	 * categoria selecionada e adiciona o
	 * pai no breadcrums
	 * @param  {obj} node Categoria e filhos
	 */
	public actionButtonSelectCategory(node) {
		const vm = this;

		const nodeList = node.children;

		this.$scope.chartDonut.title = node.name;
		this.$scope.totalTime = node.time;
		this.$scope.totalFailuresLessons = node.failuresLessonsLength;

		this.createSeriesDataChart(nodeList);

		this.$scope.data.breadcrumbs.push(
			{ id: node.id, name: node.name },
		);

		this.$scope.nodeList = nodeList;
	}

	/**
	 * Redesenha a lista com os filhos da
	 * categoria selecionada e remove o
	 * ultimo indice do breadcrumbs
	 * @param  {int} key  indice atual do breadcrumbs
	 * @param  {obj} node categoria selecionada
	 */
	public actionClickBreadcrumbs(key, node) {
		const vm = this;
		this.$scope.chartDonut.title = node.name;

		if (node.id) {
			this.$scope.totalTime = this.listCategory[node.id].time;
			this.$scope.totalFailuresLessons = this.listCategory[node.id].failuresLessonsLength;
			this.$scope.nodeList = this.listCategory[node.id].children;
		} else {
			this.$scope.totalTime = this.$scope.failuresLessonsData.categories.time;
			this.$scope.totalFailuresLessons = this.$scope.failuresLessonsData.categories.failuresLessonsLength;
			this.$scope.nodeList = this.$scope.failuresLessonsData.categories.children;
		}

		this.createSeriesDataChart(this.$scope.nodeList);
		this.$scope.failuresLessonsData.breadcrumbs.splice(key + 1, this.$scope.failuresLessonsData.breadcrumbs.length);
	}

	/**
	 * Abre um modal com a lista de
	 * todas failures/lessons relacionada a categoria
	 * @param  {obj} categoria com suas respectivas falhas
	 */
	public actionButtonClickCategory(category) {

		this.$scope.modalData.category = category;

		this.$scope.$modalInstance = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			windowClass: 'xpd-operation-modal',
			template: template,
			scope: this.$scope,
		});
	}

	/** Fecha o modal com alista de failures/lessons */
	public modalActionButtonClose() {
		this.$scope.$modalInstance.close();
	}

	/**
	 * Prepara todo os scopo do grafico de failures/lessons
	 * @param  {obj} result lista de failures/lessons e categorias
	 */
	private getListSuccessCallback(result) {

		const vm = this;

		if (Object.keys(result[this.$scope.type]).length === 0) {
			this.$scope.nodeList = [];
			return;
		}

		const failuresLessons = result[this.$scope.type];
		this.listCategory = result.categories;

		for (const i in failuresLessons) {
			const node = this.insertFailureLessonInCategory(failuresLessons[i]);
			this.createTreeStructure(node);
		}

		this.setTimeAndFailuresLessonsLength([this.listCategory[1]]);

		this.$scope.data.categories = this.listCategory[1];

		this.$scope.chartDonut.title = this.listCategory[1].name;
		this.$scope.totalTime = this.listCategory[1].time;
		this.$scope.totalFailuresLessons = this.listCategory[1].failuresLessonsLength;
		this.$scope.nodeList = this.listCategory[1].children;
		this.createSeriesDataChart(this.$scope.nodeList);
	}

	private getListErrorCallback(error) {
		console.log(error);
	}

	/**
	 * Insere a failures/lessons na categoria relacionada
	 * @param  {obj} failuresLessons failures/lessons
	 * @return {obj} categoria com sua failures/lessons
	 */
	private insertFailureLessonInCategory(failureLesson) {

		const categories = this.listCategory;

		const node = categories[failureLesson[this.$scope.category].id];
		const time = (new Date(failureLesson.endTime).getTime() - new Date(failureLesson.startTime).getTime()) / 1000;
		failureLesson.time = time;

		/** Time / SelfTime */
		if (node.time === undefined) {
			node.time = 0;
		}

		if (node.selfTime === undefined) {
			node.selfTime = 0;
		}

		node.selfTime += time;

		/**  nptBpTime / selfNptBpTime */
		if (node.nptBpTime === undefined) {
			node.nptBpTime = 0;
		}

		if (node.selfNptBpTime === undefined) {
			node.selfNptBpTime = 0;
		}

		if (!node.nptBpLength) {
			node.nptBpLength = 0;
		}

		if (!node.selfNptBpLength) {
			node.selfNptBpLength = 0;
		}

		if (failureLesson.npt || failureLesson.bestPractices) {
			node.selfNptBpTime += time;
			node.selfNptBpLength += 1;
		}

		if (!node.failuresLessons) {
			node.failuresLessons = [];
		}

		if (!node.failuresLessonsLength) {
			node.failuresLessonsLength = 0;
		}

		node.failuresLessons.push(failureLesson);
		return node;
	}

	/**
	 * Monta uma lista parcial das categorias
	 * com as failures/lessons inserindo o pai como
	 * filho virtual
	 * @param  {obj} node categoria
	 */
	private makeVirtualNode(node) {

		const type = this.$scope.type;

		if (node.failuresLessons) {
			const virtualNode = {
				name: 'Other',
				initial: node.initial,
				isParent: false,
				failuresLessons: node.failuresLessons,
				time: node.selfTime,
				nptBpTime: node.selfNptBpTime,
				failuresLessonsLength: node.failuresLessons.length,
				nptBpLength: node.selfNptBpLength,
			};

			node.children.push(virtualNode);

			node.time += node.selfTime;
			node.nptBpTime += node.selfNptBpTime;
			node.failuresLessonsLength += node.failuresLessons.length;
			node.nptBpLength += node.selfNptBpLength;
		}
	}

	/**
	 * Monta a estrutura de arvore com as
	 * categorias e suas falhas
	 * @param  {obj} node categoria
	 */
	private createTreeStructure(node) {

		/*
			verifica se o nó tem um pai para proseguir,
			se não ele retorna, pois é a raiz principal
		 */
		let parentNode;

		if (node.parentId) {

			parentNode = this.listCategory[node.parentId];

			parentNode.isParent = true;

			/** flag que indiga se o nó ja esta insereido na arvore */
			if (node.inTree) {
				return;
			}

			if (!parentNode.children) {
				parentNode.children = [];
			}

			parentNode.time = 0;
			parentNode.nptBpTime = 0;
			parentNode.failuresLessonsLength = 0;
			parentNode.nptBpLength = 0;

			parentNode.children.push(node);

			node.inTree = true;

		} else {
			return;
		}
		/** passa o pai com filhos atrelado ao nó */
		this.createTreeStructure(parentNode);
	}

	/**
	 * Soma o tempo e failures/lessons de todos
	 * filhos e insere o total no pai
	 * @param {array} node categoria pai
	 */
	private setTimeAndFailuresLessonsLength(nodes) {

		for (const i in nodes) {

			if (nodes[i].children) {
				this.setTimeAndFailuresLessonsLength(nodes[i].children);
				this.makeVirtualNode(nodes[i]);
			} else {
				if (!nodes[i].parentId && !nodes[i].children) {
					/**
					 * Caso só exista o nó raiz e o nó raiz possua failures/lessons
					 * deverá ser criado um nó virtual para exibir os dados
					 */
					nodes[i].children = [];

					nodes[i].time = 0;
					nodes[i].nptBpTime = 0;
					nodes[i].failuresLessonsLength = 0;
					nodes[i].nptBpLength = 0;

					this.makeVirtualNode(nodes[i]);
				} else {
					nodes[i].time = nodes[i].selfTime;
					nodes[i].nptBpTime = nodes[i].selfNptBpTime;
					nodes[i].failuresLessonsLength = nodes[i].failuresLessons.length;
					nodes[i].nptBpLength = nodes[i].selfNptBpLength;
				}
			}

			if (!nodes[i].parentId) {

				/**
				 * Caso só exista o nó raiz e o nó raiz possua failures
				 * deverá ser criado um nó virtual para exibir os dados
				 */
				if (!nodes[i].children) {
					nodes[i].children = [];
					this.makeVirtualNode(nodes[i]);
				}

				return;
			}

			const parentNode = this.listCategory[nodes[i].parentId];
			parentNode.time += nodes[i].time;
			parentNode.nptBpTime += nodes[i].nptBpTime;
			parentNode.failuresLessonsLength += nodes[i].failuresLessonsLength;
			parentNode.nptBpLength += nodes[i].nptBpLength;
		}
	}

	/**
	 * Monta a serie do gráfico toda vez
	 * que a lista é redesenhada
	 * @param  {array} lista de categoria filho
	 */
	private createSeriesDataChart(nodes) {
		const vm = this;

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
				nptsBps: {
					y: 0,
					color: colors[dark],
				},
			};

			donut[i] = {
				name: nodes[i].name,
				y: nodes[i].time,
				color: colors[light],
			};

			if (nodes[i].nptBpTime === 0) {

				pie[j] = {
					name: nodes[i].name,
					y: nodes[i].time,
					color: colors[light],
					type: this.$scope.chartPrimaryTitle, // 'Failure' 'Lesson',
				};

				paretoItem.nptsBps.y = 0;
			} else {

				paretoItem.nptsBps.y = nodes[i].nptBpLength;

				if (nodes[i].nptBpTime === nodes[i].time) {
					pie[j] = {
						name: nodes[i].name,
						y: nodes[i].time,
						color: colors[dark],
						type: this.$scope.chartSecondaryTitle, // 'NPT' 'B. Pract.',
					};
				} else {

					const time = nodes[i].time - nodes[i].nptBpTime;

					pie[j] = {
						name: nodes[i].name,
						y: time,
						color: colors[light],
						type: this.$scope.chartPrimaryTitle, // 'Failure' 'Lesson',
					};

					j++;

					pie[j] = {
						name: nodes[i].name,
						y: nodes[i].nptBpTime,
						color: colors[dark],
						type: this.$scope.chartSecondaryTitle, // 'NPT' 'B. Pract.',
					};
				}
			}

			paretoItem.percent = (nodes[i].failuresLessonsLength * 100) / this.$scope.totalFailuresLessons;
			paretoItem.category = nodes[i].name;

			const failuresLessonsLength = {
				y: nodes[i].failuresLessonsLength - nodes[i].nptBpLength,
				color: colors[light],
			};

			paretoItem.failuresLessons = failuresLessonsLength;

			j++;
			dark += 2;
			light += 2;

			paretoData.push(paretoItem);
		}

		const chartPareto: any = {
			categories: [],
			failuresLessons: [],
			nptsBps: [],
			percentage: [],
		};

		paretoData.sort((a, b) => {
			const totalFailuresA = ((a.failuresLessons && a.failuresLessons.y) ? a.failuresLessons.y : 0) + ((a.nptsBps && a.nptsBps.y) ? a.nptsBps.y : 0);
			const totalFailuresB = ((b.failuresLessons && b.failuresLessons.y) ? b.failuresLessons.y : 0) + ((b.nptsBps && b.nptsBps.y) ? b.nptsBps.y : 0);

			return totalFailuresB - totalFailuresA;
		});

		let accPercent = 0;

		// tslint:disable-next-line:no-shadowed-variable
		for (const paretoItem of paretoData) {
			accPercent += paretoItem.percent;

			chartPareto.categories.push(paretoItem.category);
			chartPareto.failuresLessons.push(paretoItem.failuresLessons);
			chartPareto.nptsBps.push(paretoItem.nptsBps);
			chartPareto.percentage.push(accPercent);
		}

		chartDonut.donut = donut;
		chartDonut.pie = pie;
		this.$scope.chartDonut.data = chartDonut;
		this.$scope.chartPareto.data = chartPareto;
	}
}
