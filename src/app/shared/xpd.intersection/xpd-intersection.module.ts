import * as angular from 'angular';
import { IntersectionFactory } from './xpd-intersection.factory';

const ngIntersection: angular.IModule  = angular.module('ngIntersection', []);
export { ngIntersection };

ngIntersection.factory('intersectionFactory', IntersectionFactory);
