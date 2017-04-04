'use strict';

angular.module('logicToolsApp')
    .service('fitchImplication', function (Premise) {

    	this.introduction = function(scope, lastScope) {
            var head, last, assumption, conclusion;
            head = lastScope.head;
            last = lastScope.last;

            assumption = (head.isCompound(head.value))
                            ? '(' + head.value + ')'
                            : head.value;

            conclusion = (last.isCompound(last.value))
                            ? '(' + last.value + ')'
                            : last.value;

            if (head.hasNegation(head.digest())) {
                assumption = head.value;
            }
            if (last.hasNegation(last.digest())) {
                conclusion = last.value;
            }

			return Premise.new({
				scopeLayer: scope.layer,
				scopeId: scope.id,
				value: assumption + '=>' + conclusion
			});
    	};

    	this.elimination = function(premiseOne, premiseTwo, scope) {
    		var newPremise = eliminate(premiseTwo, premiseOne, scope) || eliminate(premiseOne, premiseTwo, scope);
        if (!newPremise) {
          return null;
        }
    		newPremise.scopeLayer = scope.layer;
    		newPremise.scopeId = scope.id;
        return newPremise;
    	};

    	function eliminate(premiseOne, premiseTwo, scope) {
        var assumption, conclusion, structure, assumptionNegated;
        structure = premiseOne.digest();
        assumption = premiseOne.getAssumption(structure);
        assumptionNegated = premiseOne.hasNegation(assumption);
        assumption = premiseOne.expand(assumption);
        assumption = (assumptionNegated)
        ? assumption
        : premiseOne.unwrap(assumption);

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
