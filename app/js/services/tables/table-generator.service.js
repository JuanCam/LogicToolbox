'use strict';

angular
  .module('logicToolsApp')
  .service('tableGenerator', function(Premise, Table) {

    var basePremise, table;
    this.generate = function(premise) {
      var premises, atomicPremises;
      premises = [];
      this.premise = premise;
      basePremise = Premise.new({
          value: premise
      });
      table = Table.new();
      reset.call(this);
      atomicPremises = _getAtomicPremises(premise);
      this.value = _buildAtomicColumn(atomicPremises);
      this.value = _.assign({}, this.value, _buildCompoundColumn(this.value));
      this.labels = basePremise.labels;
    };

    function reset() {
      this.value = {};
      this.labels = {};
    }

    reset.call(this);

    function _getAtomicPremises(premise) {
      return _.uniq(premise.match(/[^~<=>()&|\s]/g));
    }
    function _buildAtomicValues(value, key) {
      var columns, column, rows;
      columns = _.keys(value);
      rows = Math.pow(2, columns.length);
      column = 0;
      return _.mapValues(value, function (value, key) {
        return table.getAtomicValue(++column, rows);
      });
    }
    function _buildAtomicColumn(atomicPremises) {
      var initialPremises, premisesValues;
      initialPremises = {};
      _.forEach(atomicPremises, function (premise, key) {
          initialPremises[premise] = [];
          premisesValues = _buildAtomicValues(initialPremises, key);
      });
      return premisesValues;
    }
    function _buildCompoundColumn(tableValue) {
      var values;
      values = _.assign({}, tableValue);
      basePremise.digest(function(premise, value, label) {
          values[label] = table.getCompoundValue(premise, label, values);
      });
      return values;
    }
  });
