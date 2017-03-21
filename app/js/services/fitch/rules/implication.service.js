'use strict';

angular.module('logicToolsApp')
    .service('fitchImplication', function (Premise, formula) {

    	this.introduction = function(scope, lastScope) {
			return Premise.new({
                conclusion: lastScope.last.lang,
				scopeLayer: scope.layer,
				scopeId: scope.id,
				value: lastScope.head.lang
			});
    	};

    	this.elimination = function(premiseOne, premiseTwo, scope) {
    		var newPremise = eliminate(premiseTwo, premiseOne, scope) || eliminate(premiseOne, premiseTwo, scope);
    		newPremise.scopeLayer = scope.layer;
    		newPremise.scopeId = scope.id;
            return newPremise;
    	};

    	function eliminate(premiseOne, premiseTwo, scope) {
    		if (premiseOne.conclusion && !premiseTwo.conclusion) {
    			if (premiseOne.value === premiseTwo.value) {
    				return Premise.new({
    					scopeLayer : scope.layer,
    					scopeId : scope.id,
    					value: premiseOne.conclusion
    				});
    			}
    		}
    		return null;
    	}
    });
