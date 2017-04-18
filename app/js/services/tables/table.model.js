angular
  .module('logicToolsApp')
  .factory('Table', function(formula) {

    function Table () {}

    Table.prototype.getCompoundValue = function(premise, key, tableValue) {
      var ca, cb, c, a, b, getFormula, atomics, values;
      getFormula = formula.resultFn(premise);
      atomics = premise.match(/\w+|[~]+\w|\d+|[~]+\d/g);
      values = [];
      ca = _negateColumn(tableValue, atomics[0]);
      cb = _negateColumn(tableValue, atomics[1]);
      c = 0;
      while (ca.length > c) {
          a = ca[c];
          b = cb[c];
          values.push(Number(getFormula(a, b)));
          c++;
      }
      return values;
    }

    Table.prototype.getAtomicValue = function(nCol, nRows) {
      var values, value, row, nchange, sumup;
      values = [];
      value = 0;
      row = 1;
      sumup = 1;
      nchange = Math.pow(2, nCol);
      while (row <= nRows) {
          if (((1 / nchange) * nRows) * sumup < row) {
              value = 1 - value;
              sumup++;
          }
          values.push(value);
          row++;
      }
      return values;
    }

    function _negateColumn(value, premise) {
      /*Negate if negation exists*/
      var negation, result, atomic, operator;
      negation = premise.match(/[~]/g);
      atomic = premise.match(/\w+/g);
      if (negation) {
          result = _.map(value[atomic[0]], function(val, key) {
              operator = negation.join('').replace(/[~]/g, '!');
              return Number(eval(operator + val));
          });
      } else {
          result = value[atomic[0]];
      }
      return result;
    }

		return {
			new: function() {
				return new Table();
			}
		}

  });
