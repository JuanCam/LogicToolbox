angular.module('logicToolsApp')
    .factory('Premise', function(ALIASES) {

    	function Premise(props) {
    		var labelIndex = 0;
    		this.value = props.value;
    		this.labels = {};
    		this.digest = function(callback) {
    			var premises, label, labels, value;
    			premises = [];
    			labels = {};
    			value = this.value;
    			while(premises) {
    				premises = breakPremise(value);
    				_.each(extractPremises(value), function(premise) {
    					label = ALIASES[labelIndex];
    					labels[label] = createLabels(labels, label, premise);
    					value = reducePremise(value, premise, label);
    					if (callback) {
    						callback(premise, value, label);
    					}
    					labelIndex++;
    				});
    			}
    			this.labels = labels;
    			return value;
    		}
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
        
    	return {
    		new: function(props) {
    			return new Premise(props);
    		}
    	}
    });