'use strict';

angular.module('logicToolsApp')
    .service('fitchNegation', function (Premise, formula) {

    	this.introduction = function(premiseOne, premiseTwo, scope) {
    		if(!validImplications(premiseOne, premiseTwo)) {
    			return null;
    		}
    		if(!validPremises(premiseOne, premiseTwo)) {
    			return null;
    		}
    		if(!validNegations(premiseOne, premiseTwo)) {
    			return null;
    		}
    		if(!validConclusions(premiseOne, premiseTwo)) {
    			return null;
    		}

            return Premise.new({
				scopeLayer: scope.layer,
				scopeId: scope.id,
            	value: '~' + premiseOne.value
            });
    	};

    	this.elimination = function(premise, scope) {
    		return Premise.new({})
    	};

    	function validImplications(premiseOne, premiseTwo) {
    		return premiseOne.conclusion && premiseTwo.conclusion;
    	}

    	function validPremises(premiseOne, premiseTwo) {
    		return premiseOne.value === premiseTwo.value;
    	}

    	function validNegations(premiseOne, premiseTwo) {
    		return validNegation(premiseOne, premiseTwo) || validNegation(premiseTwo, premiseOne);
    	}

    	function validConclusions(premiseOne, premiseTwo) {
    		return validConclusion(premiseOne, premiseTwo) || validConclusion(premiseTwo, premiseOne);
    	}

    	function validConclusion(premiseOne, premiseTwo) {
    		return removeNegation(premiseOne.conclusion) === premiseTwo.conclusion;
    	}

    	function validNegation(premiseOne, premiseTwo) {
    		return isNegated(premiseOne.conclusion) && !isNegated(premiseTwo.conclusion);
    	}

    	function isNegated(premise) {
            return premise.match(/[~]+/g);
        }

    	function isImplication(premise) {
            return formula.operation(premise) === 'implication';
        }

        function removeNegation(premise) {
        	return premise.replace(/[~()]+/g,'');
        }

});