'use strict';

angular
  .module('logicToolsApp')
  .controller('TruthTableCtrl', function (tableGenerator) {
        var body;
        body = ['(', ')'];
        this.premises = [];
        this.selectedPremises = [];
        this.premise = ''; //((p=>q)&q&s)=>((q=>r)&(p|q|s))//'(((p=>q)&q&s)&t)=>((q=>r)&(p|q|s)&t)'//'~(p&q)=>(~p|~q)' //'((p=>q)&q)=>(~q=>r)'//'((p=>q)&q)=>((q=>r)&(p|q))'
        this.truthTable = {};
        this.build = function() {
            if(this.premise) {
                tableGenerator.generate(this.premise);
                this.truthTable.header = getTableHeader(tableGenerator);
                this.truthTable.rows = getTableRows(tableGenerator);
            }
        };
        function readPremise(premise) {
            return premise.trim().split(/\s+/g);
        }
        function getTableHeader(table) {
          return _.chain(table.value).keys().map(function(val, key) {
              return (val in this.labels) ? this.labels[val] : val;
          }.bind(table)).value();
        }
        function getTableRows(table) {
            var rows, tableValue;
            rows = [];
            tableValue = table.value;
            _.each(_.values(tableValue), function(col, keyc) {
                _.each(col, function(val, keyr) {
                    if (!rows[keyr]) {
                      rows.push([]);
                    }
                    rows[keyr][keyc] = val;
                });
            });
            return rows;
        }
  });
