angular
  .module('logicToolsApp')
  .factory('PremiseTree', function () {

    var tree, premises
    premises = [];
    tree = [];

    function PremiseTree(props) {
    }

    PremiseTree.prototype.append = function (premiseNode) {
      tree.push([]);
      premises.push(premiseNode);
    }

    PremiseTree.prototype.appendChild = function (parentPremise, childPremise) {
      var parentIndex, childIndex;
      parentIndex = premises.indexOf(parentPremise);
      childIndex = premises.indexOf(childPremise);

      tree[parentIndex].push(childPremise.id);

      if (childIndex === -1) {
        premises.push(childPremise);
        tree.push([]);
      }
    }

    PremiseTree.prototype.remove = function (premiseRemoved) {
      // TODO: Remove all descendents according to the tree algorith created.
    }

    return {
      new: function (props) {
        return new PremiseTree(props);
      }
    };
  });
