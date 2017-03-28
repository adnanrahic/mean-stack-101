(function () {
	"use strict"
	
  angular
	.module('app')
	.config(routerConfig);

  routerConfig.$inject = ['$locationProvider', '$urlRouterProvider'];
  function routerConfig($locationProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise('/');
  }


})();
