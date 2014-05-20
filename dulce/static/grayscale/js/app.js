var dulceApp = angular.module('dulceApp', []);

// See http://stackoverflow.com/questions/8302928/angularjs-with-django-conflicting-template-tags
dulceApp.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

dulceApp.controller('AnalyseCtrl', function($scope) {
    $scope.raw = "";
    $scope.words = [];
    $scope.reverse_alphabetical;
    $scope.words_by_length;

    $scope.analyse = function(raw){
        if(!raw){return};
        var prepared = _.map(raw.split(/(\n| )/), function(w){
            return w.replace("\n", "")
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .toLowerCase()
        }).sort();
        $scope.words = _.union(prepared);

        $scope.reverse_alphabetical = _.sortBy($scope.words, function(w){
            reversed = w.split("").reverse().join("");
            return reversed
        });

        $scope.words_by_length = _.sortBy($scope.words, function(w){
            return w.length
        });
    }

    $scope.$watch('raw', $scope.analyse);

});
