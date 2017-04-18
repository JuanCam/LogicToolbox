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

      tree[parentIndex].push(childPremise);

      if (childIndex === -1) {
        premises.push(childPremise);
        tree.push([]);
      }
    }

    PremiseTree.prototype.remove = function (premiseRemoved) {
      var childrenIndexes, index;
      index = premises.indexOf(premiseRemoved);
      childrenIndexes = tree[index];
      tree[index] = [];
      premises = _.filter(premises, function (premise, indexPremise) {
        return childrenIndex.indexOf(indexPremise) === -1;
      });
    }

    function _removeItemFromTree(indexes) {
      tree = _.filter(tree, function (node, indexNode) {
        return indexes.indexOf(indexNode) === -1;
      });
    }

    function _removeItemFromPremises() {

    }

    return {
      new: function (props) {
        return new PremiseTree(props);
      }
    };
  });
