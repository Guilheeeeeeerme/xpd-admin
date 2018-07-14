import * as angular from 'angular';
import { TreeModelDirective } from './angular-treeview.directive';

const AngularTreeviewModule: angular.IModule  = angular.module('angularTreeview', []);

export { AngularTreeviewModule };

AngularTreeviewModule.directive('treeModel', TreeModelDirective.Factory());
