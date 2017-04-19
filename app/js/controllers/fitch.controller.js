'use strict';

angular
  .module('logicToolsApp')
  .controller('FitchCtrl', function (
      FitchStack,
      Premise,
      PremiseTree,
      fitchNegation,
      fitchImplication,
      fitchDisjunction
    ) {

        this.marginLeft = 16;
        this.selected = [];
        this.structure = FitchStack.new();
        this.premiseGraph = PremiseTree.new();
        this.premise = '';
        this.showDisjoinField = false;
        this.valueToDisjoin = '';

        this.assume = function() {
          var currentScope, labels, headPremise;

          headPremise = Premise.new({
            value: this.premise
          });

          this.structure.openScope(headPremise);
          currentScope = this.structure.getCurrentScope();
          this.premiseGraph.append(headPremise);
          headPremise.scopeId = currentScope.id;
          headPremise.scopeLayer = currentScope.layer;
          this.premise = '';
        };

        this.disjoinPremise = function () {
          var newPremise, currentScope, selected, disjointPremise;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          if(!selected.length || !this.valueToDisjoin) {
              return;
          }
          newPremise = fitchDisjunction.introduction(this.valueToDisjoin, selected, currentScope);
          this.showDisjoinField = false;
          this.valueToDisjoin = '';
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise, selected);
        };

        /*Operations*/
        this.negationIntro = function() {
          var selected, newPremise, secondPremise, currentScope;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          if(selected.length !== 2) {
              return;
          }
          newPremise = fitchNegation.introduction(selected[0], selected[1], currentScope);
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise, selected);
        };
        this.negationElim = function() {
          var selected, newPremise, secondPremise, currentScope;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          if(selected.length > 1) {
              return;
          }
          newPremise = fitchNegation.elimination(selected[0], currentScope);
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise, selected);
        };
        this.implicationIntro = function() {
          var lastScope, currentScope, newPremise, head, last;
          lastScope = this.structure.closeScope();
          head = lastScope.head;
          last = lastScope.last;
          currentScope = this.structure.getCurrentScope();
          newPremise = fitchImplication.introduction(currentScope, lastScope);
          _entail.call(this, newPremise, [head, last]);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
        };

        this.implicationElim = function() {
          var selected, newPremise, secondPremise, currentScope;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          if(selected.length !== 2) {
              return;
          }
          newPremise = fitchImplication.elimination(selected[0], selected[1], currentScope);
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise, selected);
        };

        this.orElimination = function () {
          var selected, currentScope, newPremise, groupedPremises;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          if(selected.length < 3) {
              return;
          }
          groupedPremises = _groupOrPremises(selected);
          if(!groupedPremises) {
              return;
          }
          newPremise = fitchDisjunction.elimination(groupedPremises, currentScope);
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise, groupedPremises);
        };
        this.orIntroduction = function () {
          this.showDisjoinField = true;
        };

        this.reiterate = function() {
          var reiterated, currentScope, selected;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes)
          reiterated = selected.map(function(premise, key) {
                              return Premise.new({
                                  scopeLayer: currentScope.layer,
                                  scopeId: currentScope.id,
                                  value: premise.value
                              });
                          });
          _.forEach(reiterated, function (premise) {
            _appendPremiseChild(this.premiseGraph, premise, selected);
          }.bind(this));
          _uncheckPremises(this.premiseGraph.premises, this.selected);
          this.structure.entail(reiterated[0]);
        };

        this.delete = function () {
          var selected, scopeIds;
          selected = _getSelectedPremises(this.premiseGraph.premises);
          _.forEach(selected, function (premise) {
            this.premiseGraph.removeNode(premise);
          }.bind(this));
          scopeIds = _.map(this.premiseGraph.premises, 'scopeId');
          this.structure = _resetStructure(this.structure, this.premiseGraph.premises, scopeIds);
        }

        /*Local functions*/
        function _entail(premise, parentPremises) {
          this.structure.entail(premise);
          _appendPremiseChild(this.premiseGraph, premise, parentPremises);
        }

        function _getSelectedPremises(premises) {
          return _.filter(premises, 'checked');
        }

        function _getValidSelecedPremises(premises, scopes) {
          var scopeIds = _.map(scopes, 'id');
          return _getSelectedPremises(premises).
                  filter(function(premise) {
                      return scopeIds.indexOf(premise.scopeId) !== -1;
                  });
        }

        function _uncheckPremises(premises, selected) {
          selected.length = 0;
          return _.map(premises, function(premise) {
              premise.checked = false;
              return premise;
          });
        }

        function _groupOrPremises(premises) {
          var disjunctions, implications;
          disjunctions = _.filter(premises, function (premise) {
            return premise.isOr(premise.digest());
          });
          if (disjunctions.length !== 1) {
            return null;
          }
          implications = _.filter(premises, function (premise) {
            return premise.isImplication(premise.digest());
          });
          if (implications.length !== premises.length - 1) {
            return null;
          }
          return {
            disjunctions: disjunctions,
            implications: implications
          };
        }

        function _appendPremiseChild(tree, childPremise, parentPremises) {
          _.forEach(parentPremises, function (premise) {
            tree.appendChild(premise, childPremise);
          })
        }

        function _getPremisesInScope(scope, premises) {
          return _.filter(premises, function (premise) {
            return premise.scopeId === scope.id;
          });
        }

        function _resetStructure(oldStructure, premises, scopeIds) {
          var newStructure, newCurrentLayer, newCurrentScope;
          newStructure = FitchStack.new();
          newStructure.scopes = _.filter(oldStructure.scopeHistory, function(scope) {
            return scopeIds.indexOf(scope.id) !== -1;
          });
          newCurrentLayer = _.chain(newStructure.scopes)
                             .map('layer')
                             .uniq()
                             .max()
                             .value();
          newStructure.scopes = _.map(newStructure.scopes, function(scope) {
            scope.isFocused = newCurrentLayer === scope.layer;
            scope.items = _getPremisesInScope(scope, premises);
            return scope;
          });
          newStructure.scopeHistory = oldStructure.scopeHistory;
          newStructure.setCurrentLayer(newCurrentLayer);
          return newStructure;
        }

    });
