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
		vm.editable = false;
		vm.setEditable = setEditable;
		vm.addNote = addNote;
		vm.deleteNote = deleteNote;
		vm.editNote = editNote;

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
		function deleteNote(id) {
			return $http.delete('/api/notes/' + id)
				.then(function (response) {
					console.debug("deleteNote returned: ", response.data);
					var deletedNote = response.data;
					vm.notes = vm.notes.filter(function (note) {
						return note._id !== deletedNote._id;
					});
					return deletedNote;
				})
				.catch(function (err) {
					console.error("addNote errored with: ", err);
				});
		}
		function setEditable(index) {
			vm.editable = index;

			console.debug(vm.editable);
		}
		function editNote(note) {
			return $http.put('/api/notes/' + note._id,
					$httpParamSerializer({ title: note.title, description: note.description }), {
					headers: { "Content-Type": "application/x-www-form-urlencoded" }
				})
				.then(function (response) {
					console.debug("editNote returned: ", response.data);
					var editedNote = response.data;
					vm.notes.forEach(function (note) {
						if (note._id === editedNote._id) 
							note = editedNote;
					});
					vm.editable = false;
					return editedNote;
				})
				.catch(function (err) {
					console.error("editNote errored with: ", err);
				});
		}

		
	}
	
})();
