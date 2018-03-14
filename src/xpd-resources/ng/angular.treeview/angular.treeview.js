/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] )
		.directive( 'treeModel', ['$compile', function( $compile ) {
			return {
				restrict: 'A',
				link: link,
			};

			function link( scope, element, attrs ) {

			//tree id
				var treeId = attrs.treeId;
		
				//tree model
				var treeModel = attrs.treeModel;

				// controller
				var controller = attrs.controller;

				// category controller
				var categoryController = attrs.categoryController;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node name
				var nodeName = attrs.nodeName || 'name';

				// initial
				var nodeInitial = attrs.nodeInitial || 'initial';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				//tree template
				var template = buildingTemplate(attrs.selectTemplate);

				//check tree id, tree model
				if( treeId && treeModel ) {

				//root node
					if( attrs.angularTreeview ) {

					//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

						//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};
					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}

				function buildingTemplate(view) {

					if (view == 'tracking') {
						return getTrackingTemplate(view);
					}

					return getCategoryTemplate();
				}

				function getCategoryTemplate() {
					return template =
					'<ul class="tree-ul">' +
						'<li data-ng-repeat="node in ' + treeModel + '" track by $index >' +
							
							'<i class="collapsed" data-ng-show="node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="!node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +


							'<div ng-if="(node.id == 1)" class="content-select-node">'+
								'<span>{{node.' + nodeName + '}}</span>' +
							'</div>'+

							'<div ng-if="(node.id > 1)" class="content-select-node">'+
								'<span ng-class="{'+'\'selected-node\''+' : node.selected}" ng-click="'+controller+'.actionClickSelectItem(node)">{{node.' + nodeInitial + '}} - {{node.' + nodeName + '}}</span>' +
							'</div>'+

							'<span class="add-node glyphicon glyphicon-plus" ng-click="'+controller+'.actionClickAdd(node)"></span>'+
							
							'<span class="edit-node btn btn-xs glyphicon glyphicon-pencil" ng-show="node.selected" ng-click="'+controller+'.actionClickEdit(node)""></span>'+

							'<span class="remove-node btn btn-xs glyphicon glyphicon-remove" ng-show="node.selected && !'+controller+'.hasChildren(node)" ng-click="'+controller+'.actionClickRemove(node)"></span>'+

							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeName + ' data-node-children=' + nodeChildren + ' data-controller=' + controller+'></div>' +
						'</li>' +
					'</ul>';
				}

				function getTrackingTemplate(view) {
					return template =
					'<ul class="tree-ul">' +
						'<li data-ng-repeat="node in ' + treeModel + '" track by $index >' +
							
							'<div class="content-select-node" ng-class="{ '+'\'has-error\''+': modal.category.$invalid }">'+
								'<input type="checkbox" class="checkbox-tree-input" name="category" ng-model="node.selected" ng-click="'+controller+'.actionClickSelectItem(node)">' +
								'<label><span name="category" ng-model="node.selected" ng-click="'+controller+'.actionClickSelectItem(node)"></span></label>'+
							'</div>'+


							'<i class="collapsed" data-ng-show="node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="!node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +

							'<div ng-if="(node.id == 1)" class="content-select-node">'+
								'<span>{{node.' + nodeName + '}}</span>' +
							'</div>'+

							'<div ng-if="(node.id > 1)" class="content-select-node">'+
								'<span ng-click="'+categoryController+'.actionClickSelectItem(node)">{{node.' + nodeInitial + '}} - {{node.' + nodeName + '}}</span>' +
							'</div>'+

							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeName + ' data-node-children=' + nodeChildren + ' data-select-template='+ view +' data-controller='+controller+' data-category-controller='+categoryController+'></div>' +
						'</li>' +
					'</ul>';
				}
			}
		}]);
})( angular );
