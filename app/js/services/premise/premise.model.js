angular.module('logicToolsApp')
    .factory('Premise', function() {
      var NEGATION_REGEX = /^\~+/;
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
    				premises = _breakPremise(value);
    				_.each(_extractPremises(value), function(premise) {
    					label =  labelIndex + 1;
    					copyPremise = premise.slice();
    					labels[label] = _createLabels(labels, label, copyPremise);
    					value = _reducePremise(value, _unwrap(premise), label);
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
    	  var base = structrue || this.value;
          return /[=][>]/g.exec(base);
      };
      Premise.prototype.isAnd = function (structrue) {
      	var base = structrue || this.value;
          return /[&]/g.exec(base);
      };
      Premise.prototype.isOr = function (structrue) {
      	var base = structrue || this.value;
          return /[|]/g.exec(base);
      };
      Premise.prototype.isBicon = function (structrue) {
      	var base = structrue || this.value;
          return /[<][=][>]/g.exec(base);
      };
      Premise.prototype.expand = function(premiseLabel) {
      	var premise, indexPremise, labels, symbol;
          indexPremise = premiseLabel.replace(NEGATION_REGEX, '');
          labels = this.labels;
          premise = labels[indexPremise] || premiseLabel;
          symbol = (this.hasNegation(premiseLabel))
          ? premiseLabel.match(NEGATION_REGEX)[0]
          : '';
          return  symbol + _expandPremise(labels, premise);
      };
      Premise.prototype.getAssumption = function(structrue) {
      	var base, valuesMatched;
      	base = structrue || this.value;
      	valuesMatched = base.split(/[=][>]/g);
      	return (valuesMatched) ? valuesMatched[0] : undefined;
      }
      Premise.prototype.getConclusion = function(structrue) {
      	var base, valuesMatched;
      	base = structrue || this.value;
      	valuesMatched = base.split(/[=][>]/g)
      	return (valuesMatched) ? valuesMatched[1] : undefined;
      }
      Premise.prototype.getPrimitives = function(structrue) {
      	var base = structrue || this.value;
      	return base.match(/\w+/g);
      }
      Premise.prototype.removeNegation = function(structrue) {
        var base = structrue || this.value;
        return base.replace(NEGATION_REGEX, '');
      }
      Premise.prototype.hasNegation = function(structrue) {
          var base = structrue || this.value;
          return !!base.match(NEGATION_REGEX);
      }
      Premise.prototype.isCompound = function(structrue) {
          var base = structrue || this.value;
          return !!base.match(/[<=>|&]+/);
      }
      Premise.prototype.unwrap = function (value) {
        return _unwrap(value || this.value);
      };

      function _breakPremise(value) {
      	return value.match(/[(]{1}[\w~<=>|&]+(?=[)]{1})[)]{1}/g);
      }

      function _createLabels (labels, label, premise) {
          var createdLabels;
          createdLabels = _.keys(labels);
          return Array.prototype.map.call(premise, function(val, k) {
              return (createdLabels.indexOf(val) > -1) ? labels[val] : val;
          }).join('');
      }

      function _extractPremises(premise) {
      	return (_breakPremise(premise)) ? _breakPremise(premise) : [premise];
      }

      function _reducePremise(premise, subPremise, label) {
          var matchExpr;
          subPremise = subPremise.replace(/[|]/g, '[|]'); //This is special for the 'or' character.
          matchExpr = new RegExp('[(]' + subPremise + '[)]', 'g');
          return premise.replace(matchExpr, label);
      }

      function _expandPremise(labels, value) {
          var premiseValue, labelsKeys, symbol;
          premiseValue = value.slice();
          labelsKeys = _.keys(labels);
          return _.map(labelsKeys, function(label) {
                          premiseValue = premiseValue.replace(label, labels[label]);
                          return premiseValue;
                      }).slice(-1)[0];
      }

      function _unwrap(value) {
        var unwraped;
        if (!value) {
          return undefined;
        }
      	unwraped = value.match(/[(]{1}([\w\W]+)[)]{1}/);
      	return (unwraped) ? unwraped[1] : value;
      }

    	return {
    		new: function(props) {
    			return new Premise(props);
    		}
    	}
    });
