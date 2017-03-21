'use strict';

angular
  .module('logicToolsApp')
  .controller('FitchCt', function (Premise, formula) {
        var level, reiterated, newPremise, headAssum, idScope, scopes;
        level = 0;
        idScope = 0;
        this.marginLeft = 16;
        this.assumptions = [];
        this.selected = [];
        scopes = [];
        this.assume = function() {
            headAssum = Premise.new({
                value: this.premise,
                level: ++level,
                scope: ++idScope
            });
            scopes.push(idScope);
            this.assumptions.push(headAssum);
            this.premise = '';
        };
        /*Local functions*/
        function uncheckPremises(premises, selected) {
            selected.length = 0;
            return _.map(premises, function(premise) {
                premise.checked = false;
                return premise;
            });
        }
        /*Events*/
        this.selectPremise = function(event, id) {
            var isChecked, assumptionInd, assumChecked;
            isChecked = event.target.checked;
            assumChecked = this.assumptions[id]
            assumChecked.checked = isChecked;
            if (isChecked) {
                this.selected.push(assumChecked);
            } else {
                assumptionInd = this.selected.indexOf(assumChecked);
                this.selected.splice(assumptionInd, 1);
                headAssum.exclude(assumptionInd);
            }
        };
        /*Operations*/
        this.reiterate = function() {
            reiterated = _.chain(this.selected).map(function(assum, key) {
                if (!validateScope([assum])) return null;
                headAssum.entail(assum.value);
                return Premise.new({
                    value: assum.value,
                    level: level,
                    scope: getCurrentScope()
                });
            }).filter(function(assum) {
                return !_.isNull(assum);
            }).value();
            uncheckPremises(this.assumptions, this.selected);
            this.assumptions = this.assumptions.concat(reiterated);
        }
        this.implicationIntro = function() {
            newPremise = Premise.new({
                value: headAssum.toLang(),
                level: --level
            });
            uncheckPremises(this.assumptions, this.selected);
            closeAssumption.call(this, newPremise, this.assumptions);
        }
        this.implicationElim = function() {
            var firstPremise, secondPremise, newPremise, value, premises;
            firstPremise = _.filter(this.selected, function(premise) {
                return premise.primitives.length <= 1;
            });
            secondPremise = _.filter(this.selected, function(premise) {
                return premise.primitives.length > 1;
            });
            uncheckPremises(this.assumptions, this.selected);
            if (firstPremise.length === 1 && secondPremise.length === 1) {
                firstPremise = firstPremise[0];
                secondPremise = secondPremise[0];
            } else {
                return false;
            }
            if (!validateScope([firstPremise, secondPremise])) return false;
            newPremise = determineIE(secondPremise, firstPremise) || determineIE(firstPremise, secondPremise);
            if (!newPremise) return false;
            buildEntail(this.assumptions, newPremise);
        }
        this.negationIntro = function() {
            var firstPremise, secondPremise, newPremise;
            firstPremise = _.filter(this.selected, function(premise) {
                return premise.primitives.length > 1;
            })[0];
            secondPremise = _.filter(this.selected, function(premise) {
                return premise.primitives.length > 1;
            })[1];
            uncheckPremises(this.assumptions, this.selected);
            if (!firstPremise || !secondPremise || !validateScope([firstPremise, secondPremise])) return false;
            newPremise = determineNI(firstPremise, secondPremise);
            if (!newPremise) return false;
            buildEntail(this.assumptions, newPremise);
        }
        function closeAssumption(premise, assumptions) {
            if (premise) {
                scopes.splice(-1);
                headAssum = _.filter(assumptions, function(assum) {
                    console.log(assum.scope,getCurrentScope(),assum.scope === getCurrentScope())
                    return assum.level === level && assum.scope === getCurrentScope();
                })[0];
                premise.scope = headAssum.scope;
                buildEntail(assumptions, premise);
            }
        }
        function getCurrentScope() {
            return scopes[scopes.length - 1];
        }
        function isImplication(premise) {
            return formula.operation(premise) === 'implication';
        }
        function isNegated(premise) {
            return premise.match(/[~]+/g);
        }
        function getImplValues(value) {
            return value.split(/[=>]+/g)[0];
        }
        function getImplConclusion(value) {
            return value.split(/[=>]+/g)[1];
        }
        function validateScope(premises) {
            var validPremises;
            validPremises = _.filter(premises, function(premise) {
                return (premise.level === level && premise.scope === getCurrentScope()) || (premise.level < level);
            });
            return validPremises.length === premises.length;
        }
        function buildEntail(assumptions, premise) {
            headAssum.entail(premise.value);
            assumptions.push(premise);
        }
        function splitPremise(premise) {
            var existAsocKey, value, conclusion;
            existAsocKey = !_.isEmpty(premise.labelsAsociated);
            if (existAsocKey) {
                value = premise.labelsAsociated[getImplValues(premise.structure)];
                conclusion = premise.labelsAsociated[getImplConclusion(premise.structure)];
                value = (value) ? value : premise.primitives[0];
                conclusion = (conclusion) ? conclusion : premise.primitives[1];
            } else {
                value = premise.primitives[0];
                conclusion = premise.primitives[1];
            }
            return {
                value: value,
                conclusion: conclusion
            };
        }
        function isNegation(premise) {
            var splited, value, conclusion, fNegated;
            splited = splitPremise(premise);
            value = splited.value;
            conclusion = splited.conclusion;
            fNegated = isNegated(splited.conclusion);
            return (fNegated) ? fNegated[0].length : 0
        }
        function determineIE(fPremise, sPremise) {
            var existAsocKey, value, conclusion, premise, splited;
            premise = null;
            splited = splitPremise(sPremise);
            value = splited.value;
            conclusion = splited.conclusion;
            if (value !== conclusion && fPremise.value === fPremise.conclusion && (isImplication(sPremise) && !isImplication(fPremise))) {
                premise = Premise.new({
                    level: level,
                    value: conclusion
                });
            }
            return premise;
        }
        function determineNI(fPremise, sPremise) {
            var value, premise, fConcl, sConcl, fIsNeg, sIsNeg;
            premise = null;
            fIsNeg = isNegation(fPremise);
            sIsNeg = isNegation(sPremise);
            fConcl = fPremise.primitives[1].replace(/[~()]+/g, '');
            sConcl = sPremise.primitives[1].replace(/[~()]+/g, '');
            if ((fConcl === sConcl) && ((fIsNeg === sIsNeg - 1) || (fIsNeg - 1 === sIsNeg) && (fPremise.primitives[0] === sPremise.primitives[0]))) {
                premise = Premise.new({
                    level: level,
                    value: '~' + ((!isNegated(fPremise.primitives[0])) ? fPremise.primitives[0] : sPremise.primitives[0])
                });
            }
            return premise;
        }
  });
