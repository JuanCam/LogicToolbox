angular
  .module('logicToolsApp')
  .factory('FitchStack', function(Scope) {

    var scopeLayer = 0;

    function FitchStack(props) {
      this.scopes = [];
      this.scopeHistory = [];
    }

    FitchStack.prototype.closeScope = function() {
      var removedScope, newCurrentScope;
      removedScope = _.remove(this.scopes, 'isFocused');
      newCurrentScope = this.scopes[this.scopes.length - 1];
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

    return {
      new: function(props) {
        var fitchProps = props || {};
        return new FitchStack(fitchProps);
      }
    }
  });
