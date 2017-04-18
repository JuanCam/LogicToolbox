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
        this.premises = [];
        this.selected = [];
        this.structure = FitchStack.new();
        this.premiseStructure = PremiseTree.new();
        this.premise = '';
        this.showDisjoinField = false;
        this.premiseToDisjoin = '';

        this.assume = function() {
            var currentScope, labels, headPremise;

            headPremise = Premise.new({
                value: this.premise
            });

            this.structure.openScope(headPremise);
            currentScope = this.structure.getCurrentScope();
            this.premises.push(headPremise);
            this.premiseStructure.append(headPremise);
            headPremise.scopeId = currentScope.id;
            headPremise.scopeLayer = currentScope.layer;
            this.premise = '';
        };
        this.disjoinPremise = function () {
          var newPremise, currentScope, selected;
          currentScope = this.structure.getCurrentScope();
          selected = _getValidSelecedPremises(this.premises, this.structure.scopes);
          _uncheckPremises(this.premises, this.selected);
          if(!selected.length || !this.premiseToDisjoin) {
              return;
          }
          newPremise = fitchDisjunction.introduction(this.premiseToDisjoin, selected, currentScope);
          this.showDisjoinField = false;
          this.premiseToDisjoin = '';
          if(!newPremise) {
              return;
          }
          _entail.call(this, newPremise);
        };

        /*Operations*/
        this.negationIntro = function() {
            var selected, newPremise, secondPremise, currentScope;
            currentScope = this.structure.getCurrentScope();
            selected = _getValidSelecedPremises(this.premises, this.structure.scopes);
            _uncheckPremises(this.premises, this.selected);
            if(selected.length !== 2) {
                return;
            }
            newPremise = fitchNegation.introduction(selected[0], selected[1], currentScope);
            if(!newPremise) {
                return;
            }
            _entail.call(this, newPremise);
        };
        this.negationElim = function() {
            var selected, newPremise, secondPremise, currentScope;
            currentScope = this.structure.getCurrentScope();
            selected = _getValidSelecedPremises(this.premises, this.structure.scopes);
            _uncheckPremises(this.premises, this.selected);
            if(selected.length > 1) {
                return;
            }
            newPremise = fitchNegation.elimination(selected[0], currentScope);
            if(!newPremise) {
                return;
            }
            _entail.call(this, newPremise);
        };
        this.implicationIntro = function() {
            var lastScope, currentScope, newPremise, head, last;
            lastScope = this.structure.closeScope();
            head = lastScope.head;
            last = lastScope.last;
            currentScope = this.structure.getCurrentScope();
            newPremise = fitchImplication.introduction(currentScope, lastScope);
            _entail.call(this, newPremise);
            _appendPremiseChild(this.premiseStructure, [head, last], newPremise);
            _uncheckPremises(this.premises, this.selected);
        };

        this.implicationElim = function() {
            var selected, newPremise, secondPremise, currentScope;
            currentScope = this.structure.getCurrentScope();
            selected = _getValidSelecedPremises(this.premises, this.structure.scopes);
            _uncheckPremises(this.premises, this.selected);
            if(selected.length !== 2) {
                return;
            }
            newPremise = fitchImplication.elimination(selected[0], selected[1], currentScope);
            if(!newPremise) {
                return;
            }
            _entail.call(this, newPremise);
        };

        this.orElimination = function () {
            var selected, currentScope, newPremise, groupedPremises;
            currentScope = this.structure.getCurrentScope();
            selected = _getValidSelecedPremises(this.premises, this.structure.scopes);
            _uncheckPremises(this.premises, this.selected);
            if(selected.length < 3) {
                return;
            }
            groupedPremises = _groupOrEliminPremises(selected);
            if(!groupedPremises) {
                return;
            }
            newPremise = fitchDisjunction.elimination(groupedPremises, currentScope);
            if(!newPremise) {
                return;
            }
            _entail.call(this, newPremise);
        };
        this.orIntroduction = function () {
          this.showDisjoinField = true;
        };

        this.reiterate = function() {
            var reiterated, currentScope;
            currentScope = this.structure.getCurrentScope();
            reiterated = _getValidSelecedPremises(this.premises, this.structure.scopes)
                            .map(function(premise, key) {
                                return Premise.new({
                                    scopeLayer: currentScope.layer,
                                    scopeId: currentScope.id,
                                    value: premise.value
                                });
                            });
            _uncheckPremises(this.premises, this.selected);
            this.structure.entail(reiterated[0]);
            this.premiseStructure.append(reiterated[0]);
            this.premises = this.premises.concat(reiterated);
        };

        this.delete = function () {
          var selected;
          selected = _getSelectedPremises(this.premises);
          this.premiseStructure.remove(selected[0]);
        }

        /*Local functions*/
        function _entail(premise) {
            this.structure.entail(premise);
            this.premises.push(premise);
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

        function _groupOrEliminPremises(premises) {
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

        function _appendPremiseChild(tree, parentPremises, childPremise) {
          _.forEach(parentPremises, function (premise) {
            tree.appendChild(premise, childPremise);
          })
        }

    });
