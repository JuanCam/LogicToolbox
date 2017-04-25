angular
  .module('logicToolsApp')
  .factory('FitchStack', function(Scope) {

    var scopeLayer, universalScope;
    scopeLayer = 0;
    universalScope = Scope.new({
      layer: scopeLayer
    });

    function FitchStack(props) {
      scopeLayer = 0;
      this.scopes = [universalScope];
      this.scopeHistory = [universalScope];
    }

    FitchStack.prototype.closeScope = function() {
      var removedScope, newCurrentScope;
      removedScope = _.remove(this.scopes, 'isFocused');
      newCurrentScope = this.scopes[this.scopes.length - 1];
      if (!newCurrentScope) {
        return removedScope[0];
      }
      newCurrentScope.focus();
      newCurrentScope.layer = --scopeLayer;
      return removedScope[0];
    };

    FitchStack.prototype.openScope = function(headAssumption) {
      var scope = Scope.new({
        head: headAssumption,
        layer: ++scopeLayer
      });

      if (this.scopes.length) {
        this.scopes = _.map(this.scopes, function(scope) {
          scope.blur();
          return scope;
        });
      }

      this.scopes.push(scope);
      this.scopeHistory.push(scope);
    };

    FitchStack.prototype.entail = function(assumption) {
      var currentScope = this.getCurrentScope();
      currentScope.append(assumption);
    };

    FitchStack.prototype.getCurrentScope = function() {
      return _.filter(this.scopes, 'isFocused')[0];
    };

    FitchStack.prototype.reset = function (premises) {
      var currentScope;
      this.scopes.length = 0;
      this.scopeHistory.length = 0;
      this.scopes = _setScopesItems(_createScopes(premises), premises);
      currentScope = _.find(this.scopes, {
        id: _getLastItem(premises).scopeId
      });
      currentScope.focus();
      scopeLayer = currentScope.layer;
      this.scopeHistory = [universalScope].concat(this.scopes);
      this.scopes = [universalScope].concat(_getActiveScopes(this.scopes, premises));
    }

    function _getLastItem(items) {
      return items.slice(-1)[0];
    }

    function _createScopes(premises) {
      return _.chain(premises)
              .map(function (premise) {
                return {
                  layer: premise.scopeLayer,
                  id: premise.scopeId
                };
              })
              .uniqBy('id')
              .map(function (scopeBase) {
                return Scope.new({
                  layer: scopeBase.layer,
                  id: scopeBase.id
                });
              })
              .value();
    }

    function _premisesByScope(premises) {
      return _.groupBy(premises, 'scopeId');
    }

    function _setScopesItems(scopes, premises) {
      return _.chain(scopes)
              .map(function (scope) {
                scope.items = _.sortBy(_premisesByScope(premises)[scope.id], 'scopeId');
                scope.blur();
                return scope;
              })
              .value();
    }

    function _getActiveScopes(scopes, premises) {
      var prevScopeLayer, prevScopePosition, activeIds, scopePosition;
      activeIds = [];
      prevScopeLayer = 0;
      _.forEach(premises, function (premise) {
        scopePosition = activeIds.indexOf(premise.scopeId);
        if (prevScopeLayer <= premise.scopeLayer && scopePosition === -1) {
          activeIds.push(premise.scopeId);
        } else if (prevScopeLayer > premise.scopeLayer && scopePosition !== -1) {
          activeIds.splice(prevScopePosition, 1);
        }
        prevScopeLayer = premise.scopeLayer;
        prevScopePosition = scopePosition;
      });
      return _.filter(scopes, function (scope) {
        return activeIds.indexOf(scope.id) !== -1;
      })
    }

    return {
      new: function(props) {
        var fitchProps = props || {};
        return new FitchStack(fitchProps);
      }
    }

  });
