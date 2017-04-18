angular
  .module('logicToolsApp')
  .factory('PremiseTree', function () {

    function PremiseTree(props) {
      this.premises = [];
      this.tree = [];
    }

    PremiseTree.prototype.append = function (premiseNode) {
      this.tree.push([]);
      this.premises.push(premiseNode);
    }

    PremiseTree.prototype.appendChild = function (parentPremise, childPremise) {
      var parentIndex, childIndex;
      parentIndex = this.premises.indexOf(parentPremise);
      childIndex = this.premises.indexOf(childPremise);

      this.tree[parentIndex].push(childPremise.id);

      if (childIndex === -1) {
        this.premises.push(childPremise);
        this.tree.push([]);
      }
    }

    PremiseTree.prototype.removeNode = function (premiseToRemove) {
      var childrenIds, grandChildrenIds;
      childrenIds = _getChildrenIds(this.tree, this.premises, premiseToRemove);
      while (childrenIds.length) {
        grandChildrenIds = _getGrandchildren(this.tree, this.premises, childrenIds);
        this.tree = _cutTree(this.tree, this.premises, childrenIds);
        this.premises = _cutPremises(this.premises, childrenIds);
        childrenIds = grandChildrenIds;
      }
      this.premises = _removePremise(this.premises, premiseToRemove);
      this.tree = _removeTreeNode(this.tree, this.premise, premiseToRemove);
      return this.premises;
    }

    function _removePremise(premises, premiseToRemove) {
      return _.filter(premises, function (premise) {
        return premise.id !== premiseToRemove.id;
      });
    }

    function _removeTreeNode(tree, premises, premiseToRemove) {
      var premiseIndex = _getPremiseNodeIndex(premises, premiseToRemove);
      return _.filter(tree, function (node, indexNode) {
        return indexNode !== premiseIndex;
      });
    }

    function _getChildrenIds(tree, premises, premise) {
      var index = _getPremiseNodeIndex(premises, premise);
      return tree[index];
    }

    function _getPremiseNodeIndex(premises, premise) {
      return _.chain(premises)
              .map('id')
              .indexOf(premise.id)
              .value();
    }

    function _cutTree(tree, premises, ids) {
      return _.filter(tree, function (node, indexNode) {
        return ids.indexOf(premises[indexNode].id) === -1;
      });
    }

    function _cutPremises(premises, ids) {
      return _.filter(premises, function (premise) {
        return ids.indexOf(premise.id) === -1;
      });
    }

    function _getGrandchildren(tree, premises, childrenIds) {
      return _.chain(childrenIds)
              .map(function (id) {
                 return _getChildrenIds(tree, premises, _.find(premises, {id: id}));
               })
               .flattenDeep()
               .value();
    }

    return {
      new: function (props) {
        return new PremiseTree(props);
      }
    };

  });
