angular.module('logicToolsApp')
    .factory('FitchStructure', function(Scope) {

      var scopeLayer = 0;
      function FitchStructure(props) {
        this.scopes = [];
      }

      FitchStructure.prototype.closeScope = function() {
          var removedScope, newCurrentScope; 
          removedScope = _.remove(this.scopes, 'isFocused');
          newCurrentScope = this.scopes[this.scopes.length - 1];
          newCurrentScope.focus();
          newCurrentScope.layer = --scopeLayer;
          return removedScope[0];
      };

      FitchStructure.prototype.openScope = function(headAssumption) {
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
      };

      FitchStructure.prototype.entail = function(assumption) {
          var currentScope = this.getCurrentScope();
          currentScope.append(assumption);
      };

      FitchStructure.prototype.getCurrentScope = function() {
          return _.filter(this.scopes, 'isFocused')[0];
      };

      return {
        new: function(props) {
          var fitchProps = props || {};
          return new FitchStructure(fitchProps);
        }
      }
    });
