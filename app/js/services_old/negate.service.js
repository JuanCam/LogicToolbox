'use strict';

angular.module('logicToolsApp')
    .service('negate', function(ALIASES) {
        this.column = function(value, premise) {
            /*Negate if negation exists*/
            var negation, result, atomic, operator;
            negation = premise.match(/[~]/g);
            atomic = premise.match(/\w+/g);
            if (negation) {
                result = _.map(value[atomic[0]], function(val, key) {
                    operator = negation.join('').replace(/[~]/g, '!');
                    return Number(eval(operator + val));
                });
            } else {
                result = value[atomic[0]];
            }
            return result;
        }
    });
