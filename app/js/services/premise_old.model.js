'use strict';

angular.module('logicToolsApp')
    .factory('Premise', function(ALIASES, formula) {
        /*Premise Class*/
        function Premise(props) {
            this.value = props.value;
            this.conclusion = (props.conclusion) ? props.conclusion : props.value;
            this.primitives = _.uniq(this.value.match(/\w+/g));
            this.implications = [this.conclusion];
            this.level = props.level;
            this.labels = {};
            this.checked = false;
            this.scope = props.scope;
            this.structure = getStructure.call(this, formula.break(this.value));
        }
        Premise.prototype.clear = function() {
            this.value = undefined;
            this.structure = undefined;
            this.conclusion = undefined;
            this.primitives = undefined;
            this.implications = undefined;
        }
        Premise.prototype.entail = function(premise) {
            this.implications.push(premise);
            setConclusion.call(this);
        };
        Premise.prototype.exclude = function(premise) {
            var n;
            n = this.implications.indexOf(premise);
            this.implications.splice(n, 1);
            setConclusion.call(this);
        };
        Premise.prototype.toLang = function() {
            /*Converts to formal propositional logic language*/
            var value, conclusion;
            value = (this.value.length > 1) ? '(' + this.value + ')' : this.value;
            conclusion = (this.conclusion.length > 1) ? '(' + this.conclusion + ')' : this.conclusion;
            return value + '=>' + conclusion;
        }
        Premise.prototype.createLabels = function(value, key) {
            var keys;
            keys = _.keys(this.labels);
            this.labels[key] = Array.prototype.map.call(value, function(val, k) {
                return (keys.indexOf(val) > -1) ? this.labels[val] : val;
            }.bind(this)).join('');
        }
        function setConclusion() {
            this.conclusion = this.implications[this.implications.length - 1];
        }
        function getStructure(premises) {
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
