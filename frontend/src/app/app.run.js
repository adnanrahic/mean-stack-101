(function () {
    "use strict"

  angular
    .module('app')
    .run(run);

  run.$inject = ['$rootScope'];
  function run($rootScope) {

    $rootScope.view = false;
    $rootScope.$on('$viewContentLoaded', function() {
        $rootScope.view = true;
    });

  } 

})();
