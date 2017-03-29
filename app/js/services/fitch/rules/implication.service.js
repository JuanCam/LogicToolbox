'use strict';

angular.module('logicToolsApp')
    .service('fitchImplication', function (Premise, formula) {

    	this.introduction = function(scope, lastScope) {
			return Premise.new({
				scopeLayer: scope.layer,
				scopeId: scope.id,
				value: lastScope.head.value + '=>' + lastScope.last.value,
			});
    	};

    	this.elimination = function(premiseOne, premiseTwo, scope) {
    		var newPremise = eliminate(premiseTwo, premiseOne, scope) || eliminate(premiseOne, premiseTwo, scope);
    		newPremise.scopeLayer = scope.layer;
    		newPremise.scopeId = scope.id;
            return newPremise;
    	};

    	function eliminate(premiseOne, premiseTwo, scope) {    
            var assumption, conclusion, structure;
            structure = premiseOne.digest();
            assumption = premiseOne.getAssumption(structure);
            assumption = premiseOne.expand(assumption);
			if (assumption === premiseTwo.value) {
                conclusion = premiseOne.getConclusion(structure);
				return Premise.new({
					scopeLayer : scope.layer,
					scopeId : scope.id,
					value: premiseOne.expand(conclusion)
				});
			}
    		return null;
    	}
    });
