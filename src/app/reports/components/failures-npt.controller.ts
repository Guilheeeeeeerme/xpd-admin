/*
* @Author: Gezzy Ramos
* @Date:   2017-05-09 14:48:15
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 10:57:31
*/

import { IModalService } from 'angular-ui-bootstrap';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import template from './modal/failures-npt-report.modal.html';

export class FailuresNptController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModal', 'reportsSetupAPIService'];
	public totalTime: any;
	public totalFailures: any;
	public nodeList: any[];
	public chartPareto: { title: string; data: any[]; totalTime: number; };
	public chartDonut: { title: any; data: any[]; };
	public listCategory: any;

	constructor(
		private $scope: any,
		private $modal: IModalService,
		private reportsSetupAPIService: ReportsSetupAPIService) {
		const vm = this;

		vm.totalTime = null;
		vm.totalFailures = null;
		vm.nodeList = [];

		vm.chartPareto = {
			title: 'Pareto | Failures / NPT',
			data: [],
			totalTime: 0,
		};

		vm.chartDonut = {
			title: null,
			data: [],
		};

		$scope.failuresData = {
			fromDate: null,
			toDate: null,
			categories: null,
			breadcrumbs: [
				{ name: 'Failure / Delay Categories' },
			],
			modalData: {
				category: [],
			},
		};

		this.listCategory = null;

		this.getFailureList();
	}
	/**
	 * Busca uma lista de categorias e falhas
	 * dentro de um intervalo de tempo
	 */
	private getFailureList() {

		const parentData = this.$scope.reportsData;

		this.reportsSetupAPIService.getFailuresNptDataChart(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.getFailureListSuccessCallback(arg); },
				(arg) => { this.getFailureListErrorCallback(arg); },
		);
	}

	/**
	 * Prepara todo os scopo do grafico de falhas
	 * @param  {obj} result lista de falhas e categorias
	 */
	private getFailureListSuccessCallback(result) {
		const vm = this;

		if (Object.keys(result.failures).length === 0) {
			vm.nodeList = [];
			return;
		}

		const failures = result.failures;
		this.listCategory = result.categories;

		for (const i in failures) {
			const node = this.insertFailureInCategory(failures[i]);
			this.makeTreeStructure(node);
		}

		this.setTimeAndFailuresLength([this.listCategory[1]]);

		this.$scope.failuresData.categories = this.listCategory[1];

		vm.chartDonut.title = this.listCategory[1].name;
		vm.totalTime = this.listCategory[1].time;
		vm.totalFailures = this.listCategory[1].failuresLength;
		vm.nodeList = this.listCategory[1].children;
		this.makeSeriesDataChart(vm.nodeList);
	}

	private getFailureListErrorCallback(error) {
		console.log(error);
	}

	/**
	 * Insere a falha na categoria relacionada
	 * @param  {obj} failure falha
	 * @return {obj}         categoria com sua falha
	 */
	private insertFailureInCategory(failure) {

		const categories = this.listCategory;

		const node = categories[failure.category.id];
		const time = (new Date(failure.endTime).getTime() - new Date(failure.startTime).getTime()) / 1000;
		failure.time = time;

		/** Time / SelfTime */
		if (node.time === undefined) {
			node.time = 0;
		}

		if (node.selfTime === undefined) {
			node.selfTime = 0;
		}

		node.selfTime += time;

		/**  NptTime / SelfNPtTime */
		if (node.nptTime === undefined) {
			node.nptTime = 0;
		}

		if (node.selfNptTime === undefined) {
			node.selfNptTime = 0;
		}

		if (!node.failuresNptLength) {
			node.failuresNptLength = 0;
		}

		if (!node.selfFailuresNptLength) {
			node.selfFailuresNptLength = 0;
		}

		if (failure.npt) {
			node.selfNptTime += time;
			node.selfFailuresNptLength += 1;
		}

		if (!node.failures) {
			node.failures = [];
		}

		if (!node.failuresLength) {
			node.failuresLength = 0;
		}

		node.failures.push(failure);
		return node;
	}

	/**
	 * Busca uma lista de categorias e falhas
	 * com as datas selecionada pelo usuário
	 * @param  {date} fromDate data inicial
	 * @param  {date} toDate   data final
	 */
	public onClickFilterButton(fromDate, toDate) {

		this.$scope.failuresData.breadcrumbs = [
			{ name: 'Failure / Delay Categories' },
		];

		this.reportsSetupAPIService.getFailuresNptDataChart(
			fromDate,
			toDate).then(
				(arg) => { this.getFailureListSuccessCallback(arg); },
				(arg) => { this.getFailureListErrorCallback(arg); },
		);
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

		vm.chartDonut.title = node.name;
		vm.totalTime = node.time;
		vm.totalFailures = node.failuresLength;

		this.makeSeriesDataChart(nodeList);

		this.$scope.failuresData.breadcrumbs.push(
			{ id: node.id, name: node.name },
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
	public actionClickBreadcrumbs(key, node) {
		const vm = this;
		vm.chartDonut.title = node.name;

		if (node.id) {
			vm.totalTime = this.listCategory[node.id].time;
			vm.totalFailures = this.listCategory[node.id].failuresLength;
			vm.nodeList = this.listCategory[node.id].children;
		} else {
			vm.totalTime = this.$scope.failuresData.categories.time;
			vm.totalFailures = this.$scope.failuresData.categories.failuresLength;
			vm.nodeList = this.$scope.failuresData.categories.children;
		}

		this.makeSeriesDataChart(vm.nodeList);
		this.$scope.failuresData.breadcrumbs.splice(key + 1, this.$scope.failuresData.breadcrumbs.length);
	}

	/**
	 * Monta uma lista parcial das categorias
	 * com as falhas inserindo o pai como
	 * filho virtual
	 * @param  {obj} node categoria
	 */
	private makeVirtualNode(node) {

		if (node.failures) {
			const virtualNode = {
				name: 'Other',
				initial: node.initial,
				isParent: false,
				failures: node.failures,
				time: node.selfTime,
				nptTime: node.selfNptTime,
				failuresLength: node.failures.length,
				failuresNptLength: node.selfFailuresNptLength,
			};

			node.children.push(virtualNode);

			node.time += node.selfTime;
			node.nptTime += node.selfNptTime;
			node.failuresLength += node.failures.length;
			node.failuresNptLength += node.selfFailuresNptLength;
		}
	}

	/**
	 * Monta a estrutura de arvore com as
	 * categorias e suas falhas
	 * @param  {obj} node categoria
	 */
	private makeTreeStructure(node) {

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
			parentNode.nptTime = 0;
			parentNode.failuresLength = 0;
			parentNode.failuresNptLength = 0;

			parentNode.children.push(node);

			node.inTree = true;

		} else {
			return;
		}
		/** passa o pai com filhos atrelado ao nó */
		this.makeTreeStructure(parentNode);
	}

	/**
	 * Soma o tempo e falhas de todos
	 * filhos e insere o total no pai
	 * @param {array} node categoria pai
	 */
	private setTimeAndFailuresLength(nodes) {

		for (const i in nodes) {

			if (nodes[i].children) {
				this.setTimeAndFailuresLength(nodes[i].children);
				this.makeVirtualNode(nodes[i]);
			} else {
				if (!nodes[i].parentId && !nodes[i].children) {
					/**
					 * Caso só exista o nó raiz e o nó raiz possua lessons learned
					 * deverá ser criado um nó virtual para exibir os dados
					 */
					nodes[i].children = [];

					nodes[i].time = 0;
					nodes[i].nptTime = 0;
					nodes[i].failuresLength = 0;
					nodes[i].failuresNptLength = 0;

					this.makeVirtualNode(nodes[i]);
				} else {
					nodes[i].time = nodes[i].selfTime;
					nodes[i].nptTime = nodes[i].selfNptTime;
					nodes[i].failuresLength = nodes[i].failures.length;
					nodes[i].failuresNptLength = nodes[i].selfFailuresNptLength;
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
			parentNode.nptTime += nodes[i].nptTime;
			parentNode.failuresLength += nodes[i].failuresLength;
			parentNode.failuresNptLength += nodes[i].failuresNptLength;
		}
	}

	/**
	 * Abre um modal com a lista de
	 * todas falhas relacionada a categoria
	 * @param  {obj} categoria com suas respectivas falhas
	 */
	public actionButtonClickCategory(category) {

		this.$scope.failuresData.modalData.category = category;

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

	/** Fecha o modal com alista de falhas */
	public modalActionButtonClose() {
		this.$scope.$modalInstance.close();
	}

	/**
	 * Monta a serie do gráfico toda vez
	 * que a lista é redesenhada
	 * @param  {array} lista de categoria filho
	 */
	private makeSeriesDataChart(nodes) {
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
				npts: {
					y: 0,
					color: colors[dark],
				},
			};

			donut[i] = {
				name: nodes[i].name,
				y: nodes[i].time,
				color: colors[light],
			};

			if (nodes[i].nptTime === 0) {

				pie[j] = {
					name: nodes[i].name,
					y: nodes[i].time,
					color: colors[light],
					type: 'Failure',
				};

				paretoItem.npts.y = 0;
			} else {

				paretoItem.npts.y = nodes[i].failuresNptLength;

				if (nodes[i].nptTime === nodes[i].time) {
					pie[j] = {
						name: nodes[i].name,
						y: nodes[i].time,
						color: colors[dark],
						type: 'NPT',
					};
				} else {

					const time = nodes[i].time - nodes[i].nptTime;

					pie[j] = {
						name: nodes[i].name,
						y: time,
						color: colors[light],
						type: 'Failure',
					};

					j++;

					pie[j] = {
						name: nodes[i].name,
						y: nodes[i].nptTime,
						color: colors[dark],
						type: 'NPT',
					};
				}
			}

			paretoItem.percent = (nodes[i].failuresLength * 100) / vm.totalFailures;
			paretoItem.category = nodes[i].name;

			const failuresLength = {
				y: nodes[i].failuresLength - nodes[i].failuresNptLength,
				color: colors[light],
			};

			paretoItem.failures = failuresLength;

			j++;
			dark += 2;
			light += 2;

			paretoData.push(paretoItem);
		}

		const chartPareto: any = {
			categories: [],
			failures: [],
			npts: [],
			percentage: [],
		};

		paretoData.sort((a, b) => {
			const totalFailuresA = ((a.failures && a.failures.y) ? a.failures.y : 0) + ((a.npts && a.npts.y) ? a.npts.y : 0);
			const totalFailuresB = ((b.failures && b.failures.y) ? b.failures.y : 0) + ((b.npts && b.npts.y) ? b.npts.y : 0);

			return totalFailuresB - totalFailuresA;
		});

		let accPercent = 0;

		// tslint:disable-next-line:no-shadowed-variable
		for (const paretoItem of paretoData) {
			accPercent += paretoItem.percent;

			chartPareto.categories.push(paretoItem.category);
			chartPareto.failures.push(paretoItem.failures);
			chartPareto.npts.push(paretoItem.npts);
			chartPareto.percentage.push(accPercent);
		}

		chartDonut.donut = donut;
		chartDonut.pie = pie;
		vm.chartDonut.data = chartDonut;
		vm.chartPareto.data = chartPareto;
	}

}
// })();
