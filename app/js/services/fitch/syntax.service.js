angular
  .module('logicToolsApp')
  .service('syntaxChecker', function () {
    this.validate = function (premise) {
      if (_emptyPremise(premise)) {
        return false;
      }

      return true;
    }

    function _emptyPremise(premise) {
      return !premise.value;
    }
  });
