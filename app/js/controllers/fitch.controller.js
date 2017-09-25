'use strict';

angular
  .module('logicToolsApp')
  .controller('FitchCtrl', function (
      FitchStack,
      Premise,
      PremiseTree,
      fitchBicondition,
      fitchConjunction,
      fitchDisjunction,
      fitchImplication,
      fitchNegation,
      syntaxChecker
    ) {

      _init.call(this);

      this.createPremises = function() {
        var splitedPremises, emptyHistory;
        splitedPremises = _getInitialPremises(this.initialPremises);
        _appendInitialPremises(_createInitialPremises(splitedPremises), this.structure, this.premiseGraph);
        emptyHistory = splitedPremises.map(function(premise) {
          return '';
        });
        this.history = this.history.concat(emptyHistory);
        this.initialPremises = '';
      };

      this.assume = function() {
        var currentScope, labels, headPremise;

        headPremise = Premise.new({
          value: this.premise,
          productOf: 'Assumption'
        });

        if (!syntaxChecker.validate(headPremise)) {
          return;
        }
        _openStructureScope(headPremise, this.structure, this.premiseGraph);
        this.premise = '';
        this.isAssumptionVisible = false;
        this.isPremiseVisible = false;
        this.history.push('Assumption');
      };

      this.refresh = function () {
        _init.call(this);
      }

      this.closeDisjoinField = function () {
        this.showDisjoinField = false;
        this.valueToDisjoin = '';
      }

      this.disjoinPremise = function () {
        var newPremises, currentScope, selected, disjointPremise;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (!selected.length || !this.valueToDisjoin) {
            return;
        }
        newPremises = fitchDisjunction.introduction(this.valueToDisjoin, selected, currentScope);
        this.showDisjoinField = false;
        this.valueToDisjoin = '';
        if (!newPremises) {
            return;
        }
        _multipleEntialment.call(this, newPremises, selected);
        this.history.push('Or. Int.');
      };

      /*Operations*/
      this.andIntroduction = function () {
        var selected, newPremises, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length < 2) {
          return;
        }
        newPremises = fitchConjunction.introduction(selected, currentScope);
        if (!newPremises) {
          return;
        }
        _multipleEntialment.call(this, newPremises, selected);
        this.history.push('And Int.');
      };
      this.andElimination = function () {
        var selected, newPremises, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length !== 1) {
          return;
        }
        newPremises = fitchConjunction.elimination(selected[0], currentScope);
        if (!newPremises) {
          return;
        }
        _multipleEntialment.call(this, newPremises, selected);
      };
      this.negationIntro = function() {
        var selected, newPremise, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length !== 2) {
          return;
        }
        newPremise = fitchNegation.introduction(selected[0], selected[1], currentScope);
        if (!newPremise) {
          return;
        }
        _entail.call(this, newPremise, selected);
      };
      this.negationElim = function() {
        var selected, newPremise, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length > 1) {
          return;
        }
        newPremise = fitchNegation.elimination(selected[0], currentScope);
        if (!newPremise) {
          return;
        }
        _entail.call(this, newPremise, selected);
      };
      this.implicationIntro = function() {
        var lastScope, currentScope, newPremise;
        lastScope = this.structure.closeScope();
        currentScope = this.structure.getCurrentScope();
        newPremise = fitchImplication.introduction(currentScope, lastScope);
        _entail.call(this, newPremise, [lastScope.head, lastScope.last]);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
      };

      this.implicationElim = function() {
        var selected, newPremise, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length !== 2) {
          return;
        }
        newPremise = fitchImplication.elimination(selected[0], selected[1], currentScope);
        if (!newPremise) {
          return;
        }
        _entail.call(this, newPremise, selected);
      };

      this.orElimination = function () {
        var selected, currentScope, newPremise, groupedPremises;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length < 3) {
          return;
        }
        groupedPremises = _groupOrPremises(selected);
        if (!groupedPremises) {
          return;
        }
        newPremise = fitchDisjunction.elimination(groupedPremises, currentScope);
        if (!newPremise) {
          return;
        }
        _entail.call(this, newPremise, groupedPremises.disjunctions.concat(groupedPremises.implications));
      };
      this.orIntroduction = function () {
        this.showDisjoinField = true;
      };
      this.reiterate = function() {
        var reiterated, currentScope, selected;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        reiterated = selected.map(function(premise, key) {
                            return Premise.new({
                                scopeLayer: currentScope.layer,
                                scopeId: currentScope.id,
                                value: premise.value,
                                productOf: 'Reiteration'
                            });
                        });
        _.forEach(reiterated, function (premise) {
          _entail.call(this, premise, selected);
        }.bind(this));
        _uncheckPremises(this.premiseGraph.premises, this.selected);
      };
      this.delete = function () {
        var selected, scopeIds, selectedIndex, removedPremises;
        selected = _getSelectedPremises(this.premiseGraph.premises);
        _.forEach(selected, function (premise) {
          selectedIndex = this.premiseGraph.premises.indexOf(premise);
          removedPremises = this.premiseGraph.removeNode(premise);
        }.bind(this));
        scopeIds = _.map(this.premiseGraph.premises, 'scopeId');
        this.structure.reset(this.premiseGraph.premises);
      };
      this.biconditionalIntro = function () {
        var selected, newPremises, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length !== 2) {
          return;
        }
        newPremises = fitchBicondition.introduction(selected, currentScope);
        if (!newPremises) {
          return;
        }
        _multipleEntialment.call(this, newPremises, selected);
        this.history.push('Bic. Int.');
      }
      this.biconditionalElim = function () {
        var selected, newPremises, secondPremise, currentScope;
        currentScope = this.structure.getCurrentScope();
        selected = _getValidSelecedPremises(this.premiseGraph.premises, this.structure.scopes);
        _uncheckPremises(this.premiseGraph.premises, this.selected);
        if (selected.length !== 1) {
          return;
        }
        newPremises = fitchBicondition.elimination(selected[0], currentScope);
        if (!newPremises) {
          return;
        }
        _multipleEntialment.call(this, newPremises, selected);
        this.history.push('Bic. Int.');
      }

      /*Local functions*/
      function _init() {
        this.isAssumptionVisible = false;
        this.history = [];
        this.marginLeft = 20; //pixels
        this.premise = '';
        this.isPremiseVisible = true;
        this.premiseGraph = PremiseTree.new();
        this.selected = [];
        this.showDisjoinField = false;
        this.structure = FitchStack.new();
        this.valueToDisjoin = '';
        this.initialPremises = '';
      }

      function _getInitialPremises(premiseString) {
        return premiseString.split(/\,/g);
      }

      function _createInitialPremises(premises) {
        return _.map(premises, function(premise) {
          return Premise.new({
            value: premise
          });
        });
      }

      function _openStructureScope (premise, structure, premiseGraph, holdLayer) {
        var currentScope;
        structure.openScope(premise, holdLayer);
        currentScope = structure.getCurrentScope();
        premise.scopeId = currentScope.id;
        premise.scopeLayer = currentScope.layer;
        premiseGraph.appendNode(premise);
      }

      function _insertToScope (premise, structure, premiseGraph) {
        var currentScope;
        structure.entail(premise);
        currentScope = structure.getCurrentScope();
        premise.scopeId = currentScope.id;
        premise.scopeLayer = currentScope.layer;
        premiseGraph.appendNode(premise);
      }

      function _appendInitialPremises(premises, structure, premiseGraph) {
        premises.forEach(function(premise, index){
          if (index <= 0) {
            _openStructureScope(premise, structure, premiseGraph, true);
          } else {
            _insertToScope (premise, structure, premiseGraph)
          }
        });
      }

      function _entail(premise, parentPremises) {
        this.structure.entail(premise);
        _appendPremiseChild(this.premiseGraph, premise, parentPremises);
      }

      function _multipleEntialment(premises, parentPremises) {
        _.forEach(premises, function (premise) {
          _entail.call(this, premise, parentPremises);
        }.bind(this));
      }

      function _getSelectedPremises(premises) {
        return _.filter(premises, 'checked');
      }

      function _getValidSelecedPremises(premises, scopes) {
        var scopeIds = _.map(scopes, 'id');
        return _getSelectedPremises(premises)
               .filter(function(premise) {
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
        if  (disjunctions.length !== 1) {
          return null;
        }
        implications = _.filter(premises, function (premise) {
          return premise.isImplication(premise.digest());
        });
        if  (implications.length !== premises.length - 1) {
          return null;
        }
        return {
          disjunctions: disjunctions,
          implications: implications
        };
      }

      function _appendPremiseChild(premiseGraph, childPremise, parentPremises) {
        _.forEach(parentPremises, function (premise) {
          premiseGraph.appendChildNode(premise, childPremise);
        });
      }

    });
