angular.module('logicToolsApp')
    .factory('Premise', function() {

    	function Premise(props) {
    		var labelIndex, labelConst;
    		labelIndex = 0;
    		this.labels = {};
    		this.scopeLayer = props.scopeLayer;
    		this.scopeId = props.scopeId;
    		this.value = props.value;

    		this.digest = function(callback) {
    			var premises, copyPremise, label, labels, value;
    			value = this.value;
    			premises = [];
    			labels = {};
    			while(premises) {
    				premises = breakPremise(value);
    				_.each(extractPremises(value), function(premise) {
    					label =  labelIndex + 1;
    					copyPremise = premise.slice();
    					labels[label] = createLabels(labels, label, copyPremise);
    					value = reducePremise(value, unwrap(premise), label);
    					if (callback) {
    						callback(premise, value, label);
    					}
    					labelIndex++;
    				});
    			}
    			this.labels = _.assign({}, labels);
    			return value;
    		}
    	}

    	Premise.prototype.isImplication = function(structrue) {
            return /[=][>]/g.exec(structrue);
        };
        Premise.prototype.isAnd = function (structrue) {
            return /[&]/g.exec(structrue);
        };
        Premise.prototype.isOr = function (structrue) {
            return /[|]/g.exec(structrue);
        };
        Premise.prototype.isBicon = function (structrue) {
            return /[<][=][>]/g.exec(structrue);
        };
        Premise.prototype.expand = function(premiseLabel) {
        	var premise = this.labels[premiseLabel];
        	return (premise) ? unwrap(premise) : premiseLabel;
        };
        Premise.prototype.getAssumption = function(structrue) {
        	var valuesMatched = structrue.split(/[=][>]/g);
        	return (valuesMatched) ? valuesMatched[0] : undefined;
        }
        Premise.prototype.getConclusion = function(structrue) {
        	var valuesMatched = structrue.split(/[=][>]/g)
        	return (valuesMatched) ? valuesMatched[1] : undefined;
        }

        function breakPremise(value) {
        	return value.match(/[(]{1}[\w~<=>|&]+(?=[)]{1})[)]{1}/g);
        }

        function createLabels (labels, label, premise) {
            var createdLabels;
            createdLabels = _.keys(labels);
            return Array.prototype.map.call(premise, function(val, k) {
                return (createdLabels.indexOf(val) > -1) ? labels[val] : val;
            }).join('');
        }

        function extractPremises(premise) {
        	return (breakPremise(premise)) ? breakPremise(premise) : [premise];
        }

        function reducePremise(premise, subPremise, label) {
            var matchExpr;
            subPremise = subPremise.replace(/[|]/g, '[|]'); //This is special for the 'or' character.
            matchExpr = new RegExp('[(]' + subPremise + '[)]', 'g');
            return premise.replace(matchExpr, label);
        }

        function unwrap(value) {
        	var unwraped = value.match(/[(]{1}([\w\W]+)[)]{1}/);
        	return (unwraped) ? unwraped[1] : value;
        }
        
    	return {
    		new: function(props) {
    			return new Premise(props);
    		}
    	}
    });