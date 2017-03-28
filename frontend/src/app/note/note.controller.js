(function () {
	"use strict"
	
	angular
		.module('app.note')
		.controller('NoteController', ctrl);

	ctrl.$inject = ['$http', '$httpParamSerializer'];
	function ctrl($http, $httpParamSerializer) {
		var vm = this;
		vm.notes = [];
		vm.note = {};
		vm.addNote = addNote;

		activate();

		function activate() {
			getNotes();
		}

		///////////////////

		function getNotes() {
			return $http.get('/api/notes')
				.then(function (response) {
					console.debug("getNotes returned: ", response.data);
					vm.notes = response.data;
					return vm.notes;
				})
				.catch(function (err) {
					console.error("getNotes errored with: ", err);
				});
		}
		function addNote() {
			vm.note.pinned = false;
			return $http.post('/api/notes', 
					$httpParamSerializer(vm.note), {
					headers: { "Content-Type": "application/x-www-form-urlencoded" }
				})
				.then(function (response) {
					console.debug("addNote returned: ", response.data);
					var addedNote = response.data;

					vm.notes.push(addedNote);
					vm.note = {};
					return addedNote;
				})
				.catch(function (err) {
					console.error("addNote errored with: ", err);
				});
		}

		
	}
	
})();