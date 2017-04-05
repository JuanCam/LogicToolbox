angular.module('logicToolsApp')
      .factory(function () {
          function PremiseTree(props) {
              this.premises = props.premises || [];
              this.structure = [];
          }

          PremiseTree.prototype.appendNode = function (child, parents) {
              var parentIndexes, childIndex;
              if (!parents) {
                this.premises.push(child);
                return;
              }

              parentIndexes = _parentsIndex(child, parents);
              childIndex = _childIndex(child);
              return _mutate(parentIndexes, childIndex);

          };

          function _parentsIndex(parents) {
              var ids = _.map(parents, 'id');
              return _.chain(this.premises)
                      .map(function (premise) {
                          return (ids.indexOf(premise.id) !== -1) ? ids.indexOf(premise.id) : undefined;
                      })
                      .filter(function (premise) {
                          return premise;
                      });
          }

          function _childIndex(child) {
              return _.chain(this.values)
                      .map('id')
                      .indexOf(child.id);
          }

          function _mutate(parentIndexes, childIndex) {
              var maxSize, p;
              maxSize = _.max(parentIndexes);
              parentIndex = 0;
              while(parentIndex < maxSize) {
                  if (parentIndexes.indexOf(parentIndex + 1) !== -1) {
                    if(_.isArray(this.structrue[parentIndex])) {
                        this.structrue[parentIndex].push(childIndex);
                    } else {
                        this.structrue[parentIndex] = [childIndex]
                    }
                  } else {
                    this.structrue[parentIndex] = null;
                  }
                  parentIndex++;
              }
              return true;
          }

      });
