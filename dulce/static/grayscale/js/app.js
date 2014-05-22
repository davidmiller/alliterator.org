POSTAGS =  {

    CC: 'COORDINATING CONJUNCTION',
    CD: 'CARDINAL NUMBER',
    DT: 'DETERMINER',
    EX: 'EXISTENTIAL THERE',
    FW: 'FOREIGN WORD',
        IN: 'PREPOSITION OR SUBORDINATING CONJUNCTION',
    JJ: 'ADJECTIVE',
    JJR: 'ADJECTIVE, COMPARATIVE',
    JJS: 'ADJECTIVE, SUPERLATIVE',
    LS: 'LIST ITEM MARKER',
    MD: 'MODAL',
    NN: 'NOUN, SINGULAR OR MASS',
    NNS: 'NOUN, PLURAL',
    NNP: 'PROPER NOUN, SINGULAR',
    NNPS: 'PROPER NOUN, PLURAL',
    PDT: 'PREDETERMINER',
    POS: 'POSSESSIVE ENDING',
    PRP: 'PERSONAL PRONOUN',
    PRP$: 'POSSESSIVE PRONOUN',
    RB: 'ADVERB',
    RBR: 'ADVERB, COMPARATIVE',
    RBS: 'ADVERB, SUPERLATIVE',
    RP: 'PARTICLE',
    SYM: 'SYMBOL',
    TO: 'TO',
    UH: 'INTERJECTION',
    VB: 'VERB, BASE FORM',
    VBD: 'VERB, PAST TENSE',
    VBG: 'VERB, GERUND OR PRESENT PARTICIPLE',
    VBN: 'VERB, PAST PARTICIPLE',
    VBP: 'VERB, NON-3RD PERSON SINGULAR PRESENT',
    VBZ: 'VERB, 3RD PERSON SINGULAR PRESENT',
    WDT: 'WH-DETERMINER',
    WP: 'WH-PRONOUN',
    WP$: 'POSSESSIVE WH-PRONOUN',
    WRB: 'WH-ADVERB'
}

var dulceApp = angular.module('dulceApp', []);

// See http://stackoverflow.com/questions/8302928/angularjs-with-django-conflicting-template-tags
dulceApp.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

dulceApp.controller('AnalyseCtrl', function($scope, $http) {
    $scope.raw = "";
    $scope.words = [];
    $scope.reverse_alphabetical = null;
    $scope.words_by_length = null;
    $scope.pos_tagged = null;

    $scope.analyse = function(raw){
        if(!raw){return};
        var prepared = _.map(raw.split(/(\n| )/), function(w){
            return w.replace("\n", "")
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .toLowerCase().trim()
        }).sort();
        $scope.words = _.union(prepared);

        $http.post('/api/1/pos', JSON.stringify({corpus: $scope.raw})).success(function(data){
            console.log(data);
            $scope.pos_tagged = [];
            for(var tag in POSTAGS){
                if(data[tag] != undefined){
                    $scope.pos_tagged.push({
                        definition: POSTAGS[tag],
                        words: data[tag]
                    });
                };
            };
        });

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
