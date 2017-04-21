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
      this.tree = _removeTreeNode(this.tree, this.premises, premiseToRemove);
      this.premises = _removePremise(this.premises, premiseToRemove);
      return this.premises;
    }

    function _removePremise(premises, premiseToRemove) {
      var filteredPremises = _.filter(premises, function (premise) {
        return premise.id !== premiseToRemove.id;
      });
      return _mergePremiseScopes(filteredPremises, premiseToRemove);
    }

    function _removeChildNode(node, childNode) {
      return _.filter(node, function (child) {
        return child !== childNode;
      });
    }

    function _removeInvalidChildren(node, premises) {
      return _.filter(node, function (child) {
        return !!_findPremise(premises, child);
      });
    }

    function _removeTreeNode(tree, premises, premiseToRemove) {
      var premiseIndex = _getPremiseNodeIndex(premises, premiseToRemove);
      return _.chain(tree)
              .filter(function (node, indexNode) {
                return indexNode !== premiseIndex;
              })
              .map(function (node) {
                var newNode = _removeChildNode(node, premiseToRemove.id);
                return _removeInvalidChildren(newNode, premises);
              })
              .value();
    }

    function _findPremise(premises, id) {
      return _.find(premises, {id: id});
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
      return  _.filter(premises, function (premise) {
        return ids.indexOf(premise.id) === -1;
      });
    }

    function _getGrandchildren(tree, premises, childrenIds) {
      return _.chain(childrenIds)
              .map(function (id) {
                var premise = _findPremise(premises, id) || {};
                return _getChildrenIds(tree, premises, premise);
               })
              .flattenDeep()
              .filter(function (id) {
                return !!id;
              })
              .value();
    }

    function _getSurroundingPremises(premises, premise) {
      var premiseIndex, upPremise, downPremise;
      premiseIndex = premises.indexOf(premise);
      upPremise = premises[premiseIndex];
      downPremise = premises[premiseIndex + 1];
      return [upPremise, downPremise];
    }

    function _mergePremiseScopes(premises, premiseToRemove) {
      var prevScopeId, prevScopeLayer, layerIncrement;
      layerIncrement = 0;
      return _.map(premises, function (premise) {
        if (prevScopeLayer === premise.scopeLayer && prevScopeId !== premise.scopeId) {
          layerIncrement++;
        }
        prevScopeLayer = premise.scopeLayer;
        prevScopeId = premise.scopeId;
        premise.scopeLayer += layerIncrement;
        return premise;
      });
    }

    return {
      new: function (props) {
        return new PremiseTree(props);
      }
    };

  });
