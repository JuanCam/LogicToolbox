'use strict';

angular.module('logicToolsApp')
    .service('table', function(ALIASES, assumption, formula, negate) {
        var labelIndex, baseAssum;

        this.generate = function(premise) {
            var premises, atomicPremises;
            premises = [];
            this.premise = premise;
            baseAssum = assumption.new({
                value: premise,
                level: 0
            });
            reset.call(this);
            atomicPremises = getAtomicPremises(premise);
            this.value = buildAtomicColumn(atomicPremises);
            this.value = _.assign({}, this.value, buildCompoundColumn(premise, this.value));
            this.labelsAsociated = baseAssum.labelsAsociated;
        };

        function reset() {
            this.value = {};
            this.labelsAsociated = {};
            labelIndex = 0;
        }
        reset.call(this);

        function getAtomicPremises(premise) {
            return _.uniq(premise.match(/[^~<=>()&|\s]/g));
        }
        function buildAtomicValues(value, key) {
            var columns, column, rows;
            columns = _.keys(value);
            rows = Math.pow(2, columns.length);
            column = 0;
            return _.mapValues(value, function (value, key) {
              return getAtomicValue(++column, rows);
            });
        }
        function buildAtomicColumn(atomicPremises) {
            var initialPremises, premisesValues;
            initialPremises = {};
            _.forEach(atomicPremises, function (premise, key) {
                initialPremises[premise] = [];
                premisesValues = buildAtomicValues(initialPremises, key);
            });
            return premisesValues;
        }
        function buildCompoundColumn(premise, tableValue) {
            var premises, brokenPremise, compoundObject, values;
            values = _.assign({}, tableValue);
            premises = [];
            while (premises) {
                premises = formula.break(premise);
                brokenPremise = (premises) ? premises : [premise];
                compoundObject = buildCompoundValues(brokenPremise, premise, values);
                premise = compoundObject.reduced;
                values = compoundObject.tableValue;
            }
            return values;
        }
        function buildCompoundValues(premises, toReduce, tableValue) {
            var reduced, values, label;
            reduced = toReduce.slice();
            values = _.assign({}, tableValue);
            _.each(premises, function(premise, key) {
                label = ALIASES[labelIndex];
                values[label] = getCompoundValue(premise, label, values);
                baseAssum.createLabels(premise, label);
                reduced = reducePremise(reduced, premise, label);
                labelIndex++;
            });
            return {
              reduced: reduced,
              tableValue: values
            };
        }
        function reducePremise(premiseToReduce, subPremise, label) {
            var matchPremise;
            subPremise = subPremise.replace(/[|]/g, '[|]'); //This is special for the 'or' character.
            matchPremise = new RegExp('[(]' + subPremise + '[)]', 'g');
            return premiseToReduce.replace(matchPremise, label);
        }
        function getCompoundValue(premise, key, tableValue) {
            var ca, cb, c, a, b, getFormula, atomics, values;
            getFormula = formula.resultFn(premise);
            atomics = premise.match(/\w+|[~]+\w/g);
            values = [];
            ca = negate.column(tableValue, atomics[0]);
            cb = negate.column(tableValue, atomics[1]);
            c = 0;
            while (ca.length > c) {
                a = ca[c];
                b = cb[c];
                values.push(Number(getFormula(a, b)));
                c++;
            }
            return values;
        }
        function getAtomicValue(column, rowsNumber) {
            var values, value, row, nchange, sumup;
            values = [];
            value = 0;
            row = 1;
            sumup = 1;
            nchange = Math.pow(2, column);
            while (row <= rowsNumber) {
                if (((1 / nchange) * rowsNumber) * sumup < row) {
                    value = 1 - value;
                    sumup++;
                }
                values.push(value);
                row++;
            }
            return values;
        }
    });
