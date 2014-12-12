var app = angular.module('fancytodo', []);

app.directive('ngBlur', function(){
	return function(scope, elem, attrs){
		elem.bind('blur', function(){
			scope.$apply(attrs.ngBlur);
		})
	}
});

app.controller('toDoController', function($scope, filterFilter, $http, $location){

	$scope.todos = [];
	$scope.placeholder = "Chargement..."	
	$scope.statusFilter = {};
		
	$http.get('/api/todos')
		.success(function(data){
			$scope.todos = data;
			$scope.placeholder = "Ajouter une Nouvelle Tâche";
		})
		.error(function(data){
			console.log('Error: ' + data)
		});
	
	
	$scope.$watch('todos', function(){
		$scope.remaining = filterFilter($scope.todos, { completed: true }).length;
		$scope.allchecked = !$scope.remaining;
	}, true)
	
	if($location.path() == ''){ $location.path('/')}
	$scope.location = $location;
	$scope.$watch('location.path()', function(path){
		$scope.statusFilter = 
		(path == '/active') ? {completed : false} : 
		(path == '/done') ? {completed : true} :
		null;
	});
	
	$scope.deleteTodo = function(id){
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.createTodo = function(){
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
	
	$scope.editTodo = function(todo){
		todo.editing = false;
	}
	
	$scope.checkAllTodo = function(allchecked){
		$scope.todos.forEach(function(todo){
			todo.completed = allchecked;
		})
	}
});