(function () {
	'use strict';

	/**
     * @author Xavier
     * @description Service para injeção da biblioteca highcharts como dependência e
     *        para manter o namespace limpo
     * @source http://www.ng-newsletter.com/posts/d3-on-angular.html
     */
	angular.module('highcharts')
		.factory('highchartsService', highchartsService);

	highchartsService.$inject = ['$document', '$q', '$rootScope'];

	function highchartsService($document, $q, $rootScope) {

		var d = $q.defer();

		// Create a script tag with d3 as the source
		// and call our onScriptLoad callback when it
		// has been loaded

		var scriptTag = $document[0].createElement('script');
		scriptTag.type = 'text/javascript';
		scriptTag.async = true;
		scriptTag.src = '../assets/js/highcharts.js';

		scriptTag.onreadystatechange = function () {
			if (this.readyState == 'complete') loadHighchartsMore();
		};

		scriptTag.onload = loadHighchartsMore;

		var s = $document[0].getElementsByTagName('body')[0];
		s.appendChild(scriptTag);

		return {
			highcharts: function () {
				return d.promise;
			}
		};

		function loadHighchartsMore(){

			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = '../assets/js/highcharts-more.js';

			scriptTag.onreadystatechange = function () {
				if (this.readyState == 'complete') loadMultiColor();
			};
			scriptTag.onload = loadMultiColor;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);
		}

		function loadMultiColor(){

			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = '../assets/js/multicolor_series.js';

			scriptTag.onreadystatechange = function () {
				if (this.readyState == 'complete') onScriptLoad();
			};
			scriptTag.onload = onScriptLoad;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);
		}

		function onScriptLoad() {

			// Load client in the browser
			$rootScope.$apply(function () {
				window.Highcharts.theme = getHighchartsTheme();
				window.Highcharts.setOptions(getHighchartsTheme());

				window.Highcharts.setOptions({
					global: {
						timezoneOffset: new Date().getTimezoneOffset()
					}
				});

				d.resolve(window.Highcharts);
			});

		}

		function getHighchartsTheme(){
			return {
				colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
					'#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
				chart: {
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
						stops: [
							[0, '#2a2a2b'],
							[1, '#3e3e40']
						]
					},
					style: {
						fontFamily: '\'AgencyFB\', sans-serif'
					},
					plotBorderColor: '#606063'
				},
				title: {
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase',
						fontSize: '20px'
					}
				},
				subtitle: {
					style: {
						color: '#E0E0E3',
						textTransform: 'uppercase'
					}
				},
				xAxis: {
					gridLineColor: '#707073',
					labels: {
						style: {
							color: '#E0E0E3'
						}
					},
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					title: {
						style: {
							color: '#A0A0A3'

						}
					}
				},
				yAxis: {
					gridLineColor: '#707073',
					lineColor: '#707073',
					minorGridLineColor: '#505053',
					tickColor: '#707073',
					tickWidth: 1,
					title: {
						style: {
							color: '#A0A0A3'
						}
					}
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.85)',
					style: {
						color: '#F0F0F0'
					}
				},
				plotOptions: {
					series: {
						dataLabels: {
							color: '#B0B0B3'
						},
						marker: {
							lineColor: '#333'
						}
					},
					boxplot: {
						fillColor: '#505053'
					},
					candlestick: {
						lineColor: 'white'
					},
					errorbar: {
						color: 'white'
					}
				},
				legend: {
					itemStyle: {
						color: '#E0E0E3'
					},
					itemHoverStyle: {
						color: '#FFF'
					},
					itemHiddenStyle: {
						color: '#606063'
					}
				},
				credits: {
					enabled: false
				},
				labels: {
					style: {
						color: '#707073'
					}
				},

				drilldown: {
					activeAxisLabelStyle: {
						color: '#F0F0F3'
					},
					activeDataLabelStyle: {
						color: '#F0F0F3'
					}
				},

				navigation: {
					buttonOptions: {
						symbolStroke: '#DDDDDD',
						theme: {
							fill: '#505053'
						}
					}
				},

				// scroll charts
				rangeSelector: {
					buttonTheme: {
						fill: '#505053',
						stroke: '#000000',
						style: {
							color: '#CCC'
						},
						states: {
							hover: {
								fill: '#707073',
								stroke: '#000000',
								style: {
									color: 'white'
								}
							},
							select: {
								fill: '#000003',
								stroke: '#000000',
								style: {
									color: 'white'
								}
							}
						}
					},
					inputBoxBorderColor: '#505053',
					inputStyle: {
						backgroundColor: '#333',
						color: 'silver'
					},
					labelStyle: {
						color: 'silver'
					}
				},

				navigator: {
					handles: {
						backgroundColor: '#666',
						borderColor: '#AAA'
					},
					outlineColor: '#CCC',
					maskFill: 'rgba(255,255,255,0.1)',
					series: {
						color: '#7798BF',
						lineColor: '#A6C7ED'
					},
					xAxis: {
						gridLineColor: '#505053'
					}
				},

				scrollbar: {
					barBackgroundColor: '#808083',
					barBorderColor: '#808083',
					buttonArrowColor: '#CCC',
					buttonBackgroundColor: '#606063',
					buttonBorderColor: '#606063',
					rifleColor: '#FFF',
					trackBackgroundColor: '#404043',
					trackBorderColor: '#404043'
				},

				// special colors for some of the
				legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
				background2: '#505053',
				dataLabelsColor: '#B0B0B3',
				textColor: '#C0C0C0',
				contrastTextColor: '#F0F0F3',
				maskColor: 'rgba(255,255,255,0.3)'
			};
		}
	}
})();
