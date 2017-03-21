'use strict';

angular.module('logicToolsApp')
    .factory('Premise', function(ALIASES, formula) {
        /*Premise Class*/
        function Premise(props) {
            this.value = props.value;
            this.conclusion = props.conclusion;
            this.implications = [this.conclusion];
            this.level = props.level;
            this.labels = {};
            this.checked = false;
            this.scopeId = props.scopeId;
            this.scopeLayer = props.scopeLayer;
            this.structure = _getStructure.call(this, formula.break(this.value)) || this.value;
            this.simplified = {};
        }
        Premise.prototype.clear = function() {
            this.value = undefined;
            this.structure = undefined;
            this.conclusion = undefined;
            this.implications = undefined;
        }
        Premise.prototype.entail = function(premise) {
            this.conclusion = premise;
        };
        Premise.prototype.exclude = function(premise) {
            var n;
            n = this.implications.indexOf(premise);
            this.implications.splice(n, 1);
            _setConclusion.call(this);
        };
        Premise.prototype.createLabels = function(value, key) {
            var keys;
            keys = _.keys(this.labels);
            this.labels[key] = Array.prototype.map.call(value, function(val, k) {
                return (keys.indexOf(val) > -1) ? this.labels[val] : val;
            }.bind(this)).join('');
        }
        Object.defineProperty(Premise.prototype, 'lang', {
            get: function() {
                if (this.conclusion) {
                    return _wrap(this.value) + '=>' + _wrap(this.conclusion);
                }
                return this.value;
            }
        })
        Object.defineProperty(Premise.prototype, 'primitives', {
            get: function() {
                return _.uniq(_getPrimitives(this.value).concat(_getPrimitives(this.conclusion)));
            }
        });
        function _isWrapped(value) {
            return /^[(][\w\W]+[)]$/g.exec(value);
        }
        function _setConclusion() {
            this.conclusion = this.implications[this.implications.length - 1];
        }
        function _wrap(value, primitives) {
            if (!value) {
                return null;
            }

            var primitives = _getPrimitives(value);
            return (primitives.length > 1 && !_isWrapped(value)) ? '(' + value + ')' : value;
        }
        function _getPrimitives(symbol) {
            return _.uniq(symbol.match(/[~\w]+/g));
        }
        function _getStructure(premises) {
            var valuePremise, prm, structure;
            prm = 0;
            _.each(premises, function(premise, key) {
                this.createLabels(premise, ALIASES[prm]);
                premise = premise.replace(/[|]/g, '[|]'); //This is special for the 'or' character.
                valuePremise = new RegExp('[(]' + premise + '[)]', 'g');
                structure = this.value.replace(valuePremise, ALIASES[prm]);
                prm++;
            }.bind(this));
            return structure;
        }
        return {
            new: function(props) {
                return new Premise(props);
            }
        };
    });
