angular
  .module('logicToolsApp')
  .factory('Scope', function() {

    var id = 0;
    function Scope(props) {
      this.id = props.id || ++id;
      this.isClosed = false;
      this.layer = props.layer;
      this.isFocused = true;
      this.items = [];

      if (props.head) {
        this.items.push(props.head);
      }
    }

    Scope.prototype.append = function(item) {
      this.items.push(item);
    }

    Scope.prototype.blur = function() {
      this.isFocused = false;
    }

    Scope.prototype.focus = function() {
      this.isFocused = true;
    }

    Scope.prototype.remove = function(item) {
      var index = item.indexOf(item);
      return this.items.splice(index, 1);
    }

    Object.defineProperty(Scope.prototype, 'head', {
      get: function() {
        return this.items[0];
      }
    });

    Object.defineProperty(Scope.prototype, 'last', {
      get: function() {
        return this.items[this.items.length - 1];
      }
    });

    Object.defineProperty(Scope.prototype, 'size', {
      get: function() {
        return this.items.length;
      }
    });

    return {
      new: function(props) {
        var scopeProps = props || {};
        return new Scope(scopeProps);
      }
    }

  });
