(function () {
	"use strict"
	
	angular
		.module('app.note')
		.config(routerConfig);

	routerConfig.$inject = ['$stateProvider'];
	function routerConfig($stateProvider) {
    $stateProvider
      .state('note', {
        url: '/note',
        templateUrl: 'app/note/note.html',
        controller: 'NoteController',
        controllerAs: 'vm'
      });
  	}
	
})();
